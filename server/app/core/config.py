# core/config.py

from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Banco
    DATABASE_URL: str = "sqlite:///./dev.db"

    # JWT
    JWT_SECRET: str = "change-me-in-.env"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRES_MINUTES: int = 60

    # App / CORS / arquivos
    APP_NAME: str = "EventFlow"
    BASE_URL: str = "http://localhost:8000"
    CORS_ORIGINS: List[str] = ["*"]           # pode listar URLs
    MEDIA_DIR: str = "uploads"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore",        # ignora chaves extras no .env (evita os "extra inputs are not permitted")
    )

settings = Settings()
