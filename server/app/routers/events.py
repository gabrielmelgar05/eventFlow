import os
from typing import List
from datetime import date, time

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.config import settings
from app.models.event import Event
from app.models.category import Category
from app.models.location import Location
from app.schemas.event import EventCreate, EventUpdate, EventOut
from app.routers.auth import get_current_user, User

router = APIRouter(prefix="/events", tags=["events"])

os.makedirs(settings.MEDIA_DIR, exist_ok=True)

@router.get("", response_model=List[EventOut])
def list_events(db: Session = Depends(get_db)):
    return db.query(Event).order_by(Event.event_date, Event.event_time).all()

@router.post("", response_model=EventOut, status_code=201)
def create_event(payload: EventCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not db.get(Category, payload.category_id):
        raise HTTPException(status_code=400, detail="Categoria inválida")
    if not db.get(Location, payload.location_id):
        raise HTTPException(status_code=400, detail="Local inválido")
    obj = Event(**payload.model_dump(), owner_id=user.id)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

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
    db.refresh(obj)
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
    db.refresh(obj)
    return obj

# endpoint form-data (útil p/ RN + upload em uma ida)
@router.post("/create-with-image", response_model=EventOut, status_code=201)
def create_with_image(
    name: str = Form(...),
    description: str | None = Form(None),
    event_date: date = Form(...),
    event_time: time = Form(...),
    price: float = Form(...),
    category_id: int = Form(...),
    location_id: int = Form(...),
    file: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    payload = EventCreate(
        name=name, description=description,
        event_date=event_date, event_time=event_time, price=price,
        category_id=category_id, location_id=location_id
    )
    obj = Event(**payload.model_dump(), owner_id=user.id)
    db.add(obj)
    db.commit()
    db.refresh(obj)

    if file:
        ext = os.path.splitext(file.filename or "")[1].lower()
        fname = f"event_{obj.id}{ext or '.jpg'}"
        path = os.path.join(settings.MEDIA_DIR, fname)
        with open(path, "wb") as f:
            f.write(file.file.read())
        obj.image_path = path
        db.commit()
        db.refresh(obj)

    return obj
