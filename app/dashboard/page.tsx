"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import MobileNavDrawer from "@/components/ui/MobileNavDrawer";
import NotificationsDrawer from "@/components/ui/NotificationsDrawer";
import AddSkillModal from "@/components/forms/AddSkillModal";
import { useToast } from "@/context/ToastContext";
import { dashboardApi, requestsApi, skillsApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { User, Skill, SkillRequest } from "@/types";
import {
    Box, Button, Card, Chip, Container, Grid, Stack,
    Typography, Avatar, LinearProgress, IconButton, Divider, Badge,
    CircularProgress,
} from "@mui/material";
import {
    Add, Edit, Delete, CheckCircle, Cancel, Schedule,
    LocationOn, Star, TrendingUp, People, AccessTime,
    EmojiEvents, Notifications, Settings, ArrowForward,
    FiberManualRecord, Psychology, Handshake, Menu as MenuIcon,
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

// ─── Colour palette for avatar initials ──────────────────────────────────────
const AVATAR_COLORS = [C.emerald, C.coral, C.gold, C.coralLight, C.emeraldLight];
const avatarColor = (idx: number) => AVATAR_COLORS[idx % AVATAR_COLORS.length];

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
function DashboardNav({ setMobileOpen, setNotifsOpen, setAddSkillOpen, initials }: any) {
    return (
        <Box sx={{
            px: { xs: 2, md: 4 }, py: 1.5,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: `1px solid ${C.border}`,
            background: "rgba(8,15,30,0.95)", backdropFilter: "blur(16px)",
            position: "sticky", top: 0, zIndex: 100,
        }}>
            <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton onClick={() => setMobileOpen(true)} sx={{ color: C.muted, display: { md: "none" } }}><MenuIcon /></IconButton>
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
                <IconButton onClick={() => setNotifsOpen(true)} sx={{ color: C.muted, "&:hover": { color: C.text } }}>
                    <Badge badgeContent={2} sx={{ "& .MuiBadge-badge": { background: C.coral, color: "#fff" } }}>
                        <Notifications sx={{ fontSize: 20 }} />
                    </Badge>
                </IconButton>
                <IconButton component={Link} href="/settings" sx={{ color: C.muted, "&:hover": { color: C.text } }}>
                    <Settings sx={{ fontSize: 20 }} />
                </IconButton>
                <Avatar component={Link} href="/profile/1" sx={{ width: 34, height: 34, background: `linear-gradient(135deg,${C.emerald},${C.coral})`, fontSize: 13, fontWeight: 700, cursor: "pointer", textDecoration: "none" }}>
                    {initials || "U"}
                </Avatar>
            </Stack>
        </Box>
    );
}

// ─── Welcome Header ───────────────────────────────────────────────────────────
function WelcomeHeader({ user, setAddSkillOpen }: { user: User | null; setAddSkillOpen: (v: boolean) => void }) {
    const initials = user ? ("" + (user as any).initials || user.name?.slice(0, 2).toUpperCase()) : "…";
    const level = (user as any)?.level ?? "Seed";
    const nextLevel = (user as any)?.nextLevel ?? "Sprout";
    const levelProgress = (user as any)?.levelProgress ?? 0;
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
                        {initials}
                    </Avatar>
                    <Box>
                        <Typography sx={{ color: C.muted, fontSize: 13, mb: 0.3 }}>Welcome back</Typography>
                        <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 22 }}>{user?.name ?? "…"}</Typography>
                        <Stack direction="row" alignItems="center" spacing={0.8} mt={0.3}>
                            <LocationOn sx={{ fontSize: 12, color: C.faint }} />
                            <Typography sx={{ fontSize: 12, color: C.faint }}>{user?.location ?? ""}</Typography>
                            <Typography sx={{ fontSize: 12, color: C.faint }}>·</Typography>
                            <EmojiEvents sx={{ fontSize: 12, color: C.gold }} />
                            <Typography sx={{ fontSize: 12, color: C.gold, fontWeight: 600 }}>{level}</Typography>
                        </Stack>
                    </Box>
                </Stack>
                <Stack direction="row" spacing={1.5}>
                    <Button size="small" startIcon={<Add />} onClick={() => setAddSkillOpen(true)} sx={{ borderColor: `${C.emerald}55`, color: C.emerald, border: "1px solid", textTransform: "none", borderRadius: "10px", fontSize: 13, "&:hover": { background: `${C.emerald}10` } }}>
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
                        Progress to <span style={{ color: C.gold }}>{nextLevel}</span>
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: C.muted }}>{levelProgress}%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={levelProgress} sx={{
                    height: 6, borderRadius: 3, background: `${C.border}`,
                    "& .MuiLinearProgress-bar": { background: `linear-gradient(90deg,${C.emerald},${C.coral})`, borderRadius: 3 },
                }} />
            </Box>
        </Box>
    );
}

// ─── Stats Row ────────────────────────────────────────────────────────────────
function StatsRow({ stats }: { stats: { skillsShared: number; peopleHelped: number; hoursContributed: number; impactScore: number } | null }) {
    const rows = [
        { label: "Skills shared", value: String(stats?.skillsShared ?? 0), icon: <Psychology sx={{ fontSize: 20 }} />, color: C.emerald, sub: "Share your expertise" },
        { label: "People helped", value: String(stats?.peopleHelped ?? 0), icon: <People sx={{ fontSize: 20 }} />, color: C.coral, sub: "Community impact" },
        { label: "Hours contributed", value: String(stats?.hoursContributed ?? 0), icon: <AccessTime sx={{ fontSize: 20 }} />, color: C.gold, sub: "Time invested" },
        { label: "Impact score", value: String(stats?.impactScore ?? 0), icon: <EmojiEvents sx={{ fontSize: 20 }} />, color: C.coralLight, sub: "Your rank in city" },
    ];
    return (
        <Grid container spacing={2} sx={{ mb: 3 }}>
            {rows.map((s, i) => (
                <Grid size={{ xs: 6, md: 3 }} key={s.label}>
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
function MySkills({ skills, onToggle, onDelete }: { skills: Skill[]; onToggle: (id: number) => void; onDelete: (id: number) => void }) {

    return (
        <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3, height: "100%" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
                <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 18 }}>My skills</Typography>
            </Stack>
            {skills.length === 0 ? (
                <Typography sx={{ color: C.faint, fontSize: 13, textAlign: "center", py: 4 }}>No skills yet. Add your first skill!</Typography>
            ) : (
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
                                    <IconButton size="small" onClick={() => onToggle(Number(skill.id))} sx={{ color: skill.active ? C.emerald : C.faint, "&:hover": { background: `${C.emerald}12` } }}>
                                        <FiberManualRecord sx={{ fontSize: 14 }} />
                                    </IconButton>
                                    <IconButton size="small" component={Link} href={`/skill/${skill.id}`} sx={{ color: C.faint, "&:hover": { color: C.coral } }}>
                                        <Edit sx={{ fontSize: 14 }} />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => onDelete(Number(skill.id))} sx={{ color: C.faint, "&:hover": { color: "#F43A3A" } }}>
                                        <Delete sx={{ fontSize: 14 }} />
                                    </IconButton>
                                </Stack>
                            </Stack>
                        </Box>
                    ))}
                </Stack>
            )}
        </Card>
    );
}

// ─── Requests ─────────────────────────────────────────────────────────────────
function Requests({ requests, onAccept, onDecline }: { requests: SkillRequest[]; onAccept: (id: number) => void; onDecline: (id: number) => void }) {
    return (
        <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3, height: "100%" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 18 }}>Requests</Typography>
                    <Chip label={requests.filter(r => r.status === "pending").length} size="small" sx={{ height: 20, fontSize: 11, fontWeight: 700, background: `${C.gold}18`, color: C.gold }} />
                </Stack>
                <Typography sx={{ fontSize: 12, color: C.faint, cursor: "pointer", "&:hover": { color: C.emerald } }}>View all</Typography>
            </Stack>
            {requests.length === 0 ? (
                <Typography sx={{ color: C.faint, fontSize: 13, textAlign: "center", py: 4 }}>No requests yet.</Typography>
            ) : (
                <Stack spacing={1.5}>
                    {requests.map((req, idx) => {
                        const name = (req as any).user?.name ?? "Unknown";
                        const initials = name.split(" ").slice(0, 2).map((p: string) => p[0]?.toUpperCase()).join("");
                        const skillTitle = (req as any).skill?.title ?? "Skill";
                        const time = req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "";
                        const status = req.status ?? "pending";
                        return (
                            <Box key={req.id} sx={{ p: 1.8, borderRadius: "12px", background: "rgba(240,237,232,0.02)", border: `1px solid ${C.border}`, "&:hover": { borderColor: "rgba(240,237,232,0.1)" }, transition: "border 0.2s" }}>
                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                    <Avatar sx={{ width: 36, height: 36, fontSize: 12, fontWeight: 700, background: avatarColor(idx), flexShrink: 0 }}>{initials}</Avatar>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography sx={{ color: C.text, fontWeight: 600, fontSize: 13 }}>{name}</Typography>
                                            <Typography sx={{ fontSize: 11, color: C.faint }}>{time}</Typography>
                                        </Stack>
                                        <Typography sx={{ fontSize: 12, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{skillTitle}</Typography>
                                    </Box>
                                </Stack>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1.2}>
                                    <Chip label={STATUS_CONFIG[status]?.label ?? status} size="small" sx={{ height: 20, fontSize: 10, fontWeight: 700, background: STATUS_CONFIG[status]?.bg ?? "transparent", color: STATUS_CONFIG[status]?.color ?? C.muted }} />
                                    {status === "pending" && (
                                        <Stack direction="row" spacing={0.8}>
                                            <Button size="small" startIcon={<CheckCircle sx={{ fontSize: 13 }} />} onClick={() => onAccept(Number(req.id))} sx={{ color: C.emerald, textTransform: "none", fontSize: 11, py: 0.3, px: 1, borderRadius: "8px", minWidth: 0, "&:hover": { background: `${C.emerald}12` } }}>Accept</Button>
                                            <Button size="small" startIcon={<Cancel sx={{ fontSize: 13 }} />} onClick={() => onDecline(Number(req.id))} sx={{ color: C.coral, textTransform: "none", fontSize: 11, py: 0.3, px: 1, borderRadius: "8px", minWidth: 0, "&:hover": { background: `${C.coral}12` } }}>Decline</Button>
                                        </Stack>
                                    )}
                                </Stack>
                            </Box>
                        );
                    })}
                </Stack>
            )}
        </Card>
    );
}

// ─── Recommended ──────────────────────────────────────────────────────────────
const REC_COLORS = [C.emerald, C.coral, C.gold, C.coralLight, C.emeraldLight];
function RecommendedMatches({ recommended }: { recommended: Skill[] }) {
    return (
        <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Psychology sx={{ fontSize: 18, color: C.coral }} />
                    <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 18 }}>AI recommended for you</Typography>
                </Stack>
                <Chip label="Near you" size="small" sx={{ background: `${C.coral}18`, color: C.coral, fontSize: 11, fontWeight: 600 }} />
            </Stack>
            {recommended.length === 0 ? (
                <Typography sx={{ color: C.faint, fontSize: 13, textAlign: "center", py: 4 }}>No recommendations yet.</Typography>
            ) : (
                <Grid container spacing={2}>
                    {recommended.map((r, idx) => {
                        const color = REC_COLORS[idx % REC_COLORS.length];
                        const person = (r as any).user?.name ?? "Anonymous";
                        return (
                            <Grid size={{ xs: 12, sm: 4 }} key={r.id}>
                                <Box component={Link} href={`/skill/${r.id}`} sx={{
                                    p: 2, borderRadius: "14px", background: "rgba(240,237,232,0.02)", border: `1px solid ${C.border}`, cursor: "pointer",
                                    "&:hover": { borderColor: color + "55", background: color + "08", transform: "translateY(-2px)" }, transition: "all 0.2s",
                                    display: "block", textDecoration: "none",
                                }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                        <Chip label={r.category} size="small" sx={{ height: 20, fontSize: 10, fontWeight: 700, background: color + "20", color }} />
                                        <Stack direction="row" alignItems="center" spacing={0.3}>
                                            <Star sx={{ fontSize: 11, color: C.gold }} />
                                            <Typography sx={{ fontSize: 11, color: C.gold, fontWeight: 600 }}>{r.rating?.toFixed(1) ?? "0.0"}</Typography>
                                        </Stack>
                                    </Stack>
                                    <Typography sx={{ color: C.text, fontWeight: 600, fontSize: 14, mb: 0.5 }}>{r.title}</Typography>
                                    <Typography sx={{ fontSize: 12, color: C.muted }}>{person}</Typography>
                                    <Stack direction="row" alignItems="center" spacing={0.4} mt={0.5}>
                                        <LocationOn sx={{ fontSize: 11, color }} />
                                        <Typography sx={{ fontSize: 11, color, fontWeight: 600 }}>{r.location || "Nearby"}</Typography>
                                    </Stack>
                                    <Button fullWidth size="small" sx={{ mt: 1.5, color, border: `1px solid ${color}44`, textTransform: "none", fontSize: 12, borderRadius: "8px", "&:hover": { background: color + "15" } }}>
                                        Request session
                                    </Button>
                                </Box>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Card>
    );
}

// ─── Activity ─────────────────────────────────────────────────────────────────
function RecentActivity({ activity }: { activity: { id: number; text: string; time: string; type: string }[] }) {
    return (
        <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
                <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 18 }}>Recent activity</Typography>
                <Typography sx={{ fontSize: 12, color: C.faint, cursor: "pointer", "&:hover": { color: C.emerald } }}>View all</Typography>
            </Stack>
            {activity.length === 0 ? (
                <Typography sx={{ color: C.faint, fontSize: 13, textAlign: "center", py: 4 }}>No recent activity.</Typography>
            ) : (
                <Stack spacing={0}>
                    {activity.map((item, i) => (
                        <Box key={item.id}>
                            <Stack direction="row" alignItems="flex-start" spacing={1.5} py={1.5}>
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", mt: 0.5, flexShrink: 0, background: ACTIVITY_COLORS[item.type] ?? C.emerald, boxShadow: `0 0 8px ${ACTIVITY_COLORS[item.type] ?? C.emerald}88` }} />
                                    {i < activity.length - 1 && <Box sx={{ width: 1, flex: 1, minHeight: 24, background: C.border, mt: 0.5 }} />}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography sx={{ color: C.muted, fontSize: 13, lineHeight: 1.5 }}>{item.text}</Typography>
                                    <Stack direction="row" alignItems="center" spacing={0.5} mt={0.4}>
                                        <Schedule sx={{ fontSize: 11, color: C.faint }} />
                                        <Typography sx={{ fontSize: 11, color: C.faint }}>{item.time}</Typography>
                                    </Stack>
                                </Box>
                            </Stack>
                            {i < activity.length - 1 && <Divider sx={{ borderColor: "rgba(240,237,232,0.04)" }} />}
                        </Box>
                    ))}
                </Stack>
            )}
        </Card>
    );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function DashboardPage() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [notifsOpen, setNotifsOpen] = useState(false);
    const [addSkillOpen, setAddSkillOpen] = useState(false);

    // ── Auth context — wait for token restore before fetching ────────────────
    const { loading: authLoading } = useAuth();

    // ── Real API state ────────────────────────────────────────────────────────
    const [dashData, setDashData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchDash = useCallback(async () => {
        try {
            const res = await dashboardApi.getData();
            if (res.success) setDashData(res.data);
        } catch (e) {
            console.error("Dashboard fetch failed", e);
        } finally {
            setLoading(false);
        }
    }, []);

    // Only fetch once the auth token has been restored from localStorage
    useEffect(() => {
        if (!authLoading) fetchDash();
    }, [authLoading, fetchDash]);

    const handleAccept = async (id: number) => {
        try {
            await requestsApi.accept(id);
            fetchDash();
        } catch (e) { console.error(e); }
    };

    const handleDecline = async (id: number) => {
        try {
            await requestsApi.decline(id);
            fetchDash();
        } catch (e) { console.error(e); }
    };

    const handleToggle = async (id: number) => {
        try {
            await skillsApi.toggle(id);
            fetchDash();
        } catch (e) { console.error(e); }
    };

    const handleDelete = async (id: number) => {
        try {
            await skillsApi.delete(id);
            fetchDash();
        } catch (e) { console.error(e); }
    };

    if (authLoading || loading) {
        return (
            <Box sx={{ background: C.ink, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CircularProgress sx={{ color: C.emerald }} />
            </Box>
        );
    }

    return (
        <Box sx={{ background: C.ink, minHeight: "100vh", color: C.text }}>
            <MobileNavDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} activeHref="/dashboard" />
            <NotificationsDrawer open={notifsOpen} onClose={() => setNotifsOpen(false)} />
            <AddSkillModal open={addSkillOpen} onClose={() => { setAddSkillOpen(false); fetchDash(); }} />
            <DashboardNav setMobileOpen={setMobileOpen} setNotifsOpen={setNotifsOpen} setAddSkillOpen={setAddSkillOpen} initials={dashData?.user?.initials ?? "U"} />
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <WelcomeHeader user={dashData?.user ?? null} setAddSkillOpen={setAddSkillOpen} />
                <StatsRow stats={dashData?.stats ?? null} />
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 5 }}><MySkills skills={dashData?.mySkills ?? []} onToggle={handleToggle} onDelete={handleDelete} /></Grid>
                    <Grid size={{ xs: 12, md: 7 }}><Requests requests={dashData?.requests ?? []} onAccept={handleAccept} onDecline={handleDecline} /></Grid>
                </Grid>
                <Box sx={{ mb: 3 }}><RecommendedMatches recommended={dashData?.recommended ?? []} /></Box>
                <RecentActivity activity={dashData?.recentActivity ?? []} />
            </Container>
        </Box>
    );
}
