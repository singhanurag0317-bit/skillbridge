"use client";
import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
    Box, Button, Card, Chip, Container, Grid, Stack,
    Typography, Avatar, LinearProgress, Divider, Tab, Tabs,
} from "@mui/material";
import {
    EmojiEvents, People, AccessTime, Psychology,
    TrendingUp, TrendingDown, LocationOn, Star,
    WorkspacePremium, Handshake, CalendarMonth,
    FiberManualRecord, ArrowForward, Lock,
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
const COMMUNITY = {
    totalSessions: "12,450+",
    activeCities: 42,
    livesImpacted: "8,200+",
    hoursGiven: "45,000+",
};

const METRICS = [
    { label: "Sessions done", value: "24", prev: "19", icon: <CalendarMonth sx={{ fontSize: 20 }} />, color: C.emerald, trend: "up" },
    { label: "People helped", value: "18", prev: "14", icon: <People sx={{ fontSize: 20 }} />, color: C.coral, trend: "up" },
    { label: "Hours contributed", value: "38", prev: "30", icon: <AccessTime sx={{ fontSize: 20 }} />, color: C.gold, trend: "up" },
    { label: "Skills shared", value: "3", prev: "3", icon: <Psychology sx={{ fontSize: 20 }} />, color: C.coralLight, trend: "same" },
];

const MONTHLY_DATA = [
    { month: "Jul", sessions: 2, hours: 3 },
    { month: "Aug", sessions: 3, hours: 5 },
    { month: "Sep", sessions: 4, hours: 6 },
    { month: "Oct", sessions: 5, hours: 8 },
    { month: "Nov", sessions: 6, hours: 9 },
    { month: "Dec", sessions: 4, hours: 7 },
    { month: "Jan", sessions: 7, hours: 11 },
    { month: "Feb", sessions: 5, hours: 9 },
    { month: "Mar", sessions: 8, hours: 13 },
    { month: "Apr", sessions: 6, hours: 10 },
    { month: "May", sessions: 9, hours: 14 },
    { month: "Jun", sessions: 7, hours: 12 },
];

const SKILLS_BREAKDOWN = [
    { skill: "Python tutoring", sessions: 12, hours: 18, rating: 4.9, color: C.emerald, pct: 50 },
    { skill: "Resume writing", sessions: 7, hours: 11, rating: 4.8, color: C.coral, pct: 29 },
    { skill: "Guitar lessons", sessions: 5, hours: 9, rating: 5.0, color: C.gold, pct: 21 },
];

const LEADERBOARD = [
    { rank: 1, name: "Sneha V.", initials: "SV", city: "Delhi", score: 142, sessions: 38, color: C.gold },
    { rank: 2, name: "Kavya R.", initials: "KR", city: "Lucknow", score: 128, sessions: 34, color: C.emerald },
    { rank: 3, name: "Rahul J.", initials: "RJ", city: "Noida", score: 115, sessions: 31, color: C.coral },
    { rank: 4, name: "Fatima K.", initials: "FK", city: "Agra", score: 102, sessions: 27, color: C.coralLight },
    { rank: 5, name: "Arjun M.", initials: "AM", city: "Mathura", score: 96, sessions: 25, color: C.emeraldLight },
    { rank: 12, name: "Anurag S.", initials: "AS", city: "Mathura", score: 87, sessions: 24, color: C.emerald, isMe: true },
];

const BADGES = [
    { id: 1, name: "First session", desc: "Completed your first skill session", color: C.emerald, earned: true, icon: "🎯" },
    { id: 2, name: "Python pro", desc: "10+ Python tutoring sessions", color: C.emerald, earned: true, icon: "🐍" },
    { id: 3, name: "Resume master", desc: "Helped 5+ people with their resumes", color: C.coral, earned: true, icon: "📄" },
    { id: 4, name: "5-star teacher", desc: "Maintained 5.0 rating for 5 sessions", color: C.gold, earned: true, icon: "⭐" },
    { id: 5, name: "Community voice", desc: "Left 10 helpful reviews", color: C.coralLight, earned: true, icon: "💬" },
    { id: 6, name: "City legend", desc: "Reach top 5 in your city", color: C.gold, earned: false, icon: "🏙️" },
    { id: 7, name: "100 hours", desc: "Contribute 100 hours to the community", color: C.emerald, earned: false, icon: "⏱️" },
    { id: 8, name: "Mentor", desc: "Help 50 unique people", color: C.coral, earned: false, icon: "🎓" },
];

const IMPACT_LOCATIONS = [
    { city: "Mathura", sessions: 14, color: C.emerald },
    { city: "Agra", sessions: 5, color: C.coral },
    { city: "Delhi", sessions: 3, color: C.gold },
    { city: "Noida", sessions: 2, color: C.coralLight },
];



// ─── Impact Hero ──────────────────────────────────────────────────────────────
function ImpactHero() {
    return (
        <Card sx={{
            background: `linear-gradient(135deg,${C.emerald}0F,${C.coral}0A)`,
            border: `1px solid ${C.emerald}22`, borderRadius: "24px",
            p: { xs: 3, md: 4 }, mb: 3, position: "relative", overflow: "hidden",
        }}>
            <Box sx={{ position: "absolute", top: -60, right: -40, width: 260, height: 260, borderRadius: "50%", background: `radial-gradient(circle,${C.coral}12,transparent 70%)`, pointerEvents: "none" }} />
            <Box sx={{ position: "absolute", bottom: -40, left: "20%", width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle,${C.emerald}0E,transparent 70%)`, pointerEvents: "none" }} />

            <Grid container spacing={4} alignItems="center">
                <Grid size={{ xs: 12, md: 6 }}>
                    <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                        <Box>
                            <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 800, fontSize: { xs: 24, md: 32 } }}>Global Community Impact</Typography>
                            <Stack direction="row" alignItems="center" spacing={0.8} mt={1}>
                                <Typography sx={{ fontSize: 13, color: C.muted }}>Together, we are bridging skill gaps</Typography>
                            </Stack>
                        </Box>
                    </Stack>

                    <Stack direction="row" alignItems="baseline" spacing={1.5} mb={1.5}>
                        <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: { xs: 56, md: 72 }, fontWeight: 800, color: C.text, lineHeight: 1 }}>{COMMUNITY.totalSessions}</Typography>
                        <Box>
                            <Typography sx={{ fontSize: 14, color: C.muted }}>Sessions hosted</Typography>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <TrendingUp sx={{ fontSize: 14, color: C.emerald }} />
                                <Typography sx={{ fontSize: 13, color: C.emerald, fontWeight: 600 }}>+450 this week</Typography>
                            </Stack>
                        </Box>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                        <WorkspacePremium sx={{ fontSize: 15, color: C.coral }} />
                        <Typography sx={{ fontSize: 13, color: C.muted }}>
                            Join a movement of <strong style={{ color: C.coral }}>{COMMUNITY.livesImpacted}</strong> members across <strong style={{ color: C.gold }}>{COMMUNITY.activeCities}</strong> cities
                        </Typography>
                    </Stack>
                </Grid>

                {/* Right: score ring visual */}
                <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: "none", md: "flex" }, justifyContent: "center" }}>
                    <Box sx={{ position: "relative", width: 220, height: 220 }}>
                        {/* Outer ring */}
                        <Box sx={{
                            position: "absolute", inset: 0, borderRadius: "50%",
                            border: `3px solid ${C.border}`,
                        }} />
                        {/* Progress arc (simulated with conic gradient) */}
                        <Box sx={{
                            position: "absolute", inset: 0, borderRadius: "50%",
                            background: `conic-gradient(${C.emerald} 0% 100%, rgba(240,237,232,0.05) 100% 100%)`,
                        }} />
                        {/* Inner circle */}
                        <Box sx={{
                            position: "absolute", inset: 12, borderRadius: "50%",
                            background: C.ink,
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        }}>
                            <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: 44, fontWeight: 800, color: C.text, lineHeight: 1 }}>{COMMUNITY.hoursGiven}</Typography>
                            <Typography sx={{ fontSize: 12, color: C.muted }}>Hours Taught</Typography>
                            <Stack direction="row" alignItems="center" spacing={0.4} mt={0.5}>
                                <FiberManualRecord sx={{ fontSize: 8, color: C.emerald }} />
                                <Typography sx={{ fontSize: 11, color: C.emerald, fontWeight: 600 }}>All Time</Typography>
                            </Stack>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Card>
    );
}

// ─── Metrics Row ──────────────────────────────────────────────────────────────
function MetricsRow() {
    return (
        <Grid container spacing={2} sx={{ mb: 3 }}>
            {METRICS.map((m, i) => (
                <Grid size={{ xs: 6, md: 3 }} key={m.label}>
                    <Card sx={{
                        background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`,
                        borderRadius: "16px", p: 2.5,
                        animation: `fadeUp 0.5s ease ${i * 0.08}s both`,
                        "@keyframes fadeUp": { from: { opacity: 0, transform: "translateY(14px)" }, to: { opacity: 1, transform: "translateY(0)" } },
                        "&:hover": { borderColor: m.color + "55", transform: "translateY(-2px)" }, transition: "all 0.25s",
                    }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                            <Box sx={{ width: 38, height: 38, borderRadius: "10px", background: m.color + "18", display: "flex", alignItems: "center", justifyContent: "center", color: m.color }}>
                                {m.icon}
                            </Box>
                            {m.trend === "up"
                                ? <Stack direction="row" alignItems="center" spacing={0.3}><TrendingUp sx={{ fontSize: 13, color: C.emerald }} /><Typography sx={{ fontSize: 11, color: C.emerald, fontWeight: 600 }}>+{parseInt(m.value) - parseInt(m.prev)}</Typography></Stack>
                                : <Typography sx={{ fontSize: 11, color: C.faint }}>—</Typography>
                            }
                        </Stack>
                        <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 800, color: C.text, lineHeight: 1 }}>{m.value}k</Typography>
                        <Typography sx={{ fontSize: 12, color: C.muted, mt: 0.5 }}>{m.label}</Typography>
                        <Typography sx={{ fontSize: 11, color: C.faint, mt: 0.3 }}>vs {m.prev}k last period</Typography>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

// ─── Chart + Breakdown ────────────────────────────────────────────────────────
function ChartsSection() {
    const [chartMetric, setChartMetric] = useState<"sessions" | "hours">("sessions");
    const maxVal = Math.max(...MONTHLY_DATA.map(m => m[chartMetric]));

    return (
        <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Bar chart */}
            <Grid size={{ xs: 12, md: 7 }}>
                <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3, height: "100%" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 18 }}>Activity over time</Typography>
                        <Stack direction="row" spacing={1}>
                            {(["sessions", "hours"] as const).map(m => (
                                <Chip key={m} label={m} size="small" onClick={() => setChartMetric(m)} sx={{
                                    cursor: "pointer", fontWeight: 600, fontSize: 11,
                                    background: chartMetric === m ? `${C.emerald}22` : "rgba(240,237,232,0.05)",
                                    color: chartMetric === m ? C.emerald : C.muted,
                                    border: `1px solid ${chartMetric === m ? C.emerald + "44" : C.border}`,
                                    "&:hover": { background: `${C.emerald}18` },
                                }} />
                            ))}
                        </Stack>
                    </Stack>

                    {/* Bars */}
                    <Stack direction="row" alignItems="flex-end" spacing={1} sx={{ height: 160, mb: 1 }}>
                        {MONTHLY_DATA.map((m, i) => {
                            const isLast = i === MONTHLY_DATA.length - 1;
                            const pct = (m[chartMetric] / maxVal) * 100;
                            return (
                                <Box key={m.month} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <Typography sx={{ fontSize: 10, color: isLast ? C.emerald : C.faint, fontWeight: isLast ? 700 : 400, mb: 0.5 }}>{m[chartMetric]}</Typography>
                                    <Box sx={{
                                        width: "100%", borderRadius: "5px 5px 0 0",
                                        height: `${pct}%`, minHeight: 4,
                                        background: isLast
                                            ? `linear-gradient(180deg,${C.coral},${C.gold})`
                                            : `linear-gradient(180deg,${C.emerald}cc,${C.emerald}44)`,
                                        animation: `growBar 0.6s ease ${i * 0.05}s both`,
                                        "@keyframes growBar": { from: { height: 0, opacity: 0 }, to: {} },
                                        "&:hover": { filter: "brightness(1.2)" }, cursor: "pointer", transition: "filter 0.15s",
                                    }} />
                                </Box>
                            );
                        })}
                    </Stack>
                    <Divider sx={{ borderColor: C.border, mb: 1 }} />
                    <Stack direction="row" spacing={1}>
                        {MONTHLY_DATA.map(m => (
                            <Box key={m.month} sx={{ flex: 1, textAlign: "center" }}>
                                <Typography sx={{ fontSize: 10, color: C.faint }}>{m.month}</Typography>
                            </Box>
                        ))}
                    </Stack>
                </Card>
            </Grid>

            {/* Skills breakdown */}
            <Grid size={{ xs: 12, md: 5 }}>
                <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3, height: "100%" }}>
                    <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 18, mb: 3 }}>Skills breakdown</Typography>
                    <Stack spacing={2.5}>
                        {SKILLS_BREAKDOWN.map((s, i) => (
                            <Box key={s.skill} sx={{ animation: `fadeUp 0.5s ease ${i * 0.1}s both`, "@keyframes fadeUp": { from: { opacity: 0, transform: "translateY(10px)" }, to: { opacity: 1, transform: "translateY(0)" } } }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.8}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Box sx={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                                        <Typography sx={{ color: C.text, fontWeight: 600, fontSize: 14 }}>{s.skill}</Typography>
                                    </Stack>
                                    <Stack direction="row" alignItems="center" spacing={0.4}>
                                        <Star sx={{ fontSize: 12, color: C.gold }} />
                                        <Typography sx={{ fontSize: 12, color: C.gold, fontWeight: 600 }}>{s.rating}</Typography>
                                    </Stack>
                                </Stack>
                                <LinearProgress variant="determinate" value={s.pct} sx={{
                                    height: 8, borderRadius: 4, background: C.border, mb: 0.8,
                                    "& .MuiLinearProgress-bar": { background: `linear-gradient(90deg,${s.color},${s.color}88)`, borderRadius: 4 },
                                }} />
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography sx={{ fontSize: 11, color: C.faint }}>{s.sessions} sessions · {s.hours}h</Typography>
                                    <Typography sx={{ fontSize: 11, color: s.color, fontWeight: 600 }}>{s.pct}%</Typography>
                                </Stack>
                            </Box>
                        ))}
                    </Stack>

                    {/* Donut legend */}
                    <Divider sx={{ borderColor: C.border, my: 2.5 }} />
                    <Typography sx={{ color: C.faint, fontSize: 12, mb: 1.5 }}>Total contribution</Typography>
                    <Grid container spacing={1.5}>
                        {[
                            { label: "Total sessions", value: "24" },
                            { label: "Total hours", value: "38" },
                            { label: "Avg rating", value: "4.9" },
                        ].map(stat => (
                            <Grid size={{ xs: 4 }} key={stat.label}>
                                <Box sx={{ textAlign: "center", p: 1, borderRadius: "10px", background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}` }}>
                                    <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: C.text }}>{stat.value}</Typography>
                                    <Typography sx={{ fontSize: 10, color: C.faint }}>{stat.label}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    );
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────
function Leaderboard() {
    return (
        <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3, mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <EmojiEvents sx={{ fontSize: 22, color: C.gold }} />
                    <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 20 }}>Community leaderboard</Typography>
                </Stack>
                <Chip label="Mathura · All time" size="small" sx={{ background: `${C.gold}18`, color: C.gold, fontWeight: 600, fontSize: 11 }} />
            </Stack>

            <Stack spacing={1.5}>
                {LEADERBOARD.map((person, i) => {
                    const rankColors: Record<number, string> = { 1: C.gold, 2: "#C0C0C0", 3: "#CD7F32" };
                    const isMe = person.isMe;
                    return (
                        <Box key={person.rank}>
                            {/* Gap indicator before "me" */}
                            {isMe && i > 0 && (
                                <Stack direction="row" alignItems="center" spacing={1} py={1}>
                                    <Box sx={{ flex: 1, height: 1, background: C.border }} />
                                    <Typography sx={{ fontSize: 11, color: C.faint }}>· · ·</Typography>
                                    <Box sx={{ flex: 1, height: 1, background: C.border }} />
                                </Stack>
                            )}
                            <Box sx={{
                                p: 2, borderRadius: "14px",
                                background: isMe ? `${C.emerald}0D` : "rgba(240,237,232,0.02)",
                                border: `1px solid ${isMe ? C.emerald + "33" : C.border}`,
                                animation: `fadeUp 0.45s ease ${i * 0.07}s both`,
                                "@keyframes fadeUp": { from: { opacity: 0, transform: "translateY(10px)" }, to: { opacity: 1, transform: "translateY(0)" } },
                                "&:hover": { borderColor: isMe ? C.emerald + "55" : "rgba(240,237,232,0.12)" },
                                transition: "border 0.2s",
                            }}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    {/* Rank */}
                                    <Box sx={{ width: 32, textAlign: "center" }}>
                                        {person.rank <= 3
                                            ? <EmojiEvents sx={{ fontSize: 22, color: rankColors[person.rank] }} />
                                            : <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.faint }}>#{person.rank}</Typography>
                                        }
                                    </Box>

                                    {/* Avatar */}
                                    <Avatar sx={{ width: 40, height: 40, background: person.color, fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{person.initials}</Avatar>

                                    {/* Info */}
                                    <Box sx={{ flex: 1 }}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Typography sx={{ color: C.text, fontWeight: isMe ? 700 : 600, fontSize: 14 }}>{person.name}</Typography>
                                            {isMe && <Chip label="You" size="small" sx={{ height: 18, fontSize: 10, fontWeight: 700, background: `${C.emerald}20`, color: C.emerald }} />}
                                        </Stack>
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <LocationOn sx={{ fontSize: 11, color: C.faint }} />
                                            <Typography sx={{ fontSize: 12, color: C.faint }}>{person.city}</Typography>
                                            <Typography sx={{ fontSize: 11, color: C.faint }}>· {person.sessions} sessions</Typography>
                                        </Stack>
                                    </Box>

                                    {/* Score */}
                                    <Box sx={{ textAlign: "right" }}>
                                        <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 800, color: person.rank <= 3 ? rankColors[person.rank] : isMe ? C.emerald : C.text }}>{person.score}</Typography>
                                        <Typography sx={{ fontSize: 10, color: C.faint }}>points</Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        </Box>
                    );
                })}
            </Stack>
        </Card>
    );
}

// ─── Badges ───────────────────────────────────────────────────────────────────
function BadgesSection() {
    const [tab, setTab] = useState(0);
    const earned = BADGES.filter(b => b.earned);
    const locked = BADGES.filter(b => !b.earned);
    const shown = tab === 0 ? BADGES : tab === 1 ? earned : locked;

    return (
        <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3, mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <WorkspacePremium sx={{ fontSize: 22, color: C.coral }} />
                    <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 20 }}>Badges & achievements</Typography>
                </Stack>
                <Chip label={`${earned.length}/${BADGES.length} earned`} size="small" sx={{ background: `${C.coral}18`, color: C.coral, fontWeight: 600, fontSize: 11 }} />
            </Stack>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{
                mb: 2.5,
                "& .MuiTab-root": { color: C.muted, textTransform: "none", fontSize: 13, fontWeight: 600, minWidth: 0, mr: 2, px: 0 },
                "& .Mui-selected": { color: C.emerald },
                "& .MuiTabs-indicator": { background: C.emerald, height: 2, borderRadius: 1 },
            }}>
                <Tab label="All" />
                <Tab label={`Earned (${earned.length})`} />
                <Tab label={`Locked (${locked.length})`} />
            </Tabs>

            <Grid container spacing={2}>
                {shown.map((badge, i) => (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }} key={badge.id}>
                        <Box sx={{
                            p: 2.5, borderRadius: "16px", textAlign: "center",
                            background: badge.earned ? badge.color + "0D" : "rgba(240,237,232,0.02)",
                            border: `1px solid ${badge.earned ? badge.color + "33" : C.border}`,
                            opacity: badge.earned ? 1 : 0.55,
                            animation: `fadeUp 0.45s ease ${i * 0.06}s both`,
                            "@keyframes fadeUp": { from: { opacity: 0, transform: "translateY(10px)" }, to: { opacity: badge.earned ? 1 : 0.55, transform: "translateY(0)" } },
                            "&:hover": { borderColor: badge.earned ? badge.color + "55" : "rgba(240,237,232,0.1)", transform: badge.earned ? "translateY(-2px)" : "none" },
                            transition: "all 0.2s", cursor: badge.earned ? "default" : "not-allowed",
                        }}>
                            <Typography sx={{ fontSize: 28, mb: 1, filter: badge.earned ? "none" : "grayscale(1)" }}>
                                {badge.earned ? badge.icon : <Lock sx={{ fontSize: 24, color: C.faint }} />}
                            </Typography>
                            <Typography sx={{ color: badge.earned ? C.text : C.faint, fontWeight: 700, fontSize: 13, mb: 0.5 }}>{badge.name}</Typography>
                            <Typography sx={{ color: C.faint, fontSize: 11, lineHeight: 1.5 }}>{badge.desc}</Typography>
                            {badge.earned && (
                                <Chip label="Earned" size="small" sx={{ mt: 1, height: 18, fontSize: 9, background: badge.color + "20", color: badge.color, fontWeight: 700 }} />
                            )}
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Card>
    );
}

// ─── Impact Map ───────────────────────────────────────────────────────────────
function ImpactMap() {
    const total = IMPACT_LOCATIONS.reduce((a, l) => a + l.sessions, 0);
    return (
        <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <LocationOn sx={{ fontSize: 22, color: C.emerald }} />
                    <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 20 }}>Where you've made impact</Typography>
                </Stack>
                <Chip label={`${total} sessions · 4 cities`} size="small" sx={{ background: `${C.emerald}18`, color: C.emerald, fontWeight: 600, fontSize: 11 }} />
            </Stack>

            <Grid container spacing={2.5}>
                {IMPACT_LOCATIONS.map((loc, i) => {
                    const pct = Math.round((loc.sessions / total) * 100);
                    return (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={loc.city}>
                            <Box sx={{
                                p: 2.5, borderRadius: "16px",
                                background: loc.color + "0A",
                                border: `1px solid ${loc.color}22`,
                                animation: `fadeUp 0.5s ease ${i * 0.1}s both`,
                                "@keyframes fadeUp": { from: { opacity: 0, transform: "translateY(12px)" }, to: { opacity: 1, transform: "translateY(0)" } },
                                "&:hover": { borderColor: loc.color + "44", transform: "translateY(-2px)" }, transition: "all 0.2s",
                            }}>
                                <Stack direction="row" alignItems="center" spacing={0.8} mb={1.5}>
                                    <LocationOn sx={{ fontSize: 16, color: loc.color }} />
                                    <Typography sx={{ color: C.text, fontWeight: 700, fontSize: 15 }}>{loc.city}</Typography>
                                </Stack>
                                <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 800, color: C.text, lineHeight: 1, mb: 0.5 }}>{loc.sessions}</Typography>
                                <Typography sx={{ fontSize: 12, color: C.muted, mb: 1.5 }}>sessions done</Typography>
                                <LinearProgress variant="determinate" value={pct} sx={{
                                    height: 5, borderRadius: 3, background: C.border,
                                    "& .MuiLinearProgress-bar": { background: `linear-gradient(90deg,${loc.color},${loc.color}88)`, borderRadius: 3 },
                                }} />
                                <Typography sx={{ fontSize: 11, color: loc.color, mt: 0.6, fontWeight: 600 }}>{pct}% of total</Typography>
                            </Box>
                        </Grid>
                    );
                })}
            </Grid>

            <Box sx={{ mt: 3, p: 2.5, borderRadius: "14px", background: `linear-gradient(135deg,${C.emerald}0A,${C.coral}08)`, border: `1px solid ${C.emerald}18` }}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
                    <Box>
                        <Typography sx={{ color: C.text, fontWeight: 600, fontSize: 15, mb: 0.3 }}>Ready to expand your impact?</Typography>
                        <Typography sx={{ color: C.muted, fontSize: 13 }}>People in 12 nearby cities are looking for your skills.</Typography>
                    </Box>
                    <Button component={Link} href="/explore" variant="contained" endIcon={<ArrowForward sx={{ fontSize: 15 }} />} sx={{
                        background: `linear-gradient(135deg,${C.emerald},${C.coral})`, color: "#fff",
                        textTransform: "none", borderRadius: "10px", fontSize: 13,
                        boxShadow: "none", flexShrink: 0,
                        "&:hover": { boxShadow: `0 4px 20px ${C.emerald}44` },
                    }}>
                        Explore more cities
                    </Button>
                </Stack>
            </Box>
        </Card>
    );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function ImpactPage() {
    return (
        <Box sx={{ background: "transparent", minHeight: "100vh", color: C.text }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <ImpactHero />
                <MetricsRow />
                <ChartsSection />
                <Leaderboard />
                <BadgesSection />
                <ImpactMap />
            </Container>
            <Footer />
        </Box>
    );
}