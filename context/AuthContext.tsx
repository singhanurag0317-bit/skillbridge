"use client";
// context/AuthContext.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Global auth state for SkillBridge.
// Currently uses localStorage + mock data.
// When backend is ready: replace mock blocks with real authApi calls.
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@/types";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: {
        name: string;
        email: string;
        password: string;
        location: string;
    }) => Promise<void>;
    logout: () => void;
    updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "sb_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // ── Restore session on mount ──────────────────────────────────────────────
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setUser(JSON.parse(stored));
        } catch {
            localStorage.removeItem(STORAGE_KEY);
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Login ─────────────────────────────────────────────────────────────────
    const login = async (email: string, _password: string) => {
        setLoading(true);
        try {
            // TODO: Replace with real call when backend is ready:
            // const { data } = await authApi.login({ email, password });
            // const loggedIn = data.user;

            // ── MOCK ──
            const loggedIn: User = {
                id: "1",
                name: "Anurag Sharma",
                email,
                location: "Mathura, Uttar Pradesh",
                city: "Mathura",
                initials: "AS",
                role: "Full Stack Developer",
                level: "Community Champion",
                nextLevel: "City Legend",
                levelProgress: 67,
                impactScore: 87,
                rank: 12,
                totalUsers: 3800,
                verified: true,
                responseTime: "Usually within 2 hours",
                availability: ["Weekday evenings", "Weekend mornings"],
                languages: ["Hindi", "English"],
                joined: "Member since Jan 2025",
                bio: "Passionate developer with 4 years of experience.",
            };
            // ── END MOCK ──

            setUser(loggedIn);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedIn));
        } finally {
            setLoading(false);
        }
    };

    // ── Register ──────────────────────────────────────────────────────────────
    const register = async (data: {
        name: string;
        email: string;
        password: string;
        location: string;
    }) => {
        setLoading(true);
        try {
            // TODO: Replace with real call when backend is ready:
            // const { data: res } = await authApi.register(data);
            // const newUser = res;

            // ── MOCK ──
            const initials = data.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

            const newUser: User = {
                id: Date.now().toString(),
                name: data.name,
                email: data.email,
                location: data.location,
                city: data.location.split(",")[0].trim(),
                initials,
                level: "Newcomer",
                nextLevel: "Community Member",
                levelProgress: 0,
                impactScore: 0,
                joined: `Member since ${new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}`,
            };
            // ── END MOCK ──

            setUser(newUser);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        } finally {
            setLoading(false);
        }
    };

    // ── Logout ────────────────────────────────────────────────────────────────
    const logout = () => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    // ── Update user (e.g. after profile edit) ─────────────────────────────────
    const updateUser = (data: Partial<User>) => {
        if (!user) return;
        const updated = { ...user, ...data };
        setUser(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
    return ctx;
}
