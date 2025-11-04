from pydantic import BaseModel, Field

class LocationIn(BaseModel):
    name: str
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    address: str | None = None

class LocationOut(LocationIn):
    id: int
