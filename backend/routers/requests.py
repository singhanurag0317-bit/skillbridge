# backend/routers/requests.py
# /requests  CRUD + accept/decline/complete

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
import models, schemas
from auth import get_current_user

router = APIRouter(prefix="/requests", tags=["requests"])


@router.get("")
def get_all_requests(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Returns requests where user is either requester or provider."""
    reqs = (
        db.query(models.SkillRequest)
        .filter(
            (models.SkillRequest.user_id == current_user.id) |
            (models.SkillRequest.provider_id == current_user.id)
        )
        .order_by(models.SkillRequest.created_at.desc())
        .all()
    )
    return schemas.ok([schemas.SkillRequestOut.from_orm(r).model_dump() for r in reqs])


@router.post("")
def create_request(
    body: schemas.CreateRequestBody,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    skill = db.query(models.Skill).filter(models.Skill.id == int(body.skillId)).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    if skill.user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot request your own skill")

    req = models.SkillRequest(
        skill_id=skill.id,
        user_id=current_user.id,
        provider_id=skill.user_id,
        message=body.message or "",
        scheduled_at=body.scheduledAt,
        status="pending",
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    return schemas.ok(schemas.SkillRequestOut.from_orm(req).model_dump(), "Request sent")


def _change_status(request_id: int, new_status: str, current_user: models.User, db: Session):
    req = db.query(models.SkillRequest).filter(models.SkillRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    # Accept/decline: provider only. Complete: either party.
    if new_status in ("accepted", "cancelled"):
        if req.provider_id != current_user.id and req.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not your request")
    req.status = new_status

    if new_status == "completed":
        # Update stats
        provider = db.query(models.User).filter(models.User.id == req.provider_id).first()
        if provider:
            provider.sessions_count = (provider.sessions_count or 0) + 1
            provider.people_helped = (provider.people_helped or 0) + 1
            provider.impact_score = (provider.impact_score or 0) + 20
            _recalculate_level(provider)
        req.skill.sessions = (req.skill.sessions or 0) + 1

    db.commit()
    db.refresh(req)
    return schemas.ok(schemas.SkillRequestOut.from_orm(req).model_dump())


def _recalculate_level(user: models.User):
    score = user.impact_score or 0
    if score < 100:
        user.level, user.next_level = "Seed", "Sprout"
        user.level_progress = score
    elif score < 300:
        user.level, user.next_level = "Sprout", "Sapling"
        user.level_progress = int((score - 100) / 2)
    elif score < 600:
        user.level, user.next_level = "Sapling", "Tree"
        user.level_progress = int((score - 300) / 3)
    elif score < 1000:
        user.level, user.next_level = "Tree", "Forest"
        user.level_progress = int((score - 600) / 4)
    else:
        user.level, user.next_level = "Forest", "Legend"
        user.level_progress = min(100, int((score - 1000) / 10))


@router.patch("/{request_id}/accept")
def accept_request(
    request_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return _change_status(request_id, "accepted", current_user, db)


@router.patch("/{request_id}/decline")
def decline_request(
    request_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return _change_status(request_id, "cancelled", current_user, db)


@router.patch("/{request_id}/complete")
def complete_request(
    request_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return _change_status(request_id, "completed", current_user, db)
