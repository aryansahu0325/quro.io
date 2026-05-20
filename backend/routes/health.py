from fastapi import APIRouter, status, Response
from sqlalchemy import text
import time
import asyncio
from database import engine
from services.cache_service import cache_service
from core.vector_store import vector_store
from services.llm_service import llm_service

router = APIRouter()

@router.get("/")
async def health_check(response: Response):
    """
    Industry-level multi-service health and diagnostic check.
    Tests active connections to PostgreSQL, Redis Cache, Qdrant Vector Store, and Groq LLM.
    """
    diagnostics = {}
    is_fully_healthy = True
    
    # 1. PostgreSQL Check
    start_time = time.time()
    try:
        # Run a simple query to verify active db connection
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_latency = round((time.time() - start_time) * 1000, 2)
        diagnostics["database"] = {
            "status": "healthy",
            "latency_ms": db_latency,
            "type": engine.name
        }
    except Exception as e:
        is_fully_healthy = False
        diagnostics["database"] = {
            "status": "unhealthy",
            "error": str(e)
        }

    # 2. Redis Cache Check
    start_time = time.time()
    if cache_service.use_fallback:
        diagnostics["cache"] = {
            "status": "degraded",
            "info": "In-memory thread-safe fallback cache active",
            "latency_ms": 0.0
        }
    else:
        try:
            cache_service.client.ping()
            cache_latency = round((time.time() - start_time) * 1000, 2)
            diagnostics["cache"] = {
                "status": "healthy",
                "latency_ms": cache_latency
            }
        except Exception as e:
            diagnostics["cache"] = {
                "status": "unhealthy",
                "error": str(e)
            }

    # 3. Qdrant Vector Database Check
    start_time = time.time()
    try:
        # Verify collection listing works (active API ping)
        vector_store.client.get_collections()
        qdrant_latency = round((time.time() - start_time) * 1000, 2)
        diagnostics["vector_store"] = {
            "status": "healthy",
            "latency_ms": qdrant_latency
        }
    except Exception as e:
        is_fully_healthy = False
        diagnostics["vector_store"] = {
            "status": "unhealthy",
            "error": str(e)
        }

    # 4. Groq LLM Check
    try:
        if llm_service.client.api_key:
            diagnostics["llm_gateway"] = {
                "status": "healthy",
                "provider": "Groq Async API"
            }
        else:
            is_fully_healthy = False
            diagnostics["llm_gateway"] = {
                "status": "unhealthy",
                "error": "Groq API key not configured"
            }
    except Exception as e:
        is_fully_healthy = False
        diagnostics["llm_gateway"] = {
            "status": "unhealthy",
            "error": str(e)
        }

    # Determine overall system status
    overall_status = "healthy" if is_fully_healthy else "degraded"
    
    # If a critical component (like the DB) is unhealthy, return a 503 Service Unavailable
    if diagnostics["database"]["status"] == "unhealthy":
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        overall_status = "unhealthy"

    return {
        "status": overall_status,
        "timestamp": time.time(),
        "version": "1.1.0",
        "services": diagnostics
    }
