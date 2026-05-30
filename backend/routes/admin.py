from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
import datetime
from database import get_db
from models.user import User, DocumentSession, GuestSession
from routes.auth import admin_required
from services.email_service import send_promotional_email_task

class BroadcastEmailSchema(BaseModel):
    subject: str
    html_content: str

router = APIRouter()

@router.get("/stats")
async def get_system_stats(db: Session = Depends(get_db), current_admin: User = Depends(admin_required)):
    """Retrieve comprehensive system statistics for the admin dashboard."""
    total_users = db.query(User).count()
    verified_users = db.query(User).filter(User.is_verified == True).count()
    admin_users = db.query(User).filter(User.is_admin == True).count()
    
    total_document_sessions = db.query(DocumentSession).count()
    total_guest_sessions = db.query(GuestSession).count()
    
    # Granular Metrics
    last_24h = datetime.datetime.utcnow() - datetime.timedelta(days=1)
    new_users_24h = db.query(User).filter(User.created_at >= last_24h).count()
    new_sessions_24h = db.query(DocumentSession).filter(DocumentSession.created_at >= last_24h).count()
    
    # Redis / Celery Background Worker metrics
    worker_queue_length = 0
    try:
        from core.redis_client import redis_client
        if redis_client:
            worker_queue_length = redis_client.llen("celery")
    except Exception:
        pass
    
    return {
        "users": {
            "total": total_users,
            "verified": verified_users,
            "admins": admin_users,
            "new_24h": new_users_24h
        },
        "sessions": {
            "document_sessions": total_document_sessions,
            "guest_sessions": total_guest_sessions,
            "new_24h": new_sessions_24h
        },
        "system": {
            "status": "Operational",
            "version": "1.2.0",
            "worker_queue_length": worker_queue_length
        }
    }

@router.get("/users")
async def list_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_admin: User = Depends(admin_required)):
    """Retrieve a list of all registered users."""
    users = db.query(User).order_by(User.created_at.desc()).offset(skip).limit(limit).all()
    total = db.query(User).count()
    
    return {
        "total": total,
        "users": [
            {
                "id": u.id,
                "email": u.email,
                "created_at": u.created_at,
                "is_admin": u.is_admin,
                "is_verified": u.is_verified,
                "session_count": len(u.document_sessions) # Due to relationship loading
            } for u in users
        ]
    }

@router.post("/users/{user_id}/toggle-admin")
async def toggle_admin_status(user_id: str, db: Session = Depends(get_db), current_admin: User = Depends(admin_required)):
    """Toggle the administrative privileges of a specific user."""
    if user_id == current_admin.id:
        raise HTTPException(status_code=400, detail="Cannot toggle your own admin status")
        
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.is_admin = not user.is_admin
    db.commit()
    
    return {"message": f"Admin status updated", "is_admin": user.is_admin}

@router.delete("/users/{user_id}")
async def delete_user(user_id: str, db: Session = Depends(get_db), current_admin: User = Depends(admin_required)):
    """Completely delete a user and all associated data."""
    if user_id == current_admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
        
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # The relationship cascade will delete DocumentSessions and ChatMessages
    db.delete(user)
    db.commit()
    
    return {"message": "User successfully deleted"}

@router.post("/broadcast")
async def broadcast_email(payload: BroadcastEmailSchema, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_admin: User = Depends(admin_required)):
    """Send a promotional HTML email to all verified users."""
    verified_users = db.query(User).filter(User.is_verified == True).all()
    if not verified_users:
        raise HTTPException(status_code=400, detail="No verified users found to broadcast to.")
        
    for u in verified_users:
        send_promotional_email_task.delay(u.email, payload.subject, payload.html_content)
        
    return {"message": f"Broadcast queued for {len(verified_users)} verified users."}
