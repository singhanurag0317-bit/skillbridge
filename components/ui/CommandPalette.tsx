"use client";
// components/ui/CommandPalette.tsx — Global Cmd+K / Ctrl+K search overlay

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Box, Dialog, InputBase, Stack, Typography, Chip,
} from "@mui/material";
import { Search, ArrowForward, KeyboardCommandKey } from "@mui/icons-material";

const C = {
    emerald: "#10B981", coral: "#F4623A",
    text: "#F0EDE8", muted: "rgba(240,237,232,0.52)",
    faint: "rgba(240,237,232,0.18)", border: "rgba(240,237,232,0.07)",
};

const PAGES = [
    { label: "Dashboard",  href: "/dashboard",  icon: "📊", tag: "Page" },
    { label: "Explore Skills", href: "/explore", icon: "🔍", tag: "Page" },
    { label: "Messages / Chat", href: "/chat",  icon: "💬", tag: "Page" },
    { label: "Impact & Leaderboard", href: "/impact", icon: "⚡", tag: "Page" },
    { label: "My Bookings", href: "/bookings",  icon: "📅", tag: "Page" },
    { label: "Settings",   href: "/settings",   icon: "⚙️", tag: "Page" },
    { label: "Sign in",    href: "/auth/login",  icon: "🔐", tag: "Auth" },
];

const SKILLS = [
    { label: "Python Basics → Data Science", href: "/skill/1", icon: "💻", tag: "Skill" },
    { label: "Yoga & Mindfulness", href: "/skill/2",           icon: "🧘", tag: "Skill" },
    { label: "Guitar for Beginners", href: "/skill/3",         icon: "🎸", tag: "Skill" },
    { label: "Resume & Interview Prep", href: "/skill/4",      icon: "📋", tag: "Skill" },
    { label: "Spanish Conversation", href: "/skill/5",         icon: "🌍", tag: "Skill" },
];

const ALL = [...PAGES, ...SKILLS];

interface Props { open: boolean; onClose: () => void; }

export default function CommandPalette({ open, onClose }: Props) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(0);

    const results = useMemo(() => {
        if (!query.trim()) return ALL;
        const q = query.toLowerCase();
        return ALL.filter(i => i.label.toLowerCase().includes(q));
    }, [query]);

    const handleClose = () => {
        setQuery("");
        setSelected(0);
        onClose();
    };

    const go = (href: string) => { router.push(href); handleClose(); };

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)); }
        if (e.key === "ArrowUp")   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
        if (e.key === "Enter" && results[selected]) go(results[selected].href);
        if (e.key === "Escape") handleClose();
    };

    const tagColor = (tag: string) => tag === "Skill" ? C.emerald : C.coral;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    background: "#0e1829", border: `1px solid ${C.border}`,
                    borderRadius: "18px", overflow: "hidden",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
                    mt: { xs: 4, md: 10 },
                },
            }}
            BackdropProps={{ sx: { backdropFilter: "blur(6px)" } }}
        >
            {/* Search input */}
            <Stack direction="row" alignItems="center" px={2.5} py={2} sx={{ borderBottom: `1px solid ${C.border}` }}>
                <Search sx={{ color: C.muted, fontSize: 20, mr: 1.5 }} />
                <InputBase
                    autoFocus
                    fullWidth
                    placeholder="Search pages, skills, people…"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setSelected(0);
                    }}
                    onKeyDown={handleKey}
                    sx={{ color: C.text, fontSize: 15, "& input::placeholder": { color: C.muted } }}
                />
                <Chip label="ESC" size="small" sx={{ height: 20, fontSize: 10, background: C.border, color: C.muted, ml: 1 }} />
            </Stack>

            {/* Results */}
            <Box sx={{ maxHeight: 380, overflowY: "auto", py: 1 }}>
                {results.length === 0 ? (
                    <Typography sx={{ color: C.muted, fontSize: 14, textAlign: "center", py: 4 }}>
                        No results for &ldquo;{query}&rdquo;
                    </Typography>
                ) : results.map((item, i) => (
                    <Stack
                        key={item.href + item.label}
                        direction="row"
                        alignItems="center"
                        onClick={() => go(item.href)}
                        sx={{
                            px: 2.5, py: 1.4, cursor: "pointer",
                            background: selected === i ? "rgba(16,185,129,0.08)" : "transparent",
                            "&:hover": { background: "rgba(16,185,129,0.06)" },
                            transition: "background 0.1s",
                        }}
                    >
                        <Typography sx={{ fontSize: 18, mr: 1.5, lineHeight: 1 }}>{item.icon}</Typography>
                        <Typography sx={{ color: C.text, fontSize: 14, flex: 1 }}>{item.label}</Typography>
                        <Chip label={item.tag} size="small" sx={{ height: 20, fontSize: 10, fontWeight: 700, background: tagColor(item.tag) + "20", color: tagColor(item.tag) }} />
                        {selected === i && <ArrowForward sx={{ fontSize: 14, color: C.emerald, ml: 1 }} />}
                    </Stack>
                ))}
            </Box>

            {/* Footer hint */}
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} px={2.5} py={1.5} sx={{ borderTop: `1px solid ${C.border}` }}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                    <KeyboardCommandKey sx={{ fontSize: 12, color: C.faint }} />
                    <Typography sx={{ fontSize: 11, color: C.faint }}>K to open</Typography>
                </Stack>
                <Typography sx={{ fontSize: 11, color: C.faint }}>↑↓ navigate</Typography>
                <Typography sx={{ fontSize: 11, color: C.faint }}>↵ select</Typography>
            </Stack>
        </Dialog>
    );
}
