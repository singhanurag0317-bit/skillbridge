"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Box, CircularProgress } from "@mui/material";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

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
        if (!loading && !isAuthenticated && !isPublic && mounted) {
            router.push("/auth/login");
        }
    }, [isAuthenticated, loading, pathname, router, isPublic, mounted]);

    if (!mounted) {
        return <Box sx={{ minHeight: "100vh", background: "#080F1E" }} />;
    }

    if (loading) {
        return (
            <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#080F1E" }}>
                <CircularProgress sx={{ color: "#10B981" }} />
            </Box>
        );
    }

    if (!isAuthenticated && !isPublic) {
        return <Box sx={{ minHeight: "100vh", background: "#080F1E" }} />;
    }

    return <>{children}</>;
}
