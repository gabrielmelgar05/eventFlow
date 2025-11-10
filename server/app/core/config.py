# app/core/config.py
from typing import List, Any
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator


class Settings(BaseSettings):
    # Banco
    DATABASE_URL: str = "sqlite:///./dev.db"

    # JWT
    JWT_SECRET: str = "change-me-in-.env"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRES_MINUTES: int = 60

    # CORS
    # Aceita "*" ou lista separada por vírgula no .env (ex: http://localhost:3000,http://localhost:5173)
    CORS_ORIGINS: List[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",   # ignora APP_NAME, BASE_URL etc. se existirem no .env
    )

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def split_cors(cls, v: Any) -> List[str]:
        if isinstance(v, str):
            return [s.strip() for s in v.split(",")] if v and v != "*" else ["*"]
        return v


settings = Settings()
