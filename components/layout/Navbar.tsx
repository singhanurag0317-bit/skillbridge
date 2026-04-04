"use client";
// components/layout/Navbar.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Shared navbar for authenticated pages (Dashboard, Explore, Chat, Impact).
// Uses usePathname to highlight the active link.
// Uses useAuth to show user avatar or Sign in button.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Button, Stack, Typography, Avatar, IconButton, Badge } from "@mui/material";
import { Handshake, Notifications, Settings } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Explore",   href: "/explore"   },
    { label: "My Skills", href: "/dashboard" },
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

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

    return (
        <Box sx={{
            px: { xs: 2, md: 4 }, py: 1.5,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: `1px solid ${C.border}`,
            background: "rgba(8,15,30,0.95)", backdropFilter: "blur(16px)",
            position: "sticky", top: 0, zIndex: 100,
        }}>
            {/* Logo */}
            <Stack direction="row" alignItems="center" spacing={1} component={Link} href="/" sx={{ textDecoration: "none" }}>
                <Box sx={{
                    width: 32, height: 32, borderRadius: "9px",
                    background: `linear-gradient(135deg,${C.emerald},${C.coral})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <Handshake sx={{ fontSize: 16, color: "#fff" }} />
                </Box>
                <Typography sx={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 18, color: C.text }}>
                    SkillBridge
                </Typography>
            </Stack>

            {/* Nav links */}
            <Stack direction="row" spacing={3} sx={{ display: { xs: "none", md: "flex" } }}>
                {NAV_LINKS.map((l) => {
                    const active = isActive(l.href) && l.href !== "/dashboard"
                        ? true
                        : pathname === l.href;
                    return (
                        <Typography
                            key={l.label}
                            component={Link}
                            href={l.href}
                            sx={{
                                color: active ? C.emerald : C.muted,
                                fontSize: 14, cursor: "pointer",
                                borderBottom: active ? `2px solid ${C.emerald}` : "2px solid transparent",
                                pb: 0.3, textDecoration: "none",
                                "&:hover": { color: C.text },
                                transition: "color 0.2s",
                            }}
                        >
                            {l.label}
                        </Typography>
                    );
                })}
            </Stack>

            {/* Right side */}
            {isAuthenticated && user ? (
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <IconButton sx={{ color: C.muted, "&:hover": { color: C.text } }}>
                        <Badge badgeContent={2} sx={{ "& .MuiBadge-badge": { background: C.coral, color: "#fff" } }}>
                            <Notifications sx={{ fontSize: 20 }} />
                        </Badge>
                    </IconButton>
                    <IconButton sx={{ color: C.muted, "&:hover": { color: C.text } }}>
                        <Settings sx={{ fontSize: 20 }} />
                    </IconButton>
                    <Avatar
                        component={Link}
                        href="/profile/1"
                        sx={{
                            width: 34, height: 34,
                            background: `linear-gradient(135deg,${C.emerald},${C.coral})`,
                            fontSize: 13, fontWeight: 700, cursor: "pointer",
                            textDecoration: "none",
                        }}
                    >
                        {user.initials}
                    </Avatar>
                </Stack>
            ) : (
                <Stack direction="row" spacing={1.5}>
                    <Button
                        component={Link} href="/auth/login"
                        variant="text"
                        sx={{ color: C.muted, fontSize: 13, textTransform: "none", "&:hover": { color: C.text } }}
                    >
                        Sign in
                    </Button>
                    <Button
                        component={Link} href="/auth/login"
                        variant="contained"
                        sx={{
                            background: `linear-gradient(135deg,${C.emerald},${C.coral})`,
                            color: "#fff", fontSize: 13, textTransform: "none",
                            borderRadius: "10px", px: 2.5, boxShadow: "none",
                        }}
                    >
                        Join free
                    </Button>
                </Stack>
            )}
        </Box>
    );
}
