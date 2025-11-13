# routers/location.py


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas.location import LocationCreate, LocationUpdate, LocationOut
from app.models.location import Location
from typing import List

router = APIRouter(prefix="/locations", tags=["locations"])

@router.get("", response_model=List[LocationOut])
def list_locations(db: Session = Depends(get_db)):
    return db.query(Location).order_by(Location.name).all()

@router.post("", response_model=LocationOut, status_code=201)
def create_location(payload: LocationCreate, db: Session = Depends(get_db)):
    obj = Location(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.put("/{location_id}", response_model=LocationOut)
def update_location(location_id: int, payload: LocationUpdate, db: Session = Depends(get_db)):
    obj = db.get(Location, location_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Local não encontrado")
    for k, v in payload.model_dump().items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/{location_id}", status_code=204)
def delete_location(location_id: int, db: Session = Depends(get_db)):
    obj = db.get(Location, location_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Local não encontrado")
    db.delete(obj)
    db.commit()
