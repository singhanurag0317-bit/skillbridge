# backend/routers/skills.py
# Full CRUD + recommended (AI cosine similarity) + similar + toggle

import json
import math
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
import models, schemas
from auth import get_current_user

router = APIRouter(prefix="/skills", tags=["skills"])

CATEGORY_COLORS = {
    "Tech": "#10B981",
    "Career": "#6366F1",
    "Music": "#F4B83A",
    "Wellness": "#F4623A",
    "Creative": "#EC4899",
    "Language": "#14B8A6",
}


def _haversine_km(lat1, lng1, lat2, lng2) -> float:
    R = 6371
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lng2 - lng1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlam / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


# ─── GET /skills ─────────────────────────────────────────────────────────────
@router.get("")
def get_all_skills(
    category: Optional[str] = Query(None),
    maxDistance: Optional[float] = Query(None),
    minRating: Optional[float] = Query(None),
    available: Optional[bool] = Query(None),
    query: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(models.Skill)

    if category and category != "All":
        q = q.filter(models.Skill.category == category)
    if minRating:
        q = q.filter(models.Skill.rating >= minRating)
    if available is not None:
        q = q.filter(models.Skill.active == available)
    if query:
        like = f"%{query}%"
        q = q.filter(
            models.Skill.title.ilike(like) | models.Skill.description.ilike(like)
        )

    skills = q.all()

    # Distance filter (post-query, needs coordinates)
    if maxDistance and maxDistance < 50:
        # Use a default center (Bangalore) if no user location
        center_lat, center_lng = 12.9716, 77.5946
        filtered = []
        for s in skills:
            if s.lat and s.lng:
                d = _haversine_km(center_lat, center_lng, s.lat, s.lng)
                if d <= maxDistance:
                    s.distance = f"{d:.1f} km"
                    filtered.append(s)
            else:
                filtered.append(s)
        skills = filtered

    return schemas.ok([schemas.SkillOut.from_orm_skill(s).model_dump() for s in skills])


# ─── GET /skills/recommended ─────────────────────────────────────────────────
@router.get("/recommended")
def get_recommended(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Cosine-similarity AI matching: match user's skills against all others."""
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity
        import numpy as np

        # User's own skill texts
        user_skills = db.query(models.Skill).filter(models.Skill.user_id == current_user.id).all()
        user_text = " ".join([f"{s.title} {s.description} {s.category}" for s in user_skills])

        # All other skills
        other_skills = (
            db.query(models.Skill)
            .filter(models.Skill.user_id != current_user.id, models.Skill.active == True)
            .all()
        )

        if not other_skills or not user_text.strip():
            # Fall back to top-rated
            top = (
                db.query(models.Skill)
                .filter(models.Skill.user_id != current_user.id)
                .order_by(models.Skill.rating.desc())
                .limit(6)
                .all()
            )
            return schemas.ok([schemas.SkillOut.from_orm_skill(s).model_dump() for s in top])

        corpus = [user_text] + [f"{s.title} {s.description} {s.category}" for s in other_skills]
        vectorizer = TfidfVectorizer(stop_words="english")
        tfidf = vectorizer.fit_transform(corpus)
        sims = cosine_similarity(tfidf[0:1], tfidf[1:]).flatten()

        top_indices = np.argsort(sims)[::-1][:6]
        recommended = [other_skills[i] for i in top_indices]

    except Exception:
        # Fallback: sort by rating
        recommended = (
            db.query(models.Skill)
            .filter(models.Skill.user_id != current_user.id)
            .order_by(models.Skill.rating.desc())
            .limit(6)
            .all()
        )

    return schemas.ok([schemas.SkillOut.from_orm_skill(s).model_dump() for s in recommended])


# ─── GET /skills/user/:userId ─────────────────────────────────────────────────
@router.get("/user/{user_id}")
def get_by_user(user_id: str, db: Session = Depends(get_db)):
    skills = db.query(models.Skill).filter(models.Skill.user_id == user_id).all()
    return schemas.ok([schemas.SkillOut.from_orm_skill(s).model_dump() for s in skills])


# ─── GET /skills/:id ─────────────────────────────────────────────────────────
@router.get("/{skill_id}")
def get_skill(skill_id: int, db: Session = Depends(get_db)):
    skill = db.query(models.Skill).filter(models.Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return schemas.ok(schemas.SkillOut.from_orm_skill(skill).model_dump())


# ─── POST /skills ─────────────────────────────────────────────────────────────
@router.post("")
def create_skill(
    body: schemas.CreateSkillRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    skill = models.Skill(
        title=body.title,
        description=body.description,
        category=body.category,
        location=body.location,
        lat=body.lat,
        lng=body.lng,
        tags=json.dumps(body.tags or []),
        availability=json.dumps(body.availability or []),
        color=CATEGORY_COLORS.get(body.category, "#10B981"),
        user_id=current_user.id,
    )
    db.add(skill)
    # increment user skill count
    current_user.skills_shared = (current_user.skills_shared or 0) + 1
    db.commit()
    db.refresh(skill)
    return schemas.ok(schemas.SkillOut.from_orm_skill(skill).model_dump(), "Skill created")


# ─── PUT /skills/:id ─────────────────────────────────────────────────────────
@router.put("/{skill_id}")
def update_skill(
    skill_id: int,
    body: schemas.UpdateSkillRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    skill = db.query(models.Skill).filter(models.Skill.id == skill_id, models.Skill.user_id == current_user.id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found or not yours")

    for field, value in body.model_dump(exclude_none=True).items():
        col = {"whatYouLearn": "what_you_learn"}.get(field, field)
        if col in ("tags", "what_you_learn", "requirements"):
            setattr(skill, col, json.dumps(value))
        elif col == "availability":
            setattr(skill, col, json.dumps(value) if not isinstance(value, str) else value)
        elif hasattr(skill, col):
            setattr(skill, col, value)

    db.commit()
    db.refresh(skill)
    return schemas.ok(schemas.SkillOut.from_orm_skill(skill).model_dump())


# ─── DELETE /skills/:id ──────────────────────────────────────────────────────
@router.delete("/{skill_id}")
def delete_skill(
    skill_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    skill = db.query(models.Skill).filter(models.Skill.id == skill_id, models.Skill.user_id == current_user.id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found or not yours")
    db.delete(skill)
    db.commit()
    return schemas.ok(None, "Skill deleted")


# ─── PATCH /skills/:id/toggle ────────────────────────────────────────────────
@router.patch("/{skill_id}/toggle")
def toggle_skill(
    skill_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    skill = db.query(models.Skill).filter(models.Skill.id == skill_id, models.Skill.user_id == current_user.id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    skill.active = not skill.active
    db.commit()
    db.refresh(skill)
    return schemas.ok(schemas.SkillOut.from_orm_skill(skill).model_dump())


# ─── GET /skills/:id/similar ─────────────────────────────────────────────────
@router.get("/{skill_id}/similar")
def get_similar(skill_id: int, db: Session = Depends(get_db)):
    skill = db.query(models.Skill).filter(models.Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    similar = (
        db.query(models.Skill)
        .filter(models.Skill.category == skill.category, models.Skill.id != skill_id)
        .order_by(models.Skill.rating.desc())
        .limit(4)
        .all()
    )
    return schemas.ok([schemas.SkillOut.from_orm_skill(s).model_dump() for s in similar])
