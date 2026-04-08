# backend/routers/users.py
# /users/:id  /users/search

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
import models, schemas
from auth import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/search")
def search_users(
    q: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
):
    like = f"%{q}%"
    users = (
        db.query(models.User)
        .filter(models.User.name.ilike(like) | models.User.city.ilike(like))
        .limit(20)
        .all()
    )
    total = db.query(models.User).count()
    return schemas.ok([schemas.UserOut.from_orm_user(u, total).model_dump() for u in users])


@router.get("/{user_id}")
def get_profile(user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    total = db.query(models.User).count()
    return schemas.ok(schemas.UserOut.from_orm_user(user, total).model_dump())
