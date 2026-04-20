# backend/auth.py
# JWT creation + verification + password hashing

import os
import uuid
from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
import bcrypt
from sqlalchemy.orm import Session

from database import get_db
import models

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "skillbridge-super-secret-key-change-in-prod")
ALGORITHM = "HS256"

bearer_scheme = HTTPBearer(auto_error=False)


def decode_token(token: str) -> Optional[dict]:
    """Decodes a Supabase JWT and returns the payload (including 'sub' and 'email')."""
    try:
        # Supabase uses HS256 with the JWT Secret for the API
        payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=[ALGORITHM], options={"verify_aud": False})
        return payload
    except JWTError as e:
        print(f"JWT Decode Error: {e}")
        return None


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> models.User:
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    payload = decode_token(credentials.credentials)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    user_id = payload["sub"]
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    # ─── Lazy synchronization: Create user if they don't exist in our DB ──────
    if not user:
        # Extract metadata from Supabase token
        email = payload.get("email")
        # Supabase stores extra data in user_metadata
        metadata = payload.get("user_metadata", {})
        name = metadata.get("full_name") or metadata.get("name") or email.split("@")[0]
        location = metadata.get("location") or ""
        
        user = models.User(
            id=user_id,
            email=email,
            name=name,
            location=location,
            password_hash="supabase_managed", # password is managed by Supabase
        )
        db.add(user)
        try:
            db.commit()
            db.refresh(user)
        except Exception as e:
            db.rollback()
            print(f"Failed to sync user: {e}")
            # Try finding again in case of race condition
            user = db.query(models.User).filter(models.User.id == user_id).first()
            if not user:
                raise HTTPException(status_code=500, detail="User sync failed")

    return user


def generate_id() -> str:
    return str(uuid.uuid4())
