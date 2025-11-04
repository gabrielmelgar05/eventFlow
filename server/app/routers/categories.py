from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.category import Category
from app.schemas.category import CategoryIn, CategoryOut
from .auth import get_current_user

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).order_by(Category.name).all()

@router.post("", response_model=CategoryOut)
def create_category(payload: CategoryIn, db: Session = Depends(get_db), _=Depends(get_current_user)):
    c = Category(name=payload.name)
    db.add(c); db.commit(); db.refresh(c)
    return c

@router.put("/{cat_id}", response_model=CategoryOut)
def update_category(cat_id: int, payload: CategoryIn, db: Session = Depends(get_db), _=Depends(get_current_user)):
    c = db.query(Category).get(cat_id)
    c.name = payload.name
    db.commit(); db.refresh(c)
    return c

@router.delete("/{cat_id}")
def delete_category(cat_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    c = db.query(Category).get(cat_id)
    db.delete(c); db.commit()
    return {"ok": True}
