from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routes import assistant, upload, challenge, health, auth, sessions, admin
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from starlette.exceptions import HTTPException as StarletteHTTPException
import uvicorn
from database import engine, run_migrations
from models import user

# Create all tables (User, GuestSession, DocumentSession, ChatMessage)
user.Base.metadata.create_all(bind=engine)
run_migrations(engine)

# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Custom exception handler for 405 Method Not Allowed errors
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code == 405:
        return JSONResponse(
            status_code=405,
            content={
                "status": "error",
                "code": 405,
                "message": f"Method {request.method} is not allowed for this endpoint. Please verify the correct HTTP verb (e.g. POST, PUT, DELETE) and standard parameters.",
                "endpoint": str(request.url.path),
                "docs_url": f"{request.base_url}docs"
            }
        )
    # Default handler for other standard HTTPExceptions
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

# Serve a blank 204 No Content response for /favicon.ico requests
@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)

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
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

@app.get("/")
async def root():
    return {"message": "Welcome to Quro AI Platform API", "status": "running"}

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)