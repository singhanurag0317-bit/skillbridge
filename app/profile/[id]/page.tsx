"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
    Box, Button, Card, Chip, Container, Grid, Stack,
    Typography, Avatar, LinearProgress, IconButton, Divider, Tab, Tabs,
} from "@mui/material";
import {
    LocationOn, Star, TrendingUp, People, AccessTime,
    EmojiEvents, ArrowForward, Edit, Share, BookmarkAdd,
    CheckCircle, FormatQuote, Psychology, Handshake,
    CalendarMonth, WorkspacePremium, FiberManualRecord, Logout,
} from "@mui/icons-material";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ─── Color tokens ─────────────────────────────────────────────────────────────
const C = {
    emerald: "#10B981",
    emeraldLight: "#34D399",
    coral: "#F4623A",
    coralLight: "#F87B58",
    gold: "#F4B83A",
    ink: "#080F1E",
    card: "#0E1829",
    text: "#F0EDE8",
    muted: "rgba(240,237,232,0.52)",
    faint: "rgba(240,237,232,0.22)",
    border: "rgba(240,237,232,0.07)",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const PROFILE = {
    name: "Anurag Sharma",
    title: "Full Stack Developer & Python Mentor",
    location: "Mathura, Uttar Pradesh",
    initials: "AS",
    bio: "Passionate developer with 4 years of experience in web and backend development. I love teaching what I know — from Python basics to building full-stack apps. When I'm not coding, I'm learning Hindustani music and hiking local trails.",
    joined: "Member since Jan 2025",
    level: "Community Champion",
    nextLevel: "City Legend",
    levelProgress: 67,
    verified: true,
    responseTime: "Usually within 2 hours",
    availability: ["Weekday evenings", "Weekend mornings"],
    languages: ["Hindi", "English"],
};

const STATS = [
    { label: "Impact score", value: "87", icon: <EmojiEvents sx={{ fontSize: 18 }} />, color: C.gold },
    { label: "Sessions done", value: "24", icon: <People sx={{ fontSize: 18 }} />, color: C.emerald },
    { label: "Avg rating", value: "4.9", icon: <Star sx={{ fontSize: 18 }} />, color: C.coral },
    { label: "Hours shared", value: "38", icon: <AccessTime sx={{ fontSize: 18 }} />, color: C.coralLight },
];

const SKILLS = [
    { id: 1, title: "Python tutoring", category: "Tech", rating: 4.9, sessions: 12, desc: "Beginner to intermediate Python. Data structures, OOP, APIs and more.", color: C.emerald },
    { id: 2, title: "Resume writing", category: "Career", rating: 4.8, sessions: 7, desc: "ATS-friendly resumes, LinkedIn optimization, and interview prep.", color: C.coral },
    { id: 3, title: "Guitar lessons", category: "Music", rating: 5.0, sessions: 5, desc: "Acoustic guitar for beginners. Chords, strumming patterns, and basic theory.", color: C.gold },
];

const REVIEWS = [
    { id: 1, name: "Priya S.", initials: "PS", color: C.emerald, rating: 5, time: "2 weeks ago", comment: "Anurag explained Python concepts so clearly! Went from zero to writing my own scripts in 3 sessions. Highly recommend." },
    { id: 2, name: "Meera P.", initials: "MP", color: C.coral, rating: 5, time: "1 month ago", comment: "The resume he helped me craft got me 3 interview calls in a week. Genuinely life-changing help, completely free." },
    { id: 3, name: "Rohan K.", initials: "RK", color: C.gold, rating: 5, time: "1 month ago", comment: "Super patient and knowledgeable. Learned more in 2 guitar sessions than months of YouTube tutorials." },
    { id: 4, name: "Aditya N.", initials: "AN", color: C.coralLight, rating: 4, time: "2 months ago", comment: "Great teacher with a structured approach. Would have given 5 stars but had to reschedule once. Still fantastic." },
];

const ACTIVITY_MONTHS = [
    { month: "Jan", sessions: 2 },
    { month: "Feb", sessions: 4 },
    { month: "Mar", sessions: 3 },
    { month: "Apr", sessions: 6 },
    { month: "May", sessions: 5 },
    { month: "Jun", sessions: 4 },
];

const TAG_COLORS: Record<string, string> = {
    Tech: C.emerald, Career: C.coral, Music: C.gold,
    Wellness: C.emeraldLight, Creative: C.coralLight, Language: "#E8A838",
};


// ─── Cover + Avatar ───────────────────────────────────────────────────────────
function ProfileHero() {
    return (
        <Box sx={{ position: "relative", mb: 3 }}>
            {/* Cover banner */}
            <Box sx={{
                height: { xs: 140, md: 200 }, borderRadius: "20px", overflow: "hidden",
                background: `linear-gradient(135deg, ${C.emerald}33 0%, ${C.coral}22 50%, ${C.gold}18 100%)`,
                border: `1px solid ${C.border}`, position: "relative",
            }}>
                {/* Decorative dots */}
                {[...Array(6)].map((_, i) => (
                    <Box key={i} sx={{
                        position: "absolute",
                        top: `${20 + i * 12}%`, left: `${10 + i * 15}%`,
                        width: 6, height: 6, borderRadius: "50%",
                        background: [C.emerald, C.coral, C.gold, C.emeraldLight, C.coralLight, C.emerald][i],
                        opacity: 0.4,
                    }} />
                ))}
                <Box sx={{ position: "absolute", top: "20%", right: "5%", width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle,${C.coral}22,transparent 70%)` }} />
                <Box sx={{ position: "absolute", bottom: "10%", left: "8%", width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle,${C.emerald}22,transparent 70%)` }} />
            </Box>

            {/* Avatar + actions row */}
            <Box sx={{ px: { xs: 2, md: 3 }, position: "relative" }}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "flex-end" }}>
                    {/* Avatar */}
                    <Box sx={{ mt: { xs: -5, md: -7 }, mb: { xs: 1, md: 0 } }}>
                        <Avatar sx={{
                            width: { xs: 80, md: 108 }, height: { xs: 80, md: 108 },
                            fontSize: { xs: 28, md: 36 }, fontWeight: 800,
                            background: `linear-gradient(135deg,${C.emerald},${C.coral})`,
                            border: `4px solid ${C.ink}`,
                            boxShadow: `0 0 0 2px ${C.emerald}44`,
                        }}>
                            {PROFILE.initials}
                        </Avatar>
                    </Box>

                    {/* Action buttons */}
                    <Stack direction="row" spacing={1.5} sx={{ pt: { xs: 0, sm: 1 } }}>
                        <IconButton sx={{ color: C.muted, border: `1px solid ${C.border}`, borderRadius: "10px", "&:hover": { color: C.text, borderColor: C.emerald } }}>
                            <Share sx={{ fontSize: 18 }} />
                        </IconButton>
                        <IconButton sx={{ color: C.muted, border: `1px solid ${C.border}`, borderRadius: "10px", "&:hover": { color: C.coral, borderColor: C.coral } }}>
                            <BookmarkAdd sx={{ fontSize: 18 }} />
                        </IconButton>
                        <Button variant="outlined" startIcon={<Edit sx={{ fontSize: 15 }} />} sx={{
                            borderColor: `${C.emerald}44`, color: C.emerald,
                            textTransform: "none", borderRadius: "10px", fontSize: 13,
                            "&:hover": { borderColor: C.emerald, background: `${C.emerald}10` },
                        }}>
                            Edit profile
                        </Button>
                        <Button variant="contained" endIcon={<ArrowForward sx={{ fontSize: 15 }} />} sx={{
                            background: `linear-gradient(135deg,${C.emerald},${C.coral})`,
                            color: "#fff", textTransform: "none", borderRadius: "10px",
                            fontSize: 13, boxShadow: "none",
                            "&:hover": { boxShadow: `0 4px 20px ${C.emerald}44` },
                        }}>
                            Request session
                        </Button>
                        <Button variant="outlined" startIcon={<Logout sx={{ fontSize: 15 }} />} sx={{
                            borderColor: `${C.coral}44`, color: C.coral,
                            textTransform: "none", borderRadius: "10px", fontSize: 13,
                            "&:hover": { borderColor: C.coral, background: `${C.coral}10` },
                        }}>
                            Logout
                        </Button>
                    </Stack>
                </Stack>

                {/* Name + meta */}
                <Box sx={{ mt: 1.5 }}>
                    <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                        <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 800, fontSize: { xs: 22, md: 28 } }}>
                            {PROFILE.name}
                        </Typography>
                        {PROFILE.verified && (
                            <CheckCircle sx={{ fontSize: 20, color: C.emerald }} />
                        )}
                        <Chip label={PROFILE.level} size="small" sx={{ background: `${C.gold}18`, color: C.gold, fontWeight: 700, fontSize: 11 }} />
                    </Stack>
                    <Typography sx={{ color: C.muted, fontSize: 15, mt: 0.5 }}>{PROFILE.title}</Typography>
                    <Stack direction="row" alignItems="center" spacing={2} mt={1} flexWrap="wrap">
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <LocationOn sx={{ fontSize: 13, color: C.faint }} />
                            <Typography sx={{ fontSize: 13, color: C.faint }}>{PROFILE.location}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <CalendarMonth sx={{ fontSize: 13, color: C.faint }} />
                            <Typography sx={{ fontSize: 13, color: C.faint }}>{PROFILE.joined}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <FiberManualRecord sx={{ fontSize: 10, color: C.emerald }} />
                            <Typography sx={{ fontSize: 13, color: C.emerald, fontWeight: 600 }}>{PROFILE.responseTime}</Typography>
                        </Stack>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}

// ─── Stats Row ────────────────────────────────────────────────────────────────
function StatsRow() {
    return (
        <Grid container spacing={2} sx={{ mb: 3 }}>
            {STATS.map((s, i) => (
                <Grid size={{ xs: 6, md: 3 }} key={s.label}>
                    <Card sx={{
                        background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`,
                        borderRadius: "16px", p: 2.5, textAlign: "center",
                        animation: `fadeUp 0.5s ease ${i * 0.08}s both`,
                        "@keyframes fadeUp": { from: { opacity: 0, transform: "translateY(16px)" }, to: { opacity: 1, transform: "translateY(0)" } },
                        "&:hover": { borderColor: s.color + "55", transform: "translateY(-2px)" },
                        transition: "all 0.25s",
                    }}>
                        <Box sx={{ color: s.color, mb: 1 }}>{s.icon}</Box>
                        <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 800, color: C.text, lineHeight: 1 }}>{s.value}</Typography>
                        <Typography sx={{ fontSize: 12, color: C.muted, mt: 0.5 }}>{s.label}</Typography>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

// ─── About Card ───────────────────────────────────────────────────────────────
function AboutCard() {
    return (
        <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3, mb: 3 }}>
            <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 18, mb: 2 }}>About</Typography>
            <Typography sx={{ color: C.muted, fontSize: 15, lineHeight: 1.8, mb: 3 }}>{PROFILE.bio}</Typography>

            <Divider sx={{ borderColor: C.border, mb: 2.5 }} />

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography sx={{ color: C.faint, fontSize: 12, mb: 1, textTransform: "uppercase", letterSpacing: "0.08em" }}>Availability</Typography>
                    <Stack spacing={0.8}>
                        {PROFILE.availability.map(a => (
                            <Stack key={a} direction="row" alignItems="center" spacing={0.8}>
                                <CheckCircle sx={{ fontSize: 14, color: C.emerald }} />
                                <Typography sx={{ fontSize: 13, color: C.muted }}>{a}</Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography sx={{ color: C.faint, fontSize: 12, mb: 1, textTransform: "uppercase", letterSpacing: "0.08em" }}>Languages</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        {PROFILE.languages.map(l => (
                            <Chip key={l} label={l} size="small" sx={{ background: `${C.emerald}18`, color: C.emerald, fontWeight: 600, fontSize: 12 }} />
                        ))}
                    </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography sx={{ color: C.faint, fontSize: 12, mb: 1, textTransform: "uppercase", letterSpacing: "0.08em" }}>Level progress</Typography>
                    <Typography sx={{ fontSize: 13, color: C.muted, mb: 1 }}>
                        Towards <span style={{ color: C.gold }}>{PROFILE.nextLevel}</span>
                    </Typography>
                    <LinearProgress variant="determinate" value={PROFILE.levelProgress} sx={{
                        height: 6, borderRadius: 3, background: C.border,
                        "& .MuiLinearProgress-bar": { background: `linear-gradient(90deg,${C.emerald},${C.coral})`, borderRadius: 3 },
                    }} />
                    <Typography sx={{ fontSize: 11, color: C.faint, mt: 0.5 }}>{PROFILE.levelProgress}% complete</Typography>
                </Grid>
            </Grid>
        </Card>
    );
}

// ─── Tabs Section ─────────────────────────────────────────────────────────────
function TabsSection() {
    const [tab, setTab] = useState(0);

    return (
        <Box>
            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                sx={{
                    mb: 3,
                    "& .MuiTab-root": { color: C.muted, textTransform: "none", fontSize: 14, fontWeight: 600, minWidth: 0, mr: 1, px: 0, pb: 1 },
                    "& .Mui-selected": { color: C.emerald },
                    "& .MuiTabs-indicator": { background: C.emerald, height: 2, borderRadius: 1 },
                }}
            >
                <Tab label={`Skills offered (${SKILLS.length})`} />
                <Tab label={`Reviews (${REVIEWS.length})`} />
                <Tab label="Activity" />
            </Tabs>

            {tab === 0 && <SkillsTab />}
            {tab === 1 && <ReviewsTab />}
            {tab === 2 && <ActivityTab />}
        </Box>
    );
}

// ─── Skills Tab ───────────────────────────────────────────────────────────────
function SkillsTab() {
    return (
        <Stack spacing={2.5}>
            {SKILLS.map((skill, i) => (
                <Card key={skill.id} sx={{
                    background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`,
                    borderRadius: "18px", p: 3,
                    animation: `fadeUp 0.45s ease ${i * 0.1}s both`,
                    "@keyframes fadeUp": { from: { opacity: 0, transform: "translateY(14px)" }, to: { opacity: 1, transform: "translateY(0)" } },
                    "&:hover": { borderColor: skill.color + "44", transform: "translateY(-2px)" },
                    transition: "all 0.25s",
                }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
                                <Box sx={{ width: 42, height: 42, borderRadius: "12px", background: skill.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Psychology sx={{ fontSize: 20, color: skill.color }} />
                                </Box>
                                <Box>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Typography sx={{ color: C.text, fontWeight: 700, fontSize: 16 }}>{skill.title}</Typography>
                                        <Chip label={skill.category} size="small" sx={{ height: 20, fontSize: 10, fontWeight: 700, background: skill.color + "20", color: skill.color }} />
                                    </Stack>
                                    <Stack direction="row" alignItems="center" spacing={1} mt={0.3}>
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} sx={{ fontSize: 13, color: s <= Math.round(skill.rating) ? C.gold : C.faint }} />
                                        ))}
                                        <Typography sx={{ fontSize: 12, color: C.gold, fontWeight: 600 }}>{skill.rating}</Typography>
                                        <Typography sx={{ fontSize: 12, color: C.faint }}>· {skill.sessions} sessions</Typography>
                                    </Stack>
                                </Box>
                            </Stack>
                            <Typography sx={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>{skill.desc}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Stack direction={{ xs: "row", md: "column" }} spacing={1.5} alignItems={{ xs: "center", md: "flex-end" }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <WorkspacePremium sx={{ fontSize: 14, color: skill.color }} />
                                    <Typography sx={{ fontSize: 12, color: C.muted }}>Free · Community exchange</Typography>
                                </Stack>
                                <Button variant="outlined" endIcon={<ArrowForward sx={{ fontSize: 14 }} />} sx={{
                                    borderColor: skill.color + "44", color: skill.color,
                                    textTransform: "none", borderRadius: "10px", fontSize: 13,
                                    "&:hover": { borderColor: skill.color, background: skill.color + "10" },
                                }}>
                                    Request this skill
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Card>
            ))}
        </Stack>
    );
}

// ─── Reviews Tab ──────────────────────────────────────────────────────────────
function ReviewsTab() {
    const avg = (REVIEWS.reduce((a, r) => a + r.rating, 0) / REVIEWS.length).toFixed(1);
    return (
        <Box>
            {/* Summary */}
            <Card sx={{ background: `linear-gradient(135deg,${C.emerald}0D,${C.coral}0D)`, border: `1px solid ${C.emerald}22`, borderRadius: "18px", p: 3, mb: 3 }}>
                <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" spacing={3}>
                    <Box sx={{ textAlign: "center" }}>
                        <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: 52, fontWeight: 800, color: C.text, lineHeight: 1 }}>{avg}</Typography>
                        <Stack direction="row" justifyContent="center" spacing={0.3} mt={0.5}>
                            {[1, 2, 3, 4, 5].map(s => <Star key={s} sx={{ fontSize: 16, color: C.gold }} />)}
                        </Stack>
                        <Typography sx={{ fontSize: 12, color: C.muted, mt: 0.5 }}>{REVIEWS.length} reviews</Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ borderColor: C.border, display: { xs: "none", sm: "block" } }} />
                    <Box sx={{ flex: 1 }}>
                        {[5, 4, 3].map(stars => {
                            const count = REVIEWS.filter(r => r.rating === stars).length;
                            const pct = Math.round((count / REVIEWS.length) * 100);
                            return (
                                <Stack key={stars} direction="row" alignItems="center" spacing={1.5} mb={0.8}>
                                    <Typography sx={{ fontSize: 12, color: C.muted, minWidth: 12 }}>{stars}</Typography>
                                    <Star sx={{ fontSize: 12, color: C.gold }} />
                                    <LinearProgress variant="determinate" value={pct} sx={{
                                        flex: 1, height: 6, borderRadius: 3, background: C.border,
                                        "& .MuiLinearProgress-bar": { background: `linear-gradient(90deg,${C.gold},${C.coral})`, borderRadius: 3 },
                                    }} />
                                    <Typography sx={{ fontSize: 12, color: C.muted, minWidth: 28 }}>{pct}%</Typography>
                                </Stack>
                            );
                        })}
                    </Box>
                </Stack>
            </Card>

            {/* Review cards */}
            <Stack spacing={2}>
                {REVIEWS.map((r, i) => (
                    <Card key={r.id} sx={{
                        background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`,
                        borderRadius: "18px", p: 3,
                        animation: `fadeUp 0.45s ease ${i * 0.08}s both`,
                        "@keyframes fadeUp": { from: { opacity: 0, transform: "translateY(14px)" }, to: { opacity: 1, transform: "translateY(0)" } },
                        "&:hover": { borderColor: r.color + "33" }, transition: "border 0.25s",
                    }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                <Avatar sx={{ width: 40, height: 40, background: r.color, fontSize: 14, fontWeight: 700 }}>{r.initials}</Avatar>
                                <Box>
                                    <Typography sx={{ color: C.text, fontWeight: 600, fontSize: 14 }}>{r.name}</Typography>
                                    <Typography sx={{ fontSize: 12, color: C.faint }}>{r.time}</Typography>
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={0.3}>
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} sx={{ fontSize: 13, color: s <= r.rating ? C.gold : C.faint }} />)}
                            </Stack>
                        </Stack>
                        <FormatQuote sx={{ fontSize: 20, color: r.color, opacity: 0.6, mb: 0.5 }} />
                        <Typography sx={{ color: "rgba(240,237,232,0.7)", fontSize: 14, lineHeight: 1.8, fontStyle: "italic" }}>
                            &ldquo;{r.comment}&rdquo;
                        </Typography>
                    </Card>
                ))}
            </Stack>
        </Box>
    );
}

// ─── Activity Tab ─────────────────────────────────────────────────────────────
function ActivityTab() {
    const maxSessions = Math.max(...ACTIVITY_MONTHS.map(m => m.sessions));
    return (
        <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 18 }}>Sessions over time</Typography>
                <Chip label="Last 6 months" size="small" sx={{ background: `${C.emerald}18`, color: C.emerald, fontSize: 11, fontWeight: 600 }} />
            </Stack>

            {/* Bar chart */}
            <Stack direction="row" alignItems="flex-end" spacing={1.5} sx={{ height: 140, mb: 1 }}>
                {ACTIVITY_MONTHS.map((m, i) => (
                    <Box key={m.month} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Typography sx={{ fontSize: 11, color: C.emerald, fontWeight: 600, mb: 0.5 }}>{m.sessions}</Typography>
                        <Box sx={{
                            width: "100%", borderRadius: "6px 6px 0 0",
                            height: `${(m.sessions / maxSessions) * 100}px`,
                            background: i === ACTIVITY_MONTHS.length - 1
                                ? `linear-gradient(180deg,${C.coral},${C.gold})`
                                : `linear-gradient(180deg,${C.emerald},${C.emeraldLight}33)`,
                            transition: "height 0.5s ease",
                            animation: `growBar 0.6s ease ${i * 0.08}s both`,
                            "@keyframes growBar": { from: { height: 0, opacity: 0 }, to: {} },
                        }} />
                    </Box>
                ))}
            </Stack>
            <Divider sx={{ borderColor: C.border, mb: 1 }} />
            <Stack direction="row" spacing={1.5}>
                {ACTIVITY_MONTHS.map(m => (
                    <Box key={m.month} sx={{ flex: 1, textAlign: "center" }}>
                        <Typography sx={{ fontSize: 11, color: C.faint }}>{m.month}</Typography>
                    </Box>
                ))}
            </Stack>

            {/* Summary row */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
                {[
                    { label: "Total sessions", value: ACTIVITY_MONTHS.reduce((a, m) => a + m.sessions, 0) },
                    { label: "Best month", value: `${ACTIVITY_MONTHS.reduce((a, m) => m.sessions > a.sessions ? m : a).month} (${Math.max(...ACTIVITY_MONTHS.map(m => m.sessions))})` },
                    { label: "Avg per month", value: (ACTIVITY_MONTHS.reduce((a, m) => a + m.sessions, 0) / ACTIVITY_MONTHS.length).toFixed(1) },
                ].map(stat => (
                    <Grid size={{ xs: 4 }} key={stat.label}>
                        <Box sx={{ textAlign: "center", p: 1.5, borderRadius: "12px", background: "rgba(240,237,232,0.02)", border: `1px solid ${C.border}` }}>
                            <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: C.text }}>{stat.value}</Typography>
                            <Typography sx={{ fontSize: 11, color: C.faint }}>{stat.label}</Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Card>
    );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function ProfilePage() {
    return (
        <Box sx={{ background: "transparent", minHeight: "100vh", color: C.text }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
                <ProfileHero />
                <StatsRow />
                <AboutCard />
                <TabsSection />
            </Container>
            <Footer />
        </Box>
    );
}