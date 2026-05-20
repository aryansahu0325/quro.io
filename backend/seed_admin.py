import asyncio
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models.user import User
from core.security import get_password_hash
import datetime

def seed_admin():
    db = SessionLocal()
    try:
        admin_email = "admin@quro.io"
        admin_pass = "admin123"
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == admin_email).first()
        if existing_user:
            print(f"Admin user {admin_email} already exists. Updating password and permissions.")
            existing_user.hashed_password = get_password_hash(admin_pass)
            existing_user.is_admin = True
            existing_user.is_verified = True
        else:
            print(f"Creating new admin user {admin_email}...")
            new_user = User(
                email=admin_email,
                hashed_password=get_password_hash(admin_pass),
                is_admin=True,
                is_verified=True,
                created_at=datetime.datetime.utcnow()
            )
            db.add(new_user)
            
        db.commit()
        print("Successfully seeded admin user!")
    except Exception as e:
        print(f"Error seeding admin: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_admin()
