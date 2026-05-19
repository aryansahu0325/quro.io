from fastapi import APIRouter, Form, Depends, BackgroundTasks
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from services.rag_service import rag_service
from database import get_db
from models.user import ChatMessage, DocumentSession
from routes.auth import get_optional_current_user
from models.user import User
from typing import Optional
import uuid
import datetime

router = APIRouter()

@router.post("/ask")
async def ask_question(
    question: str = Form(...),
    session_id: str = Form(...),
    session_db_id: Optional[str] = Form(None),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    full_answer_chunks = []

    async def event_generator():
        async for chunk in rag_service.answer_question(question, session_id):
            full_answer_chunks.append(chunk)
            yield f"data: {chunk}\n\n"
        yield "data: [DONE]\n\n"

        # Persist messages to DB after stream completes (for logged-in users)
        if current_user and session_db_id:
            full_answer = "".join(full_answer_chunks)
            try:
                user_msg = ChatMessage(
                    id=str(uuid.uuid4()),
                    session_id=session_db_id,
                    role="user",
                    content=question,
                    created_at=datetime.datetime.utcnow(),
                )
                ai_msg = ChatMessage(
                    id=str(uuid.uuid4()),
                    session_id=session_db_id,
                    role="ai",
                    content=full_answer,
                    created_at=datetime.datetime.utcnow(),
                )
                db.add(user_msg)
                db.add(ai_msg)
                db.commit()
            except Exception as e:
                print(f"Warning: Could not persist chat message: {e}")

    return StreamingResponse(event_generator(), media_type="text/event-stream")
