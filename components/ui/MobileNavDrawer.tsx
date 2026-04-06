"use client";
// components/ui/MobileNavDrawer.tsx — Slide-in mobile drawer for all pages

import React from "react";
import Link from "next/link";
import {
    Box, Drawer, IconButton, Stack, Typography, Divider, Button, Avatar,
} from "@mui/material";
import { Close, Handshake, ArrowForward } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";

const C = {
    emerald: "#10B981", coral: "#F4623A",
    ink: "#080F1E", text: "#F0EDE8",
    muted: "rgba(240,237,232,0.52)",
    border: "rgba(240,237,232,0.08)",
    card: "rgba(240,237,232,0.04)",
};

const NAV = [
    { label: "Dashboard",  href: "/dashboard", emoji: "📊" },
    { label: "Explore",    href: "/explore",   emoji: "🔍" },
    { label: "Messages",   href: "/chat",      emoji: "💬" },
    { label: "Impact",     href: "/impact",    emoji: "⚡" },
    { label: "Bookings",   href: "/bookings",  emoji: "📅" },
    { label: "Settings",   href: "/settings",  emoji: "⚙️" },
];

interface Props {
    open: boolean;
    onClose: () => void;
    activeHref?: string;
}

export default function MobileNavDrawer({ open, onClose, activeHref }: Props) {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: 280, background: "#0b1324",
                    border: "none", borderRight: `1px solid ${C.border}`,
                },
            }}
        >
            <Box sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
                {/* Header */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                    <Stack direction="row" alignItems="center" spacing={1} component={Link} href="/" onClick={onClose} sx={{ textDecoration: "none" }}>
                        <Box sx={{ width: 30, height: 30, borderRadius: "8px", background: `linear-gradient(135deg,${C.emerald},${C.coral})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Handshake sx={{ fontSize: 15, color: "#fff" }} />
                        </Box>
                        <Typography sx={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 16, color: C.text }}>
                            SkillBridge
                        </Typography>
                    </Stack>
                    <IconButton onClick={onClose} sx={{ color: C.muted }}>
                        <Close sx={{ fontSize: 20 }} />
                    </IconButton>
                </Stack>

                {/* User info */}
                {isAuthenticated && user && (
                    <Box sx={{ p: 2, background: C.card, borderRadius: "14px", mb: 2.5, border: `1px solid ${C.border}` }}>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Avatar sx={{ width: 38, height: 38, background: `linear-gradient(135deg,${C.emerald},${C.coral})`, fontSize: 14, fontWeight: 700 }}>
                                {user.initials}
                            </Avatar>
                            <Box>
                                <Typography sx={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{user.name}</Typography>
                                <Typography sx={{ color: C.muted, fontSize: 12 }}>{user.city}</Typography>
                            </Box>
                        </Stack>
                    </Box>
                )}

                <Divider sx={{ borderColor: C.border, mb: 2 }} />

                {/* Nav links */}
                <Stack spacing={0.5} flex={1}>
                    {NAV.map(l => {
                        const active = activeHref === l.href;
                        return (
                            <Box
                                key={l.href}
                                component={Link}
                                href={l.href}
                                onClick={onClose}
                                sx={{
                                    display: "flex", alignItems: "center", gap: 1.5,
                                    px: 2, py: 1.3, borderRadius: "12px",
                                    textDecoration: "none",
                                    background: active ? `${C.emerald}15` : "transparent",
                                    border: active ? `1px solid ${C.emerald}30` : "1px solid transparent",
                                    "&:hover": { background: `${C.emerald}10` },
                                    transition: "all 0.15s",
                                }}
                            >
                                <Typography sx={{ fontSize: 16 }}>{l.emoji}</Typography>
                                <Typography sx={{ color: active ? C.emerald : C.muted, fontWeight: active ? 700 : 500, fontSize: 14 }}>
                                    {l.label}
                                </Typography>
                            </Box>
                        );
                    })}
                </Stack>

                <Divider sx={{ borderColor: C.border, my: 2 }} />

                {/* Footer */}
                {isAuthenticated ? (
                    <Button
                        onClick={() => { logout(); onClose(); }}
                        variant="outlined"
                        fullWidth
                        sx={{ borderColor: `${C.coral}44`, color: C.coral, textTransform: "none", borderRadius: "12px", fontSize: 13, "&:hover": { background: `${C.coral}10` } }}
                    >
                        Sign out
                    </Button>
                ) : (
                    <Stack spacing={1.5}>
                        <Button component={Link} href="/auth/login" onClick={onClose} variant="outlined" fullWidth sx={{ borderColor: C.border, color: C.text, textTransform: "none", borderRadius: "12px", fontSize: 13 }}>Sign in</Button>
                        <Button component={Link} href="/auth/login" onClick={onClose} variant="contained" fullWidth endIcon={<ArrowForward />} sx={{ background: `linear-gradient(135deg,${C.emerald},${C.coral})`, color: "#fff", textTransform: "none", borderRadius: "12px", fontSize: 13, boxShadow: "none" }}>
                            Join free
                        </Button>
                    </Stack>
                )}
            </Box>
        </Drawer>
    );
}
