"""
JanRakshak Application Configuration.
Loaded from environment variables with production defaults.
"""

import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "JanRakshak Backend API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://janrakshak_user:janrakshak_password@localhost:5432/janrakshak_db",
    )
    
    # Operating Mode: NORMAL (Civic Care) | DISASTER (Red Alert)
    OPERATING_MODE: str = os.getenv("OPERATING_MODE", "NORMAL")
    
    # CORS Origins for Frontend PWA & Mobile Web
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*",
    ]

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()
