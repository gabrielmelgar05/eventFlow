from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.db import engine, Base
from app.core.config import settings
from app.routers import auth
from app.models.user import User
from app.utils.security import hash_password
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.db import AsyncSessionLocal

app = FastAPI(title="EventFlow API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # em prod restrinja
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    # cria tabelas
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    # seed admin
    async with AsyncSessionLocal() as db:
        q = await db.execute(select(User).where(User.email == settings.ADMIN_EMAIL))
        admin = q.scalar_one_or_none()
        if not admin:
            admin = User(
                name=settings.ADMIN_NAME,
                email=settings.ADMIN_EMAIL,
                password_hash=hash_password(settings.ADMIN_PASSWORD),
            )
            db.add(admin)
            await db.commit()

app.include_router(auth.router)

@app.get("/")
async def root():
    return {"name": "EventFlow API", "docs": "/docs"}
