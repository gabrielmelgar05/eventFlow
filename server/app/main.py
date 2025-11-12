import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.db import Base, engine
from app.routers import auth, categories, locations, events

# cria tabelas no start (simples p/ projeto da disciplina)
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(locations.router)
app.include_router(events.router)

@app.get("/", tags=["health"])
def health():
    return {"status": "ok"}
