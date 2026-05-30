from fastapi import APIRouter, Form, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from database import get_db
from routes.auth import get_optional_current_user
from models.user import User
from services.synthesis_service import synthesis_service
from typing import Optional

router = APIRouter()

@router.post("/analyze")
async def analyze_workspace_papers(
    session_id: str = Form(...),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Validates uploaded papers and synthesizes their relationship.
    Returns:
    - Domain Mismatch error details if not academic research papers.
    - Interconnected themes, crust, domains and relationship summary if valid.
    """
    try:
        result = await synthesis_service.validate_and_synthesize(session_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Synthesis analysis failed: {str(e)}")

@router.post("/co-write")
async def co_write_research_paper(
    session_id: str = Form(...),
    topic: str = Form(...),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Co-writes a short, reference-backed research paper based on the topic.
    Returns a streamed text/event-stream.
    """
    async def event_generator():
        try:
            async for chunk in synthesis_service.stream_co_write_paper(session_id, topic):
                yield f"data: {chunk}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"data: ⚠️ Generation failed: {str(e)}\n\n"
            yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
