from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.db import Base, engine
from app.routers import auth, categories, locations, events

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(f"/{settings.MEDIA_DIR}", StaticFiles(directory=settings.MEDIA_DIR), name="uploads")

app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(locations.router)
app.include_router(events.router)
