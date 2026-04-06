"use client";
// components/ui/NotificationsDrawer.tsx — Slide-in notification panel

import React from "react";
import {
    Box, Drawer, IconButton, Stack, Typography, Divider, Avatar, Chip, Button,
} from "@mui/material";
import { Close, NotificationsNone, CheckCircleOutline } from "@mui/icons-material";

const C = {
    emerald: "#10B981", coral: "#F4623A", gold: "#F4B83A",
    ink: "#080F1E", text: "#F0EDE8",
    muted: "rgba(240,237,232,0.52)", faint: "rgba(240,237,232,0.18)",
    border: "rgba(240,237,232,0.07)", card: "rgba(240,237,232,0.04)",
};

const NOTIFS = [
    { id: 1, emoji: "🤝", title: "Session request", body: "Priya Kapoor wants to learn Python from you", time: "2 min ago", read: false, color: C.emerald },
    { id: 2, emoji: "⭐", title: "New review", body: "Arjun Mehta gave you 5 stars for Yoga session", time: "1 hour ago", read: false, color: C.gold },
    { id: 3, emoji: "✅", title: "Session completed", body: "Your guitar session with Vikram is done!", time: "Yesterday", read: true, color: C.emerald },
    { id: 4, emoji: "🏆", title: "Badge earned", body: "You unlocked the Community Star badge", time: "2 days ago", read: true, color: C.coral },
    { id: 5, emoji: "💬", title: "New message", body: "Neha Gupta: \"Are you free this Saturday?\"", time: "3 days ago", read: true, color: "#60A5FA" },
];

interface Props { open: boolean; onClose: () => void; }

export default function NotificationsDrawer({ open, onClose }: Props) {
    const unread = NOTIFS.filter(n => !n.read).length;

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: 340, background: "#0b1324", border: "none", borderLeft: `1px solid ${C.border}` },
            }}
        >
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                {/* Header */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" p={2.5} sx={{ borderBottom: `1px solid ${C.border}` }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <NotificationsNone sx={{ color: C.text, fontSize: 22 }} />
                        <Typography sx={{ color: C.text, fontWeight: 700, fontSize: 16 }}>Notifications</Typography>
                        {unread > 0 && (
                            <Chip label={unread} size="small" sx={{ height: 20, fontSize: 11, fontWeight: 700, background: C.coral, color: "#fff" }} />
                        )}
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Button size="small" sx={{ color: C.emerald, textTransform: "none", fontSize: 12, p: 0.5, minWidth: 0 }}>
                            Mark all read
                        </Button>
                        <IconButton onClick={onClose} sx={{ color: C.muted, p: 0.5 }}>
                            <Close sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Stack>
                </Stack>

                {/* Notifications list */}
                <Box sx={{ flex: 1, overflowY: "auto" }}>
                    {NOTIFS.map((n, i) => (
                        <Box key={n.id}>
                            <Stack
                                direction="row"
                                spacing={1.5}
                                sx={{
                                    px: 2.5, py: 2, cursor: "pointer",
                                    background: n.read ? "transparent" : `${n.color}08`,
                                    "&:hover": { background: `${n.color}10` },
                                    transition: "background 0.15s",
                                }}
                            >
                                {/* Icon */}
                                <Avatar sx={{ width: 40, height: 40, background: n.color + "20", fontSize: 18, flexShrink: 0 }}>
                                    {n.emoji}
                                </Avatar>
                                {/* Content */}
                                <Box flex={1}>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.3}>
                                        <Typography sx={{ color: C.text, fontWeight: n.read ? 500 : 700, fontSize: 13 }}>
                                            {n.title}
                                        </Typography>
                                        {!n.read && (
                                            <Box sx={{ width: 7, height: 7, borderRadius: "50%", background: n.color, flexShrink: 0 }} />
                                        )}
                                    </Stack>
                                    <Typography sx={{ color: C.muted, fontSize: 12, lineHeight: 1.5 }}>{n.body}</Typography>
                                    <Typography sx={{ color: C.faint, fontSize: 11, mt: 0.5 }}>{n.time}</Typography>
                                </Box>
                            </Stack>
                            {i < NOTIFS.length - 1 && <Divider sx={{ borderColor: C.border }} />}
                        </Box>
                    ))}
                </Box>

                {/* Footer */}
                <Stack p={2.5} sx={{ borderTop: `1px solid ${C.border}` }}>
                    <Button startIcon={<CheckCircleOutline sx={{ fontSize: 15 }} />} sx={{ color: C.muted, textTransform: "none", fontSize: 13, "&:hover": { color: C.emerald } }}>
                        View all notifications
                    </Button>
                </Stack>
            </Box>
        </Drawer>
    );
}
