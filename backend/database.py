from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings

DATABASE_URL = settings.DATABASE_URL

connect_args = {}
engine_args = {}

if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
else:
    # Industry-grade pooling settings for production serverless databases (e.g., Neon PostgreSQL)
    # pool_pre_ping: Pessimistic check to verify connection viability before execution.
    # pool_recycle: Prevent connections from sitting idle and getting closed by Neon.
    engine_args = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
        "pool_size": 10,
        "max_overflow": 20
    }

engine = create_engine(DATABASE_URL, connect_args=connect_args, **engine_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def run_migrations(engine):
    """
    Lightweight, resilient automatic migration runner.
    Applies schema upgrades (such as adding OTP and admin columns) to existing tables,
    ensuring compatibility on active Neon Postgres/SQLite databases without losing data.
    """
    from sqlalchemy import text
    import logging
    logger = logging.getLogger("quro.db_migrations")
    logger.info("Initializing automatic schema migration checks...")
    
    with engine.connect() as conn:
        columns_to_add = [
            ("is_admin", "BOOLEAN DEFAULT FALSE"),
            ("is_verified", "BOOLEAN DEFAULT FALSE"),
            ("verification_otp", "VARCHAR"),
            ("verification_otp_expires_at", "TIMESTAMP"),
            ("login_otp", "VARCHAR"),
            ("login_otp_expires_at", "TIMESTAMP"),
            ("reset_password_otp", "VARCHAR"),
            ("reset_password_otp_expires_at", "TIMESTAMP"),
            ("google_id", "VARCHAR")
        ]
        
        for column_name, column_type in columns_to_add:
            try:
                with conn.begin():
                    conn.execute(text(f"ALTER TABLE users ADD COLUMN {column_name} {column_type};"))
                    logger.info(f"Database Migrations: Added column '{column_name}' to users table.")
            except Exception:
                # Column already exists or table is empty - ignore error
                pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
