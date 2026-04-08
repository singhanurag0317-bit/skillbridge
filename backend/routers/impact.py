# backend/routers/impact.py
# /impact/:id  /impact/leaderboard  /impact/:id/activity  /impact/:id/badges

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional

from database import get_db
import models, schemas

router = APIRouter(prefix="/impact", tags=["impact"])

BADGES = [
    {"id": 1, "name": "First Share",    "desc": "Shared your first skill",            "color": "#10B981", "icon": "⭐", "threshold_sessions": 1},
    {"id": 2, "name": "Helper",         "desc": "Helped 5 people",                    "color": "#6366F1", "icon": "🤝", "threshold_helped": 5},
    {"id": 3, "name": "Mentor",         "desc": "Completed 10 sessions",              "color": "#F4B83A", "icon": "🎓", "threshold_sessions": 10},
    {"id": 4, "name": "Community Star", "desc": "Reached 100 impact points",          "color": "#F4623A", "icon": "🌟", "threshold_score": 100},
    {"id": 5, "name": "Top Teacher",    "desc": "Got 5 reviews with 4.5+ rating",     "color": "#EC4899", "icon": "🏆", "threshold_reviews": 5},
    {"id": 6, "name": "Polymath",       "desc": "Skills in 3+ categories",            "color": "#14B8A6", "icon": "🔬", "threshold_categories": 3},
]


def _compute_badges(user: models.User, db: Session) -> list:
    skills = db.query(models.Skill).filter(models.Skill.user_id == user.id).all()
    categories = set(s.category for s in skills)
    total_reviews = sum(s.total_reviews or 0 for s in skills)
    avg_rating = sum(s.rating or 0 for s in skills) / len(skills) if skills else 0
    good_reviews = total_reviews if avg_rating >= 4.5 else 0

    result = []
    for b in BADGES:
        earned = False
        if b.get("threshold_sessions") and (user.sessions_count or 0) >= b["threshold_sessions"]:
            earned = True
        if b.get("threshold_helped") and (user.people_helped or 0) >= b["threshold_helped"]:
            earned = True
        if b.get("threshold_score") and (user.impact_score or 0) >= b["threshold_score"]:
            earned = True
        if b.get("threshold_reviews") and good_reviews >= b["threshold_reviews"]:
            earned = True
        if b.get("threshold_categories") and len(categories) >= b["threshold_categories"]:
            earned = True
        result.append({
            "id": b["id"],
            "name": b["name"],
            "desc": b["desc"],
            "color": b["color"],
            "icon": b["icon"],
            "earned": earned,
        })
    return result


@router.get("/leaderboard")
def get_leaderboard(
    city: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(models.User).order_by(models.User.impact_score.desc())
    if city:
        q = q.filter(models.User.city.ilike(f"%{city}%"))
    users = q.limit(20).all()
    total = db.query(models.User).count()

    result = []
    for rank, u in enumerate(users, start=1):
        out = schemas.UserOut.from_orm_user(u, total).model_dump()
        out["rank"] = rank
        out["score"] = u.impact_score
        result.append(out)
    return schemas.ok(result)


@router.get("/{user_id}/activity")
def get_activity(user_id: str, db: Session = Depends(get_db)):
    from datetime import datetime, timedelta
    import calendar

    # Generate last 6 months of activity from completed requests
    now = datetime.utcnow()
    activity = []
    for i in range(5, -1, -1):
        target = now.replace(day=1) - timedelta(days=i * 28)
        month_str = target.strftime("%b")
        year = target.year
        month = target.month

        count = (
            db.query(func.count(models.SkillRequest.id))
            .filter(
                models.SkillRequest.provider_id == user_id,
                models.SkillRequest.status == "completed",
                func.strftime("%Y", models.SkillRequest.created_at) == str(year),
                func.strftime("%m", models.SkillRequest.created_at) == f"{month:02d}",
            )
            .scalar()
        ) or 0

        activity.append({
            "month": month_str,
            "sessions": count,
            "hours": count * 1.0,
        })

    return schemas.ok(activity)


@router.get("/{user_id}/badges")
def get_badges(user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        return schemas.ok([])
    return schemas.ok(_compute_badges(user, db))


@router.get("/{user_id}")
def get_impact_stats(user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="User not found")

    total = db.query(models.User).count()

    # Calculate rank by impact score
    higher = db.query(func.count(models.User.id)).filter(
        models.User.impact_score > (user.impact_score or 0)
    ).scalar() or 0
    rank = higher + 1

    stats = schemas.ImpactStatsOut(
        impactScore=user.impact_score or 0,
        rank=rank,
        totalUsers=total,
        level=user.level or "Seed",
        nextLevel=user.next_level or "Sprout",
        levelProgress=user.level_progress or 0,
        sessions=user.sessions_count or 0,
        hours=user.hours_contributed or 0.0,
        peopleHelped=user.people_helped or 0,
        skillsShared=user.skills_shared or 0,
        city=user.city or "",
    )
    return schemas.ok(stats.model_dump())
