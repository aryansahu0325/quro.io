from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from services.document_service import document_service
from database import get_db
from models.user import GuestSession, User, DocumentSession
from routes.auth import get_optional_current_user
from typing import Optional, List
import json

router = APIRouter()

@router.post("/")
async def upload_document(
    files: List[UploadFile] = File(...),
    session_id: str = Form(...),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    # Enforce multi-file auth limit
    if len(files) > 1 and not current_user:
        raise HTTPException(status_code=403, detail="Guest users can only upload 1 file at a time. Please sign in to upload multiple papers.")
        
    for file in files:
        if not file.filename.endswith(('.pdf', '.txt')):
            raise HTTPException(status_code=400, detail="Only PDF and TXT files are supported.")
    
    # Check upload limits for guest users
    if not current_user:
        guest = db.query(GuestSession).filter(GuestSession.session_id == session_id).first()
        if not guest:
            guest = GuestSession(session_id=session_id)
            db.add(guest)
            db.commit()
            
        if guest.upload_count >= 1:
            raise HTTPException(status_code=403, detail="Guest upload limit reached. Please sign up to upload more.")
    
    results = []
    
    try:
        for file in files:
            content = await file.read()
            file_size = len(content)
            result = await document_service.process_document(content, file.filename, session_id)
            
            # Increment guest upload count if not logged in
            if not current_user:
                guest.upload_count += 1
                db.commit()
            else:
                # Save DocumentSession for authenticated users
                doc_session = DocumentSession(
                    user_id=current_user.id,
                    qdrant_session_id=session_id,
                    filename=file.filename,
                    file_size=file_size,
                    summary_json=json.dumps(result.get("summary", {})),
                )
                db.add(doc_session)
                db.commit()
                db.refresh(doc_session)
                result["session_db_id"] = doc_session.id
                
            results.append(result)
            
        return {"documents": results, "qdrant_session_id": session_id}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")
