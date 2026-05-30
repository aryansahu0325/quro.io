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
    """Return paginated list of the user's workspaces (grouped by qdrant_session_id)."""
    docs = (
        db.query(DocumentSession)
        .filter(DocumentSession.user_id == current_user.id)
        .order_by(DocumentSession.created_at.desc())
        .all()
    )

    workspaces = {}
    for d in docs:
        qid = d.qdrant_session_id
        if qid not in workspaces:
            workspaces[qid] = {
                "id": qid, # qdrant_session_id acts as the workspace ID
                "created_at": d.created_at.isoformat(),
                "document_count": 0,
                "filenames": [],
                "message_count": 0,
                "db_ids": []
            }
        
        workspaces[qid]["document_count"] += 1
        workspaces[qid]["filenames"].append(d.filename)
        workspaces[qid]["db_ids"].append(d.id)
        
    # Get message counts
    for qid, ws in workspaces.items():
        count = db.query(ChatMessage).filter(ChatMessage.session_id.in_(ws["db_ids"])).count()
        ws["message_count"] = count
        
        # Determine title
        if ws["document_count"] == 1:
            ws["title"] = ws["filenames"][0]
        else:
            ws["title"] = f"{ws['filenames'][0]} + {ws['document_count'] - 1} more"

    # Paginate workspaces
    ws_list = list(workspaces.values())
    paginated = ws_list[skip : skip + limit]

    return {"sessions": paginated, "total": len(ws_list)}


@router.get("/{qdrant_session_id}")
async def get_session(
    qdrant_session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return workspace details + all documents + full chat history."""
    docs = (
        db.query(DocumentSession)
        .filter(
            DocumentSession.qdrant_session_id == qdrant_session_id,
            DocumentSession.user_id == current_user.id,
        )
        .order_by(DocumentSession.created_at.asc())
        .all()
    )
    if not docs:
        raise HTTPException(status_code=404, detail="Workspace not found")

    documents_info = []
    all_messages = []
    
    for doc in docs:
        summary = {}
        try:
            summary = json.loads(doc.summary_json) if doc.summary_json else {}
        except Exception:
            pass
            
        documents_info.append({
            "id": doc.id,
            "filename": doc.filename,
            "file_size": doc.file_size,
            "summary": summary
        })
        
        for m in doc.chat_messages:
            all_messages.append(m)
            
    # Sort messages chronologically
    all_messages.sort(key=lambda x: x.created_at)

    messages = [
        {
            "id": m.id,
            "role": m.role,
            "content": m.content,
            "created_at": m.created_at.isoformat(),
        }
        for m in all_messages
    ]

    return {
        "id": qdrant_session_id, # return qdrant_session_id as the main workspace ID
        "created_at": docs[0].created_at.isoformat(),
        "qdrant_session_id": qdrant_session_id,
        "documents": documents_info,
        "messages": messages,
    }


@router.delete("/{qdrant_session_id}")
async def delete_session(
    qdrant_session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete all documents and chat messages in a workspace."""
    docs = (
        db.query(DocumentSession)
        .filter(
            DocumentSession.qdrant_session_id == qdrant_session_id,
            DocumentSession.user_id == current_user.id,
        )
        .all()
    )
    if not docs:
        raise HTTPException(status_code=404, detail="Workspace not found")

    for doc in docs:
        db.delete(doc)
    db.commit()
    return {"message": "Workspace deleted successfully"}
