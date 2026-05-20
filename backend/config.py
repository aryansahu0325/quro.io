import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional

class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "Quro AI Platform"
    DEBUG: bool = False
    ALLOWED_ORIGINS: List[str] = ["*"]
    
    # Groq Settings
    GROQ_API_KEY: str
    PRIMARY_MODEL: str = "llama-3.1-8b-instant"
    FALLBACK_MODEL: str = "llama-3.3-70b-versatile"
    
    # Qdrant Settings
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_API_KEY: Optional[str] = None
    VECTOR_COLLECTION: str = "quro_documents"
    
    # Redis Settings
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Neon/PostgreSQL Settings
    DATABASE_URL: str
    
    # Email Settings (Resend API)
    RESEND_API_KEY: Optional[str] = None
    
    # Embedding Settings
    EMBEDDING_MODEL: str = "BAAI/bge-small-en-v1.5"
    RERANK_MODEL: str = "cross-encoder/ms-marco-MiniLM-L-6-v2"
    
    # OCR Settings
    TESSERACT_CMD: str = "tesseract"
    
    # Security
    MAX_FILE_SIZE_MB: int = 25
    SESSION_EXPIRY_HOURS: int = 2
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
