from pydantic import BaseModel, Field

class LocationCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    latitude: float
    longitude: float
    address: str | None = None

class LocationUpdate(LocationCreate):
    pass

class LocationOut(BaseModel):
    id: int
    name: str
    latitude: float
    longitude: float
    address: str | None
