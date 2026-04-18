# backend/setup_mega_demo.py
import json
from datetime import datetime, timedelta
from database import SessionLocal, engine
from models import User, Skill, SkillRequest, Message, Review, Base
from auth import hash_password

def setup():
    db = SessionLocal()
    
    # Create the Mega Demo User
    demo_email = "demo@skillbridge.io"
    demo_password = "password123"
    
    # Check if exists
    existing = db.query(User).filter(User.email == demo_email).first()
    if existing:
        db.delete(existing)
        db.commit()

    mega_user = User(
        id="demo-user-123",
        name="Alex Riverstone",
        email=demo_email,
        password_hash=hash_password(demo_password),
        location="Indiranagar, Bangalore",
        city="Bangalore",
        bio="Full-stack developer by day, jazz guitarist by night. Passionate about community building and peer-to-peer learning. I can help with coding, music, and career mentorship.",
        impact_score=1250,
        level="Sapling",
        next_level="Oak",
        level_progress=75,
        sessions_count=24,
        hours_contributed=32.5,
        people_helped=18,
        skills_shared=6,
        joined=datetime.now().strftime("%B %Y")
    )
    db.add(mega_user)
    db.flush()

    # Add Many Skills for Mega User
    skills_to_add = [
        {
            "title": "Mastering React & Next.js",
            "category": "Tech",
            "description": "Deep dive into app router, server components, and advanced state management with Redux/Zustand.",
            "rating": 4.9,
            "sessions": 12,
            "tags": ["Frontend", "JavaScript", "Architecture"],
            "availability": [{"day": "Mon", "slots": ["6 PM"], "available": True}, {"day": "Wed", "slots": ["7 PM"], "available": True}]
        },
        {
            "title": "Jazz Guitar Improvisation",
            "category": "Music",
            "description": "Learn the scales, chord voicings, and rhythmic patterns of jazz. Suitable for intermediate players.",
            "rating": 5.0,
            "sessions": 8,
            "tags": ["Guitar", "Jazz", "Art"],
            "availability": [{"day": "Sat", "slots": ["10 AM", "2 PM"], "available": True}]
        },
        {
            "title": "Career Mentorship for Junior Devs",
            "category": "Career",
            "description": "Resume reviews, interview prep, and navigating your first 100 days in a high-growth tech company.",
            "rating": 4.8,
            "sessions": 15,
            "tags": ["Mentorship", "Jobs", "Success"],
            "availability": [{"day": "Fri", "slots": ["5 PM"], "available": True}]
        },
        {
            "title": "Intro to Mindful Meditation",
            "category": "Wellness",
            "description": "Learn basic breathing techniques and daily mindfulness habits to reduce stress.",
            "rating": 4.7,
            "sessions": 6,
            "tags": ["Health", "Mental Health", "Mindfulness"],
            "availability": [{"day": "Sun", "slots": ["8 AM"], "available": True}]
        }
    ]

    for s in skills_to_add:
        new_skill = Skill(
            user_id=mega_user.id,
            title=s["title"],
            category=s["category"],
            description=s["description"],
            rating=s["rating"],
            sessions=s["sessions"],
            tags=json.dumps(s["tags"]),
            availability=json.dumps(s["availability"]),
            active=True
        )
        db.add(new_skill)

    # Create other users to interact with Mega User
    other_users = [
        {"id": "user-2", "name": "Sarah Chen", "email": "sarah@ex.com", "city": "Bangalore"},
        {"id": "user-3", "name": "Marcus Vane", "email": "marcus@ex.com", "city": "Bangalore"},
        {"id": "user-4", "name": "Elena Rodriguez", "email": "elena@ex.com", "city": "Mumbai"},
        {"id": "user-5", "name": "Priya Sharma", "email": "priya@ex.com", "city": "Bangalore"},
    ]
    
    u_objs = []
    for u in other_users:
        user_obj = User(
            id=u["id"], name=u["name"], email=u["email"], city=u["city"],
            password_hash=hash_password("password123"), impact_score=500
        )
        db.add(user_obj)
        u_objs.append(user_obj)
    db.flush()

    # Create Messages
    messages = [
        {"sender": u_objs[0].id, "receiver": mega_user.id, "content": "Hey Alex! Loved your Next.js session last week. Can we schedule another one?"},
        {"sender": mega_user.id, "receiver": u_objs[0].id, "content": "Sure Sarah! I have a slot open this Friday at 6 PM. Does that work?"},
        {"sender": u_objs[1].id, "receiver": mega_user.id, "content": "Hi, I'm interested in the Jazz Guitar class. Do I need to know sheet music?"},
        {"sender": mega_user.id, "receiver": u_objs[1].id, "content": "Not at all, we focus mostly on ear training and patterns. See you Saturday!"},
        {"sender": u_objs[3].id, "receiver": mega_user.id, "content": "Alex, could you take a look at my portfolio before our session tomorrow?"},
    ]
    for m in messages:
        db.add(Message(sender_id=m["sender"], receiver_id=m["receiver"], content=m["content"]))

    # Create Skill Requests
    reqs = [
        {"skill_idx": 0, "requester": u_objs[0].id, "status": "accepted", "msg": "Looking to master server actions."},
        {"skill_idx": 1, "requester": u_objs[1].id, "status": "pending", "msg": "I am a blues guitarist switching to jazz."},
        {"skill_idx": 2, "requester": u_objs[3].id, "status": "completed", "msg": "First portfolio review session."},
        {"skill_idx": 0, "requester": u_objs[2].id, "status": "pending", "msg": "Help with my Next.js deployment error."},
    ]
    
    added_skills = db.query(Skill).filter(Skill.user_id == mega_user.id).all()
    added_reqs = []
    for r in reqs:
        new_req = SkillRequest(
            skill_id=added_skills[r["skill_idx"]].id,
            user_id=r["requester"],
            provider_id=mega_user.id,
            status=r["status"],
            message=r["msg"],
            scheduled_at=(datetime.now() + timedelta(days=2)).isoformat() if r["status"] == "accepted" else None
        )
        db.add(new_req)
        added_reqs.append(new_req)
    
    db.flush()

    # Create Reviews
    reviews_data = [
        {"skill_idx": 0, "user": u_objs[0], "rating": 5.0, "comment": "Alex is the best! The Next.js session was super clear, especially the RSC part."},
        {"skill_idx": 0, "user": u_objs[2], "rating": 4.5, "comment": "Great depth. Solved many of my architectural doubts in just one hour."},
        {"skill_idx": 1, "user": u_objs[1], "rating": 5.0, "comment": "Actually learned more in 60 mins than 10 YouTube videos. Highly recommended for guitarists!"},
        {"skill_idx": 2, "user": u_objs[3], "rating": 4.8, "comment": "The portfolio review was brutal but exactly what I needed to land my first interview. Thanks Alex!"},
    ]

    for rd in reviews_data:
        db.add(Review(
            skill_id=added_skills[rd["skill_idx"]].id,
            user_id=rd["user"].id,
            rating=rd["rating"],
            comment=rd["comment"],
            created_at=datetime.utcnow() - timedelta(days=2)
        ))

    db.commit()
    db.close()
    print(f"Mega Demo Account created: {demo_email} / {demo_password}")

if __name__ == "__main__":
    setup()
