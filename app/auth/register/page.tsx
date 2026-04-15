"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Box, Button, Card, Chip, Divider, IconButton,
    InputAdornment, Stack, TextField, Typography, Avatar,
    CircularProgress,
} from "@mui/material";
import {
    Visibility, VisibilityOff, Google, Handshake,
    ArrowForward, ArrowBack, CheckCircle,
    Person, Email, Lock, LocationOn, Psychology,
    MyLocation,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

// ─── Constants ────────────────────────────────────────────────────────────────
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

const DEMO_ACCOUNTS = [
    { name: "Aarav Mehta", email: "aarav@demo.com", role: "Expert Mentor" },
    { name: "Priya Sharma", email: "priya@demo.com", role: "Community Lead" },
    { name: "Rahul Krishnan", email: "rahul@demo.com", role: "Active Member" },
];

const SKILL_CATEGORIES = ["Tech", "Music", "Career", "Wellness", "Creative", "Language", "Education", "Sports", "Other"];

const inputSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        background: "rgba(240,237,232,0.04)",
        fontSize: 14,
        color: C.text,
        "& fieldset": { borderColor: C.border },
        "&:hover fieldset": { borderColor: `${C.emerald}55` },
        "&.Mui-focused fieldset": { borderColor: C.emerald },
    },
    "& .MuiInputLabel-root": { color: C.faint, fontSize: 14 },
    "& .MuiInputLabel-root.Mui-focused": { color: C.emerald },
};

// ─── Left Panel ───────────────────────────────────────────────────────────────
function LeftPanel() {
    return (
        <Box sx={{
            display: { xs: "none", md: "flex" }, flexDirection: "column",
            justifyContent: "center", width: "42%", minHeight: "100vh",
            borderRight: `1px solid ${C.border}`, p: 6,
        }}>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={4}>
                <Box sx={{ width: 38, height: 38, borderRadius: "11px", background: `linear-gradient(135deg,${C.emerald},${C.coral})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Handshake sx={{ fontSize: 20, color: "#fff" }} />
                </Box>
                <Typography sx={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 22, color: C.text }}>SkillBridge</Typography>
            </Stack>

            <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: 42, fontWeight: 800, color: C.text, lineHeight: 1.1, mb: 3 }}>
                Exchange skills. <br/>
                Build <span style={{ background: `linear-gradient(90deg,${C.emerald},${C.coral})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Connections.</span>
            </Typography>
            <Typography sx={{ color: C.muted, fontSize: 16, lineHeight: 1.8, mb: 5 }}>
                Join the largest hyperlocal skill-sharing network. Use what you know to learn what you don&apos;t.
            </Typography>

            <Stack spacing={2.5}>
                {[
                    { label: "12k+ Skills learned", color: C.emerald },
                    { label: "Community verified", color: C.gold },
                    { label: "Free forever", color: C.coral }
                ].map(s => (
                    <Stack key={s.label} direction="row" alignItems="center" spacing={2}>
                        <CheckCircle sx={{ fontSize: 20, color: s.color }} />
                        <Typography sx={{ color: C.text, fontWeight: 500 }}>{s.label}</Typography>
                    </Stack>
                ))}
            </Stack>
        </Box>
    );
}

// ─── RegisterForm ─────────────────────────────────────────────────────────────
function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
    const router = useRouter();
    const { register, googleLogin } = useAuth();
    const { success, error: toastError } = useToast();
    const [step, setStep] = useState(1);
    const [showPass, setShowPass] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [form, setForm] = useState({ name: "", email: "", password: "", location: "" });
    const [loading, setLoading] = useState(false);
    const [showSandbox, setShowSandbox] = useState(false);
    const [guest, setGuest] = useState({ name: "", email: "" });

    const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
    const toggleSkill = (s: string) => setSelectedSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

    const handleRegister = async () => {
        if (!form.name || !form.email || !form.password || !form.location) {
            return toastError("Please complete all fields.");
        }
        setLoading(true);
        try {
            await register(form);
            success("Account created successfully!");
            router.push("/dashboard");
        } catch (err: any) {
            toastError(err.response?.data?.detail || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleGuestAction = async (demoEmail?: string) => {
        const emailToUse = demoEmail || guest.email;
        if (!emailToUse) return toastError("Email is required.");
        setLoading(true);
        try {
            const acc = DEMO_ACCOUNTS.find(a => a.email === emailToUse);
            await googleLogin({
                email: emailToUse,
                name: acc?.name || guest.name || emailToUse.split("@")[0],
                image: `https://ui-avatars.com/api/?name=${acc?.name || guest.name || "G"}&background=random`
            });
            success("Joined successfully!");
            router.push("/dashboard");
        } catch (err: any) {
            toastError("Sign-up failed.");
        } finally {
            setLoading(false);
        }
    };

    const detectLocation = () => {
        if (!navigator.geolocation) return toastError("Geolocation not supported");
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
                    const data = await res.json();
                    const city = data.address.city || data.address.town || data.address.state;
                    if (city) { update("location", city); success(`Detected: ${city}`); }
                } catch (e) { toastError("Could not detect city."); }
            },
            () => toastError("Location access denied.")
        );
    };

    return (
        <Box sx={{ width: "100%", maxWidth: 460 }}>
            {step === 1 && (
                <Box sx={{ animation: "fadeIn 0.5s ease" }}>
                    <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 800, fontSize: 32, mb: 1 }}>Join SkillBridge</Typography>
                    <Typography sx={{ color: C.muted, fontSize: 16, mb: 4 }}>The world&apos;s first skill-exchange network.</Typography>

                    {!showSandbox ? (
                        <Button fullWidth onClick={() => setShowSandbox(true)} startIcon={<Google />} sx={{ border: `1px solid ${C.border}`, color: C.text, textTransform: "none", borderRadius: "12px", py: 1.4, fontSize: 14, background: "rgba(240,237,232,0.04)", mb: 3, "&:hover": { background: "rgba(240,237,232,0.07)" } }}>
                            Sign up with Google
                        </Button>
                    ) : (
                        <Box sx={{ p: 2, mb: 3, borderRadius: "12px", background: "rgba(240,237,232,0.02)", border: `1px solid ${C.emerald}33` }}>
                            <Typography sx={{ color: C.emerald, fontSize: 11, fontWeight: 800, mb: 2, textAlign: "center" }}>GOOGLE SANDBOX HUB</Typography>
                            <Stack spacing={1.5}>
                                <TextField fullWidth size="small" placeholder="Your Name" value={guest.name} onChange={e => setGuest(g => ({ ...g, name: e.target.value }))} sx={inputSx} />
                                <TextField fullWidth size="small" placeholder="Your real email (from your PC)" value={guest.email} onChange={e => setGuest(g => ({ ...g, email: e.target.value }))} sx={inputSx} />
                                <Button fullWidth variant="contained" disabled={loading} onClick={() => handleGuestAction()} sx={{ background: C.emerald, color: "#fff", textTransform: "none", borderRadius: "8px" }}>
                                    {loading ? "Joining..." : "Join with my Email"}
                                </Button>
                                <Button fullWidth size="small" onClick={() => setShowSandbox(false)} sx={{ color: C.muted, fontSize: 11 }}>Cancel</Button>
                            </Stack>
                        </Box>
                    )}

                    <Stack spacing={2.5}>
                        <TextField fullWidth label="Full Name" value={form.name} onChange={e => update("name", e.target.value)} sx={inputSx} />
                        <TextField fullWidth label="Email" value={form.email} onChange={e => update("email", e.target.value)} sx={inputSx} />
                        <TextField fullWidth label="Password" type={showPass ? "text" : "password"} value={form.password} onChange={e => update("password", e.target.value)} InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPass(!showPass)} sx={{ color: C.faint }}>{showPass ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} sx={inputSx} />
                        <Button fullWidth variant="contained" onClick={() => setStep(2)} sx={{ p: 1.6, borderRadius: "12px", background: `linear-gradient(135deg,${C.emerald},${C.coral})`, color: "#fff", fontWeight: 700, textTransform: "none" }}>
                            Continue
                        </Button>
                    </Stack>
                </Box>
            )}

            {step === 2 && (
                <Box sx={{ animation: "fadeIn 0.5s ease" }}>
                    <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 800, fontSize: 32, mb: 1 }}>Almost there!</Typography>
                    <Typography sx={{ color: C.muted, fontSize: 16, mb: 4 }}>Tell us where you are and what you can share.</Typography>

                    <Stack spacing={2.5} mb={4}>
                        <TextField fullWidth label="Location" value={form.location} onChange={e => update("location", e.target.value)} InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={detectLocation} sx={{ color: C.emerald }}><MyLocation /></IconButton></InputAdornment> }} sx={inputSx} />
                        
                        <Typography sx={{ color: C.text, fontSize: 14, fontWeight: 600, mb: 1 }}>Select areas of interest:</Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1}>
                            {SKILL_CATEGORIES.map(cat => (
                                <Chip key={cat} label={cat} onClick={() => toggleSkill(cat)} sx={{ background: selectedSkills.includes(cat) ? `${C.emerald}33` : "rgba(240,237,232,0.05)", color: selectedSkills.includes(cat) ? C.emerald : C.muted, border: `1px solid ${selectedSkills.includes(cat) ? C.emerald : C.border}` }} />
                            ))}
                        </Stack>
                    </Stack>

                    <Stack direction="row" spacing={2}>
                        <Button fullWidth onClick={() => setStep(1)} sx={{ color: C.muted }}>Back</Button>
                        <Button fullWidth variant="contained" onClick={handleRegister} disabled={loading} sx={{ background: C.emerald, color: "#fff", p: 1.6, borderRadius: "12px", fontWeight: 700 }}>
                            {loading ? <CircularProgress size={20} color="inherit" /> : "Join SkillBridge"}
                        </Button>
                    </Stack>
                </Box>
            )}

            <Typography sx={{ mt: 4, textAlign: "center", color: C.muted, fontSize: 14 }}>
                Already have an account? <span onClick={onSwitch} style={{ color: C.emerald, cursor: "pointer", fontWeight: 600 }}>Sign in</span>
            </Typography>
        </Box>
    );
}

export default function AuthPage() {
    const [mode, setMode] = useState<"login" | "register">("register");
    return (
        <Box sx={{ background: C.ink, minHeight: "100vh", display: "flex", color: C.text }}>
            <LeftPanel />
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 4, position: "relative" }}>
                <Button component={Link} href="/" sx={{ position: "absolute", top: 24, left: 24, color: C.muted, textTransform: "none" }}>&larr; Back home</Button>
                <RegisterForm onSwitch={() => window.location.href = "/auth/login"} />
            </Box>
        </Box>
    );
}