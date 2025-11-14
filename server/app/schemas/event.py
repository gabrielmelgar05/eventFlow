# schemas/event.py

from pydantic import BaseModel, Field
from datetime import date, time
from app.schemas.location import LocationOut # Importa o LocationOut

class EventBase(BaseModel):
    name: str = Field(min_length=2, max_length=160)
    description: str | None = None
    event_date: date
    event_time: time
    end_time: time | None = None # <-- NOVO: Horário Final
    price: float
    category_id: int
    location_id: int

class EventCreate(EventBase):
    pass

class EventUpdate(EventBase):
    pass

class EventOut(BaseModel):
    id: int
    name: str
    description: str | None
    event_date: date
    event_time: time
    end_time: time | None # <-- NOVO
    price: float
    image_path: str | None
    category_id: int
    location_id: int
    owner_id: int
    
    # Relações carregadas
    location: LocationOut # <-- NOVO: Informação de localização para o mapa/detalhe

    class Config:
        from_attributes = True