# backend/routers/messages.py
# /messages/conversations  /messages/:userId  POST /messages  PATCH /:userId/read

from fastapi import APIRouter, Depends
from sqlalchemy import or_, and_, func
from sqlalchemy.orm import Session

from database import get_db
import models, schemas
from auth import get_current_user

router = APIRouter(prefix="/messages", tags=["messages"])

COLORS = ["#10B981", "#F4623A", "#F4B83A", "#6366F1", "#EC4899", "#14B8A6"]


@router.get("/conversations")
def get_conversations(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    uid = current_user.id

    # Get all unique conversation partners
    sent = db.query(models.Message.receiver_id).filter(models.Message.sender_id == uid).distinct()
    received = db.query(models.Message.sender_id).filter(models.Message.receiver_id == uid).distinct()

    partner_ids = set()
    for (pid,) in sent:
        partner_ids.add(pid)
    for (pid,) in received:
        partner_ids.add(pid)

    conversations = []
    for idx, partner_id in enumerate(partner_ids):
        partner = db.query(models.User).filter(models.User.id == partner_id).first()
        if not partner:
            continue

        # Last message between the two
        last_msg = (
            db.query(models.Message)
            .filter(
                or_(
                    and_(models.Message.sender_id == uid, models.Message.receiver_id == partner_id),
                    and_(models.Message.sender_id == partner_id, models.Message.receiver_id == uid),
                )
            )
            .order_by(models.Message.created_at.desc())
            .first()
        )

        unread = (
            db.query(func.count(models.Message.id))
            .filter(
                models.Message.sender_id == partner_id,
                models.Message.receiver_id == uid,
                models.Message.read == False,
            )
            .scalar()
        ) or 0

        # Find a shared skill context
        shared_request = (
            db.query(models.SkillRequest)
            .filter(
                or_(
                    and_(models.SkillRequest.user_id == uid, models.SkillRequest.provider_id == partner_id),
                    and_(models.SkillRequest.user_id == partner_id, models.SkillRequest.provider_id == uid),
                )
            )
            .first()
        )
        skill_name = shared_request.skill.title if shared_request and shared_request.skill else "General"

        initials = "".join(p[0].upper() for p in partner.name.split()[:2])
        conversations.append({
            "userId": partner.id,
            "name": partner.name,
            "initials": initials,
            "color": COLORS[idx % len(COLORS)],
            "skill": skill_name,
            "lastMessage": last_msg.content[:60] if last_msg else "",
            "unread": unread,
            "online": False,
            "time": last_msg.created_at.strftime("%I:%M %p").lstrip("0") if last_msg and last_msg.created_at else "",
        })

    # Sort by most recent message
    conversations.sort(key=lambda c: c.get("time", ""), reverse=True)
    return schemas.ok(conversations)


@router.get("/{partner_id}")
def get_messages(
    partner_id: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    uid = current_user.id
    msgs = (
        db.query(models.Message)
        .filter(
            or_(
                and_(models.Message.sender_id == uid, models.Message.receiver_id == partner_id),
                and_(models.Message.sender_id == partner_id, models.Message.receiver_id == uid),
            )
        )
        .order_by(models.Message.created_at.asc())
        .all()
    )
    return schemas.ok([schemas.MessageOut.from_orm(m).model_dump() for m in msgs])


@router.post("")
def send_message(
    body: schemas.SendMessageBody,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    msg = models.Message(
        sender_id=current_user.id,
        receiver_id=body.receiverId,
        content=body.content,
        read=False,
        type="text",
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return schemas.ok(schemas.MessageOut.from_orm(msg).model_dump(), "Message sent")


@router.patch("/{partner_id}/read")
def mark_read(
    partner_id: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db.query(models.Message).filter(
        models.Message.sender_id == partner_id,
        models.Message.receiver_id == current_user.id,
        models.Message.read == False,
    ).update({"read": True})
    db.commit()
    return schemas.ok(None, "Marked read")
