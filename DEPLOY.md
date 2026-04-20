# 🚀 SkillBridge Deployment Guide (Render-Only)

This guide explains how to deploy the entire SkillBridge stack (Frontend + Backend + Database) to **Render**.

---

## 1. Database (The Foundation)
You should set this up first so you have the connection string for the backend.

1.  In the Render Dashboard, click **New** > **PostgreSQL**.
2.  Name: `skillbridge-db`
3.  Click **Create Database**.
4.  Once created, find the **Internal Database URL**. Copy this. You will need it for the Backend step.

---

## 2. Backend Deployment
1.  Click **New** > **Web Service**.
2.  Connect your GitHub repository.
3.  **Root Directory**: `backend`
4.  **Runtime**: `Docker` (Render will use `backend/Dockerfile`).
5.  **Environment Variables**:
    *   `DATABASE_URL`: Paste the **Internal Database URL** from Step 1.
    *   `ALLOWED_ORIGINS`: `https://your-frontend-name.onrender.com` (You can update this AFTER the frontend is up).
    *   `PORT`: `8080` (Render's default is usually fine).
6.  Click **Create Web Service**.

---

## 3. Frontend Deployment
1.  Click **New** > **Web Service**.
2.  Connect your GitHub repository.
3.  **Root Directory**: `.` (The root of the project).
4.  **Runtime**: `Docker` (Render will use the root `Dockerfile`).
5.  **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: `https://your-backend-name.onrender.com` (Get this from your Backend Web Service's dashboard).
6.  Click **Create Web Service**.

---

## 4. Final Connection
Once the frontend is live:
1.  Copy your Frontend URL (e.g., `https://skillbridge-frontend.onrender.com`).
2.  Go to your **Backend Service** > **Environment**.
3.  Update `ALLOWED_ORIGINS` with your Frontend URL.
4.  This ensures the backend accepts requests from your frontend.

---

## Summary of Environment Variables

| Variable | Location | Value |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Frontend | Your Backend's Render URL |
| `DATABASE_URL` | Backend | Your PostgreSQL Internal URL |
| `ALLOWED_ORIGINS` | Backend | Your Frontend's Render URL |

---

## Verification
1.  **Local Test**: Run `docker-compose up --build` on your own machine to ensure both images build perfectly before cloud deployment.
2.  **Health Check**: Visit `https://your-backend.onrender.com/health` to see if the API is alive.
