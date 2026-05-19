from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base
import datetime
import uuid


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    api_key = Column(String, unique=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    document_sessions = relationship("DocumentSession", back_populates="user", cascade="all, delete-orphan")


class GuestSession(Base):
    __tablename__ = "guest_sessions"

    session_id = Column(String, primary_key=True, index=True)
    upload_count = Column(Integer, default=0)
    last_accessed = Column(DateTime, default=datetime.datetime.utcnow)


class DocumentSession(Base):
    """Persisted PDF analysis session for authenticated users."""
    __tablename__ = "document_sessions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    qdrant_session_id = Column(String, nullable=False)  # The session_id used in vector store
    filename = Column(String, nullable=False)
    file_size = Column(Integer, default=0)
    summary_json = Column(Text, nullable=True)  # JSON string of summary
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="document_sessions")
    chat_messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan", order_by="ChatMessage.created_at")


class ChatMessage(Base):
    """Individual chat messages within a document session."""
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    session_id = Column(String, ForeignKey("document_sessions.id"), nullable=False, index=True)
    role = Column(String, nullable=False)  # 'user' or 'ai'
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    session = relationship("DocumentSession", back_populates="chat_messages")
