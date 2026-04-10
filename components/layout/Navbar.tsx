"use client";
// components/layout/Navbar.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Shared navbar for authenticated pages (Dashboard, Explore, Chat, Impact).
// Uses usePathname to highlight the active link.
// Uses useAuth to show user avatar or Sign in button.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Button, Stack, Typography, Avatar, IconButton, Badge } from "@mui/material";
import { Handshake, Notifications, Settings, Menu as MenuIcon } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import MobileNavDrawer from "@/components/ui/MobileNavDrawer";
import NotificationsDrawer from "@/components/ui/NotificationsDrawer";

const PUBLIC_LINKS = [
    { label: "How it works", href: "/how-it-works" },
    { label: "About us",     href: "/about" },
];

const PRIVATE_LINKS = [
    { label: "My Skills", href: "/dashboard" },
    { label: "Explore",   href: "/explore"   },
    { label: "Messages",  href: "/chat"      },
    { label: "Impact",    href: "/impact"    },
];

const C = {
    emerald: "#10B981",
    coral:   "#F4623A",
    ink:     "#080F1E",
    text:    "#F0EDE8",
    muted:   "rgba(240,237,232,0.52)",
    border:  "rgba(240,237,232,0.07)",
};

export default function Navbar() {
    const pathname = usePathname();
    const { user, isAuthenticated } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [notifsOpen, setNotifsOpen] = useState(false);

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

    // Standard high-end navbar container style
    const navbarSx = {
        px: { xs: 2, md: 8 },
        height: isAuthenticated ? "72px" : "80px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: isAuthenticated ? "rgba(8,15,30,0.95)" : "rgba(8,15,30,0.8)",
        backdropFilter: "blur(24px)",
        borderBottom: `1px solid ${C.border}`,
        position: "sticky", top: 0, zIndex: 100,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        ...( !isAuthenticated && {
            borderBottom: "none",
            "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0, left: "5%", right: "5%",
                height: "1px",
                background: `linear-gradient(90deg, transparent, ${C.emerald}44, ${C.coral}44, transparent)`,
            }
        })
    };

    return (
        <Box sx={navbarSx}>
            <MobileNavDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} activeHref={pathname} />
            <NotificationsDrawer open={notifsOpen} onClose={() => setNotifsOpen(false)} />

            {/* Logo */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton onClick={() => setMobileOpen(true)} sx={{ color: C.muted, display: { md: "none" } }}>
                    <MenuIcon />
                </IconButton>
                <Stack 
                    direction="row" 
                    alignItems="center" 
                    spacing={1.5} 
                    component={Link} 
                    href="/" 
                    sx={{ 
                        textDecoration: "none",
                        transition: "transform 0.3s ease",
                        "&:hover": { transform: "scale(1.05)" }
                    }}
                >
                    <Box sx={{
                        width: 40, height: 40, borderRadius: "12px",
                        background: `linear-gradient(135deg,${C.emerald},${C.coral})`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: `0 0 20px ${C.emerald}44`,
                    }}>
                        <Handshake sx={{ fontSize: 20, color: "#fff" }} />
                    </Box>
                    <Typography sx={{ 
                        fontFamily: "'Playfair Display',serif", 
                        fontWeight: 900, 
                        fontSize: 22, 
                        color: C.text,
                        letterSpacing: "-0.03em"
                    }}>
                        SkillBridge
                    </Typography>
                </Stack>
            </Stack>

            <Box sx={{ flexGrow: 1 }} />

            {/* Right side Group (Links + Actions) */}
            <Stack direction="row" alignItems="center" spacing={isAuthenticated ? 3 : 6}>
                {/* Desktop Nav links (now on the right) */}
                <Stack direction="row" spacing={isAuthenticated ? 4 : 5} sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", mr: 2 }}>
                    {(isAuthenticated ? PRIVATE_LINKS : PUBLIC_LINKS).map((l) => {
                        const active = isActive(l.href) && l.href !== "/dashboard"
                            ? true
                            : pathname === l.href;
                        
                        return (
                            <Button
                                key={l.label}
                                component={Link}
                                href={l.href}
                                variant="text"
                                sx={{
                                    color: active ? C.text : C.muted,
                                    fontSize: isAuthenticated ? 14 : 15, 
                                    fontWeight: active ? 800 : (isAuthenticated ? 500 : 600),
                                    textTransform: "none",
                                    px: 1,
                                    minWidth: 0,
                                    letterSpacing: isAuthenticated ? "normal" : "0.02em",
                                    cursor: "pointer",
                                    "&:hover": { 
                                        color: C.text,
                                        background: "transparent",
                                        "&::after": { width: "100%" }
                                    },
                                    position: "relative",
                                    "&::after": {
                                        content: '""',
                                        position: "absolute",
                                        bottom: -4, left: "10%", width: active ? "80%" : "0%", height: "2px",
                                        background: `linear-gradient(90deg, ${C.emerald}, ${C.coral})`,
                                        transition: "width 0.3s ease",
                                        borderRadius: "2px",
                                    },
                                    transition: "all 0.2s",
                                }}
                            >
                                {l.label}
                            </Button>
                        );
                    })}
                </Stack>

                {/* Authenticated Actions */}
                {isAuthenticated && user ? (
                    <Stack direction="row" alignItems="center" spacing={2.5}>
                        <IconButton onClick={() => setNotifsOpen(true)} sx={{ color: C.muted, "&:hover": { color: C.text, background: "rgba(240,237,232,0.08)" } }}>
                            <Badge badgeContent={2} sx={{ "& .MuiBadge-badge": { background: C.coral, color: "#fff" } }}>
                                <Notifications sx={{ fontSize: 22 }} />
                            </Badge>
                        </IconButton>
                        <IconButton component={Link} href="/settings" sx={{ color: C.muted, "&:hover": { color: C.text, background: "rgba(240,237,232,0.08)" } }}>
                            <Settings sx={{ fontSize: 22 }} />
                        </IconButton>
                        <Avatar
                            component={Link}
                            href="/profile/1"
                            sx={{
                                width: 42, height: 42,
                                background: `linear-gradient(135deg,${C.emerald},${C.coral})`,
                                fontSize: 16, fontWeight: 800, cursor: "pointer",
                                textDecoration: "none",
                                border: `2px solid ${C.ink}`,
                                boxShadow: `0 0 0 1px ${C.border}`,
                                "&:hover": { transform: "translateY(-2px)", boxShadow: `0 6px 16px ${C.emerald}44` },
                                transition: "all 0.3s ease"
                            }}
                        >
                            {user.initials}
                        </Avatar>
                    </Stack>
                ) : (
                    <Stack direction="row" spacing={3} alignItems="center">
                        <Button
                            component={Link} href="/auth/login"
                            variant="text"
                            sx={{ 
                                color: C.text, 
                                fontSize: 14, 
                                fontWeight: 600,
                                textTransform: "none", 
                                px: 2,
                                "&:hover": { background: "rgba(240,237,232,0.08)" } 
                            }}
                        >
                            Sign in
                        </Button>
                        <Button
                            component={Link} href="/auth/register"
                            variant="contained"
                            sx={{
                                background: `linear-gradient(135deg,${C.emerald},${C.coral})`,
                                color: "#fff", 
                                fontSize: 14, 
                                fontWeight: 800,
                                textTransform: "none",
                                borderRadius: "14px", 
                                px: 4.5, 
                                py: 1.4,
                                boxShadow: `0 4px 25px -5px ${C.emerald}66`,
                                "&:hover": { 
                                    transform: "translateY(-2px)",
                                    boxShadow: `0 12px 35px -5px ${C.emerald}88`,
                                    background: `linear-gradient(135deg,${C.emerald},${C.coral})`,
                                },
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                            }}
                        >
                            Join free
                        </Button>
                    </Stack>
                )}
            </Stack>
        </Box>
    );
}
