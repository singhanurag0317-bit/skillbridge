# backend/seed.py
# Seeds realistic demo data: 3 users, 8 skills, requests, reviews, messages
# Run: python seed.py

import sys
import os
import json
import uuid
from datetime import datetime, timedelta

sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, engine, Base
import models
from auth import hash_password

Base.metadata.create_all(bind=engine)
db = SessionLocal()


def clear_tables():
    db.query(models.Message).delete()
    db.query(models.Review).delete()
    db.query(models.SkillRequest).delete()
    db.query(models.Skill).delete()
    db.query(models.User).delete()
    db.commit()


def seed():
    clear_tables()
    print("Seeding SkillBridge demo data...")

    # ─── Users ───────────────────────────────────────────────────────────────
    u1 = models.User(
        id=str(uuid.uuid4()),
        name="Aarav Mehta",
        email="aarav@demo.com",
        password_hash=hash_password("demo1234"),
        location="Koramangala, Bangalore",
        city="Bangalore",
        bio="Full-stack developer with 5 years of experience. Love teaching Python and web dev.",
        level="Sapling",
        next_level="Tree",
        level_progress=65,
        impact_score=320,
        verified=True,
        response_time="< 1 hour",
        availability=json.dumps(["Weekday evenings", "Weekend mornings"]),
        languages=json.dumps(["English", "Hindi", "Kannada"]),
        sessions_count=18,
        hours_contributed=22.5,
        people_helped=14,
        skills_shared=3,
        rank=1,
        joined="January 2024",
    )

    u2 = models.User(
        id=str(uuid.uuid4()),
        name="Priya Sharma",
        email="priya@demo.com",
        password_hash=hash_password("demo1234"),
        location="Indiranagar, Bangalore",
        city="Bangalore",
        bio="Music teacher and wellness coach. Passionate about helping people discover their creative side.",
        level="Tree",
        next_level="Forest",
        level_progress=40,
        impact_score=720,
        verified=True,
        response_time="< 30 min",
        availability=json.dumps(["Weekends", "Weekday afternoons"]),
        languages=json.dumps(["English", "Hindi", "Tamil"]),
        sessions_count=42,
        hours_contributed=55.0,
        people_helped=38,
        skills_shared=4,
        rank=2,
        joined="October 2023",
    )

    u3 = models.User(
        id=str(uuid.uuid4()),
        name="Rahul Krishnan",
        email="rahul@demo.com",
        password_hash=hash_password("demo1234"),
        location="HSR Layout, Bangalore",
        city="Bangalore",
        bio="Career coach and ex-startup founder. Helping others navigate their professional journeys.",
        level="Sprout",
        next_level="Sapling",
        level_progress=80,
        impact_score=180,
        verified=False,
        response_time="< 2 hours",
        availability=json.dumps(["Weekend mornings", "Weekday evenings"]),
        languages=json.dumps(["English", "Malayalam"]),
        sessions_count=9,
        hours_contributed=11.0,
        people_helped=9,
        skills_shared=1,
        rank=3,
        joined="March 2024",
    )

    db.add_all([u1, u2, u3])
    db.commit()
    db.refresh(u1)
    db.refresh(u2)
    db.refresh(u3)
    print(f"  Created users: {u1.name}, {u2.name}, {u3.name}")

    # ─── Skills ──────────────────────────────────────────────────────────────
    skills_data = [
        {
            "title": "Python for Beginners",
            "category": "Tech",
            "description": "Learn Python from scratch — variables, loops, functions, and your first mini-project. Perfect for absolute beginners. I'll walk you through real examples that actually make sense.",
            "rating": 4.9,
            "total_reviews": 24,
            "sessions": 18,
            "color": "#10B981",
            "tags": json.dumps(["Python", "Programming", "Beginner"]),
            "duration": "90 min",
            "format": "In-person / Online",
            "language": "English",
            "location": "Koramangala, Bangalore",
            "lat": 12.9352,
            "lng": 77.6245,
            "what_you_learn": json.dumps(["Python syntax and data types", "Control flow and loops", "Functions and modules", "Building a simple project"]),
            "requirements": json.dumps(["No prior coding experience needed", "Laptop with internet connection"]),
            "availability": json.dumps([
                {"day": "Mon", "slots": ["6:00 PM", "7:00 PM"], "available": True},
                {"day": "Wed", "slots": ["6:00 PM"], "available": True},
                {"day": "Sat", "slots": ["10:00 AM", "11:00 AM"], "available": True},
            ]),
            "user_id": u1.id,
        },
        {
            "title": "React & Next.js Crash Course",
            "category": "Tech",
            "description": "From zero to building full-stack apps with React and Next.js. Covers hooks, routing, API calls, and deploying your first app.",
            "rating": 4.7,
            "total_reviews": 11,
            "sessions": 8,
            "color": "#10B981",
            "tags": json.dumps(["React", "Next.js", "JavaScript", "Web Dev"]),
            "duration": "120 min",
            "format": "Online",
            "language": "English",
            "location": "Koramangala, Bangalore",
            "lat": 12.9352,
            "lng": 77.6245,
            "what_you_learn": json.dumps(["React components and hooks", "Next.js App Router", "Fetching data from APIs", "Deploying to Vercel"]),
            "requirements": json.dumps(["Basic HTML/CSS knowledge", "JavaScript fundamentals"]),
            "availability": json.dumps([
                {"day": "Tue", "slots": ["7:00 PM"], "available": True},
                {"day": "Thu", "slots": ["7:00 PM"], "available": True},
                {"day": "Sun", "slots": ["9:00 AM"], "available": True},
            ]),
            "user_id": u1.id,
        },
        {
            "title": "Guitar for Absolute Beginners",
            "category": "Music",
            "description": "Hold the guitar right, learn your first 5 chords, and play a real song in your first session. Acoustic or electric, I've taught 40+ students from scratch.",
            "rating": 5.0,
            "total_reviews": 31,
            "sessions": 42,
            "color": "#F4B83A",
            "tags": json.dumps(["Guitar", "Music", "Beginner", "Acoustic"]),
            "duration": "60 min",
            "format": "In-person",
            "language": "English, Hindi",
            "location": "Indiranagar, Bangalore",
            "lat": 12.9784,
            "lng": 77.6408,
            "what_you_learn": json.dumps(["Proper posture and technique", "5 essential chords", "Reading chord charts", "Playing your first song"]),
            "requirements": json.dumps(["A guitar (acoustic preferred)", "Willingness to practice!"]),
            "availability": json.dumps([
                {"day": "Sat", "slots": ["11:00 AM", "3:00 PM", "5:00 PM"], "available": True},
                {"day": "Sun", "slots": ["10:00 AM", "4:00 PM"], "available": True},
            ]),
            "user_id": u2.id,
        },
        {
            "title": "Yoga & Mindfulness Basics",
            "category": "Wellness",
            "description": "Morning yoga flow + basic breathing and meditation techniques. Suitable for all fitness levels. I'll customise each session based on your needs.",
            "rating": 4.8,
            "total_reviews": 19,
            "sessions": 28,
            "color": "#F4623A",
            "tags": json.dumps(["Yoga", "Meditation", "Wellness", "Mindfulness"]),
            "duration": "45 min",
            "format": "In-person",
            "language": "English, Tamil",
            "location": "Indiranagar, Bangalore",
            "lat": 12.9784,
            "lng": 77.6408,
            "what_you_learn": json.dumps(["Sun salutation sequence", "Breathing techniques (pranayama)", "10-minute guided meditation", "Building a daily practice"]),
            "requirements": json.dumps(["Comfortable clothes", "Yoga mat (I have extras)"]),
            "availability": json.dumps([
                {"day": "Mon", "slots": ["6:30 AM", "7:00 AM"], "available": True},
                {"day": "Wed", "slots": ["6:30 AM"], "available": True},
                {"day": "Fri", "slots": ["6:30 AM"], "available": True},
            ]),
            "user_id": u2.id,
        },
        {
            "title": "Resume & LinkedIn Makeover",
            "category": "Career",
            "description": "I'll tear down your resume and rebuild it from scratch. Fix your LinkedIn profile, craft your story, and help you sound like the candidate companies actually want to hire.",
            "rating": 4.9,
            "total_reviews": 8,
            "sessions": 9,
            "color": "#6366F1",
            "tags": json.dumps(["Resume", "LinkedIn", "Job Search", "Career"]),
            "duration": "60 min",
            "format": "Online",
            "language": "English",
            "location": "HSR Layout, Bangalore",
            "lat": 12.9116,
            "lng": 77.6389,
            "what_you_learn": json.dumps(["ATS-optimised resume structure", "Writing compelling bullet points", "LinkedIn profile optimisation", "Crafting your personal brand"]),
            "requirements": json.dumps(["Current resume (any format)", "Your LinkedIn profile URL"]),
            "availability": json.dumps([
                {"day": "Sat", "slots": ["9:00 AM", "10:00 AM", "11:00 AM"], "available": True},
                {"day": "Sun", "slots": ["9:00 AM", "10:00 AM"], "available": True},
            ]),
            "user_id": u3.id,
        },
        {
            "title": "Spoken English Fluency",
            "category": "Language",
            "description": "Eliminate hesitation, expand vocabulary, and speak English confidently in professional and social settings. Conversation-focused, no boring grammar drills.",
            "rating": 4.6,
            "total_reviews": 14,
            "sessions": 22,
            "color": "#14B8A6",
            "tags": json.dumps(["English", "Speaking", "Fluency", "Communication"]),
            "duration": "45 min",
            "format": "Online",
            "language": "English",
            "location": "Indiranagar, Bangalore",
            "lat": 12.9784,
            "lng": 77.6408,
            "what_you_learn": json.dumps(["Natural conversation flow", "Pronunciation tips", "Professional vocabulary", "Confidence-building techniques"]),
            "requirements": json.dumps(["Basic English understanding", "Microphone and camera"]),
            "availability": json.dumps([
                {"day": "Tue", "slots": ["6:00 PM", "7:00 PM"], "available": True},
                {"day": "Thu", "slots": ["6:00 PM", "7:00 PM"], "available": True},
                {"day": "Sat", "slots": ["10:00 AM"], "available": True},
            ]),
            "user_id": u2.id,
        },
        {
            "title": "Watercolour Painting 101",
            "category": "Creative",
            "description": "Discover the meditative joy of watercolour. Learn colour mixing, wet-on-wet and wet-on-dry techniques, and create a landscape painting in our first session.",
            "rating": 4.8,
            "total_reviews": 7,
            "sessions": 12,
            "color": "#EC4899",
            "tags": json.dumps(["Painting", "Watercolour", "Art", "Creative"]),
            "duration": "90 min",
            "format": "In-person",
            "language": "English, Hindi",
            "location": "Koramangala, Bangalore",
            "lat": 12.9352,
            "lng": 77.6245,
            "what_you_learn": json.dumps(["Watercolour materials and setup", "Colour mixing theory", "Wet-on-wet technique", "Completing a landscape painting"]),
            "requirements": json.dumps(["Basic watercolour set (₹200+)", "Watercolour paper (I'll guide you)"]),
            "availability": json.dumps([
                {"day": "Sun", "slots": ["11:00 AM", "3:00 PM"], "available": True},
            ]),
            "user_id": u1.id,
        },
        {
            "title": "Mock Tech Interviews",
            "category": "Career",
            "description": "Simulate real FAANG-style coding interviews. DSA problems, system design discussions, and HR rounds. Detailed feedback after each session.",
            "rating": 4.7,
            "total_reviews": 6,
            "sessions": 5,
            "color": "#6366F1",
            "tags": json.dumps(["Interview", "DSA", "System Design", "Coding"]),
            "duration": "60 min",
            "format": "Online",
            "language": "English",
            "location": "Koramangala, Bangalore",
            "lat": 12.9352,
            "lng": 77.6245,
            "what_you_learn": json.dumps(["Approaching coding problems", "Thinking out loud technique", "System design basics", "Handling HR questions"]),
            "requirements": json.dumps(["Comfortable with at least one programming language", "LeetCode account"]),
            "availability": json.dumps([
                {"day": "Mon", "slots": ["8:00 PM"], "available": True},
                {"day": "Wed", "slots": ["8:00 PM"], "available": True},
                {"day": "Fri", "slots": ["8:00 PM"], "available": True},
            ]),
            "user_id": u1.id,
        },
    ]

    skill_objs = []
    for sd in skills_data:
        s = models.Skill(**sd)
        db.add(s)
        skill_objs.append(s)

    db.commit()
    for s in skill_objs:
        db.refresh(s)
    print(f"  Created {len(skill_objs)} skills")

    # ─── Requests ────────────────────────────────────────────────────────────
    r1 = models.SkillRequest(
        skill_id=skill_objs[0].id,   # Python (u1)
        user_id=u2.id,               # Priya requests
        provider_id=u1.id,
        status="completed",
        message="I've always wanted to learn Python for data analysis!",
        scheduled_at="Mon 6:00 PM",
        created_at=datetime.utcnow() - timedelta(days=14),
    )
    r2 = models.SkillRequest(
        skill_id=skill_objs[2].id,   # Guitar (u2)
        user_id=u3.id,               # Rahul requests
        provider_id=u2.id,
        status="accepted",
        message="Would love to learn guitar, been wanting to for years.",
        scheduled_at="Sat 11:00 AM",
        created_at=datetime.utcnow() - timedelta(days=3),
    )
    r3 = models.SkillRequest(
        skill_id=skill_objs[4].id,   # Resume (u3)
        user_id=u1.id,               # Aarav requests
        provider_id=u3.id,
        status="pending",
        message="Need help polishing my resume before applying to new companies.",
        created_at=datetime.utcnow() - timedelta(hours=5),
    )
    r4 = models.SkillRequest(
        skill_id=skill_objs[1].id,   # React (u1)
        user_id=u2.id,               # Priya requests
        provider_id=u1.id,
        status="pending",
        message="Want to learn React for building a portfolio site!",
        created_at=datetime.utcnow() - timedelta(hours=2),
    )

    db.add_all([r1, r2, r3, r4])
    db.commit()
    db.refresh(r1)
    print("  Created 4 skill requests")

    # ─── Reviews ─────────────────────────────────────────────────────────────
    reviews = [
        models.Review(
            skill_id=skill_objs[0].id,
            request_id=r1.id,
            user_id=u2.id,
            rating=5.0,
            comment="Aarav is an incredible teacher! Explained everything so clearly. I wrote my first Python script in just one session.",
            created_at=datetime.utcnow() - timedelta(days=13),
        ),
        models.Review(
            skill_id=skill_objs[2].id,
            request_id=None,
            user_id=u1.id,
            rating=5.0,
            comment="Priya is amazing! I was tone-deaf my whole life and now I can play Wonderwall. Highly recommend!",
            created_at=datetime.utcnow() - timedelta(days=20),
        ),
        models.Review(
            skill_id=skill_objs[3].id,
            request_id=None,
            user_id=u3.id,
            rating=4.8,
            comment="The morning yoga sessions with Priya have transformed my mornings. So calm and patient.",
            created_at=datetime.utcnow() - timedelta(days=7),
        ),
    ]
    db.add_all(reviews)
    db.commit()
    print("  Created 3 reviews")

    # ─── Messages ─────────────────────────────────────────────────────────────
    msgs = [
        models.Message(
            sender_id=u2.id, receiver_id=u1.id,
            content="Hey Aarav! Looking forward to our Python session tomorrow 🐍",
            created_at=datetime.utcnow() - timedelta(hours=20),
        ),
        models.Message(
            sender_id=u1.id, receiver_id=u2.id,
            content="Hey Priya! Me too! I'll send you the setup guide. Please install Python 3.11 beforehand.",
            created_at=datetime.utcnow() - timedelta(hours=19),
        ),
        models.Message(
            sender_id=u2.id, receiver_id=u1.id,
            content="Done! Also — can we go a little longer if needed? I have lots of questions 😊",
            created_at=datetime.utcnow() - timedelta(hours=18),
        ),
        models.Message(
            sender_id=u1.id, receiver_id=u2.id,
            content="Absolutely, no worries. See you at 6 PM!",
            created_at=datetime.utcnow() - timedelta(hours=17),
        ),
        models.Message(
            sender_id=u3.id, receiver_id=u2.id,
            content="Hi Priya, I'm all set for the guitar lesson Saturday. Should I bring picks?",
            created_at=datetime.utcnow() - timedelta(hours=5),
        ),
        models.Message(
            sender_id=u2.id, receiver_id=u3.id,
            content="Yes please! Bring a few — medium gauge is best for beginners. See you at 11!",
            created_at=datetime.utcnow() - timedelta(hours=4),
        ),
    ]
    db.add_all(msgs)
    db.commit()

    # Update user stats based on seeded data
    u1.sessions_count = 18
    u1.people_helped = 14
    u1.hours_contributed = 22.5
    u1.skills_shared = 4
    u2.sessions_count = 42
    u2.people_helped = 38
    u2.hours_contributed = 55.0
    u2.skills_shared = 4
    u3.sessions_count = 9
    u3.people_helped = 9
    u3.hours_contributed = 11.0
    u3.skills_shared = 1
    db.commit()

    print("  Created messages and updated stats")
    print()
    print("-" * 50)
    print("Demo data seeded successfully!")
    print()
    print("Demo login credentials:")
    print(f"  - {u1.name:<20} {u1.email} / demo1234")
    print(f"  - {u2.name:<20} {u2.email} / demo1234")
    print(f"  - {u3.name:<20} {u3.email} / demo1234")
    print("-" * 50)

    db.close()


if __name__ == "__main__":
    seed()
