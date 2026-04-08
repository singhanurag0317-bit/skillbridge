# backend/routers/reviews.py
# /reviews/skill/:id  /reviews/user/:id  POST /reviews

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
import models, schemas
from auth import get_current_user

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.get("/skill/{skill_id}")
def get_by_skill(skill_id: int, db: Session = Depends(get_db)):
    reviews = (
        db.query(models.Review)
        .filter(models.Review.skill_id == skill_id)
        .order_by(models.Review.created_at.desc())
        .all()
    )
    return schemas.ok([schemas.ReviewOut.from_orm(r).model_dump() for r in reviews])


@router.get("/user/{user_id}")
def get_by_user(user_id: str, db: Session = Depends(get_db)):
    # Reviews left for skills owned by user_id
    reviews = (
        db.query(models.Review)
        .join(models.Skill, models.Review.skill_id == models.Skill.id)
        .filter(models.Skill.user_id == user_id)
        .order_by(models.Review.created_at.desc())
        .all()
    )
    return schemas.ok([schemas.ReviewOut.from_orm(r).model_dump() for r in reviews])


@router.post("")
def create_review(
    body: schemas.CreateReviewBody,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not 1 <= body.rating <= 5:
        raise HTTPException(status_code=400, detail="Rating must be 1–5")

    review = models.Review(
        skill_id=int(body.skillId),
        request_id=int(body.requestId) if body.requestId else None,
        user_id=current_user.id,
        rating=body.rating,
        comment=body.comment,
    )
    db.add(review)
    db.commit()

    # Recalculate skill average rating
    skill = db.query(models.Skill).filter(models.Skill.id == int(body.skillId)).first()
    if skill:
        avg = db.query(func.avg(models.Review.rating)).filter(
            models.Review.skill_id == skill.id
        ).scalar()
        count = db.query(func.count(models.Review.id)).filter(
            models.Review.skill_id == skill.id
        ).scalar()
        skill.rating = round(float(avg or 0), 1)
        skill.total_reviews = count or 0
        db.commit()

    db.refresh(review)
    return schemas.ok(schemas.ReviewOut.from_orm(review).model_dump(), "Review submitted")
