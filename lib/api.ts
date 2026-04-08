// lib/api.ts
// ─────────────────────────────────────────────────────────────────────────────
// SkillBridge — Central API layer
// All backend calls go through here. When backend is ready:
//   1. Set NEXT_PUBLIC_API_URL in .env.local
//   2. Replace mock returns with real axios calls (marked with TODO)
// ─────────────────────────────────────────────────────────────────────────────

import axios from "axios";
import type {
    User, Skill, SkillRequest, Review,
    Message, ImpactStats, ApiResponse, SkillCategory,
} from "@/types";

// ─── Axios instance ───────────────────────────────────────────────────────────
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
});

// ─── Auth token injection ─────────────────────────────────────────────────────
// Reads the JWT stored by AuthContext (sb_token) and attaches it to every request.
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("sb_token");
        if (token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// ─── Response error handler ───────────────────────────────────────────────────
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const msg = err.response?.data?.message || err.message || "Something went wrong";
        console.error("API Error:", msg);
        return Promise.reject(new Error(msg));
    }
);

// =============================================================================
// AUTH
// =============================================================================
export const authApi = {
    register: async (data: { name: string; email: string; password: string; location: string }) => {
        const res = await api.post<ApiResponse<User>>("/auth/register", data);
        return res.data;
    },
    login: async (data: { email: string; password: string }) => {
        const res = await api.post<ApiResponse<{ user: User; token: string }>>("/auth/login", data);
        return res.data;
    },
    getMe: async () => {
        const res = await api.get<ApiResponse<User>>("/auth/me");
        return res.data;
    },
    updateProfile: async (data: Partial<User>) => {
        const res = await api.put<ApiResponse<User>>("/auth/profile", data);
        return res.data;
    },
};

// =============================================================================
// SKILLS
// =============================================================================
export const skillsApi = {
    getAll: async (filters?: {
        category?: SkillCategory | "All";
        maxDistance?: number;
        minRating?: number;
        available?: boolean;
        query?: string;
    }) => {
        const res = await api.get<ApiResponse<Skill[]>>("/skills", { params: filters });
        return res.data;
    },
    getById: async (id: string | number) => {
        const res = await api.get<ApiResponse<Skill>>(`/skills/${id}`);
        return res.data;
    },
    getByUser: async (userId: string) => {
        const res = await api.get<ApiResponse<Skill[]>>(`/skills/user/${userId}`);
        return res.data;
    },
    create: async (data: {
        title: string; description: string; category: SkillCategory;
        location: string; lat: number; lng: number;
        availability: string[]; tags: string[];
    }) => {
        const res = await api.post<ApiResponse<Skill>>("/skills", data);
        return res.data;
    },
    update: async (id: string | number, data: Partial<Skill>) => {
        const res = await api.put<ApiResponse<Skill>>(`/skills/${id}`, data);
        return res.data;
    },
    delete: async (id: string | number) => {
        const res = await api.delete<ApiResponse<null>>(`/skills/${id}`);
        return res.data;
    },
    toggle: async (id: string | number) => {
        const res = await api.patch<ApiResponse<Skill>>(`/skills/${id}/toggle`);
        return res.data;
    },
    getRecommended: async () => {
        const res = await api.get<ApiResponse<Skill[]>>("/skills/recommended");
        return res.data;
    },
    getSimilar: async (id: string | number) => {
        const res = await api.get<ApiResponse<Skill[]>>(`/skills/${id}/similar`);
        return res.data;
    },
};

// =============================================================================
// REQUESTS
// =============================================================================
export const requestsApi = {
    getAll: async () => {
        const res = await api.get<ApiResponse<SkillRequest[]>>("/requests");
        return res.data;
    },
    create: async (data: { skillId: string | number; message: string; scheduledAt?: string }) => {
        const res = await api.post<ApiResponse<SkillRequest>>("/requests", data);
        return res.data;
    },
    accept: async (id: string | number) => {
        const res = await api.patch<ApiResponse<SkillRequest>>(`/requests/${id}/accept`);
        return res.data;
    },
    decline: async (id: string | number) => {
        const res = await api.patch<ApiResponse<SkillRequest>>(`/requests/${id}/decline`);
        return res.data;
    },
    complete: async (id: string | number) => {
        const res = await api.patch<ApiResponse<SkillRequest>>(`/requests/${id}/complete`);
        return res.data;
    },
};

// =============================================================================
// REVIEWS
// =============================================================================
export const reviewsApi = {
    getBySkill: async (skillId: string | number) => {
        const res = await api.get<ApiResponse<Review[]>>(`/reviews/skill/${skillId}`);
        return res.data;
    },
    getByUser: async (userId: string) => {
        const res = await api.get<ApiResponse<Review[]>>(`/reviews/user/${userId}`);
        return res.data;
    },
    create: async (data: { skillId: string | number; requestId: string | number; rating: number; comment: string }) => {
        const res = await api.post<ApiResponse<Review>>("/reviews", data);
        return res.data;
    },
};

// =============================================================================
// MESSAGES / CHAT
// =============================================================================
export const messagesApi = {
    getConversations: async () => {
        const res = await api.get<ApiResponse<{
            userId: string; name: string; skill: string;
            lastMessage: string; unread: number; online: boolean;
        }[]>>("/messages/conversations");
        return res.data;
    },
    getMessages: async (userId: string) => {
        const res = await api.get<ApiResponse<Message[]>>(`/messages/${userId}`);
        return res.data;
    },
    send: async (data: { receiverId: string; content: string }) => {
        const res = await api.post<ApiResponse<Message>>("/messages", data);
        return res.data;
    },
    markRead: async (userId: string) => {
        const res = await api.patch<ApiResponse<null>>(`/messages/${userId}/read`);
        return res.data;
    },
};

// =============================================================================
// USERS / PROFILES
// =============================================================================
export const usersApi = {
    getProfile: async (id: string) => {
        const res = await api.get<ApiResponse<User>>(`/users/${id}`);
        return res.data;
    },
    search: async (query: string) => {
        const res = await api.get<ApiResponse<User[]>>("/users/search", { params: { q: query } });
        return res.data;
    },
};

// =============================================================================
// IMPACT / ANALYTICS
// =============================================================================
export const impactApi = {
    getStats: async (userId: string) => {
        const res = await api.get<ApiResponse<ImpactStats>>(`/impact/${userId}`);
        return res.data;
    },
    getLeaderboard: async (city?: string) => {
        const res = await api.get<ApiResponse<(User & { rank: number; score: number })[]>>(
            "/impact/leaderboard", { params: { city } }
        );
        return res.data;
    },
    getActivity: async (userId: string) => {
        const res = await api.get<ApiResponse<{ month: string; sessions: number; hours: number }[]>>(
            `/impact/${userId}/activity`
        );
        return res.data;
    },
    getBadges: async (userId: string) => {
        const res = await api.get<ApiResponse<{
            id: number; name: string; desc: string;
            color: string; earned: boolean; icon: string;
        }[]>>(`/impact/${userId}/badges`);
        return res.data;
    },
};

// =============================================================================
// DASHBOARD
// =============================================================================
export const dashboardApi = {
    getData: async () => {
        const res = await api.get<ApiResponse<{
            user: User;
            stats: { skillsShared: number; peopleHelped: number; hoursContributed: number; impactScore: number };
            mySkills: Skill[];
            requests: SkillRequest[];
            recommended: Skill[];
            recentActivity: { id: number; text: string; time: string; type: string }[];
        }>>("/dashboard");
        return res.data;
    },
};

export default api;