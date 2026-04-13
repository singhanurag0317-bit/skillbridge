"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    Box, Button, Card, Chip, Container, Grid, Stack,
    Typography, Avatar, LinearProgress, IconButton, Divider, Tab, Tabs,
    CircularProgress,
} from "@mui/material";
import {
    LocationOn, Star, People, AccessTime,
    EmojiEvents, ArrowForward, Edit, Share, BookmarkAdd,
    CheckCircle, FormatQuote, Psychology,
    CalendarMonth, WorkspacePremium, FiberManualRecord, Logout,
} from "@mui/icons-material";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { usersApi, skillsApi, reviewsApi } from "@/lib/api";

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

// ─── Export ───────────────────────────────────────────────────────────────────
export default function ProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const { user: me, logout } = useAuth();
    const [user, setUser] = useState<any>(null);
    const [skills, setSkills] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);

    const isMe = me?.id === id;

    const fetchData = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const [uRes, sRes, rRes] = await Promise.all([
                usersApi.getProfile(id as string),
                skillsApi.getByUser(id as string),
                reviewsApi.getByUser(id as string),
            ]);
            if (uRes.success) setUser(uRes.data);
            if (sRes.success) setSkills(sRes.data);
            if (rRes.success) setReviews(rRes.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    if (loading) return (
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CircularProgress sx={{ color: C.emerald }} />
        </Box>
    );

    if (!user) return (
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography>User not found</Typography>
        </Box>
    );

    const initials = user.initials || user.name[0];

    return (
        <Box sx={{ background: "transparent", minHeight: "100vh", color: C.text }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
                
                {/* Hero */}
                <Box sx={{ position: "relative", mb: 3 }}>
                    <Box sx={{ height: { xs: 140, md: 200 }, borderRadius: "20px", background: `linear-gradient(135deg, ${C.emerald}33, ${C.coral}22)`, border: `1px solid ${C.border}` }} />
                    <Box sx={{ px: { xs: 2, md: 3 }, mt: { xs: -5, md: -7 } }}>
                        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="flex-end">
                            <Avatar sx={{ width: 108, height: 108, fontSize: 36, fontWeight: 800, background: `linear-gradient(135deg,${C.emerald},${C.coral})`, border: `4px solid ${C.ink}` }}>{initials}</Avatar>
                            <Stack direction="row" spacing={1.5} sx={{ pb: 1 }}>
                                {isMe ? (
                                    <>
                                        <Button variant="outlined" startIcon={<Edit />} sx={{ borderColor: `${C.emerald}44`, color: C.emerald, borderRadius: "10px", textTransform: "none" }}>Edit profile</Button>
                                        <Button variant="outlined" onClick={handleLogout} startIcon={<Logout />} sx={{ borderColor: `${C.coral}44`, color: C.coral, borderRadius: "10px", textTransform: "none" }}>Logout</Button>
                                    </>
                                ) : (
                                    <Button variant="contained" component={Link} href={`/chat?user=${user.id}`} sx={{ background: `linear-gradient(135deg,${C.emerald},${C.coral})`, color: "#fff", borderRadius: "10px", textTransform: "none" }}>Message</Button>
                                )}
                            </Stack>
                        </Stack>
                        <Box sx={{ mt: 2 }}>
                            <Typography sx={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: 32 }}>{user.name}</Typography>
                            <Typography sx={{ color: C.muted }}>{user.bio || "Community member"}</Typography>
                            <Stack direction="row" spacing={2} mt={1}>
                                <Stack direction="row" alignItems="center" spacing={0.5}><LocationOn sx={{ fontSize: 14, color: C.faint }} /><Typography sx={{ fontSize: 13 }}>{user.city}</Typography></Stack>
                                <Stack direction="row" alignItems="center" spacing={0.5}><CalendarMonth sx={{ fontSize: 14, color: C.faint }} /><Typography sx={{ fontSize: 13 }}>Joined {user.joined}</Typography></Stack>
                            </Stack>
                        </Box>
                    </Box>
                </Box>

                {/* Stats */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    {[
                        { label: "Impact Score", value: user.impactScore, icon: <EmojiEvents />, color: C.gold },
                        { label: "People Helped", value: user.peopleHelped, icon: <People />, color: C.emerald },
                        { label: "Skills Shared", value: user.skillsShared, icon: <Psychology />, color: C.coral },
                        { label: "Avg Rating", value: "4.9", icon: <Star />, color: C.gold },
                    ].map(s => (
                        <Grid size={{ xs: 6, md: 3 }} key={s.label}>
                            <Card sx={{ p: 2, textAlign: "center", background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "16px" }}>
                                <Box sx={{ color: s.color, mb: 1 }}>{s.icon}</Box>
                                <Typography sx={{ fontSize: 24, fontWeight: 800 }}>{s.value}</Typography>
                                <Typography sx={{ fontSize: 12, color: C.muted }}>{s.label}</Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Content Tabs */}
                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, "& .MuiTabs-indicator": { background: C.emerald } }}>
                    <Tab label={`Skills (${skills.length})`} sx={{ color: C.muted, "&.Mui-selected": { color: C.emerald } }} />
                    <Tab label={`Reviews (${reviews.length})`} sx={{ color: C.muted, "&.Mui-selected": { color: C.emerald } }} />
                </Tabs>

                {tab === 0 && (
                    <Grid container spacing={2}>
                        {skills.map(s => (
                            <Grid size={{ xs: 12, md: 6 }} key={s.id}>
                                <Card sx={{ p: 3, background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "18px" }}>
                                    <Stack direction="row" justifyContent="space-between" mb={1}>
                                        <Typography sx={{ fontWeight: 700, fontSize: 18 }}>{s.title}</Typography>
                                        <Chip label={s.category} size="small" sx={{ background: `${C.emerald}20`, color: C.emerald }} />
                                    </Stack>
                                    <Typography sx={{ color: C.muted, fontSize: 14, mb: 2 }}>{s.description}</Typography>
                                    <Button component={Link} href={`/skill/${s.id}`} variant="outlined" size="small" sx={{ borderColor: C.border, color: C.text }}>View detail</Button>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {tab === 1 && (
                    <Stack spacing={2}>
                        {reviews.map(r => (
                            <Card key={r.id} sx={{ p: 2, background: "rgba(240,237,232,0.02)", border: `1px solid ${C.border}`, borderRadius: "16px" }}>
                                <Stack direction="row" spacing={2} mb={1}>
                                    <Avatar sx={{ width: 32, height: 32 }}>{r.name[0]}</Avatar>
                                    <Box>
                                        <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{r.name}</Typography>
                                        <Typography sx={{ fontSize: 12, color: C.faint }}>{r.time}</Typography>
                                    </Box>
                                </Stack>
                                <Typography sx={{ fontSize: 14, fontStyle: "italic" }}>"{r.comment}"</Typography>
                            </Card>
                        ))}
                    </Stack>
                )}
            </Container>
            <Footer />
        </Box>
    );
}