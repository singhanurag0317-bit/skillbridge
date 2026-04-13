"use client";
// context/AuthContext.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Global auth state for SkillBridge — wired to the real FastAPI backend.
// JWT token is kept in localStorage (sb_token); user object in sb_user.
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@/types";
import { authApi } from "@/lib/api";
import api from "@/lib/api";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    googleLogin: (data: { email: string; name: string; image?: string }) => Promise<void>;
    register: (data: {
        name: string;
        email: string;
        password: string;
        location: string;
    }) => Promise<void>;
    logout: () => void;
    updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "sb_token";
const USER_KEY = "sb_user";

// ─── Inject the JWT into every outgoing request ───────────────────────────────
api.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // ── Restore session on mount ──────────────────────────────────────────────
    useEffect(() => {
        const restoreSession = async () => {
            const token = localStorage.getItem(TOKEN_KEY);
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await authApi.getMe();
                if (res.success && res.data) {
                    setUser(res.data as User);
                    localStorage.setItem(USER_KEY, JSON.stringify(res.data));
                } else {
                    // Token invalid — clear everything
                    localStorage.removeItem(TOKEN_KEY);
                    localStorage.removeItem(USER_KEY);
                }
            } catch {
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
            } finally {
                setLoading(false);
            }
        };
        restoreSession();
    }, []);

    // ── Login ─────────────────────────────────────────────────────────────────
    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const res = await authApi.login({ email, password });
            if (!res.success || !res.data) throw new Error(res.message ?? "Login failed");
            const { user: loggedIn, token } = res.data as { user: User; token: string };
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(USER_KEY, JSON.stringify(loggedIn));
            setUser(loggedIn);
        } catch (err) {
            throw err; // re-throw so login form can display the error
        } finally {
            setLoading(false);
        }
    };

    // ── Google Login ──────────────────────────────────────────────────────────
    const googleLogin = async (data: { email: string; name: string; image?: string }) => {
        setLoading(true);
        try {
            const res = await authApi.googleLogin(data);
            if (!res.success || !res.data) throw new Error(res.message ?? "Google login failed");
            const { user: loggedIn, token } = res.data as { user: User; token: string };
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(USER_KEY, JSON.stringify(loggedIn));
            setUser(loggedIn);
        } catch (err) {
            throw err; // re-throw so login form can display the error
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
            const res = await authApi.register(data);
            if (!res.success || !res.data) throw new Error(res.message ?? "Registration failed");
            const { user: newUser, token } = res.data as { user: User; token: string };
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(USER_KEY, JSON.stringify(newUser));
            setUser(newUser);
        } catch (err) {
            throw err; // re-throw so register form can display the error
        } finally {
            setLoading(false);
        }
    };

    // ── Logout ────────────────────────────────────────────────────────────────
    const logout = () => {
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    };

    // ── Update user (e.g. after profile edit) ─────────────────────────────────
    const updateUser = async (data: Partial<User>) => {
        if (!user) return;
        try {
            const res = await authApi.updateProfile(data);
            if (res.success && res.data) {
                setUser(res.data as User);
                localStorage.setItem(USER_KEY, JSON.stringify(res.data));
            }
        } catch (err) {
            console.error("Failed to update user profile:", err);
            // Fallback to local update if backend fails (not ideal but better than nothing)
            const updated = { ...user, ...data };
            setUser(updated);
            localStorage.setItem(USER_KEY, JSON.stringify(updated));
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                login,
                googleLogin,
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
