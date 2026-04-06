"use client";
// app/settings/page.tsx — Account settings page

import React, { useState } from "react";
import Link from "next/link";
import {
    Box, Button, Card, Container, Divider, IconButton,
    Stack, Switch, TextField, Typography, Avatar,
} from "@mui/material";
import { ArrowBack, Handshake, Save, Lock, Notifications, Person, Shield } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import MobileNavDrawer from "@/components/ui/MobileNavDrawer";
import { Menu as MenuIcon } from "@mui/icons-material";

const C = {
    emerald: "#10B981", coral: "#F4623A",
    ink: "#080F1E", text: "#F0EDE8",
    muted: "rgba(240,237,232,0.52)", faint: "rgba(240,237,232,0.18)",
    border: "rgba(240,237,232,0.07)", card: "rgba(240,237,232,0.03)",
};

const inputSx = {
    "& .MuiOutlinedInput-root": {
        color: C.text, borderRadius: "12px",
        "& fieldset": { borderColor: C.border },
        "&:hover fieldset": { borderColor: `${C.emerald}55` },
        "&.Mui-focused fieldset": { borderColor: C.emerald },
    },
    "& .MuiInputLabel-root": { color: C.muted },
    "& .MuiInputLabel-root.Mui-focused": { color: C.emerald },
};

const SECTIONS = [
    { id: "profile", label: "Profile", icon: <Person sx={{ fontSize: 18 }} /> },
    { id: "notifications", label: "Notifications", icon: <Notifications sx={{ fontSize: 18 }} /> },
    { id: "privacy", label: "Privacy", icon: <Shield sx={{ fontSize: 18 }} /> },
    { id: "security", label: "Security", icon: <Lock sx={{ fontSize: 18 }} /> },
];

export default function SettingsPage() {
    const { user, updateUser } = useAuth();
    const { success } = useToast();
    const [active, setActive] = useState("profile");
    const [mobileOpen, setMobileOpen] = useState(false);
    const [name, setName] = useState(user?.name ?? "");
    const [bio, setBio] = useState(user?.bio ?? "");
    const [location, setLocation] = useState(user?.location ?? "");

    const [notifs, setNotifs] = useState({ requests: true, reviews: true, messages: true, badges: true, reminders: false });
    const [privacy, setPrivacy] = useState({ showProfile: true, showLocation: true, allowMessages: true });

    const saveProfile = () => { updateUser({ name, bio, location }); success("Profile updated!"); };

    return (
        <Box sx={{ background: C.ink, minHeight: "100vh", color: C.text }}>
            <MobileNavDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} activeHref="/settings" />

            {/* Navbar */}
            <Box sx={{ px: { xs: 2, md: 4 }, py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}`, background: "rgba(8,15,30,0.95)", backdropFilter: "blur(16px)", position: "sticky", top: 0, zIndex: 100 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton onClick={() => setMobileOpen(true)} sx={{ color: C.muted, display: { md: "none" } }}><MenuIcon /></IconButton>
                    <Stack direction="row" alignItems="center" spacing={1} component={Link} href="/" sx={{ textDecoration: "none" }}>
                        <Box sx={{ width: 32, height: 32, borderRadius: "9px", background: `linear-gradient(135deg,${C.emerald},${C.coral})`, display: "flex", alignItems: "center", justifyContent: "center" }}><Handshake sx={{ fontSize: 16, color: "#fff" }} /></Box>
                        <Typography sx={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 17, color: C.text }}>SkillBridge</Typography>
                    </Stack>
                </Stack>
                <Button component={Link} href="/dashboard" startIcon={<ArrowBack sx={{ fontSize: 14 }} />} sx={{ color: C.muted, textTransform: "none", fontSize: 13, "&:hover": { color: C.text } }}>Dashboard</Button>
            </Box>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography sx={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: { xs: 26, md: 32 }, mb: 4 }}>Settings</Typography>

                <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="flex-start">
                    {/* Sidebar nav */}
                    <Card sx={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "18px", p: 1.5, width: { xs: "100%", md: 220 }, flexShrink: 0 }}>
                        {SECTIONS.map(s => (
                            <Box key={s.id} onClick={() => setActive(s.id)} sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.4, borderRadius: "12px", cursor: "pointer", background: active === s.id ? `${C.emerald}15` : "transparent", color: active === s.id ? C.emerald : C.muted, "&:hover": { background: `${C.emerald}08`, color: C.text }, transition: "all 0.15s", mb: 0.5 }}>
                                {s.icon}
                                <Typography sx={{ fontSize: 14, fontWeight: active === s.id ? 700 : 500 }}>{s.label}</Typography>
                            </Box>
                        ))}
                    </Card>

                    {/* Content */}
                    <Card sx={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "18px", p: 3.5, flex: 1, width: "100%" }}>
                        {active === "profile" && (
                            <Stack spacing={3}>
                                <Typography sx={{ fontWeight: 700, fontSize: 18, color: C.text }}>Profile</Typography>
                                <Stack direction="row" alignItems="center" spacing={2.5}>
                                    <Avatar sx={{ width: 68, height: 68, background: `linear-gradient(135deg,${C.emerald},${C.coral})`, fontSize: 24, fontWeight: 700 }}>{user?.initials ?? "?"}</Avatar>
                                    <Box><Typography sx={{ color: C.muted, fontSize: 13 }}>Avatar auto-generated from your initials</Typography></Box>
                                </Stack>
                                <TextField fullWidth label="Full name" value={name} onChange={e => setName(e.target.value)} sx={inputSx} />
                                <TextField fullWidth label="Location" value={location} onChange={e => setLocation(e.target.value)} sx={inputSx} />
                                <TextField fullWidth multiline rows={3} label="Bio" placeholder="Tell people about yourself…" value={bio} onChange={e => setBio(e.target.value)} sx={inputSx} />
                                <Button onClick={saveProfile} startIcon={<Save />} variant="contained" sx={{ alignSelf: "flex-start", background: `linear-gradient(135deg,${C.emerald},${C.coral})`, textTransform: "none", borderRadius: "12px", boxShadow: "none" }}>Save changes</Button>
                            </Stack>
                        )}

                        {active === "notifications" && (
                            <Stack spacing={0}>
                                <Typography sx={{ fontWeight: 700, fontSize: 18, color: C.text, mb: 2.5 }}>Notifications</Typography>
                                {Object.entries(notifs).map(([key, val], i) => (
                                    <Box key={key}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" py={1.8}>
                                            <Box>
                                                <Typography sx={{ color: C.text, fontWeight: 600, fontSize: 14, textTransform: "capitalize" }}>{key}</Typography>
                                                <Typography sx={{ color: C.muted, fontSize: 12 }}>Receive {key} notifications</Typography>
                                            </Box>
                                            <Switch checked={val} onChange={() => setNotifs(p => ({ ...p, [key]: !val }))} sx={{ "& .MuiSwitch-thumb": { background: val ? C.emerald : C.faint }, "& .MuiSwitch-track": { background: val ? `${C.emerald}44` : C.border } }} />
                                        </Stack>
                                        {i < Object.keys(notifs).length - 1 && <Divider sx={{ borderColor: C.border }} />}
                                    </Box>
                                ))}
                            </Stack>
                        )}

                        {active === "privacy" && (
                            <Stack spacing={0}>
                                <Typography sx={{ fontWeight: 700, fontSize: 18, color: C.text, mb: 2.5 }}>Privacy</Typography>
                                {Object.entries(privacy).map(([key, val], i) => (
                                    <Box key={key}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" py={1.8}>
                                            <Box>
                                                <Typography sx={{ color: C.text, fontWeight: 600, fontSize: 14 }}>{key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}</Typography>
                                                <Typography sx={{ color: C.muted, fontSize: 12 }}>Control your {key.toLowerCase()} visibility</Typography>
                                            </Box>
                                            <Switch checked={val} onChange={() => setPrivacy(p => ({ ...p, [key]: !val }))} sx={{ "& .MuiSwitch-thumb": { background: val ? C.emerald : C.faint }, "& .MuiSwitch-track": { background: val ? `${C.emerald}44` : C.border } }} />
                                        </Stack>
                                        {i < Object.keys(privacy).length - 1 && <Divider sx={{ borderColor: C.border }} />}
                                    </Box>
                                ))}
                            </Stack>
                        )}

                        {active === "security" && (
                            <Stack spacing={3}>
                                <Typography sx={{ fontWeight: 700, fontSize: 18, color: C.text }}>Security</Typography>
                                <TextField fullWidth label="Current password" type="password" sx={inputSx} />
                                <TextField fullWidth label="New password" type="password" sx={inputSx} />
                                <TextField fullWidth label="Confirm new password" type="password" sx={inputSx} />
                                <Button variant="contained" onClick={() => success("Password updated!")} sx={{ alignSelf: "flex-start", background: `linear-gradient(135deg,${C.emerald},${C.coral})`, textTransform: "none", borderRadius: "12px", boxShadow: "none" }}>Update password</Button>
                                <Divider sx={{ borderColor: C.border }} />
                                <Box>
                                    <Typography sx={{ color: C.coral, fontWeight: 700, fontSize: 15, mb: 0.5 }}>Danger zone</Typography>
                                    <Typography sx={{ color: C.muted, fontSize: 13, mb: 2 }}>Once deleted, your account cannot be recovered.</Typography>
                                    <Button variant="outlined" sx={{ borderColor: `${C.coral}44`, color: C.coral, textTransform: "none", borderRadius: "12px", "&:hover": { background: `${C.coral}10` } }}>Delete account</Button>
                                </Box>
                            </Stack>
                        )}
                    </Card>
                </Stack>
            </Container>
        </Box>
    );
}
