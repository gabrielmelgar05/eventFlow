from app.core.db import SessionLocal
from app.core.security import hash_password
from app.models.user import User
from app.models.category import Category
from app.models.location import Location

def run():
    db = SessionLocal()
    if not db.query(User).first():
        db.add(User(name="Admin", email="admin@eventflow.com", password_hash=hash_password("123456")))
    if not db.query(Category).first():
        db.add_all([Category(name="Música"), Category(name="Tech"), Category(name="Esporte")])
    if not db.query(Location).first():
        db.add_all([
            Location(name="Centro", latitude=-8.7612, longitude=-63.9039, address="Centro, Porto Velho"),
            Location(name="Teatro", latitude=-8.7645, longitude=-63.9000, address="Av. Exemplo, 123")
        ])
    db.commit(); db.close()

if __name__ == "__main__":
    run()
