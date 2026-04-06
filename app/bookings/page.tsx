"use client";
// app/bookings/page.tsx — My Bookings page

import React, { useState } from "react";
import Link from "next/link";
import {
    Box, Button, Card, Chip, Container, Divider, IconButton,
    Stack, Tab, Tabs, Typography, Avatar,
} from "@mui/material";
import { ArrowForward, CalendarToday, CheckCircle, Schedule, Cancel, Handshake, Menu as MenuIcon } from "@mui/icons-material";
import MobileNavDrawer from "@/components/ui/MobileNavDrawer";
import { useToast } from "@/context/ToastContext";

const C = {
    emerald: "#10B981", coral: "#F4623A", gold: "#F4B83A",
    ink: "#080F1E", text: "#F0EDE8",
    muted: "rgba(240,237,232,0.52)", faint: "rgba(240,237,232,0.18)",
    border: "rgba(240,237,232,0.07)", card: "rgba(240,237,232,0.03)",
};

const STATUS_COLOR: Record<string, string> = {
    pending: C.gold, accepted: C.emerald, completed: "#60A5FA", cancelled: C.coral,
};
const STATUS_ICON: Record<string, React.ReactNode> = {
    pending: <Schedule sx={{ fontSize: 13 }} />,
    accepted: <CheckCircle sx={{ fontSize: 13 }} />,
    completed: <CheckCircle sx={{ fontSize: 13 }} />,
    cancelled: <Cancel sx={{ fontSize: 13 }} />,
};

const BOOKINGS = [
    { id: 1, skill: "Python → Data Science", provider: "Rahul Verma", initials: "RV", color: C.emerald, time: "Sat, Apr 12 · 5:00 PM", status: "accepted", type: "session" },
    { id: 2, skill: "Yoga & Mindfulness", provider: "Priya Kapoor", initials: "PK", color: C.coral, time: "Mon, Apr 14 · 7:00 AM", status: "pending", type: "session" },
    { id: 3, skill: "Guitar Basics", provider: "Vikram Singh", initials: "VS", color: C.gold, time: "Thu, Apr 10 · 6:00 PM", status: "completed", type: "session" },
    { id: 4, skill: "Resume Prep", provider: "Ananya Roy", initials: "AR", color: "#60A5FA", time: "Wed, Apr 8 · 4:00 PM", status: "completed", type: "session" },
    { id: 5, skill: "Spanish Conversation", provider: "Carlos M.", initials: "CM", color: "#A78BFA", time: "Sun, Apr 6 · 11:00 AM", status: "cancelled", type: "session" },
];

export default function BookingsPage() {
    const { info } = useToast();
    const [tab, setTab] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);

    const tabs = ["All", "Upcoming", "Completed", "Cancelled"];
    const filtered = BOOKINGS.filter(b => {
        if (tab === 0) return true;
        if (tab === 1) return ["pending", "accepted"].includes(b.status);
        if (tab === 2) return b.status === "completed";
        if (tab === 3) return b.status === "cancelled";
        return true;
    });

    return (
        <Box sx={{ background: C.ink, minHeight: "100vh", color: C.text }}>
            <MobileNavDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} activeHref="/bookings" />

            {/* Navbar */}
            <Box sx={{ px: { xs: 2, md: 4 }, py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}`, background: "rgba(8,15,30,0.95)", backdropFilter: "blur(16px)", position: "sticky", top: 0, zIndex: 100 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton onClick={() => setMobileOpen(true)} sx={{ color: C.muted, display: { md: "none" } }}><MenuIcon /></IconButton>
                    <Stack direction="row" alignItems="center" spacing={1} component={Link} href="/" sx={{ textDecoration: "none" }}>
                        <Box sx={{ width: 32, height: 32, borderRadius: "9px", background: `linear-gradient(135deg,${C.emerald},${C.coral})`, display: "flex", alignItems: "center", justifyContent: "center" }}><Handshake sx={{ fontSize: 16, color: "#fff" }} /></Box>
                        <Typography sx={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 17, color: C.text }}>SkillBridge</Typography>
                    </Stack>
                </Stack>
                <Button component={Link} href="/explore" variant="contained" endIcon={<ArrowForward />} sx={{ background: `linear-gradient(135deg,${C.emerald},${C.coral})`, color: "#fff", textTransform: "none", borderRadius: "10px", fontSize: 13, boxShadow: "none" }}>
                    Book a session
                </Button>
            </Box>

            <Container maxWidth="md" sx={{ py: 4 }}>
                {/* Header */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                    <Box>
                        <Typography sx={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: { xs: 26, md: 32 } }}>My Bookings</Typography>
                        <Typography sx={{ color: C.muted, fontSize: 14, mt: 0.3 }}>{BOOKINGS.length} sessions total</Typography>
                    </Box>
                    <Chip icon={<CalendarToday sx={{ fontSize: 14 }} />} label={`${BOOKINGS.filter(b => b.status === "accepted").length} upcoming`} sx={{ background: `${C.emerald}20`, color: C.emerald, fontWeight: 700 }} />
                </Stack>

                {/* Tabs */}
                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, "& .MuiTab-root": { color: C.muted, textTransform: "none", fontSize: 14 }, "& .Mui-selected": { color: C.emerald }, "& .MuiTabs-indicator": { background: C.emerald } }}>
                    {tabs.map(t => <Tab key={t} label={t} />)}
                </Tabs>

                {/* Bookings list */}
                <Stack spacing={2}>
                    {filtered.length === 0 ? (
                        <Box sx={{ textAlign: "center", py: 8 }}>
                            <Typography sx={{ fontSize: 40, mb: 2 }}>📅</Typography>
                            <Typography sx={{ color: C.muted, fontSize: 15 }}>No bookings in this category</Typography>
                            <Button component={Link} href="/explore" sx={{ mt: 2, color: C.emerald, textTransform: "none" }}>Explore skills →</Button>
                        </Box>
                    ) : filtered.map(b => (
                        <Card key={b.id} sx={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "18px", p: 2.5, "&:hover": { borderColor: b.color + "33" }, transition: "border 0.2s" }}>
                            <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between" spacing={2}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Avatar sx={{ width: 46, height: 46, background: b.color + "25", fontSize: 16, fontWeight: 700, color: b.color }}>{b.initials}</Avatar>
                                    <Box>
                                        <Typography sx={{ color: C.text, fontWeight: 700, fontSize: 15 }}>{b.skill}</Typography>
                                        <Typography sx={{ color: C.muted, fontSize: 13 }}>with {b.provider}</Typography>
                                        <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                                            <CalendarToday sx={{ fontSize: 12, color: C.faint }} />
                                            <Typography sx={{ color: C.faint, fontSize: 12 }}>{b.time}</Typography>
                                        </Stack>
                                    </Box>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                    <Chip
                                        icon={STATUS_ICON[b.status] as React.ReactElement}
                                        label={b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                                        size="small"
                                        sx={{ background: STATUS_COLOR[b.status] + "20", color: STATUS_COLOR[b.status], fontWeight: 700, fontSize: 12, "& .MuiChip-icon": { color: `${STATUS_COLOR[b.status]} !important` } }}
                                    />
                                    {["pending", "accepted"].includes(b.status) && (
                                        <Button size="small" onClick={() => info("Cancellation feature coming soon")} sx={{ color: C.coral, textTransform: "none", fontSize: 12, "&:hover": { background: `${C.coral}10` } }}>Cancel</Button>
                                    )}
                                    {b.status === "completed" && (
                                        <Button component={Link} href={`/skill/${b.id}`} size="small" endIcon={<ArrowForward sx={{ fontSize: 12 }} />} sx={{ color: C.emerald, textTransform: "none", fontSize: 12 }}>Book again</Button>
                                    )}
                                </Stack>
                            </Stack>
                        </Card>
                    ))}
                </Stack>
            </Container>
        </Box>
    );
}
