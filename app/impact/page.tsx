"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { impactApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
    Box, Button, Card, Chip, Container, Grid, Stack,
    Typography, Avatar, LinearProgress, Divider, Tab, Tabs,
    CircularProgress,
} from "@mui/material";
import {
    EmojiEvents, People, AccessTime, Psychology,
    TrendingUp, LocationOn, Star,
    WorkspacePremium, CalendarMonth,
    FiberManualRecord, ArrowForward, Lock,
} from "@mui/icons-material";

// ─── Color tokens ─────────────────────────────────────────────────────────────
const C = {
    emerald: "#10B981",
    coral: "#F4623A",
    gold: "#F4B83A",
    ink: "#080F1E",
    text: "#F0EDE8",
    muted: "rgba(240,237,232,0.52)",
    faint: "rgba(240,237,232,0.22)",
    border: "rgba(240,237,232,0.07)",
};

// ─── Metrics Utility ──────────────────────────────────────────────────────────
const getMetricValue = (val: number) => (val >= 1000 ? (val / 1000).toFixed(1) + "k" : val);

// ─── Impact Hero ──────────────────────────────────────────────────────────────
function ImpactHero({ stats }: { stats: any }) {
    return (
        <Card sx={{
            background: `linear-gradient(135deg,${C.emerald}0F,${C.coral}0A)`,
            border: `1px solid ${C.emerald}22`, borderRadius: "24px",
            p: { xs: 3, md: 4 }, mb: 3, position: "relative", overflow: "hidden",
        }}>
            <Box sx={{ position: "absolute", top: -60, right: -40, width: 260, height: 260, borderRadius: "50%", background: `radial-gradient(circle,${C.coral}12,transparent 70%)` }} />
            <Grid container spacing={4} alignItems="center">
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 800, fontSize: 32, mb: 1 }}>Community Impact</Typography>
                    <Typography sx={{ color: C.muted, fontSize: 15, mb: 3 }}>Bridge gaps, share knowledge, grow together.</Typography>
                    
                    <Stack direction="row" alignItems="baseline" spacing={1.5} mb={1.5}>
                        <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: 72, fontWeight: 800, color: C.text, lineHeight: 1 }}>
                            {getMetricValue(stats?.totalSessions || 1200)}+
                        </Typography>
                        <Box>
                            <Typography sx={{ fontSize: 14, color: C.muted }}>Sessions hosted</Typography>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <TrendingUp sx={{ fontSize: 14, color: C.emerald }} />
                                <Typography sx={{ fontSize: 13, color: C.emerald, fontWeight: 600 }}>Growing daily</Typography>
                            </Stack>
                        </Box>
                    </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: "none", md: "flex" }, justifyContent: "center" }}>
                    <Box sx={{ position: "relative", width: 200, height: 200, borderRadius: "50%", border: `4px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: 44, fontWeight: 800, color: C.emerald }}>{stats?.hoursGiven || 450}</Typography>
                        <Typography sx={{ fontSize: 12, color: C.muted }}>Hours Given</Typography>
                    </Box>
                </Grid>
            </Grid>
        </Card>
    );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function ImpactPage() {
    const { user, loading: authLoading } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [badges, setBadges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);

    useEffect(() => {
        if (!authLoading && user) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const [sRes, lRes, bRes] = await Promise.all([
                        impactApi.getStats(user.id),
                        impactApi.getLeaderboard(user.city),
                        impactApi.getBadges(user.id),
                    ]);
                    if (sRes.success) setStats(sRes.data);
                    if (lRes.success) setLeaderboard(lRes.data);
                    if (bRes.success) setBadges(bRes.data);
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CircularProgress sx={{ color: C.emerald }} />
            </Box>
        );
    }

    const METRICS = [
        { label: "Impact Score", value: stats?.impactScore || 0, icon: <EmojiEvents />, color: C.gold },
        { label: "People Helped", value: stats?.peopleHelped || 0, icon: <People />, color: C.coral },
        { label: "Hours Shared", value: stats?.hoursContributed || 0, icon: <AccessTime />, color: C.emerald },
        { label: "Skills Shared", value: stats?.skillsShared || 0, icon: <Psychology />, color: C.emerald },
    ];

    const shownBadges = tab === 0 ? badges : tab === 1 ? badges.filter(b => b.earned) : badges.filter(b => !b.earned);

    return (
        <Box sx={{ background: "transparent", minHeight: "100vh", color: C.text }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <ImpactHero stats={stats} />
                
                {/* Personal Metrics */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    {METRICS.map(m => (
                        <Grid size={{ xs: 6, md: 3 }} key={m.label}>
                            <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "16px", p: 2.5 }}>
                                <Box sx={{ width: 36, height: 36, borderRadius: "10px", background: m.color + "18", display: "flex", alignItems: "center", justifyContent: "center", color: m.color, mb: 2 }}>
                                    {m.icon}
                                </Box>
                                <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 800, color: C.text }}>{m.value}</Typography>
                                <Typography sx={{ fontSize: 12, color: C.muted }}>{m.label}</Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Leaderboard */}
                <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3, mb: 4 }}>
                    <Stack direction="row" justifyContent="space-between" mb={3}>
                        <Typography sx={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 20 }}>Top Contributors</Typography>
                        <Chip label={user?.city || "Your City"} size="small" sx={{ background: `${C.gold}18`, color: C.gold, fontWeight: 700 }} />
                    </Stack>
                    <Stack spacing={1.5}>
                        {leaderboard.map((person) => (
                            <Box key={person.id} sx={{ p: 2, borderRadius: "14px", border: `1px solid ${C.border}`, background: person.id === user?.id ? `${C.emerald}0D` : "transparent" }}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Typography sx={{ width: 24, fontWeight: 800, color: C.faint }}>#{person.rank}</Typography>
                                    <Avatar sx={{ background: C.emerald }}>{person.initials}</Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography sx={{ fontWeight: 600 }}>{person.name}</Typography>
                                        <Typography sx={{ fontSize: 12, color: C.faint }}>{person.city}</Typography>
                                    </Box>
                                    <Typography sx={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, color: C.gold }}>{person.score} pts</Typography>
                                </Stack>
                            </Box>
                        ))}
                    </Stack>
                </Card>

                {/* Badges */}
                <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3 }}>
                    <Typography sx={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 20, mb: 2 }}>Achievements</Typography>
                    <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, "& .MuiTabs-indicator": { background: C.emerald } }}>
                        <Tab label="All" sx={{ color: C.muted, "&.Mui-selected": { color: C.emerald } }} />
                        <Tab label="Earned" sx={{ color: C.muted, "&.Mui-selected": { color: C.emerald } }} />
                        <Tab label="Locked" sx={{ color: C.muted, "&.Mui-selected": { color: C.emerald } }} />
                    </Tabs>
                    <Grid container spacing={2}>
                        {shownBadges.map((badge) => (
                            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={badge.id}>
                                <Box sx={{ p: 2, textAlign: "center", borderRadius: "16px", border: `1px solid ${badge.earned ? C.emerald + "33" : C.border}`, opacity: badge.earned ? 1 : 0.5 }}>
                                    <Typography sx={{ fontSize: 32, mb: 1 }}>{badge.earned ? badge.icon : <Lock sx={{ color: C.faint }} />}</Typography>
                                    <Typography sx={{ fontWeight: 700, fontSize: 12 }}>{badge.name}</Typography>
                                    <Typography sx={{ fontSize: 10, color: C.faint }}>{badge.desc}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Card>
            </Container>
            <Footer />
        </Box>
    );
}