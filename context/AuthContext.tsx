"use client";
// context/AuthContext.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Global auth state for SkillBridge — wired to the real FastAPI backend.
// JWT token is kept in localStorage (sb_token); user object in sb_user.
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@/types";
import { authApi } from "@/lib/api";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    googleLogin: () => Promise<void>;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // ── Restore session and listen for changes ────────────────────────────────
    useEffect(() => {
        const initSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                await fetchUserData();
            } else {
                setLoading(false);
            }
        };

        initSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                await fetchUserData();
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserData = async () => {
        try {
            const res = await authApi.getMe();
            if (res.success && res.data) {
                setUser(res.data as User);
            }
        } catch (err) {
            console.error("Failed to fetch user metadata:", err);
        } finally {
            setLoading(false);
        }
    };

    // ── Login ─────────────────────────────────────────────────────────────────
    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            // fetchUserData will be triggered by onAuthStateChange
        } catch (err: any) {
            setLoading(false);
            throw err;
        }
    };

    // ── Google Login ──────────────────────────────────────────────────────────
    const googleLogin = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({ 
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } catch (err) {
            setLoading(false);
            throw err;
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
            const { data: authData, error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: data.name,
                        location: data.location,
                    }
                }
            });
            
            if (error) throw error;
            
            // To bridge Supabase Auth with our Backend DB immediately, 
            // we call our register endpoint which will now be updated to 
            // "sync" the user if they don't exist.
            await authApi.register(data);
            
        } catch (err: any) {
            setLoading(false);
            throw err;
        }
    };

    // ── Logout ────────────────────────────────────────────────────────────────
    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    // ── Update user (e.g. after profile edit) ─────────────────────────────────
    const updateUser = async (data: Partial<User>) => {
        if (!user) return;
        try {
            const res = await authApi.updateProfile(data);
            if (res.success && res.data) {
                setUser(res.data as User);
            }
        } catch (err) {
            console.error("Failed to update user profile:", err);
            const updated = { ...user, ...data };
            setUser(updated);
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
