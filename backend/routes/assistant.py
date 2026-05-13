from fastapi import APIRouter, Form
from fastapi.responses import StreamingResponse
from services.rag_service import rag_service
from typing import Optional

router = APIRouter()

@router.post("/ask")
async def ask_question(
    question: str = Form(...),
    session_id: str = Form(...)
):
    async def event_generator():
        async for chunk in rag_service.answer_question(question, session_id):
            # SSE format: data: <content>\n\n
            yield f"data: {chunk}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
