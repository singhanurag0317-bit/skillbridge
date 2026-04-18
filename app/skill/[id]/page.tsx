"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import BookingConfirmDialog from "@/components/ui/BookingConfirmDialog";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { skillsApi, reviewsApi } from "@/lib/api";
import {
    Box, Button, Card, Chip, Container, Grid, Stack,
    Typography, Avatar, LinearProgress, Divider, CircularProgress,
} from "@mui/material";
import {
    LocationOn, Star, People, AccessTime, CheckCircle,
    FormatQuote, ArrowBack, CalendarMonth, WorkspacePremium, 
    Psychology, EmojiEvents, Share, BookmarkAdd, FiberManualRecord,
    ArrowForward,
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

// ─── Export ───────────────────────────────────────────────────────────────────
export default function SkillDetailPage() {
    const { id } = useParams();
    const [skill, setSkill] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [similar, setSimilar] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [bookingOpen, setBookingOpen] = useState(false);

    const fetchData = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const [sRes, rRes, simRes] = await Promise.all([
                skillsApi.getById(id as string),
                reviewsApi.getBySkill(id as string),
                skillsApi.getSimilar(id as string),
            ]);
            if (sRes.success) setSkill(sRes.data);
            if (rRes.success) setReviews(rRes.data);
            if (simRes.success) setSimilar(simRes.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) return (
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CircularProgress sx={{ color: C.emerald }} />
        </Box>
    );

    if (!skill) return (
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography>Skill not found</Typography>
        </Box>
    );

    const provider = skill.user || {};
    const initials = provider.initials || 
        (provider.name ? provider.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "?");
    const color = skill.color || C.emerald;

    return (
        <Box sx={{ background: "transparent", minHeight: "100vh", color: C.text }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Breadcrumb */}
                <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                    <Button component={Link} href="/explore" startIcon={<ArrowBack sx={{ fontSize: 14 }} />} sx={{ color: C.muted, textTransform: "none", fontSize: 13, p: 0, minWidth: 0 }}>
                        Explore
                    </Button>
                    <Typography sx={{ color: C.faint, fontSize: 13 }}>/</Typography>
                    <Typography sx={{ color: C.faint, fontSize: 13 }}>{skill.category}</Typography>
                </Stack>

                {/* Hero */}
                <Card sx={{ background: `linear-gradient(135deg,${color}0D,${C.coral}08)`, border: `1px solid ${color}22`, borderRadius: "24px", p: 4, mb: 4 }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                                <Avatar sx={{ width: 52, height: 52, background: color }}>{initials}</Avatar>
                                <Box>
                                    <Chip label={skill.category} size="small" sx={{ background: color + "20", color: color, fontWeight: 700, mb: 0.5 }} />
                                    <Typography sx={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: 32 }}>{skill.title}</Typography>
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={3}>
                                <Stack direction="row" alignItems="center" spacing={0.5}><Star sx={{ color: C.gold, fontSize: 18 }} /><Typography sx={{ fontWeight: 700 }}>{skill.rating?.toFixed(1) || "New"}</Typography></Stack>
                                <Stack direction="row" alignItems="center" spacing={0.5}><LocationOn sx={{ color: C.muted, fontSize: 18 }} /><Typography sx={{ color: C.muted }}>{skill.location || "Online"}</Typography></Stack>
                                <Stack direction="row" alignItems="center" spacing={0.5}><AccessTime sx={{ color: C.muted, fontSize: 18 }} /><Typography sx={{ color: C.muted }}>60-90 min</Typography></Stack>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Button fullWidth variant="contained" onClick={() => setBookingOpen(true)} sx={{ background: `linear-gradient(135deg,${C.emerald},${C.coral})`, color: "#fff", borderRadius: "12px", py: 1.5, fontWeight: 700 }}>Request Session</Button>
                        </Grid>
                    </Grid>
                </Card>

                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3, mb: 3 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: 20, mb: 2 }}>About this skill</Typography>
                            <Typography sx={{ color: C.muted, lineHeight: 1.8 }}>{skill.description}</Typography>
                        </Card>
                        
                        {/* Tags */}
                        <Stack direction="row" spacing={1} mb={4}>
                            {skill.tags?.map((tag: any) => (
                                <Chip key={tag} label={tag} size="small" sx={{ background: "rgba(240,237,232,0.06)", color: C.muted }} />
                            ))}
                        </Stack>

                        {/* Availability */}
                        <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3, mb: 4 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: 20, mb: 2 }}>Availability</Typography>
                            <Grid container spacing={1}>
                                {skill.availability?.map((slotObj: any, idx: number) => {
                                    const slotLabel = `${slotObj.day}: ${slotObj.slots?.[0] || 'Anytime'}`;
                                    const isSelected = selectedSlot === slotLabel;
                                    return (
                                        <Grid size={{ xs: 6, sm: 4 }} key={`${slotObj.day}-${idx}`}>
                                            <Box 
                                                onClick={() => setSelectedSlot(slotLabel)} 
                                                sx={{ 
                                                    p: 1.5, borderRadius: "10px", 
                                                    border: `1px solid ${isSelected ? C.emerald : C.border}`, 
                                                    cursor: "pointer", 
                                                    background: isSelected ? `${C.emerald}18` : "transparent", 
                                                    textAlign: "center" 
                                                }}
                                            >
                                                <Typography sx={{ fontWeight: 700, fontSize: 13, color: isSelected ? C.emerald : C.text }}>{slotObj.day}</Typography>
                                                <Typography sx={{ fontSize: 11, color: isSelected ? C.emerald : C.muted }}>{slotObj.slots?.[0] || "Flexible"}</Typography>
                                            </Box>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Card>

                        {/* Reviews */}
                        <Typography sx={{ fontWeight: 700, fontSize: 22, mb: 2 }}>Reviews ({reviews.length})</Typography>
                        <Stack spacing={2}>
                            {reviews.map((r) => (
                                <Card key={r.id} sx={{ background: "rgba(240,237,232,0.02)", border: `1px solid ${C.border}`, borderRadius: "16px", p: 2 }}>
                                    <Stack direction="row" spacing={2} mb={1}>
                                        <Avatar sx={{ width: 32, height: 32 }}>{r.user?.name?.[0]}</Avatar>
                                        <Box>
                                            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{r.user?.name}</Typography>
                                            <Stack direction="row" spacing={0.3}>{[1, 2, 3, 4, 5].map(s => <Star key={s} sx={{ fontSize: 12, color: s <= r.rating ? C.gold : C.faint }} />)}</Stack>
                                        </Box>
                                    </Stack>
                                    <Typography sx={{ color: C.muted, fontSize: 14, fontStyle: "italic" }}>"{r.comment}"</Typography>
                                </Card>
                            ))}
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3 }}>
                            <Typography sx={{ color: C.faint, fontSize: 12, mb: 2, textTransform: "uppercase" }}>Provider</Typography>
                            <Stack direction="row" spacing={2} mb={2}>
                                <Avatar sx={{ width: 48, height: 48, background: `linear-gradient(135deg,${C.emerald},${C.coral})` }}>{initials}</Avatar>
                                <Box>
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                        <Typography sx={{ fontWeight: 700 }}>{provider.name}</Typography>
                                        {provider.verified && <CheckCircle sx={{ color: C.emerald, fontSize: 16 }} />}
                                    </Stack>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Typography sx={{ fontSize: 12, color: C.muted }}>{provider.city}</Typography>
                                        <FiberManualRecord sx={{ fontSize: 4, color: C.faint }} />
                                        <Typography sx={{ fontSize: 12, color: C.gold, fontWeight: 700 }}>{provider.impactScore} pts</Typography>
                                    </Stack>
                                </Box>
                            </Stack>
                            <Typography sx={{ fontSize: 13, color: C.muted, mb: 3 }}>{provider.bio || "No bio provided."}</Typography>
                            <Button fullWidth component={Link} href={`/chat?user=${provider.id}`} variant="outlined" sx={{ borderColor: C.border, color: C.text }}>Message</Button>
                        </Card>
                    </Grid>
                </Grid>

                {/* Similar */}
                <Box sx={{ mt: 6 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 20, mb: 3 }}>Similar skills nearby</Typography>
                    <Grid container spacing={2}>
                        {similar.map(s => (
                            <Grid size={{ xs: 12, sm: 4 }} key={s.id}>
                                <Card component={Link} href={`/skill/${s.id}`} sx={{ p: 2, background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "16px", textDecoration: "none" }}>
                                    <Typography sx={{ fontWeight: 700, color: C.text }}>{s.title}</Typography>
                                    <Typography sx={{ fontSize: 12, color: C.muted }}>{s.user?.name}</Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <BookingConfirmDialog
                    open={bookingOpen}
                    onClose={() => setBookingOpen(false)}
                    skillId={skill.id}
                    skillTitle={skill.title}
                    providerName={provider.name}
                    providerInitials={initials}
                    selectedSlot={selectedSlot || "Anytime"}
                />
            </Container>
            <Footer />
        </Box>
    );
}