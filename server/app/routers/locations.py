from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.location import Location
from app.schemas.location import LocationIn, LocationOut
from .auth import get_current_user

router = APIRouter(prefix="/locations", tags=["locations"])

@router.get("", response_model=list[LocationOut])
def list_locations(db: Session = Depends(get_db)):
    return db.query(Location).order_by(Location.name).all()

@router.post("", response_model=LocationOut)
def create_location(payload: LocationIn, db: Session = Depends(get_db), _=Depends(get_current_user)):
    l = Location(**payload.model_dump())
    db.add(l); db.commit(); db.refresh(l)
    return l

@router.put("/{loc_id}", response_model=LocationOut)
def update_location(loc_id: int, payload: LocationIn, db: Session = Depends(get_db), _=Depends(get_current_user)):
    l = db.query(Location).get(loc_id)
    for k,v in payload.model_dump().items(): setattr(l,k,v)
    db.commit(); db.refresh(l)
    return l

@router.delete("/{loc_id}")
def delete_location(loc_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    l = db.query(Location).get(loc_id)
    db.delete(l); db.commit()
    return {"ok": True}
