from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
import os, shutil
from app.core.db import get_db
from app.core.config import settings
from app.models.event import Event
from app.models.category import Category
from app.models.location import Location
from .auth import get_current_user

router = APIRouter(prefix="/events", tags=["events"])

@router.get("")
def list_events(search: str | None = None, page: int = 0, size: int = 10, db: Session = Depends(get_db)):
    q = db.query(Event)
    if search:
        q = q.join(Category).filter(or_(Event.name.ilike(f"%{search}%"), Category.name.ilike(f"%{search}%")))
    total = q.count()
    items = q.order_by(Event.id.desc()).offset(page*size).limit(size).all()
    def serialize(e: Event):
        return {
            "id": e.id, "name": e.name, "description": e.description,
            "date": e.date.isoformat(), "time": e.time.isoformat(),
            "price": float(e.price),
            "category": {"id": e.category.id, "name": e.category.name} if e.category else None,
            "location": {
                "id": e.location.id, "name": e.location.name,
                "latitude": e.location.latitude, "longitude": e.location.longitude,
                "address": e.location.address
            } if e.location else None,
            "image_url": e.image_url
        }
    return {"content": [serialize(i) for i in items], "total": total, "page": page, "size": size}

@router.get("/{event_id}")
def get_event(event_id: int, db: Session = Depends(get_db)):
    e = db.query(Event).get(event_id)
    if not e: raise HTTPException(404, "Evento não encontrado")
    return {
        "id": e.id, "name": e.name, "description": e.description,
        "date": e.date.isoformat(), "time": e.time.isoformat(),
        "price": float(e.price),
        "category_id": e.category_id, "location_id": e.location_id,
        "category": {"id": e.category.id, "name": e.category.name} if e.category else None,
        "location": {
            "id": e.location.id, "name": e.location.name,
            "latitude": e.location.latitude, "longitude": e.location.longitude,
            "address": e.location.address
        } if e.location else None,
        "image_url": e.image_url
    }

@router.post("")
def create_event(
    name: str = Form(...),
    description: str = Form(...),
    date: str = Form(...),
    time: str = Form(...),
    price: float = Form(...),
    category_id: int = Form(...),
    location_id: int = Form(...),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    _=Depends(get_current_user)
):
    img_url = None
    if image:
        os.makedirs(settings.MEDIA_DIR, exist_ok=True)
        dest = os.path.join(settings.MEDIA_DIR, image.filename)
        with open(dest, "wb") as f:
            shutil.copyfileobj(image.file, f)
        img_url = f"{settings.BASE_URL}/{settings.MEDIA_DIR}/{image.filename}"

    e = Event(
        name=name, description=description, date=date, time=time, price=price,
        category_id=category_id, location_id=location_id, image_url=img_url
    )
    db.add(e); db.commit(); db.refresh(e)
    return {"id": e.id}
