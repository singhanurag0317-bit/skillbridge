"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
    Box, Button, Card, Chip, Container, Grid, Stack,
    Typography, Avatar, LinearProgress, IconButton, Divider, Badge,
} from "@mui/material";
import {
    Add, Edit, Delete, CheckCircle, Cancel, Schedule,
    LocationOn, Star, TrendingUp, People, AccessTime,
    EmojiEvents, Notifications, Settings, ArrowForward,
    FiberManualRecord, Psychology, Handshake,
} from "@mui/icons-material";

// ─── Color tokens ─────────────────────────────────────────────────────────────
const C = {
    emerald: "#10B981",
    emeraldLight: "#34D399",
    coral: "#F4623A",
    coralLight: "#F87B58",
    gold: "#F4B83A",
    ink: "#080F1E",
    text: "#F0EDE8",
    muted: "rgba(240,237,232,0.52)",
    faint: "rgba(240,237,232,0.22)",
    border: "rgba(240,237,232,0.07)",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const USER = {
    name: "Anurag Sharma", role: "Full Stack Developer",
    location: "Mathura, UP", initials: "AS",
    impactScore: 87, level: "Community Champion",
    nextLevel: "City Legend", levelProgress: 67,
};

const STATS = [
    { label: "Skills shared", value: "6", icon: <Psychology sx={{ fontSize: 20 }} />, color: C.emerald, sub: "+2 this month" },
    { label: "People helped", value: "24", icon: <People sx={{ fontSize: 20 }} />, color: C.coral, sub: "+5 this week" },
    { label: "Hours contributed", value: "38", icon: <AccessTime sx={{ fontSize: 20 }} />, color: C.gold, sub: "Avg 1.6h/session" },
    { label: "Impact score", value: "87", icon: <EmojiEvents sx={{ fontSize: 20 }} />, color: C.coralLight, sub: "Top 12% in city" },
];

const MY_SKILLS = [
    { id: 1, title: "Python tutoring", category: "Tech", rating: 4.9, sessions: 12, active: true },
    { id: 2, title: "Resume writing", category: "Career", rating: 4.8, sessions: 7, active: true },
    { id: 3, title: "Guitar lessons", category: "Music", rating: 5.0, sessions: 5, active: false },
];

const REQUESTS = [
    { id: 1, name: "Priya S.", skill: "Python tutoring", location: "Agra", time: "2h ago", status: "pending", initials: "PS", color: C.emerald },
    { id: 2, name: "Rohan K.", skill: "Resume writing", location: "Delhi", time: "5h ago", status: "pending", initials: "RK", color: C.coral },
    { id: 3, name: "Meera P.", skill: "Python tutoring", location: "Mathura", time: "1d ago", status: "accepted", initials: "MP", color: C.gold },
    { id: 4, name: "Aditya N.", skill: "Guitar lessons", location: "Noida", time: "2d ago", status: "completed", initials: "AN", color: C.coralLight },
];

const RECOMMENDED = [
    { id: 1, title: "Yoga sessions", person: "Kavya R.", location: "0.8 km", tag: "Wellness", rating: 4.9, color: C.emerald },
    { id: 2, title: "UI/UX Design", person: "Sneha V.", location: "1.2 km", tag: "Creative", rating: 5.0, color: C.coral },
    { id: 3, title: "Spoken English", person: "Rahul J.", location: "2.1 km", tag: "Language", rating: 4.8, color: C.gold },
];

const ACTIVITY = [
    { id: 1, text: "Completed Python session with Meera P.", time: "Today, 10:00 AM", type: "completed" },
    { id: 2, text: "New request from Rohan K. for Resume writing", time: "Today, 8:30 AM", type: "request" },
    { id: 3, text: "Priya S. left a 5-star review", time: "Yesterday", type: "review" },
    { id: 4, text: "You earned the 'Mentor' badge", time: "2 days ago", type: "badge" },
    { id: 5, text: "Session scheduled with Aditya N.", time: "3 days ago", type: "scheduled" },
];

const TAG_COLORS: Record<string, string> = {
    Tech: C.emerald, Career: C.coral, Music: C.gold,
    Wellness: C.emeraldLight, Creative: C.coralLight, Language: "#E8A838",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: "Pending", color: C.gold, bg: `${C.gold}18` },
    accepted: { label: "Accepted", color: C.emerald, bg: `${C.emerald}18` },
    completed: { label: "Completed", color: C.coral, bg: `${C.coral}18` },
    cancelled: { label: "Cancelled", color: "#F43A3A", bg: "rgba(244,58,58,0.12)" },
};

const ACTIVITY_COLORS: Record<string, string> = {
    completed: C.emerald, request: C.gold,
    review: C.coral, badge: C.coralLight, scheduled: C.gold,
};

// ─── Navbar ───────────────────────────────────────────────────────────────────
function DashboardNav() {
    return (
        <Box sx={{
            px: { xs: 2, md: 4 }, py: 1.5,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: `1px solid ${C.border}`,
            background: "rgba(8,15,30,0.95)", backdropFilter: "blur(16px)",
            position: "sticky", top: 0, zIndex: 100,
        }}>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ width: 32, height: 32, borderRadius: "9px", background: `linear-gradient(135deg,${C.emerald},${C.coral})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Handshake sx={{ fontSize: 16, color: "#fff" }} />
                </Box>
                <Typography sx={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 18, color: C.text }}>SkillBridge</Typography>
            </Stack>

            <Stack direction="row" spacing={3} sx={{ display: { xs: "none", md: "flex" } }}>
                {[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Explore", href: "/explore" },
                    { label: "My Skills", href: "/dashboard" },
                    { label: "Messages", href: "/chat" },
                    { label: "Impact", href: "/impact" },
                ].map((l, i) => (
                    <Typography key={l.label} component={Link} href={l.href} sx={{
                        color: i === 0 ? C.emerald : C.muted, fontSize: 14, cursor: "pointer",
                        borderBottom: i === 0 ? `2px solid ${C.emerald}` : "2px solid transparent",
                        pb: 0.3, "&:hover": { color: C.text }, transition: "color 0.2s",
                        textDecoration: "none",
                    }}>{l.label}</Typography>
                ))}
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1.5}>
                <IconButton sx={{ color: C.muted, "&:hover": { color: C.text } }}>
                    <Badge badgeContent={2} sx={{ "& .MuiBadge-badge": { background: C.coral, color: "#fff" } }}>
                        <Notifications sx={{ fontSize: 20 }} />
                    </Badge>
                </IconButton>
                <IconButton sx={{ color: C.muted, "&:hover": { color: C.text } }}>
                    <Settings sx={{ fontSize: 20 }} />
                </IconButton>
                <Avatar sx={{ width: 34, height: 34, background: `linear-gradient(135deg,${C.emerald},${C.coral})`, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    {USER.initials}
                </Avatar>
            </Stack>
        </Box>
    );
}

// ─── Welcome Header ───────────────────────────────────────────────────────────
function WelcomeHeader() {
    return (
        <Box sx={{
            background: `linear-gradient(135deg,${C.emerald}0D,${C.coral}0D)`,
            border: `1px solid ${C.emerald}22`, borderRadius: "20px",
            p: { xs: 3, md: 4 }, mb: 3, position: "relative", overflow: "hidden",
        }}>
            <Box sx={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle,${C.coral}12,transparent 70%)`, pointerEvents: "none" }} />
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ width: 56, height: 56, fontSize: 20, fontWeight: 700, background: `linear-gradient(135deg,${C.emerald},${C.coral})` }}>
                        {USER.initials}
                    </Avatar>
                    <Box>
                        <Typography sx={{ color: C.muted, fontSize: 13, mb: 0.3 }}>Welcome back</Typography>
                        <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 22 }}>{USER.name}</Typography>
                        <Stack direction="row" alignItems="center" spacing={0.8} mt={0.3}>
                            <LocationOn sx={{ fontSize: 12, color: C.faint }} />
                            <Typography sx={{ fontSize: 12, color: C.faint }}>{USER.location}</Typography>
                            <Typography sx={{ fontSize: 12, color: C.faint }}>·</Typography>
                            <EmojiEvents sx={{ fontSize: 12, color: C.gold }} />
                            <Typography sx={{ fontSize: 12, color: C.gold, fontWeight: 600 }}>{USER.level}</Typography>
                        </Stack>
                    </Box>
                </Stack>
                <Stack direction="row" spacing={1.5}>
                    <Button size="small" startIcon={<Add />} sx={{ borderColor: `${C.emerald}55`, color: C.emerald, border: "1px solid", textTransform: "none", borderRadius: "10px", fontSize: 13, "&:hover": { background: `${C.emerald}10` } }}>
                        Add skill
                    </Button>
                    <Button component={Link} href="/explore" variant="contained" size="small" endIcon={<ArrowForward />} sx={{ background: `linear-gradient(135deg,${C.emerald},${C.coral})`, color: "#fff", textTransform: "none", borderRadius: "10px", fontSize: 13, boxShadow: "none" }}>
                        Explore matches
                    </Button>
                </Stack>
            </Stack>

            <Box sx={{ mt: 3 }}>
                <Stack direction="row" justifyContent="space-between" mb={0.8}>
                    <Typography sx={{ fontSize: 12, color: C.muted }}>
                        Progress to <span style={{ color: C.gold }}>{USER.nextLevel}</span>
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: C.muted }}>{USER.levelProgress}%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={USER.levelProgress} sx={{
                    height: 6, borderRadius: 3, background: `${C.border}`,
                    "& .MuiLinearProgress-bar": { background: `linear-gradient(90deg,${C.emerald},${C.coral})`, borderRadius: 3 },
                }} />
            </Box>
        </Box>
    );
}

// ─── Stats Row ────────────────────────────────────────────────────────────────
function StatsRow() {
    return (
        <Grid container spacing={2} sx={{ mb: 3 }}>
            {STATS.map((s, i) => (
                <Grid item xs={6} md={3} key={s.label}>
                    <Card sx={{
                        background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "16px", p: 2.5,
                        animation: `fadeUp 0.5s ease ${i * 0.08}s both`,
                        "@keyframes fadeUp": { from: { opacity: 0, transform: "translateY(16px)" }, to: { opacity: 1, transform: "translateY(0)" } },
                        "&:hover": { borderColor: s.color + "55", transform: "translateY(-2px)" }, transition: "all 0.25s",
                    }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                            <Box sx={{ width: 38, height: 38, borderRadius: "10px", background: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>
                                {s.icon}
                            </Box>
                            <TrendingUp sx={{ fontSize: 14, color: C.emerald }} />
                        </Stack>
                        <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 800, color: C.text, lineHeight: 1 }}>{s.value}</Typography>
                        <Typography sx={{ fontSize: 12, color: C.muted, mt: 0.4 }}>{s.label}</Typography>
                        <Typography sx={{ fontSize: 11, color: s.color, mt: 0.5, fontWeight: 600 }}>{s.sub}</Typography>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

// ─── My Skills ────────────────────────────────────────────────────────────────
function MySkills() {
    const [skills, setSkills] = useState(MY_SKILLS);
    const toggle = (id: number) => setSkills(p => p.map(s => s.id === id ? { ...s, active: !s.active } : s));

    return (
        <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3, height: "100%" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
                <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 18 }}>My skills</Typography>
                <Button size="small" startIcon={<Add />} sx={{ color: C.emerald, textTransform: "none", fontSize: 13, "&:hover": { background: `${C.emerald}10` } }}>Add new</Button>
            </Stack>
            <Stack spacing={2}>
                {skills.map(skill => (
                    <Box key={skill.id} sx={{
                        p: 2, borderRadius: "12px",
                        background: skill.active ? `${C.emerald}08` : "rgba(240,237,232,0.02)",
                        border: `1px solid ${skill.active ? C.emerald + "30" : C.border}`,
                        transition: "all 0.2s",
                    }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box sx={{ flex: 1 }}>
                                <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                                    <Typography sx={{ color: C.text, fontWeight: 600, fontSize: 14 }}>{skill.title}</Typography>
                                    <Chip label={skill.active ? "Active" : "Paused"} size="small" sx={{
                                        height: 18, fontSize: 10, fontWeight: 700,
                                        background: skill.active ? `${C.emerald}18` : "rgba(240,237,232,0.06)",
                                        color: skill.active ? C.emerald : C.muted,
                                    }} />
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                    <Chip label={skill.category} size="small" sx={{ height: 18, fontSize: 10, background: TAG_COLORS[skill.category] + "20", color: TAG_COLORS[skill.category] }} />
                                    <Stack direction="row" alignItems="center" spacing={0.3}>
                                        <Star sx={{ fontSize: 11, color: C.gold }} />
                                        <Typography sx={{ fontSize: 11, color: C.gold }}>{skill.rating}</Typography>
                                    </Stack>
                                    <Typography sx={{ fontSize: 11, color: C.faint }}>{skill.sessions} sessions</Typography>
                                </Stack>
                            </Box>
                            <Stack direction="row" spacing={0.5}>
                                <IconButton size="small" onClick={() => toggle(skill.id)} sx={{ color: skill.active ? C.emerald : C.faint, "&:hover": { background: `${C.emerald}12` } }}>
                                    <FiberManualRecord sx={{ fontSize: 14 }} />
                                </IconButton>
                                <IconButton size="small" sx={{ color: C.faint, "&:hover": { color: C.coral } }}>
                                    <Edit sx={{ fontSize: 14 }} />
                                </IconButton>
                                <IconButton size="small" sx={{ color: C.faint, "&:hover": { color: "#F43A3A" } }}>
                                    <Delete sx={{ fontSize: 14 }} />
                                </IconButton>
                            </Stack>
                        </Stack>
                    </Box>
                ))}
            </Stack>
        </Card>
    );
}

// ─── Requests ─────────────────────────────────────────────────────────────────
function Requests() {
    const [requests, setRequests] = useState(REQUESTS);
    const handle = (id: number, action: "accepted" | "cancelled") =>
        setRequests(p => p.map(r => r.id === id ? { ...r, status: action } : r));

    return (
        <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3, height: "100%" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 18 }}>Requests</Typography>
                    <Chip label={requests.filter(r => r.status === "pending").length} size="small" sx={{ height: 20, fontSize: 11, fontWeight: 700, background: `${C.gold}18`, color: C.gold }} />
                </Stack>
                <Typography sx={{ fontSize: 12, color: C.faint, cursor: "pointer", "&:hover": { color: C.emerald } }}>View all</Typography>
            </Stack>
            <Stack spacing={1.5}>
                {requests.map(req => (
                    <Box key={req.id} sx={{ p: 1.8, borderRadius: "12px", background: "rgba(240,237,232,0.02)", border: `1px solid ${C.border}`, "&:hover": { borderColor: "rgba(240,237,232,0.1)" }, transition: "border 0.2s" }}>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Avatar sx={{ width: 36, height: 36, fontSize: 12, fontWeight: 700, background: req.color, flexShrink: 0 }}>{req.initials}</Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography sx={{ color: C.text, fontWeight: 600, fontSize: 13 }}>{req.name}</Typography>
                                    <Typography sx={{ fontSize: 11, color: C.faint }}>{req.time}</Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Typography sx={{ fontSize: 12, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{req.skill}</Typography>
                                    <Typography sx={{ fontSize: 12, color: C.faint }}>·</Typography>
                                    <LocationOn sx={{ fontSize: 11, color: C.faint }} />
                                    <Typography sx={{ fontSize: 11, color: C.faint }}>{req.location}</Typography>
                                </Stack>
                            </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1.2}>
                            <Chip label={STATUS_CONFIG[req.status].label} size="small" sx={{ height: 20, fontSize: 10, fontWeight: 700, background: STATUS_CONFIG[req.status].bg, color: STATUS_CONFIG[req.status].color }} />
                            {req.status === "pending" && (
                                <Stack direction="row" spacing={0.8}>
                                    <Button size="small" startIcon={<CheckCircle sx={{ fontSize: 13 }} />} onClick={() => handle(req.id, "accepted")} sx={{ color: C.emerald, textTransform: "none", fontSize: 11, py: 0.3, px: 1, borderRadius: "8px", minWidth: 0, "&:hover": { background: `${C.emerald}12` } }}>Accept</Button>
                                    <Button size="small" startIcon={<Cancel sx={{ fontSize: 13 }} />} onClick={() => handle(req.id, "cancelled")} sx={{ color: C.coral, textTransform: "none", fontSize: 11, py: 0.3, px: 1, borderRadius: "8px", minWidth: 0, "&:hover": { background: `${C.coral}12` } }}>Decline</Button>
                                </Stack>
                            )}
                        </Stack>
                    </Box>
                ))}
            </Stack>
        </Card>
    );
}

// ─── Recommended ──────────────────────────────────────────────────────────────
function RecommendedMatches() {
    return (
        <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Psychology sx={{ fontSize: 18, color: C.coral }} />
                    <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 18 }}>AI recommended for you</Typography>
                </Stack>
                <Chip label="Near you" size="small" sx={{ background: `${C.coral}18`, color: C.coral, fontSize: 11, fontWeight: 600 }} />
            </Stack>
            <Grid container spacing={2}>
                {RECOMMENDED.map(r => (
                    <Grid item xs={12} sm={4} key={r.id}>
                        <Box sx={{
                            p: 2, borderRadius: "14px", background: "rgba(240,237,232,0.02)", border: `1px solid ${C.border}`, cursor: "pointer",
                            "&:hover": { borderColor: r.color + "55", background: r.color + "08", transform: "translateY(-2px)" }, transition: "all 0.2s",
                        }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                <Chip label={r.tag} size="small" sx={{ height: 20, fontSize: 10, fontWeight: 700, background: r.color + "20", color: r.color }} />
                                <Stack direction="row" alignItems="center" spacing={0.3}>
                                    <Star sx={{ fontSize: 11, color: C.gold }} />
                                    <Typography sx={{ fontSize: 11, color: C.gold, fontWeight: 600 }}>{r.rating}</Typography>
                                </Stack>
                            </Stack>
                            <Typography sx={{ color: C.text, fontWeight: 600, fontSize: 14, mb: 0.5 }}>{r.title}</Typography>
                            <Typography sx={{ fontSize: 12, color: C.muted }}>{r.person}</Typography>
                            <Stack direction="row" alignItems="center" spacing={0.4} mt={0.5}>
                                <LocationOn sx={{ fontSize: 11, color: r.color }} />
                                <Typography sx={{ fontSize: 11, color: r.color, fontWeight: 600 }}>{r.location}</Typography>
                            </Stack>
                            <Button fullWidth size="small" sx={{ mt: 1.5, color: r.color, border: `1px solid ${r.color}44`, textTransform: "none", fontSize: 12, borderRadius: "8px", "&:hover": { background: r.color + "15" } }}>
                                Request session
                            </Button>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Card>
    );
}

// ─── Activity ─────────────────────────────────────────────────────────────────
function RecentActivity() {
    return (
        <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
                <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 18 }}>Recent activity</Typography>
                <Typography sx={{ fontSize: 12, color: C.faint, cursor: "pointer", "&:hover": { color: C.emerald } }}>View all</Typography>
            </Stack>
            <Stack spacing={0}>
                {ACTIVITY.map((item, i) => (
                    <Box key={item.id}>
                        <Stack direction="row" alignItems="flex-start" spacing={1.5} py={1.5}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <Box sx={{ width: 10, height: 10, borderRadius: "50%", mt: 0.5, flexShrink: 0, background: ACTIVITY_COLORS[item.type], boxShadow: `0 0 8px ${ACTIVITY_COLORS[item.type]}88` }} />
                                {i < ACTIVITY.length - 1 && <Box sx={{ width: 1, flex: 1, minHeight: 24, background: C.border, mt: 0.5 }} />}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography sx={{ color: C.muted, fontSize: 13, lineHeight: 1.5 }}>{item.text}</Typography>
                                <Stack direction="row" alignItems="center" spacing={0.5} mt={0.4}>
                                    <Schedule sx={{ fontSize: 11, color: C.faint }} />
                                    <Typography sx={{ fontSize: 11, color: C.faint }}>{item.time}</Typography>
                                </Stack>
                            </Box>
                        </Stack>
                        {i < ACTIVITY.length - 1 && <Divider sx={{ borderColor: "rgba(240,237,232,0.04)" }} />}
                    </Box>
                ))}
            </Stack>
        </Card>
    );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function DashboardPage() {
    return (
        <Box sx={{ background: C.ink, minHeight: "100vh", color: C.text }}>
            <DashboardNav />
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <WelcomeHeader />
                <StatsRow />
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={5}><MySkills /></Grid>
                    <Grid item xs={12} md={7}><Requests /></Grid>
                </Grid>
                <Box sx={{ mb: 3 }}><RecommendedMatches /></Box>
                <RecentActivity />
            </Container>
        </Box>
    );
}
