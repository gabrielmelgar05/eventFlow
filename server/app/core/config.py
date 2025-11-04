import os
from dotenv import load_dotenv
from pydantic import BaseModel
load_dotenv()

class Settings(BaseModel):
    APP_NAME: str = os.getenv("APP_NAME", "EventFlow API")
    APP_HOST: str = os.getenv("APP_HOST", "0.0.0.0")
    APP_PORT: int = int(os.getenv("APP_PORT", 8000))
    CORS_ORIGINS: list[str] = os.getenv("CORS_ORIGINS", "*").split(",")

    JWT_SECRET: str = os.getenv("JWT_SECRET", "secret")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRES_MINUTES: int = int(os.getenv("JWT_EXPIRES_MINUTES", "2880"))

    DATABASE_URL: str = os.getenv("DATABASE_URL")
    MEDIA_DIR: str = os.getenv("MEDIA_DIR", "uploads")
    BASE_URL: str = os.getenv("BASE_URL", "http://localhost:8000")

settings = Settings()
