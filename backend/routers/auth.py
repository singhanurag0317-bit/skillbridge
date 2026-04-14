# backend/routers/auth.py
# /auth/register  /auth/login  /auth/me  /auth/profile

import os
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
import auth as auth_utils

# ─── Schemas (Internal) ───────────────────────────────────────────────────────
import pydantic

class GoogleLoginRequest(pydantic.BaseModel):
    email: str
    name: str
    image: str = ""


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
def register(body: schemas.RegisterRequest, db: Session = Depends(get_db)):
    # Check duplicate email
    existing = db.query(models.User).filter(models.User.email == body.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = models.User(
        id=auth_utils.generate_id(),
        name=body.name,
        email=body.email,
        password_hash=auth_utils.hash_password(body.password),
        location=body.location,
        city=body.location.split(",")[-1].strip() if "," in body.location else body.location,
        level="Seed",
        next_level="Sprout",
        level_progress=0,
        impact_score=0,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    total = db.query(models.User).count()
    user_out = schemas.UserOut.from_orm_user(user, total)
    token = auth_utils.create_access_token(user.id)

    return schemas.ok({"user": user_out.model_dump(), "token": token}, "Registered successfully")


@router.post("/login")
def login(body: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == body.email).first()
    if not user or not auth_utils.verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    total = db.query(models.User).count()
    user_out = schemas.UserOut.from_orm_user(user, total)
    token = auth_utils.create_access_token(user.id)

    return schemas.ok({"user": user_out.model_dump(), "token": token}, "Login successful")


@router.post("/google")
def google_login(body: GoogleLoginRequest, db: Session = Depends(get_db)):
    """
    Accept Google-authenticated user profile from the frontend.
    Upsert the user: create if first login, update avatar if changed.
    """
    if not body.email:
        raise HTTPException(status_code=400, detail="Email is required for Google login")

    user = db.query(models.User).filter(models.User.email == body.email).first()

    if not user:
        # ── Auto-create Google user ───────────────────────────────────────────
        user = models.User(
            id=auth_utils.generate_id(),
            name=body.name or body.email.split("@")[0],
            email=body.email,
            password_hash=auth_utils.hash_password(auth_utils.generate_id()),  # Random unguessable pwd
            avatar=body.image or None,
            level="Seed",
            next_level="Sprout",
            level_progress=0,
            impact_score=0,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # ── Update avatar if provided and not already set ─────────────────────
        if body.image and not user.avatar:
            user.avatar = body.image
            db.commit()
            db.refresh(user)

    total = db.query(models.User).count()
    user_out = schemas.UserOut.from_orm_user(user, total)
    token = auth_utils.create_access_token(user.id)

    return schemas.ok({"user": user_out.model_dump(), "token": token}, "Logged in with Google")



@router.get("/me")
def get_me(
    current_user: models.User = Depends(auth_utils.get_current_user),
    db: Session = Depends(get_db),
):
    total = db.query(models.User).count()
    return schemas.ok(schemas.UserOut.from_orm_user(current_user, total).model_dump())


@router.put("/profile")
def update_profile(
    body: schemas.UpdateProfileRequest,
    current_user: models.User = Depends(auth_utils.get_current_user),
    db: Session = Depends(get_db),
):
    import json
    if body.name is not None:
        current_user.name = body.name
    if body.location is not None:
        current_user.location = body.location
        current_user.city = body.location.split(",")[-1].strip() if "," in body.location else body.location
    if body.city is not None:
        current_user.city = body.city
    if body.bio is not None:
        current_user.bio = body.bio
    if body.avatar is not None:
        current_user.avatar = body.avatar
    if body.availability is not None:
        current_user.availability = json.dumps(body.availability)
    if body.languages is not None:
        current_user.languages = json.dumps(body.languages)

    db.commit()
    db.refresh(current_user)
    total = db.query(models.User).count()
    return schemas.ok(schemas.UserOut.from_orm_user(current_user, total).model_dump())
