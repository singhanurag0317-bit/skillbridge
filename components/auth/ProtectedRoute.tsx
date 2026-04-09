"use client";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Box, CircularProgress } from "@mui/material";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Define routes that are accessible without logging in
    const publicRoutes = [
        "/", 
        "/auth/login", 
        "/auth/register", 
        "/privacy", 
        "/terms",
        "/about",
        "/how-it-works",
        "/impact"
    ];

    const isPublic = publicRoutes.includes(pathname);

    useEffect(() => {
        if (!loading && !isAuthenticated && !isPublic) {
            router.push("/auth/login");
        }
    }, [isAuthenticated, loading, pathname, router, isPublic]);

    if (loading) {
        return (
            <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent" }}>
                <CircularProgress sx={{ color: "#10B981" }} />
            </Box>
        );
    }

    if (!isAuthenticated && !isPublic) {
        // Prevent layout flash of protected content before redirect takes hold
        return (
             <Box sx={{ minHeight: "100vh", background: "transparent" }} />
        );
    }

    return <>{children}</>;
}
