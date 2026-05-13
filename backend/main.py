from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routes import assistant, upload, challenge, health, auth
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import uvicorn

# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(assistant.router, prefix="/api/assistant", tags=["Assistant"])
app.include_router(challenge.router, prefix="/api/challenge", tags=["Challenge"])
app.include_router(health.router, prefix="/api/health", tags=["Health"])

@app.get("/")
async def root():
    return {"message": "Welcome to Quro AI Platform API", "status": "running"}

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)