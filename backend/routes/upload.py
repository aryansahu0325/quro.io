from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.document_service import document_service
from typing import Optional

router = APIRouter()

@router.post("/")
async def upload_document(
    file: UploadFile = File(...),
    session_id: str = Form(...)
):
    if not file.filename.endswith(('.pdf', '.txt')):
        raise HTTPException(status_code=400, detail="Only PDF and TXT files are supported.")
    
    try:
        content = await file.read()
        result = await document_service.process_document(content, file.filename, session_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")
