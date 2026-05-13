from fastapi import APIRouter
import uuid

router = APIRouter()

@router.get("/session")
async def get_session():
    """Returns a new session UUID."""
    return {"session_id": str(uuid.uuid4())}
