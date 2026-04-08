# backend/routers/dashboard.py
# /dashboard — aggregated user dashboard data

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from database import get_db
import models, schemas
from auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("")
def get_dashboard(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    uid = current_user.id
    total_users = db.query(models.User).count()

    # My skills
    my_skills = db.query(models.Skill).filter(models.Skill.user_id == uid).all()

    # Requests involving me
    my_requests = (
        db.query(models.SkillRequest)
        .filter(
            (models.SkillRequest.user_id == uid) | (models.SkillRequest.provider_id == uid)
        )
        .order_by(models.SkillRequest.created_at.desc())
        .limit(10)
        .all()
    )

    # AI recommended skills (reuse simple rating-based for dashboard)
    recommended = (
        db.query(models.Skill)
        .filter(models.Skill.user_id != uid, models.Skill.active == True)
        .order_by(models.Skill.rating.desc())
        .limit(3)
        .all()
    )

    # Recent activity from requests
    recent_activity = []
    for req in my_requests[:5]:
        if req.status == "completed":
            text = f"Completed session: {req.skill.title if req.skill else 'a skill'}"
            atype = "completed"
        elif req.status == "accepted":
            text = f"Session accepted: {req.skill.title if req.skill else 'a skill'}"
            atype = "scheduled"
        else:
            text = f"New request for: {req.skill.title if req.skill else 'a skill'}"
            atype = "request"
        recent_activity.append({
            "id": req.id,
            "text": text,
            "time": req.created_at.strftime("%b %d") if req.created_at else "",
            "type": atype,
        })

    stats = {
        "skillsShared": current_user.skills_shared or 0,
        "peopleHelped": current_user.people_helped or 0,
        "hoursContributed": current_user.hours_contributed or 0,
        "impactScore": current_user.impact_score or 0,
    }

    return schemas.ok({
        "user": schemas.UserOut.from_orm_user(current_user, total_users).model_dump(),
        "stats": stats,
        "mySkills": [schemas.SkillOut.from_orm_skill(s).model_dump() for s in my_skills],
        "requests": [schemas.SkillRequestOut.from_orm(r).model_dump() for r in my_requests],
        "recommended": [schemas.SkillOut.from_orm_skill(s).model_dump() for s in recommended],
        "recentActivity": recent_activity,
    })
