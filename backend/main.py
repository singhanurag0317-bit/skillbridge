# backend/main.py
# FastAPI entry point for SkillBridge backend

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
import models  # noqa — ensures models are registered before create_all

from routers import auth, skills, requests, reviews, messages, users, impact, dashboard

# ─── Create tables ────────────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ─── App ─────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="SkillBridge API",
    description="Backend for the SkillBridge hyperlocal skill-sharing platform",
    version="1.0.0",
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ─────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(skills.router)
app.include_router(requests.router)
app.include_router(reviews.router)
app.include_router(messages.router)
app.include_router(users.router)
app.include_router(impact.router)
app.include_router(dashboard.router)


# ─── Health check ─────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "service": "skillbridge-api"}


@app.get("/")
def root():
    return {
        "message": "SkillBridge API is running 🚀",
        "docs": "/docs",
        "health": "/health",
    }
