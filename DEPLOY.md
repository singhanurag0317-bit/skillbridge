# 🚀 SkillBridge Deployment Guide (Supabase + Render)

This guide explains how to deploy the SkillBridge full-stack application using **Supabase** for Auth/Database and **Render** for Hosting.

---

## 1. Supabase Setup (Database & Auth)
1.  Go to [Supabase](https://supabase.com/) and create a new project.
2.  **Database**:
    *   Go to **Project Settings** > **Database**.
    *   Copy the **Direct connection string** (e.g., `postgresql://postgres:[YOUR-PASSWORD]@db.xxxx.supabase.co:5432/postgres`).
3.  **Authentication**:
    *   Go to **Project Settings** > **API**.
    *   Find your **Project URL** and **Anon Key**.
    *   Find your **JWT Secret** (You'll need this for the backend).

---

## 2. Backend Deployment (Render)
1.  **New** > **Web Service** on Render.
2.  **Runtime**: `Docker` | **Root Directory**: `backend`.
3.  **Environment Variables**:
    *   `DATABASE_URL`: Your Supabase Direct Connection string.
    *   `SUPABASE_JWT_SECRET`: Your Supabase **JWT Secret**.
    *   `ALLOWED_ORIGINS`: Your frontend URL (e.g., `https://skillbridge.onrender.com`).

---

## 3. Frontend Deployment (Render/Vercel)
1.  **New** > **Web Service** on Render (or Vercel).
2.  **Runtime**: `Docker` | **Root Directory**: `./`.
3.  **Environment Variables**:
    *   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase **Project URL**.
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase **Anon Key**.
    *   `NEXT_PUBLIC_API_URL`: Your Backend's Render URL.

---

## 4. Local Development
To run locally with Supabase, create a `.env.local` in the root:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```
And a `.env` in the `backend` folder:
```bash
DATABASE_URL=your_supabase_db_url
SUPABASE_JWT_SECRET=your_jwt_secret
```

---

## 🛡️ Security Note
Ensure your `DATABASE_URL` uses the **Direct Connection** (port 5432) for better compatibility with SQLAlchemy, or use the connection pooler (port 6543) if you have high traffic.
