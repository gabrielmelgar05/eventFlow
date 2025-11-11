from pydantic import BaseModel, Field
from datetime import date, time

class EventBase(BaseModel):
    name: str = Field(min_length=2, max_length=160)
    description: str | None = None
    event_date: date
    event_time: time
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
    price: float
    image_path: str | None
    category_id: int
    location_id: int
    owner_id: int
