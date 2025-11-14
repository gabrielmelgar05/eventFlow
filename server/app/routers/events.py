# routers/events.py

import os
from typing import List
from datetime import date, time
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session, joinedload # Import do joinedload
from app.core.db import get_db
from app.core.config import settings
from app.models.event import Event
from app.models.category import Category
from app.models.location import Location # Necessário para criar novos locais
from app.schemas.event import EventCreate, EventUpdate, EventOut
from app.routers.auth import get_current_user, User

router = APIRouter(prefix="/events", tags=["events"])

os.makedirs(settings.MEDIA_DIR, exist_ok=True)

@router.get("", response_model=List[EventOut])
def list_events(db: Session = Depends(get_db)):
    # Modificado: Carregar a relação 'location' para ter as coordenadas no retorno para o mapa.
    return db.query(Event).options(joinedload(Event.location)).order_by(Event.event_date, Event.event_time).all()

# O create_event foi ajustado para incluir o end_time
@router.post("", response_model=EventOut, status_code=201)
def create_event(payload: EventCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not db.get(Category, payload.category_id):
        raise HTTPException(status_code=400, detail="Categoria inválida")
    if not db.get(Location, payload.location_id):
        raise HTTPException(status_code=400, detail="Local inválido")
    obj = Event(**payload.model_dump(), owner_id=user.id)
    db.add(obj)
    db.commit()
    # Adicionado: Carregar a relação 'location' antes de retornar
    db.refresh(obj, ["location"]) 
    return obj

# O update_event foi ajustado para incluir o end_time
@router.put("/{event_id}", response_model=EventOut)
def update_event(event_id: int, payload: EventUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    obj = db.get(Event, event_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Evento não encontrado")
    if obj.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Sem permissão")
    for k, v in payload.model_dump().items():
        setattr(obj, k, v)
    db.commit()
    # Adicionado: Carregar a relação 'location' antes de retornar
    db.refresh(obj, ["location"])
    return obj

@router.delete("/{event_id}", status_code=204)
def delete_event(event_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    obj = db.get(Event, event_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Evento não encontrado")
    if obj.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Sem permissão")
    db.delete(obj)
    db.commit()

@router.post("/{event_id}/image", response_model=EventOut)
def upload_event_image(
    event_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    obj = db.get(Event, event_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Evento não encontrado")
    if obj.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Sem permissão")
    ext = os.path.splitext(file.filename or "")[1].lower()
    fname = f"event_{event_id}{ext or '.jpg'}"
    path = os.path.join(settings.MEDIA_DIR, fname)
    with open(path, "wb") as f:
        f.write(file.file.read())
    obj.image_path = path
    db.commit()
    # Adicionado: Carregar a relação 'location' antes de retornar
    db.refresh(obj, ["location"])
    return obj

@router.post("/create-with-image", response_model=EventOut, status_code=201)
def create_with_image(
    name: str = Form(...),
    description: str | None = Form(None),
    event_date: date = Form(...),
    event_time: time = Form(...),
    end_time: time | None = Form(None), # <-- NOVO: Horário Final
    price: float = Form(...),
    category_id: int = Form(...),
    
    # Campos de localização
    location_id: int | None = Form(None), # ID de um local pré-existente
    # Campos para NOVO local (marcado no mapa)
    new_location_name: str | None = Form(None), # Nome do local
    latitude: float | None = Form(None), 
    longitude: float | None = Form(None),
    address: str | None = Form(None), # Endereço do local

    file: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    final_location_id = location_id
    
    # 1. Lógica para criar/selecionar Localização
    # Se não selecionou um ID, mas forneceu coordenadas, cria um novo local
    if not final_location_id and latitude is not None and longitude is not None:
        if not new_location_name:
             raise HTTPException(status_code=400, detail="Nome do novo local é obrigatório ao marcar no mapa")

        new_location = Location(
            name=new_location_name,
            latitude=latitude,
            longitude=longitude,
            address=address 
        )
        db.add(new_location)
        db.commit()
        db.refresh(new_location)
        final_location_id = new_location.id
    
    if not final_location_id:
        raise HTTPException(status_code=400, detail="Localização inválida. Selecione um local existente ou marque um no mapa.")
    
    # 2. Validações
    if not db.get(Category, category_id):
        raise HTTPException(status_code=400, detail="Categoria inválida")
    if not db.get(Location, final_location_id):
        raise HTTPException(status_code=400, detail="Local inválido")

    # 3. Criação do Evento
    payload = EventCreate(
        name=name,
        description=description,
        event_date=event_date,
        event_time=event_time,
        end_time=end_time, # <-- Incluído
        price=price,
        category_id=category_id,
        location_id=final_location_id,
    )
    obj = Event(**payload.model_dump(), owner_id=user.id)
    db.add(obj)
    db.commit()
    db.refresh(obj) 
    
    # 4. Processamento da Imagem
    if file:
        ext = os.path.splitext(file.filename or "")[1].lower()
        fname = f"event_{obj.id}{ext or '.jpg'}"
        path = os.path.join(settings.MEDIA_DIR, fname)
        with open(path, "wb") as f:
            f.write(file.file.read())
        obj.image_path = path
        db.commit()
    
    # 5. Refresh final com a localização carregada (para o EventOut)
    db.refresh(obj, ["location"])
    return obj