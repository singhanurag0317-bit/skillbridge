# 🚀 SkillBridge Deployment Guide (Unified Vercel + Supabase)

This guide explains how to deploy the entire SkillBridge stack (Frontend + Backend) to **Vercel** and connect it to **Supabase**.

## 1. Supabase Setup (Database & Auth)
1.  **Project**: Create a project at [supabase.com](https://supabase.com/).
2.  **API Keys**: Go to **Project Settings > API**.
    *   `Project URL`: e.g., `https://xxxx.supabase.co`
    *   `Anon Key`: Your public anon key.
    *   `JWT Secret`: Your backend requires this to verify tokens.
3.  **Database**: Go to **Project Settings > Database**.
    *   **Direct connection**: Copy the PostgreSQL URI (e.g., `postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres`).

---

## 2. Vercel Deployment (Unified)
Vercel will host both your Next.js frontend and your FastAPI backend.

1.  Push your code to GitHub.
2.  Go to [Vercel Dashboard](https://vercel.com/new).
3.  Import your GitHub repository.
4.  **Configuration**: Vercel will auto-detect Next.js.
5.  **Environment Variables**: Add the following:
    *   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL.
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon key.
    *   `NEXT_PUBLIC_API_URL`: (Optional) Leave blank for production, or set to your Vercel URL.
    *   `SUPABASE_JWT_SECRET`: Your Supabase JWT Secret.
    *   `DATABASE_URL`: Your Supabase Direct Connection string.
    *   `SECRET_KEY`: A secure random string for backend internal use.
    *   `ALLOWED_ORIGINS`: Your Vercel URL.
6.  **Deploy**: Click Deploy. Vercel will build the frontend and set up the `api/` functions.

---

## 3. Local Development
To run the full stack locally:

1.  **Frontend**: Run `npm run dev` in the root.
2.  **Backend**: Run `uvicorn backend.main:app --reload` (or use the provided `run.py` if available).
3.  **Env**: Ensure `.env.local` contains your Supabase credentials.

---

## 🛡️ Important Notes
*   **Cold Starts**: The backend runs as Serverless Functions. The first request after a few minutes of inactivity might be slower.
*   **Standalone Output**: The frontend is configured for `output: "standalone"` in `next.config.ts`, which Vercel handles automatically.
*   **Table Creation**: The backend automatically creates tables in Supabase on its first successful run using SQLAlchemy.
