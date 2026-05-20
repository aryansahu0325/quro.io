from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session
import uuid
import random
import datetime
from pydantic import BaseModel
import httpx
from config import settings

from database import get_db
from models.user import User, GuestSession
from core.security import verify_password, get_password_hash, create_access_token, timedelta, ACCESS_TOKEN_EXPIRE_MINUTES
from services.email_service import (
    send_verification_otp_task,
    send_login_otp_task,
    send_welcome_email_task,
    send_password_reset_otp_task
)

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="api/auth/login", auto_error=False)

class UserCreate(BaseModel):
    email: str
    password: str

class VerifyOtpSchema(BaseModel):
    email: str
    otp: str

class ResendOtpSchema(BaseModel):
    email: str
    purpose: str

class LoginOtpRequestSchema(BaseModel):
    email: str

class LoginOtpVerifySchema(BaseModel):
    email: str
    otp: str

class ForgotPasswordSchema(BaseModel):
    email: str

class ResetPasswordSchema(BaseModel):
    email: str
    otp: str
    new_password: str

class GoogleTokenSchema(BaseModel):
    token: str

@router.get("/session")
async def get_session(db: Session = Depends(get_db)):
    session_id = str(uuid.uuid4())
    guest_session = GuestSession(session_id=session_id)
    db.add(guest_session)
    db.commit()
    return {"session_id": session_id}

@router.post("/register")
async def register(user: UserCreate, request: Request, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    
    if db_user and db_user.is_verified:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    otp = f"{random.randint(100000, 999999)}"
    expiry = datetime.datetime.utcnow() + timedelta(minutes=15)
    
    if db_user:
        db_user.hashed_password = get_password_hash(user.password)
        db_user.verification_otp = otp
        db_user.verification_otp_expires_at = expiry
    else:
        hashed_password = get_password_hash(user.password)
        db_user = User(
            email=user.email,
            hashed_password=hashed_password,
            is_verified=False,
            verification_otp=otp,
            verification_otp_expires_at=expiry,
            is_admin=False
        )
        db.add(db_user)
        
    db.commit()
    db.refresh(db_user)
    
    base_url = str(request.base_url)
    verify_link = f"{base_url}api/auth/verify-link?email={db_user.email}&token={otp}"
    
    send_verification_otp_task.delay(db_user.email, otp, verify_link)
    
    return {
        "status": "verification_pending",
        "message": "Verification code sent to your email inbox. Please verify to continue.",
        "email": db_user.email
    }

@router.post("/verify-otp")
async def verify_otp(payload: VerifyOtpSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user.is_verified:
        raise HTTPException(status_code=400, detail="Email already verified")
        
    if not user.verification_otp or user.verification_otp != payload.otp:
        raise HTTPException(status_code=400, detail="Invalid verification code")
        
    if datetime.datetime.utcnow() > user.verification_otp_expires_at:
        raise HTTPException(status_code=400, detail="Verification code has expired")
        
    user.is_verified = True
    user.verification_otp = None
    user.verification_otp_expires_at = None
    
    total_users = db.query(User).count()
    if total_users <= 1:
        user.is_admin = True
        
    db.commit()
    
    send_welcome_email_task.delay(user.email)
    
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "api_key": user.api_key,
            "is_admin": user.is_admin,
            "is_verified": user.is_verified
        }
    }

@router.get("/verify-link", response_class=HTMLResponse)
async def verify_link(email: str, token: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    success = False
    message = ""
    
    if not user:
        message = "Account not found."
    elif user.is_verified:
        success = True
        message = "Your email is already verified!"
    elif not user.verification_otp or user.verification_otp != token:
        message = "Invalid or expired verification token."
    elif datetime.datetime.utcnow() > user.verification_otp_expires_at:
        message = "This verification link has expired."
    else:
        user.is_verified = True
        user.verification_otp = None
        user.verification_otp_expires_at = None
        
        total_users = db.query(User).count()
        if total_users <= 1:
            user.is_admin = True
            
        db.commit()
        success = True
        message = "Your email was successfully verified!"
        send_welcome_email_task.delay(user.email)

    status_color = "#10b981" if success else "#ef4444"
    status_icon = "✓" if success else "✗"
    html_page = f"""
    <!DOCTYPE html>
    <html><head><style>body{{font-family:sans-serif;background-color:#0c0d10;color:#e2e8f0;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;}}
    .card{{background-color:#121318;border:1px solid #1f2937;border-radius:20px;padding:48px 32px;max-width:400px;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,0.5);}}
    .icon{{width:64px;height:64px;border-radius:50%;border:2px solid {status_color};color:{status_color};font-size:32px;line-height:60px;margin:0 auto 24px;}}
    .btn{{display:inline-block;background-color:#10b981;color:#000;font-weight:700;padding:12px 32px;border-radius:8px;text-decoration:none;}}</style></head>
    <body><div class="card"><div class="icon">{status_icon}</div><h1>{"Success!" if success else "Failed"}</h1><p>{message}</p><a href="/" class="btn">Go to Workspace</a></div></body></html>
    """
    return html_page

@router.post("/resend-otp")
async def resend_otp(payload: ResendOtpSchema, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    otp = f"{random.randint(100000, 999999)}"
    expiry = datetime.datetime.utcnow() + timedelta(minutes=15)
    
    if payload.purpose == "signup":
        if user.is_verified:
            raise HTTPException(status_code=400, detail="Account is already verified")
        user.verification_otp = otp
        user.verification_otp_expires_at = expiry
        db.commit()
        
        verify_link = f"{request.base_url}api/auth/verify-link?email={user.email}&token={otp}"
        send_verification_otp_task.delay(user.email, otp, verify_link)
        
    elif payload.purpose == "login":
        if not user.is_verified:
            raise HTTPException(status_code=400, detail="Email is not verified yet.")
        user.login_otp = otp
        user.login_otp_expires_at = expiry
        db.commit()
        send_login_otp_task.delay(user.email, otp)
        
    else:
        raise HTTPException(status_code=400, detail="Invalid purpose parameters")
        
    return {"message": "Verification code resent successfully"}

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
        
    if not user.is_verified:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="EMAIL_NOT_VERIFIED")
        
    access_token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "api_key": user.api_key, "is_admin": user.is_admin, "is_verified": user.is_verified}}

@router.post("/login-otp-request")
async def login_otp_request(payload: LoginOtpRequestSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email address not found")
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="EMAIL_NOT_VERIFIED")
        
    otp = f"{random.randint(100000, 999999)}"
    user.login_otp = otp
    user.login_otp_expires_at = datetime.datetime.utcnow() + timedelta(minutes=10)
    db.commit()
    send_login_otp_task.delay(user.email, otp)
    return {"message": "Login code sent to email inbox successfully"}

@router.post("/login-otp-verify")
async def login_otp_verify(payload: LoginOtpVerifySchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not user.login_otp or user.login_otp != payload.otp:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    if datetime.datetime.utcnow() > user.login_otp_expires_at:
        raise HTTPException(status_code=400, detail="Verification code has expired")
        
    user.login_otp = None
    user.login_otp_expires_at = None
    db.commit()
    
    access_token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "api_key": user.api_key, "is_admin": user.is_admin, "is_verified": user.is_verified}}

@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if user:
        otp = f"{random.randint(100000, 999999)}"
        user.reset_password_otp = otp
        user.reset_password_otp_expires_at = datetime.datetime.utcnow() + timedelta(minutes=15)
        db.commit()
        send_password_reset_otp_task.delay(user.email, otp)
    return {"message": "If an account exists, a password reset code has been sent."}

@router.post("/reset-password")
async def reset_password(payload: ResetPasswordSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not user.reset_password_otp or user.reset_password_otp != payload.otp:
        raise HTTPException(status_code=400, detail="Invalid reset code")
    if datetime.datetime.utcnow() > user.reset_password_otp_expires_at:
        raise HTTPException(status_code=400, detail="Reset code has expired")
        
    user.hashed_password = get_password_hash(payload.new_password)
    user.reset_password_otp = None
    user.reset_password_otp_expires_at = None
    db.commit()
    return {"message": "Password updated successfully"}

@router.post("/google/login")
async def google_login(payload: GoogleTokenSchema, db: Session = Depends(get_db)):
    """Validates the Google access token manually using Google's tokeninfo API."""
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {payload.token}"}
            )
            if res.status_code != 200:
                raise HTTPException(status_code=400, detail="Invalid Google token")
            user_data = res.json()
    except Exception as e:
        raise HTTPException(status_code=400, detail="Failed to communicate with Google Identity services")

    email = user_data.get("email")
    google_id = user_data.get("sub")
    
    if not email or not google_id:
        raise HTTPException(status_code=400, detail="Invalid token payload")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            email=email,
            hashed_password=get_password_hash(str(uuid.uuid4())), # Random password since Google Auth is used
            is_verified=True,
            is_admin=False,
            google_id=google_id
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        total_users = db.query(User).count()
        if total_users <= 1:
            user.is_admin = True
            db.commit()
            
    access_token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "api_key": user.api_key, "is_admin": user.is_admin, "is_verified": user.is_verified}}

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    from jose import jwt, JWTError
    from core.security import SECRET_KEY, ALGORITHM
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

async def get_optional_current_user(token: str = Depends(oauth2_scheme_optional), db: Session = Depends(get_db)):
    if not token:
        return None
    from jose import jwt, JWTError
    from core.security import SECRET_KEY, ALGORITHM
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
    except JWTError:
        return None
    user = db.query(User).filter(User.email == email).first()
    return user

async def admin_required(current_user: User = Depends(get_current_user)):
    if not current_user.is_verified or not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Administrative privileges required.")
    return current_user

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email, "api_key": current_user.api_key, "is_admin": current_user.is_admin, "is_verified": current_user.is_verified}
