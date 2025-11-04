from pydantic import BaseModel
from datetime import date, time

class EventIn(BaseModel):
    name: str
    description: str
    date: date
    time: time
    price: float
    category_id: int
    location_id: int

class EventOut(BaseModel):
    id: int
    name: str
    description: str
    date: date
    time: time
    price: float
    category: dict
    location: dict
    image_url: str | None = None
