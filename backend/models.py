# backend/models.py
# SQLAlchemy ORM models — maps to frontend TypeScript types

import json
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean,
    DateTime, ForeignKey, Text, Enum as SAEnum
)
from sqlalchemy.orm import relationship
from database import Base


# ─── Helper: store lists as JSON strings ─────────────────────────────────────
class JsonList(Text):
    """Custom type that serialises Python lists to JSON strings."""
    pass


# ─── User ────────────────────────────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    location = Column(String, default="")
    city = Column(String, default="")
    bio = Column(Text, default="")
    avatar = Column(String, nullable=True)
    role = Column(String, default="member")

    # Gamification
    impact_score = Column(Integer, default=0)
    level = Column(String, default="Seed")
    next_level = Column(String, default="Sprout")
    level_progress = Column(Integer, default=0)  # 0-100
    rank = Column(Integer, default=0)

    # Stats
    sessions_count = Column(Integer, default=0)
    hours_contributed = Column(Float, default=0.0)
    people_helped = Column(Integer, default=0)
    skills_shared = Column(Integer, default=0)

    # Extra
    verified = Column(Boolean, default=False)
    response_time = Column(String, default="< 1 hour")
    availability = Column(JsonList, default="[]")   # JSON list
    languages = Column(JsonList, default='["English"]')  # JSON list
    joined = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relations
    skills = relationship("Skill", back_populates="user", cascade="all, delete-orphan")
    sent_requests = relationship("SkillRequest", foreign_keys="SkillRequest.user_id", back_populates="requester")
    received_requests = relationship("SkillRequest", foreign_keys="SkillRequest.provider_id", back_populates="provider")
    reviews_given = relationship("Review", foreign_keys="Review.user_id", back_populates="reviewer")


# ─── Skill ───────────────────────────────────────────────────────────────────
SKILL_CATEGORIES = ["Tech", "Career", "Music", "Wellness", "Creative", "Language"]

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, nullable=False)
    category = Column(SAEnum(*SKILL_CATEGORIES, name="skill_category"), nullable=False)
    description = Column(Text, default="")
    rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    sessions = Column(Integer, default=0)
    active = Column(Boolean, default=True)

    # Display
    color = Column(String, default="#10B981")
    tags = Column(JsonList, default="[]")          # JSON list

    # Session details
    duration = Column(String, default="60 min")
    format = Column(String, default="In-person / Online")
    language = Column(String, default="English")

    # Location
    location = Column(String, default="")
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    distance = Column(String, nullable=True)

    # Availability JSON: [{"day": "Mon", "slots": ["6pm"], "available": true}]
    availability = Column(JsonList, default="[]")

    # Learning content
    what_you_learn = Column(JsonList, default="[]")
    requirements = Column(JsonList, default="[]")

    # FK
    user_id = Column(String, ForeignKey("users.id"), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relations
    user = relationship("User", back_populates="skills")
    requests = relationship("SkillRequest", back_populates="skill")
    reviews = relationship("Review", back_populates="skill")


# ─── SkillRequest ─────────────────────────────────────────────────────────────
REQUEST_STATUSES = ["pending", "accepted", "completed", "cancelled"]

class SkillRequest(Base):
    __tablename__ = "skill_requests"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)      # requester
    provider_id = Column(String, ForeignKey("users.id"), nullable=False)  # skill owner

    status = Column(SAEnum(*REQUEST_STATUSES, name="request_status"), default="pending")
    message = Column(Text, default="")
    scheduled_at = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relations
    skill = relationship("Skill", back_populates="requests")
    requester = relationship("User", foreign_keys=[user_id], back_populates="sent_requests")
    provider = relationship("User", foreign_keys=[provider_id], back_populates="received_requests")
    review = relationship("Review", back_populates="request", uselist=False)


# ─── Review ──────────────────────────────────────────────────────────────────
class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    request_id = Column(Integer, ForeignKey("skill_requests.id"), nullable=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)

    rating = Column(Float, nullable=False)
    comment = Column(Text, default="")

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relations
    skill = relationship("Skill", back_populates="reviews")
    request = relationship("SkillRequest", back_populates="review")
    reviewer = relationship("User", foreign_keys=[user_id], back_populates="reviews_given")


# ─── Message ─────────────────────────────────────────────────────────────────
class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    sender_id = Column(String, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(String, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    read = Column(Boolean, default=False)
    type = Column(String, default="text")

    created_at = Column(DateTime, default=datetime.utcnow)
