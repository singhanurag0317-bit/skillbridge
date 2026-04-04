// types/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// SkillBridge — Shared TypeScript types
// Used across pages, components, and lib/api.ts
// ─────────────────────────────────────────────────────────────────────────────

// ─── Primitives ───────────────────────────────────────────────────────────────
export type SkillCategory =
    | "Tech"
    | "Career"
    | "Music"
    | "Wellness"
    | "Creative"
    | "Language";

export type RequestStatus = "pending" | "accepted" | "completed" | "cancelled";

// ─── API Wrapper ──────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
    id: string;
    name: string;
    email: string;
    location: string;
    city: string;
    initials: string;
    bio?: string;
    avatar?: string;
    role?: string;

    // Gamification
    level: string;
    nextLevel: string;
    levelProgress: number; // 0–100
    impactScore: number;
    rank?: number;
    totalUsers?: number;

    // Profile details
    verified?: boolean;
    responseTime?: string;
    availability?: string[];
    languages?: string[];
    joined?: string;

    createdAt?: string;
    updatedAt?: string;
}

// ─── Skill ────────────────────────────────────────────────────────────────────
export interface Skill {
    id: number | string;
    title: string;
    category: SkillCategory;
    description: string;
    rating: number;
    totalReviews?: number;
    sessions: number;
    active?: boolean;

    // Display
    color?: string;
    tags?: string[];

    // Session details
    duration?: string;
    format?: string;
    language?: string;

    // Location
    location?: string;
    lat?: number;
    lng?: number;
    distance?: string; // e.g. "1.2 km"

    // Availability (e.g. ["Mon 6:00 PM", "Fri 5:00 PM"])
    availability?: { day: string; slots: string[]; available: boolean }[];

    // Relations
    userId?: string;
    user?: Partial<User>;

    whatYouLearn?: string[];
    requirements?: string[];

    createdAt?: string;
    updatedAt?: string;
}

// ─── Skill Request ────────────────────────────────────────────────────────────
export interface SkillRequest {
    id: number | string;
    skillId: number | string;
    skill?: Partial<Skill>;

    userId?: string;
    user?: Partial<User>;

    status: RequestStatus;
    message?: string;
    scheduledAt?: string;

    createdAt?: string;
    updatedAt?: string;
}

// ─── Review ───────────────────────────────────────────────────────────────────
export interface Review {
    id: number | string;
    skillId: number | string;
    requestId?: number | string;

    userId?: string;
    name: string;
    initials: string;
    color?: string;

    rating: number; // 1–5
    comment: string;
    time: string; // display string, e.g. "2 weeks ago"

    createdAt?: string;
}

// ─── Message ──────────────────────────────────────────────────────────────────
export interface Message {
    id: number | string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: string;
    read?: boolean;
    type?: "text" | "image" | "file";
}

export interface Conversation {
    userId: string;
    name: string;
    initials: string;
    color?: string;
    skill: string;
    lastMessage: string;
    unread: number;
    online: boolean;
    time?: string;
}

// ─── Impact / Analytics ───────────────────────────────────────────────────────
export interface ImpactStats {
    impactScore: number;
    rank: number;
    totalUsers: number;
    level: string;
    nextLevel: string;
    levelProgress: number;

    sessions: number;
    hours: number;
    peopleHelped: number;
    skillsShared: number;
    city: string;
}

export interface Badge {
    id: number;
    name: string;
    desc: string;
    color: string;
    earned: boolean;
    icon: string;
}

export interface ActivityItem {
    id: number;
    text: string;
    time: string;
    type: "completed" | "request" | "review" | "badge" | "scheduled";
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface DashboardData {
    user: User;
    stats: {
        skillsShared: number;
        peopleHelped: number;
        hoursContributed: number;
        impactScore: number;
    };
    mySkills: Skill[];
    requests: SkillRequest[];
    recommended: Skill[];
    recentActivity: ActivityItem[];
}
