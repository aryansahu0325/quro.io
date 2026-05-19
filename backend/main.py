from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routes import assistant, upload, challenge, health, auth, sessions
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import uvicorn
from database import engine
from models import user

# Create all tables (User, GuestSession, DocumentSession, ChatMessage)
user.Base.metadata.create_all(bind=engine)

# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
origins = list(settings.ALLOWED_ORIGINS)
if "*" in origins:
    origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
else:
    if "http://localhost:5173" not in origins:
        origins.append("http://localhost:5173")
    if "http://127.0.0.1:5173" not in origins:
        origins.append("http://127.0.0.1:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(assistant.router, prefix="/api/assistant", tags=["Assistant"])
app.include_router(sessions.router, prefix="/api/sessions", tags=["Sessions"])
app.include_router(challenge.router, prefix="/api/challenge", tags=["Challenge"])
app.include_router(health.router, prefix="/api/health", tags=["Health"])

@app.get("/")
async def root():
    return {"message": "Welcome to Quro AI Platform API", "status": "running"}

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)