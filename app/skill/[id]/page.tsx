"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
    Box, Button, Card, Chip, Container, Grid, Stack,
    Typography, Avatar, LinearProgress, Divider,
} from "@mui/material";
import {
    LocationOn, Star, People, AccessTime, CheckCircle,
    FormatQuote, ArrowForward, ArrowBack, Handshake,
    CalendarMonth, WorkspacePremium, Psychology, EmojiEvents,
    Share, BookmarkAdd, FiberManualRecord,
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
const SKILL = {
    id: 1,
    title: "Python tutoring",
    category: "Tech",
    color: C.emerald,
    rating: 4.9,
    totalReviews: 12,
    sessions: 24,
    description: "Learn Python from the ground up with a hands-on, project-based approach. Whether you're a complete beginner or looking to solidify your fundamentals, this tutoring covers everything from variables and loops to APIs and object-oriented programming.",
    whatYouLearn: [
        "Core Python syntax and data structures",
        "Functions, modules and OOP concepts",
        "Working with files, APIs and JSON",
        "Building small real-world projects",
        "Debugging and writing clean code",
    ],
    requirements: [
        "No prior programming experience needed",
        "A laptop with Python installed (help provided)",
        "Willingness to practice between sessions",
    ],
    duration: "60–90 min per session",
    format: "In-person or video call",
    language: "Hindi / English",
    tags: ["Python", "Programming", "Beginner friendly", "Project-based"],
};

const PROVIDER = {
    name: "Anurag Sharma",
    title: "Full Stack Developer",
    location: "Mathura, UP",
    initials: "AS",
    rating: 4.9,
    sessions: 24,
    impactScore: 87,
    responseTime: "Usually within 2 hours",
    level: "Community Champion",
    verified: true,
    bio: "Passionate developer with 4 years of experience. Love teaching Python — it's the language that changed my career.",
};

const REVIEWS = [
    { id: 1, name: "Priya S.", initials: "PS", color: C.emerald, rating: 5, time: "2 weeks ago", comment: "Anurag explained Python concepts so clearly! Went from zero to writing my own scripts in 3 sessions." },
    { id: 2, name: "Meera P.", initials: "MP", color: C.coral, rating: 5, time: "1 month ago", comment: "Super patient and structured. He adapts to your pace and gives real projects to work on." },
    { id: 3, name: "Rohan K.", initials: "RK", color: C.gold, rating: 5, time: "1 month ago", comment: "Best Python tutor I've found. Completely free and incredibly knowledgeable. Highly recommend!" },
    { id: 4, name: "Aditya N.", initials: "AN", color: C.coralLight, rating: 4, time: "2 months ago", comment: "Really helpful sessions. Covered OOP thoroughly. Minor scheduling hiccup but overall fantastic." },
];

const AVAILABILITY = [
    { day: "Mon", slots: ["6:00 PM", "7:30 PM"], available: true },
    { day: "Tue", slots: [], available: false },
    { day: "Wed", slots: ["6:00 PM"], available: true },
    { day: "Thu", slots: [], available: false },
    { day: "Fri", slots: ["5:00 PM", "7:00 PM"], available: true },
    { day: "Sat", slots: ["10:00 AM", "11:30 AM"], available: true },
    { day: "Sun", slots: ["10:00 AM"], available: true },
];

const SIMILAR_SKILLS = [
    { title: "JavaScript basics", person: "Sneha V.", rating: 4.8, location: "1.2 km", color: C.coral },
    { title: "Data Science intro", person: "Rahul J.", rating: 4.7, location: "2.5 km", color: C.gold },
    { title: "Web dev bootcamp", person: "Kavya R.", rating: 5.0, location: "0.9 km", color: C.emerald },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
    return (
        <Box sx={{
            px: { xs: 2, md: 6 }, py: 1.5,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: `1px solid ${C.border}`,
            background: "rgba(8,15,30,0.95)", backdropFilter: "blur(16px)",
            position: "sticky", top: 0, zIndex: 100,
        }}>
            <Stack direction="row" alignItems="center" spacing={2}>
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
                ].map(l => (
                    <Typography key={l.label} component={Link} href={l.href} sx={{ color: C.muted, fontSize: 14, cursor: "pointer", "&:hover": { color: C.emerald }, transition: "color 0.2s", textDecoration: "none" }}>{l.label}</Typography>
                ))}
            </Stack>
            <Stack direction="row" spacing={1.5}>
                <Button component={Link} href="/auth/login" variant="text" sx={{ color: C.muted, fontSize: 13, textTransform: "none" }}>Sign in</Button>
                <Button component={Link} href="/auth/login" sx={{ background: `linear-gradient(135deg,${C.emerald},${C.coral})`, color: "#fff", fontSize: 13, textTransform: "none", borderRadius: "10px", px: 2.5, boxShadow: "none" }}>Join free</Button>
            </Stack>
        </Box>
    );
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
function Breadcrumb() {
    return (
        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <Button component={Link} href="/explore" startIcon={<ArrowBack sx={{ fontSize: 14 }} />} sx={{ color: C.muted, textTransform: "none", fontSize: 13, p: 0, minWidth: 0, "&:hover": { color: C.emerald, background: "none" } }}>
                Explore
            </Button>
            <Typography sx={{ color: C.faint, fontSize: 13 }}>/</Typography>
            <Typography sx={{ color: C.faint, fontSize: 13 }}>Tech</Typography>
            <Typography sx={{ color: C.faint, fontSize: 13 }}>/</Typography>
            <Typography sx={{ color: C.emerald, fontSize: 13, fontWeight: 600 }}>Python tutoring</Typography>
        </Stack>
    );
}

// ─── Skill Hero ───────────────────────────────────────────────────────────────
function SkillHero() {
    return (
        <Card sx={{
            background: `linear-gradient(135deg,${C.emerald}0D,${C.coral}08)`,
            border: `1px solid ${C.emerald}22`, borderRadius: "24px",
            p: { xs: 3, md: 4 }, mb: 3, position: "relative", overflow: "hidden",
        }}>
            <Box sx={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle,${C.coral}14,transparent 70%)`, pointerEvents: "none" }} />
            <Box sx={{ position: "absolute", bottom: -40, left: "30%", width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle,${C.emerald}10,transparent 70%)`, pointerEvents: "none" }} />

            <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                    <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                        <Box sx={{ width: 52, height: 52, borderRadius: "14px", background: `${C.emerald}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Psychology sx={{ fontSize: 26, color: C.emerald }} />
                        </Box>
                        <Box>
                            <Chip label={SKILL.category} size="small" sx={{ background: `${C.emerald}20`, color: C.emerald, fontWeight: 700, fontSize: 11, mb: 0.5 }} />
                            <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 800, fontSize: { xs: 24, md: 32 }, lineHeight: 1.2 }}>
                                {SKILL.title}
                            </Typography>
                        </Box>
                    </Stack>

                    {/* Tags */}
                    <Stack direction="row" flexWrap="wrap" gap={1} mb={2.5}>
                        {SKILL.tags.map(tag => (
                            <Chip key={tag} label={tag} size="small" sx={{ background: "rgba(240,237,232,0.06)", color: C.muted, fontSize: 12 }} />
                        ))}
                    </Stack>

                    {/* Meta row */}
                    <Stack direction="row" flexWrap="wrap" gap={2.5}>
                        <Stack direction="row" alignItems="center" spacing={0.6}>
                            <Star sx={{ fontSize: 16, color: C.gold }} />
                            <Typography sx={{ color: C.gold, fontWeight: 700, fontSize: 15 }}>{SKILL.rating}</Typography>
                            <Typography sx={{ color: C.faint, fontSize: 13 }}>({SKILL.totalReviews} reviews)</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={0.6}>
                            <People sx={{ fontSize: 15, color: C.muted }} />
                            <Typography sx={{ color: C.muted, fontSize: 13 }}>{SKILL.sessions} sessions done</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={0.6}>
                            <AccessTime sx={{ fontSize: 15, color: C.muted }} />
                            <Typography sx={{ color: C.muted, fontSize: 13 }}>{SKILL.duration}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={0.6}>
                            <LocationOn sx={{ fontSize: 15, color: C.muted }} />
                            <Typography sx={{ color: C.muted, fontSize: 13 }}>{PROVIDER.location}</Typography>
                        </Stack>
                    </Stack>
                </Grid>

                {/* Right: quick info */}
                <Grid item xs={12} md={4}>
                    <Stack spacing={1.5}>
                        {[
                            { icon: <WorkspacePremium sx={{ fontSize: 16, color: C.gold }} />, label: "Completely free" },
                            { icon: <CalendarMonth sx={{ fontSize: 16, color: C.emerald }} />, label: SKILL.format },
                            { icon: <FiberManualRecord sx={{ fontSize: 12, color: C.emerald }} />, label: SKILL.language },
                        ].map(item => (
                            <Stack key={item.label} direction="row" alignItems="center" spacing={1}>
                                {item.icon}
                                <Typography sx={{ fontSize: 14, color: C.muted }}>{item.label}</Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Grid>
            </Grid>
        </Card>
    );
}

// ─── Main Content ─────────────────────────────────────────────────────────────
function SkillContent() {
    return (
        <Stack spacing={3}>
            {/* About */}
            <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3 }}>
                <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 20, mb: 2 }}>About this skill</Typography>
                <Typography sx={{ color: C.muted, fontSize: 15, lineHeight: 1.85 }}>{SKILL.description}</Typography>
            </Card>

            {/* What you'll learn */}
            <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3 }}>
                <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 20, mb: 2.5 }}>What you'll learn</Typography>
                <Stack spacing={1.5}>
                    {SKILL.whatYouLearn.map((item, i) => (
                        <Stack key={i} direction="row" alignItems="flex-start" spacing={1.5}>
                            <CheckCircle sx={{ fontSize: 18, color: C.emerald, mt: 0.2, flexShrink: 0 }} />
                            <Typography sx={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>{item}</Typography>
                        </Stack>
                    ))}
                </Stack>
            </Card>

            {/* Requirements */}
            <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3 }}>
                <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 20, mb: 2.5 }}>Requirements</Typography>
                <Stack spacing={1.5}>
                    {SKILL.requirements.map((item, i) => (
                        <Stack key={i} direction="row" alignItems="flex-start" spacing={1.5}>
                            <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: C.coral, mt: 0.8, flexShrink: 0 }} />
                            <Typography sx={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>{item}</Typography>
                        </Stack>
                    ))}
                </Stack>
            </Card>

            {/* Availability */}
            <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={2.5}>
                    <CalendarMonth sx={{ fontSize: 20, color: C.emerald }} />
                    <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 20 }}>Availability</Typography>
                </Stack>
                <Grid container spacing={1.5}>
                    {AVAILABILITY.map(day => (
                        <Grid item xs={12} sm={6} md={4} key={day.day}>
                            <Box sx={{
                                p: 2, borderRadius: "12px",
                                background: day.available ? `${C.emerald}08` : "rgba(240,237,232,0.02)",
                                border: `1px solid ${day.available ? C.emerald + "30" : C.border}`,
                            }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={day.available ? 1 : 0}>
                                    <Typography sx={{ color: day.available ? C.text : C.faint, fontWeight: 600, fontSize: 14 }}>{day.day}</Typography>
                                    {day.available
                                        ? <Chip label="Available" size="small" sx={{ height: 18, fontSize: 10, background: `${C.emerald}18`, color: C.emerald, fontWeight: 600 }} />
                                        : <Chip label="Busy" size="small" sx={{ height: 18, fontSize: 10, background: "rgba(240,237,232,0.06)", color: C.faint }} />
                                    }
                                </Stack>
                                {day.slots.length > 0 && (
                                    <Stack direction="row" flexWrap="wrap" gap={0.8} mt={0.8}>
                                        {day.slots.map(slot => (
                                            <Chip key={slot} label={slot} size="small" sx={{ height: 22, fontSize: 11, background: `${C.emerald}15`, color: C.emeraldLight, cursor: "pointer", "&:hover": { background: `${C.emerald}30` } }} />
                                        ))}
                                    </Stack>
                                )}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Card>

            {/* Reviews */}
            <ReviewsSection />
        </Stack>
    );
}

// ─── Reviews Section ──────────────────────────────────────────────────────────
function ReviewsSection() {
    const avg = (REVIEWS.reduce((a, r) => a + r.rating, 0) / REVIEWS.length).toFixed(1);
    return (
        <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3 }}>
            <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 20, mb: 2.5 }}>
                Reviews ({REVIEWS.length})
            </Typography>

            {/* Rating summary */}
            <Card sx={{ background: `linear-gradient(135deg,${C.emerald}0D,${C.coral}0D)`, border: `1px solid ${C.emerald}22`, borderRadius: "16px", p: 2.5, mb: 3 }}>
                <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" spacing={3}>
                    <Box sx={{ textAlign: "center", minWidth: 80 }}>
                        <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: 48, fontWeight: 800, color: C.text, lineHeight: 1 }}>{avg}</Typography>
                        <Stack direction="row" justifyContent="center" spacing={0.3} mt={0.5}>
                            {[1, 2, 3, 4, 5].map(s => <Star key={s} sx={{ fontSize: 14, color: C.gold }} />)}
                        </Stack>
                        <Typography sx={{ fontSize: 12, color: C.muted, mt: 0.5 }}>{REVIEWS.length} reviews</Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ borderColor: C.border, display: { xs: "none", sm: "block" } }} />
                    <Box sx={{ flex: 1, width: "100%" }}>
                        {[5, 4, 3, 2, 1].map(stars => {
                            const count = REVIEWS.filter(r => r.rating === stars).length;
                            const pct = Math.round((count / REVIEWS.length) * 100);
                            return (
                                <Stack key={stars} direction="row" alignItems="center" spacing={1.5} mb={0.8}>
                                    <Stack direction="row" alignItems="center" spacing={0.3} sx={{ minWidth: 40 }}>
                                        <Typography sx={{ fontSize: 12, color: C.muted }}>{stars}</Typography>
                                        <Star sx={{ fontSize: 11, color: C.gold }} />
                                    </Stack>
                                    <LinearProgress variant="determinate" value={pct} sx={{
                                        flex: 1, height: 6, borderRadius: 3, background: C.border,
                                        "& .MuiLinearProgress-bar": { background: `linear-gradient(90deg,${C.gold},${C.coral})`, borderRadius: 3 },
                                    }} />
                                    <Typography sx={{ fontSize: 12, color: C.faint, minWidth: 30 }}>{pct}%</Typography>
                                </Stack>
                            );
                        })}
                    </Box>
                </Stack>
            </Card>

            {/* Review cards */}
            <Stack spacing={2}>
                {REVIEWS.map((r, i) => (
                    <Box key={r.id} sx={{
                        p: 2.5, borderRadius: "16px",
                        background: "rgba(240,237,232,0.02)",
                        border: `1px solid ${C.border}`,
                        animation: `fadeUp 0.45s ease ${i * 0.08}s both`,
                        "@keyframes fadeUp": { from: { opacity: 0, transform: "translateY(12px)" }, to: { opacity: 1, transform: "translateY(0)" } },
                        "&:hover": { borderColor: r.color + "33" }, transition: "border 0.2s",
                    }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                <Avatar sx={{ width: 38, height: 38, background: r.color, fontSize: 13, fontWeight: 700 }}>{r.initials}</Avatar>
                                <Box>
                                    <Typography sx={{ color: C.text, fontWeight: 600, fontSize: 14 }}>{r.name}</Typography>
                                    <Typography sx={{ fontSize: 12, color: C.faint }}>{r.time}</Typography>
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={0.3}>
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} sx={{ fontSize: 13, color: s <= r.rating ? C.gold : C.faint }} />)}
                            </Stack>
                        </Stack>
                        <FormatQuote sx={{ fontSize: 18, color: r.color, opacity: 0.6 }} />
                        <Typography sx={{ color: "rgba(240,237,232,0.68)", fontSize: 14, lineHeight: 1.8, fontStyle: "italic" }}>
                            &ldquo;{r.comment}&rdquo;
                        </Typography>
                    </Box>
                ))}
            </Stack>
        </Card>
    );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar() {
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const availableSlots = AVAILABILITY.filter(d => d.available).flatMap(d => d.slots.map(s => `${d.day} ${s}`));

    return (
        <Stack spacing={3} sx={{ position: { md: "sticky" }, top: { md: 88 } }}>

            {/* Request card */}
            <Card sx={{
                background: `linear-gradient(135deg,${C.emerald}0D,${C.coral}08)`,
                border: `1px solid ${C.emerald}33`, borderRadius: "20px", p: 3,
                overflow: "hidden", position: "relative",
            }}>
                <Box sx={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle,${C.coral}14,transparent 70%)`, pointerEvents: "none" }} />

                <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                    <WorkspacePremium sx={{ fontSize: 18, color: C.gold }} />
                    <Typography sx={{ color: C.gold, fontWeight: 700, fontSize: 15 }}>Completely free</Typography>
                </Stack>
                <Typography sx={{ color: C.faint, fontSize: 12, mb: 3 }}>No money exchanged — pure community skill sharing</Typography>

                {/* Slot picker */}
                <Typography sx={{ color: C.muted, fontSize: 13, fontWeight: 600, mb: 1.5 }}>Pick a time slot</Typography>
                <Stack spacing={0.8} mb={2.5} sx={{ maxHeight: 180, overflowY: "auto", pr: 0.5 }}>
                    {availableSlots.map(slot => (
                        <Box key={slot} onClick={() => setSelectedSlot(slot === selectedSlot ? null : slot)} sx={{
                            p: 1.2, borderRadius: "10px", cursor: "pointer",
                            background: selectedSlot === slot ? `${C.emerald}18` : "rgba(240,237,232,0.03)",
                            border: `1px solid ${selectedSlot === slot ? C.emerald + "55" : C.border}`,
                            transition: "all 0.2s",
                            "&:hover": { borderColor: C.emerald + "44", background: `${C.emerald}10` },
                        }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography sx={{ fontSize: 13, color: selectedSlot === slot ? C.emerald : C.muted, fontWeight: selectedSlot === slot ? 600 : 400 }}>
                                    {slot}
                                </Typography>
                                {selectedSlot === slot && <CheckCircle sx={{ fontSize: 15, color: C.emerald }} />}
                            </Stack>
                        </Box>
                    ))}
                </Stack>

                <Button fullWidth variant="contained" endIcon={<ArrowForward />} sx={{
                    background: `linear-gradient(135deg,${C.emerald},${C.coral})`, color: "#fff",
                    textTransform: "none", borderRadius: "12px", py: 1.5, fontSize: 15, fontWeight: 700,
                    boxShadow: "none", mb: 1.5,
                    "&:hover": { boxShadow: `0 6px 24px ${C.emerald}44`, transform: "translateY(-1px)" },
                    transition: "all 0.2s",
                }}>
                    {selectedSlot ? `Request — ${selectedSlot}` : "Request a session"}
                </Button>
                <Button component={Link} href="/chat" fullWidth variant="outlined" sx={{
                    borderColor: C.border, color: C.muted, textTransform: "none",
                    borderRadius: "12px", py: 1.2, fontSize: 14,
                    "&:hover": { borderColor: C.emerald, color: C.emerald },
                }}>
                    Message provider
                </Button>

                <Divider sx={{ borderColor: C.border, my: 2 }} />
                <Stack direction="row" justifyContent="space-around">
                    <Stack alignItems="center" spacing={0.3}>
                        <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 20 }}>{SKILL.rating}</Typography>
                        <Stack direction="row" spacing={0.2}>{[1, 2, 3, 4, 5].map(s => <Star key={s} sx={{ fontSize: 11, color: C.gold }} />)}</Stack>
                        <Typography sx={{ fontSize: 11, color: C.faint }}>Rating</Typography>
                    </Stack>
                    <Divider orientation="vertical" flexItem sx={{ borderColor: C.border }} />
                    <Stack alignItems="center" spacing={0.3}>
                        <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 20 }}>{SKILL.sessions}</Typography>
                        <Typography sx={{ fontSize: 11, color: C.faint }}>Sessions</Typography>
                    </Stack>
                    <Divider orientation="vertical" flexItem sx={{ borderColor: C.border }} />
                    <Stack alignItems="center" spacing={0.3}>
                        <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 20 }}>{SKILL.totalReviews}</Typography>
                        <Typography sx={{ fontSize: 11, color: C.faint }}>Reviews</Typography>
                    </Stack>
                </Stack>
            </Card>

            {/* Provider card */}
            <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3 }}>
                <Typography sx={{ color: C.faint, fontSize: 12, mb: 2, textTransform: "uppercase", letterSpacing: "0.08em" }}>Skill provider</Typography>
                <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                    <Avatar sx={{ width: 48, height: 48, background: `linear-gradient(135deg,${C.emerald},${C.coral})`, fontSize: 16, fontWeight: 700 }}>
                        {PROVIDER.initials}
                    </Avatar>
                    <Box>
                        <Stack direction="row" alignItems="center" spacing={0.8}>
                            <Typography sx={{ color: C.text, fontWeight: 700, fontSize: 15 }}>{PROVIDER.name}</Typography>
                            {PROVIDER.verified && <CheckCircle sx={{ fontSize: 15, color: C.emerald }} />}
                        </Stack>
                        <Typography sx={{ color: C.muted, fontSize: 12 }}>{PROVIDER.title}</Typography>
                    </Box>
                </Stack>
                <Typography sx={{ color: C.muted, fontSize: 13, lineHeight: 1.7, mb: 2 }}>{PROVIDER.bio}</Typography>

                <Stack spacing={1} mb={2}>
                    {[
                        { icon: <Star sx={{ fontSize: 14, color: C.gold }} />, label: `${PROVIDER.rating} average rating` },
                        { icon: <People sx={{ fontSize: 14, color: C.emerald }} />, label: `${PROVIDER.sessions} sessions done` },
                        { icon: <EmojiEvents sx={{ fontSize: 14, color: C.coral }} />, label: PROVIDER.level },
                    ].map(item => (
                        <Stack key={item.label} direction="row" alignItems="center" spacing={1}>
                            {item.icon}
                            <Typography sx={{ fontSize: 13, color: C.muted }}>{item.label}</Typography>
                        </Stack>
                    ))}
                </Stack>

                <Stack direction="row" alignItems="center" spacing={0.8} mb={2}>
                    <FiberManualRecord sx={{ fontSize: 10, color: C.emerald }} />
                    <Typography sx={{ fontSize: 12, color: C.emerald, fontWeight: 600 }}>{PROVIDER.responseTime}</Typography>
                </Stack>

                <Button component={Link} href="/profile/1" fullWidth variant="outlined" endIcon={<ArrowForward sx={{ fontSize: 14 }} />} sx={{
                    borderColor: `${C.emerald}33`, color: C.emerald, textTransform: "none",
                    borderRadius: "10px", fontSize: 13,
                    "&:hover": { borderColor: C.emerald, background: `${C.emerald}08` },
                }}>
                    View full profile
                </Button>
            </Card>

            {/* Share / Save */}
            <Stack direction="row" spacing={1.5}>
                <Button fullWidth startIcon={<Share sx={{ fontSize: 16 }} />} sx={{ borderColor: C.border, color: C.muted, border: "1px solid", textTransform: "none", borderRadius: "10px", fontSize: 13, "&:hover": { borderColor: C.muted } }}>
                    Share
                </Button>
                <Button fullWidth startIcon={<BookmarkAdd sx={{ fontSize: 16 }} />} sx={{ borderColor: C.border, color: C.muted, border: "1px solid", textTransform: "none", borderRadius: "10px", fontSize: 13, "&:hover": { borderColor: C.coral, color: C.coral } }}>
                    Save
                </Button>
            </Stack>
        </Stack>
    );
}

// ─── Similar Skills ───────────────────────────────────────────────────────────
function SimilarSkills() {
    return (
        <Box sx={{ mt: 5 }}>
            <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 22, mb: 3 }}>
                Similar skills nearby
            </Typography>
            <Grid container spacing={2.5}>
                {SIMILAR_SKILLS.map((s, i) => (
                    <Grid item xs={12} sm={4} key={s.title}>
                        <Card sx={{
                            background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "18px", p: 2.5, cursor: "pointer",
                            animation: `fadeUp 0.45s ease ${i * 0.1}s both`,
                            "@keyframes fadeUp": { from: { opacity: 0, transform: "translateY(14px)" }, to: { opacity: 1, transform: "translateY(0)" } },
                            "&:hover": { borderColor: s.color + "55", transform: "translateY(-3px)" }, transition: "all 0.25s",
                        }}>
                            <Stack direction="row" justifyContent="space-between" mb={1}>
                                <Chip label="Tech" size="small" sx={{ background: s.color + "20", color: s.color, fontWeight: 700, fontSize: 10, height: 20 }} />
                                <Stack direction="row" alignItems="center" spacing={0.3}>
                                    <Star sx={{ fontSize: 12, color: C.gold }} />
                                    <Typography sx={{ fontSize: 12, color: C.gold, fontWeight: 600 }}>{s.rating}</Typography>
                                </Stack>
                            </Stack>
                            <Typography sx={{ color: C.text, fontWeight: 700, fontSize: 15, mb: 0.5 }}>{s.title}</Typography>
                            <Typography sx={{ color: C.muted, fontSize: 13, mb: 0.8 }}>{s.person}</Typography>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <LocationOn sx={{ fontSize: 12, color: s.color }} />
                                <Typography sx={{ fontSize: 12, color: s.color, fontWeight: 600 }}>{s.location}</Typography>
                            </Stack>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function SkillDetailPage() {
    return (
        <Box sx={{ background: C.ink, minHeight: "100vh", color: C.text }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Breadcrumb />
                <SkillHero />
                <Grid container spacing={4}>
                    <Grid item xs={12} md={7}>
                        <SkillContent />
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Sidebar />
                    </Grid>
                </Grid>
                <SimilarSkills />
            </Container>
        </Box>
    );
}