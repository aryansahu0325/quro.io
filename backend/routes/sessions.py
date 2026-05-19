from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import DocumentSession, ChatMessage
from routes.auth import get_current_user
from models.user import User
import json

router = APIRouter()


@router.get("/")
async def list_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 50,
):
    """Return paginated list of the user's past document sessions."""
    sessions = (
        db.query(DocumentSession)
        .filter(DocumentSession.user_id == current_user.id)
        .order_by(DocumentSession.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    result = []
    for s in sessions:
        msg_count = db.query(ChatMessage).filter(ChatMessage.session_id == s.id).count()
        summary = {}
        try:
            summary = json.loads(s.summary_json) if s.summary_json else {}
        except Exception:
            pass

        result.append({
            "id": s.id,
            "filename": s.filename,
            "file_size": s.file_size,
            "created_at": s.created_at.isoformat(),
            "message_count": msg_count,
            "summary_title": summary.get("title", s.filename),
            "qdrant_session_id": s.qdrant_session_id,
        })

    return {"sessions": result, "total": len(result)}


@router.get("/{session_id}")
async def get_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return session details + full chat history."""
    session = (
        db.query(DocumentSession)
        .filter(
            DocumentSession.id == session_id,
            DocumentSession.user_id == current_user.id,
        )
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    summary = {}
    try:
        summary = json.loads(session.summary_json) if session.summary_json else {}
    except Exception:
        pass

    messages = [
        {
            "id": m.id,
            "role": m.role,
            "content": m.content,
            "created_at": m.created_at.isoformat(),
        }
        for m in session.chat_messages
    ]

    return {
        "id": session.id,
        "filename": session.filename,
        "file_size": session.file_size,
        "created_at": session.created_at.isoformat(),
        "qdrant_session_id": session.qdrant_session_id,
        "summary": summary,
        "messages": messages,
    }


@router.delete("/{session_id}")
async def delete_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a session and all its chat messages."""
    session = (
        db.query(DocumentSession)
        .filter(
            DocumentSession.id == session_id,
            DocumentSession.user_id == current_user.id,
        )
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    db.delete(session)
    db.commit()
    return {"message": "Session deleted successfully"}
