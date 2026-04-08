# backend/schemas.py
# Pydantic v2 request/response schemas — matches frontend TypeScript types exactly

import json
from datetime import datetime
from typing import Any, Generic, List, Optional, TypeVar
from pydantic import BaseModel, EmailStr, field_validator

T = TypeVar("T")


# ─── Generic API wrapper (matches frontend ApiResponse<T>) ───────────────────
class ApiResponse(BaseModel, Generic[T]):
    success: bool
    data: T
    message: Optional[str] = None


def ok(data: Any, message: str = "OK") -> dict:
    return {"success": True, "data": data, "message": message}


def err(message: str) -> dict:
    return {"success": False, "data": None, "message": message}


# ─── Auth ────────────────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    location: str = ""


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    city: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    availability: Optional[List[str]] = None
    languages: Optional[List[str]] = None


# ─── User (response) ─────────────────────────────────────────────────────────
class UserOut(BaseModel):
    id: str
    name: str
    email: str
    location: str
    city: str
    initials: str
    bio: Optional[str] = ""
    avatar: Optional[str] = None
    role: Optional[str] = "member"
    level: str
    nextLevel: str
    levelProgress: int
    impactScore: int
    rank: Optional[int] = None
    totalUsers: Optional[int] = None
    verified: Optional[bool] = False
    responseTime: Optional[str] = "< 1 hour"
    availability: Optional[List[str]] = []
    languages: Optional[List[str]] = ["English"]
    joined: Optional[str] = None
    createdAt: Optional[str] = None

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_user(cls, user: Any, total_users: int = 0) -> "UserOut":
        avail = json.loads(user.availability) if isinstance(user.availability, str) else (user.availability or [])
        langs = json.loads(user.languages) if isinstance(user.languages, str) else (user.languages or ["English"])
        initials = "".join(p[0].upper() for p in user.name.split()[:2]) if user.name else "?"
        return cls(
            id=user.id,
            name=user.name,
            email=user.email,
            location=user.location or "",
            city=user.city or "",
            initials=initials,
            bio=user.bio or "",
            avatar=user.avatar,
            role=user.role or "member",
            level=user.level or "Seed",
            nextLevel=user.next_level or "Sprout",
            levelProgress=user.level_progress or 0,
            impactScore=user.impact_score or 0,
            rank=user.rank or 0,
            totalUsers=total_users,
            verified=user.verified or False,
            responseTime=user.response_time or "< 1 hour",
            availability=avail,
            languages=langs,
            joined=user.joined or (user.created_at.strftime("%B %Y") if user.created_at else None),
            createdAt=user.created_at.isoformat() if user.created_at else None,
        )


# ─── Skill ────────────────────────────────────────────────────────────────────
class AvailabilitySlot(BaseModel):
    day: str
    slots: List[str]
    available: bool


class CreateSkillRequest(BaseModel):
    title: str
    description: str
    category: str
    location: str = ""
    lat: Optional[float] = None
    lng: Optional[float] = None
    availability: Optional[List[str]] = []
    tags: Optional[List[str]] = []


class UpdateSkillRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    availability: Optional[Any] = None
    tags: Optional[List[str]] = None
    active: Optional[bool] = None
    duration: Optional[str] = None
    format: Optional[str] = None
    language: Optional[str] = None
    whatYouLearn: Optional[List[str]] = None
    requirements: Optional[List[str]] = None


class SkillOut(BaseModel):
    id: Any
    title: str
    category: str
    description: str
    rating: float
    totalReviews: Optional[int] = 0
    sessions: int
    active: Optional[bool] = True
    color: Optional[str] = "#10B981"
    tags: Optional[List[str]] = []
    duration: Optional[str] = "60 min"
    format: Optional[str] = "In-person / Online"
    language: Optional[str] = "English"
    location: Optional[str] = ""
    lat: Optional[float] = None
    lng: Optional[float] = None
    distance: Optional[str] = None
    availability: Optional[Any] = []
    userId: Optional[str] = None
    user: Optional[Any] = None
    whatYouLearn: Optional[List[str]] = []
    requirements: Optional[List[str]] = []
    createdAt: Optional[str] = None

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_skill(cls, skill: Any) -> "SkillOut":
        tags = json.loads(skill.tags) if isinstance(skill.tags, str) else (skill.tags or [])
        avail = json.loads(skill.availability) if isinstance(skill.availability, str) else (skill.availability or [])
        wyl = json.loads(skill.what_you_learn) if isinstance(skill.what_you_learn, str) else (skill.what_you_learn or [])
        reqs = json.loads(skill.requirements) if isinstance(skill.requirements, str) else (skill.requirements or [])

        user_data = None
        if skill.user:
            initials = "".join(p[0].upper() for p in skill.user.name.split()[:2])
            user_data = {
                "id": skill.user.id,
                "name": skill.user.name,
                "initials": initials,
                "impactScore": skill.user.impact_score,
                "level": skill.user.level,
                "verified": skill.user.verified,
                "responseTime": skill.user.response_time,
            }

        return cls(
            id=skill.id,
            title=skill.title,
            category=skill.category,
            description=skill.description,
            rating=skill.rating or 0.0,
            totalReviews=skill.total_reviews or 0,
            sessions=skill.sessions or 0,
            active=skill.active,
            color=skill.color or "#10B981",
            tags=tags,
            duration=skill.duration or "60 min",
            format=skill.format or "In-person / Online",
            language=skill.language or "English",
            location=skill.location or "",
            lat=skill.lat,
            lng=skill.lng,
            distance=skill.distance,
            availability=avail,
            userId=skill.user_id,
            user=user_data,
            whatYouLearn=wyl,
            requirements=reqs,
            createdAt=skill.created_at.isoformat() if skill.created_at else None,
        )


# ─── Skill Request ────────────────────────────────────────────────────────────
class CreateRequestBody(BaseModel):
    skillId: Any
    message: str = ""
    scheduledAt: Optional[str] = None


class SkillRequestOut(BaseModel):
    id: Any
    skillId: Any
    skill: Optional[Any] = None
    userId: Optional[str] = None
    user: Optional[Any] = None
    status: str
    message: Optional[str] = ""
    scheduledAt: Optional[str] = None
    createdAt: Optional[str] = None

    @classmethod
    def from_orm(cls, req: Any) -> "SkillRequestOut":
        skill_data = None
        if req.skill:
            skill_data = {"id": req.skill.id, "title": req.skill.title, "category": req.skill.category}
        user_data = None
        if req.requester:
            initials = "".join(p[0].upper() for p in req.requester.name.split()[:2])
            user_data = {"id": req.requester.id, "name": req.requester.name, "initials": initials}
        return cls(
            id=req.id,
            skillId=req.skill_id,
            skill=skill_data,
            userId=req.user_id,
            user=user_data,
            status=req.status,
            message=req.message or "",
            scheduledAt=req.scheduled_at,
            createdAt=req.created_at.isoformat() if req.created_at else None,
        )


# ─── Review ───────────────────────────────────────────────────────────────────
class CreateReviewBody(BaseModel):
    skillId: Any
    requestId: Optional[Any] = None
    rating: float
    comment: str


class ReviewOut(BaseModel):
    id: Any
    skillId: Any
    requestId: Optional[Any] = None
    userId: Optional[str] = None
    name: str
    initials: str
    color: Optional[str] = "#10B981"
    rating: float
    comment: str
    time: str
    createdAt: Optional[str] = None

    @classmethod
    def from_orm(cls, review: Any) -> "ReviewOut":
        name = review.reviewer.name if review.reviewer else "Anonymous"
        initials = "".join(p[0].upper() for p in name.split()[:2])
        colors = ["#10B981", "#F4623A", "#F4B83A", "#6366F1", "#EC4899"]
        color = colors[review.id % len(colors)]

        # relative time
        if review.created_at:
            diff = datetime.utcnow() - review.created_at
            days = diff.days
            if days == 0:
                time_str = "Today"
            elif days < 7:
                time_str = f"{days} day{'s' if days > 1 else ''} ago"
            elif days < 30:
                weeks = days // 7
                time_str = f"{weeks} week{'s' if weeks > 1 else ''} ago"
            else:
                months = days // 30
                time_str = f"{months} month{'s' if months > 1 else ''} ago"
        else:
            time_str = "Recently"

        return cls(
            id=review.id,
            skillId=review.skill_id,
            requestId=review.request_id,
            userId=review.user_id,
            name=name,
            initials=initials,
            color=color,
            rating=review.rating,
            comment=review.comment or "",
            time=time_str,
            createdAt=review.created_at.isoformat() if review.created_at else None,
        )


# ─── Message ─────────────────────────────────────────────────────────────────
class SendMessageBody(BaseModel):
    receiverId: str
    content: str


class MessageOut(BaseModel):
    id: Any
    senderId: str
    receiverId: str
    content: str
    timestamp: str
    read: Optional[bool] = False
    type: Optional[str] = "text"

    @classmethod
    def from_orm(cls, msg: Any) -> "MessageOut":
        return cls(
            id=msg.id,
            senderId=msg.sender_id,
            receiverId=msg.receiver_id,
            content=msg.content,
            timestamp=msg.created_at.isoformat() if msg.created_at else datetime.utcnow().isoformat(),
            read=msg.read,
            type=msg.type or "text",
        )


class ConversationOut(BaseModel):
    userId: str
    name: str
    initials: str
    color: Optional[str] = "#10B981"
    skill: str
    lastMessage: str
    unread: int
    online: bool
    time: Optional[str] = None


# ─── Impact ──────────────────────────────────────────────────────────────────
class ImpactStatsOut(BaseModel):
    impactScore: int
    rank: int
    totalUsers: int
    level: str
    nextLevel: str
    levelProgress: int
    sessions: int
    hours: float
    peopleHelped: int
    skillsShared: int
    city: str
