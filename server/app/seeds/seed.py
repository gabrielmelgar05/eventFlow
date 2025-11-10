# app/seeds/seed.py
from app.core.db import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

def main():
    db = SessionLocal()
    try:
        email = "admin@email.com"
        user = db.query(User).filter(User.email == email).first()
        if user:
            print("Usuário já existe:", email)
            return
        user = User(
            name="Admin",
            email=email,
            hashed_password=get_password_hash("123456")
        )
        db.add(user)
        db.commit()
        print("Usuário criado:", email, "senha: 123456")
    finally:
        db.close()

if __name__ == "__main__":
    main()
