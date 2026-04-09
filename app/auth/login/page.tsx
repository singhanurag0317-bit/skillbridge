"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
    Box, Button, Card, Chip, Divider, IconButton,
    InputAdornment, Stack, TextField, Typography, Avatar,
} from "@mui/material";
import {
    Visibility, VisibilityOff, Handshake,
    ArrowForward, ArrowBack, CheckCircle,
    Person, Email, Lock, LocationOn, Psychology,
} from "@mui/icons-material";

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

const QUOTES = [
    { text: "Found a Python tutor 500m from my house. Changed my career trajectory completely.", name: "Priya S.", role: "Software Engineer", initials: "PS", color: C.emerald },
    { text: "Shared my resume skills with 7 people. Got yoga lessons in return. Zero rupees.", name: "Rohan K.", role: "Product Manager", initials: "RK", color: C.coral },
    { text: "SkillBridge helped our NGO match 200+ volunteers in one week. Incredible tool.", name: "Fatima K.", role: "NGO Director", initials: "FK", color: C.gold },
];

const SKILL_CATEGORIES = ["Tech", "Music", "Career", "Wellness", "Creative", "Language", "Education", "Sports", "Other"];

const inputSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "12px", background: "rgba(240,237,232,0.04)",
        fontSize: 14, color: C.text,
        "& fieldset": { borderColor: C.border },
        "&:hover fieldset": { borderColor: `${C.emerald}55` },
        "&.Mui-focused fieldset": { borderColor: C.emerald },
    },
    "& .MuiInputLabel-root": { color: C.faint, fontSize: 14 },
    "& .MuiInputLabel-root.Mui-focused": { color: C.emerald },
};

const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

// ─── Left Panel ───────────────────────────────────────────────────────────────
function LeftPanel() {
    const [activeQuote, setActiveQuote] = useState(0);
    return (
        <Box sx={{
            display: { xs: "none", md: "flex" }, flexDirection: "column",
            justifyContent: "space-between",
            width: "42%", minHeight: "100vh",
            background: "transparent",
            borderRight: `1px solid ${C.border}`,
            p: 5, position: "relative", overflow: "hidden",
        }}>

            <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{ width: 38, height: 38, borderRadius: "11px", background: `linear-gradient(135deg,${C.emerald},${C.coral})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Handshake sx={{ fontSize: 20, color: "#fff" }} />
                </Box>
                <Typography sx={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 22, color: C.text }}>SkillBridge</Typography>
            </Stack>

            <Box sx={{ position: "relative", zIndex: 2 }}>
                <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: 38, fontWeight: 800, color: C.text, lineHeight: 1.15, mb: 2 }}>
                    Your skill is someone&apos;s{" "}
                    <span style={{ background: `linear-gradient(90deg,${C.emerald},${C.coral})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        breakthrough.
                    </span>
                </Typography>
                <Typography sx={{ color: C.muted, fontSize: 16, lineHeight: 1.8, mb: 4 }}>
                    Join thousands of people sharing knowledge, building community, and making real impact — completely free.
                </Typography>

                <Stack direction="row" spacing={3} mb={5}>
                    {[{ value: "12K+", label: "Skills shared" }, { value: "3.8K+", label: "Members" }, { value: "94%", label: "Satisfaction" }].map(s => (
                        <Box key={s.label}>
                            <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 800, background: `linear-gradient(135deg,${C.emerald},${C.coral})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.value}</Typography>
                            <Typography sx={{ color: C.faint, fontSize: 12 }}>{s.label}</Typography>
                        </Box>
                    ))}
                </Stack>

                <Card sx={{ background: "rgba(240,237,232,0.04)", border: `1px solid ${C.border}`, borderRadius: "18px", p: 3 }}>
                    <Typography sx={{ color: "rgba(240,237,232,0.72)", fontSize: 14, lineHeight: 1.8, fontStyle: "italic", mb: 2 }}>
                        &ldquo;{QUOTES[activeQuote].text}&rdquo;
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Avatar sx={{ width: 36, height: 36, background: QUOTES[activeQuote].color, fontSize: 12, fontWeight: 700 }}>{QUOTES[activeQuote].initials}</Avatar>
                            <Box>
                                <Typography sx={{ color: C.text, fontWeight: 600, fontSize: 13 }}>{QUOTES[activeQuote].name}</Typography>
                                <Typography sx={{ color: C.faint, fontSize: 11 }}>{QUOTES[activeQuote].role}</Typography>
                            </Box>
                        </Stack>
                        <Stack direction="row" spacing={0.8}>
                            {QUOTES.map((_, i) => (
                                <Box key={i} onClick={() => setActiveQuote(i)} sx={{ width: i === activeQuote ? 20 : 6, height: 6, borderRadius: 3, background: i === activeQuote ? C.emerald : C.border, cursor: "pointer", transition: "all 0.3s" }} />
                            ))}
                        </Stack>
                    </Stack>
                </Card>
            </Box>


        </Box>
    );
}

// ─── Login Form ───────────────────────────────────────────────────────────────
function LoginForm({ onSwitch }: { onSwitch: () => void }) {
    const router = useRouter();
    const { login } = useAuth();
    const [showPass, setShowPass] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (!email || !password) return;
        setLoading(true);
        setError("");
        try {
            await login(email, password);
            router.push("/dashboard");
        } catch (e: any) {
            setError(e?.message ?? "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        // Google auth not yet implemented
        setError("Google sign-in is not yet available.");
    };

    return (
        <Box sx={{ width: "100%", maxWidth: 420 }}>
            <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 800, fontSize: 30, mb: 0.8 }}>Welcome back</Typography>
            <Typography sx={{ color: C.muted, fontSize: 15, mb: 4 }}>Sign in to continue sharing skills.</Typography>

            <Button fullWidth onClick={handleGoogle} startIcon={<GoogleIcon />} sx={{
                border: `1px solid ${C.border}`, color: C.text, textTransform: "none",
                borderRadius: "12px", py: 1.4, fontSize: 14, fontWeight: 500, mb: 3,
                background: "rgba(240,237,232,0.04)",
                "&:hover": { background: "rgba(240,237,232,0.07)", borderColor: "rgba(240,237,232,0.15)" },
            }}>
                Continue with Google
            </Button>

            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Divider sx={{ flex: 1, borderColor: C.border }} />
                <Typography sx={{ color: C.faint, fontSize: 12 }}>or sign in with email</Typography>
                <Divider sx={{ flex: 1, borderColor: C.border }} />
            </Stack>

            <Stack spacing={2} mb={3}>
                <TextField fullWidth label="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ fontSize: 18, color: C.faint }} /></InputAdornment> }}
                    sx={inputSx}
                />
                <TextField fullWidth label="Password" type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><Lock sx={{ fontSize: 18, color: C.faint }} /></InputAdornment>,
                        endAdornment: <InputAdornment position="end">
                            <IconButton size="small" onClick={() => setShowPass(p => !p)} sx={{ color: C.faint }}>
                                {showPass ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                            </IconButton>
                        </InputAdornment>,
                    }}
                    sx={inputSx}
                />
            </Stack>

            <Stack direction="row" justifyContent="flex-end" mb={3}>
                <Typography sx={{ color: C.emerald, fontSize: 13, cursor: "pointer", fontWeight: 600, "&:hover": { opacity: 0.8 } }}>Forgot password?</Typography>
            </Stack>

            <Button fullWidth variant="contained" endIcon={<ArrowForward />} onClick={handleLogin} disabled={loading} sx={{
                background: `linear-gradient(135deg,${C.emerald},${C.coral})`, color: "#fff",
                textTransform: "none", borderRadius: "12px", py: 1.6, fontSize: 15,
                fontWeight: 700, boxShadow: "none", mb: 3,
                "&:hover": { boxShadow: `0 6px 24px ${C.emerald}44`, transform: "translateY(-1px)" },
                transition: "all 0.2s",
            }}>
            {loading ? "Signing in…" : "Sign in"}
            </Button>

            {error && (
                <Typography sx={{ color: "#F43A3A", fontSize: 13, textAlign: "center", mt: -1, mb: 1 }}>{error}</Typography>
            )}

            <Typography sx={{ textAlign: "center", color: C.muted, fontSize: 14 }}>
                Don&apos;t have an account?{" "}
                <span onClick={onSwitch} style={{ color: C.emerald, cursor: "pointer", fontWeight: 600 }}>Create one free</span>
            </Typography>
        </Box>
    );
}

// ─── Register Form ────────────────────────────────────────────────────────────
function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
    const router = useRouter();
    const { register } = useAuth();
    const [step, setStep] = useState(1);
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [form, setForm] = useState({ name: "", email: "", password: "", location: "", bio: "" });

    const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
    const toggleSkill = (s: string) => setSelectedSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

    const handleFinish = async () => {
        setLoading(true);
        setError("");
        try {
            await register({
                name: form.name,
                email: form.email,
                password: form.password,
                location: form.location,
            });
            router.push("/onboarding");
        } catch (e: any) {
            setError(e?.message ?? "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError("Google sign-up is not yet available.");
    };

    const steps = ["Account", "Profile", "Skills"];

    return (
        <Box sx={{ width: "100%", maxWidth: 440 }}>
            {/* Step indicator */}
            <Stack direction="row" alignItems="center" spacing={1} mb={4}>
                {steps.map((s, i) => (
                    <React.Fragment key={s}>
                        <Stack direction="row" alignItems="center" spacing={0.8}>
                            <Box sx={{
                                width: 28, height: 28, borderRadius: "50%",
                                background: i + 1 < step ? C.emerald : i + 1 === step ? `linear-gradient(135deg,${C.emerald},${C.coral})` : "rgba(240,237,232,0.08)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                border: `2px solid ${i + 1 <= step ? C.emerald : C.border}`,
                                transition: "all 0.3s",
                            }}>
                                {i + 1 < step
                                    ? <CheckCircle sx={{ fontSize: 16, color: "#fff" }} />
                                    : <Typography sx={{ fontSize: 12, fontWeight: 700, color: i + 1 === step ? "#fff" : C.faint }}>{i + 1}</Typography>
                                }
                            </Box>
                            <Typography sx={{ fontSize: 13, color: i + 1 === step ? C.text : C.faint, fontWeight: i + 1 === step ? 600 : 400 }}>{s}</Typography>
                        </Stack>
                        {i < steps.length - 1 && <Box sx={{ flex: 1, height: 1, background: i + 1 < step ? C.emerald : C.border, transition: "background 0.3s" }} />}
                    </React.Fragment>
                ))}
            </Stack>

            {/* Step 1 */}
            {step === 1 && (
                <Box>
                    <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 800, fontSize: 28, mb: 0.8 }}>Create your account</Typography>
                    <Typography sx={{ color: C.muted, fontSize: 14, mb: 4 }}>Join the community — it&apos;s completely free.</Typography>

                    <Button fullWidth onClick={handleGoogle} startIcon={<GoogleIcon />} sx={{ border: `1px solid ${C.border}`, color: C.text, textTransform: "none", borderRadius: "12px", py: 1.4, fontSize: 14, background: "rgba(240,237,232,0.04)", mb: 3, "&:hover": { background: "rgba(240,237,232,0.07)" } }}>
                        Sign up with Google
                    </Button>

                    <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                        <Divider sx={{ flex: 1, borderColor: C.border }} />
                        <Typography sx={{ color: C.faint, fontSize: 12 }}>or with email</Typography>
                        <Divider sx={{ flex: 1, borderColor: C.border }} />
                    </Stack>

                    <Stack spacing={2} mb={3}>
                        <TextField fullWidth label="Full name" value={form.name} onChange={e => update("name", e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ fontSize: 18, color: C.faint }} /></InputAdornment> }}
                            sx={inputSx}
                        />
                        <TextField fullWidth label="Email address" type="email" value={form.email} onChange={e => update("email", e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ fontSize: 18, color: C.faint }} /></InputAdornment> }}
                            sx={inputSx}
                        />
                        <TextField fullWidth label="Password" type={showPass ? "text" : "password"} value={form.password} onChange={e => update("password", e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Lock sx={{ fontSize: 18, color: C.faint }} /></InputAdornment>,
                                endAdornment: <InputAdornment position="end">
                                    <IconButton size="small" onClick={() => setShowPass(p => !p)} sx={{ color: C.faint }}>
                                        {showPass ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                                    </IconButton>
                                </InputAdornment>,
                            }}
                            sx={inputSx}
                        />
                    </Stack>

                    <Button fullWidth variant="contained" endIcon={<ArrowForward />} onClick={() => setStep(2)} sx={{
                        background: `linear-gradient(135deg,${C.emerald},${C.coral})`, color: "#fff",
                        textTransform: "none", borderRadius: "12px", py: 1.6, fontSize: 15,
                        fontWeight: 700, boxShadow: "none", mb: 3,
                        "&:hover": { boxShadow: `0 6px 24px ${C.emerald}44` }, transition: "all 0.2s",
                    }}>Continue</Button>

                    <Typography sx={{ textAlign: "center", color: C.muted, fontSize: 13 }}>
                        Already have an account?{" "}
                        <span onClick={onSwitch} style={{ color: C.emerald, cursor: "pointer", fontWeight: 600 }}>Sign in</span>
                    </Typography>
                </Box>
            )}

            {/* Step 2 */}
            {step === 2 && (
                <Box>
                    <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 800, fontSize: 28, mb: 0.8 }}>Tell us about yourself</Typography>
                    <Typography sx={{ color: C.muted, fontSize: 14, mb: 4 }}>This helps us match you with the right people nearby.</Typography>

                    <Stack spacing={2.5} mb={4}>
                        <TextField fullWidth label="Your location / city" value={form.location} onChange={e => update("location", e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start"><LocationOn sx={{ fontSize: 18, color: C.faint }} /></InputAdornment> }}
                            sx={inputSx}
                        />
                        <TextField fullWidth label="Short bio (optional)" multiline rows={3}
                            value={form.bio} onChange={e => update("bio", e.target.value)}
                            placeholder="Tell the community a little about yourself…"
                            sx={{ ...inputSx, "& textarea::placeholder": { color: C.faint } }}
                        />
                    </Stack>

                    <Stack direction="row" spacing={1.5}>
                        <Button fullWidth startIcon={<ArrowBack sx={{ fontSize: 16 }} />} onClick={() => setStep(1)} sx={{ border: `1px solid ${C.border}`, color: C.muted, textTransform: "none", borderRadius: "12px", py: 1.5, fontSize: 14, "&:hover": { borderColor: C.emerald, color: C.emerald } }}>Back</Button>
                        <Button fullWidth variant="contained" endIcon={<ArrowForward />} onClick={() => setStep(3)} sx={{ background: `linear-gradient(135deg,${C.emerald},${C.coral})`, color: "#fff", textTransform: "none", borderRadius: "12px", py: 1.5, fontSize: 14, fontWeight: 700, boxShadow: "none", "&:hover": { boxShadow: `0 4px 20px ${C.emerald}44` } }}>Continue</Button>
                    </Stack>
                </Box>
            )}

            {/* Step 3 */}
            {step === 3 && (
                <Box>
                    <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 800, fontSize: 28, mb: 0.8 }}>What can you share?</Typography>
                    <Typography sx={{ color: C.muted, fontSize: 14, mb: 3 }}>Pick categories you want to offer or learn.</Typography>

                    <Stack direction="row" flexWrap="wrap" gap={1.2} mb={4}>
                        {SKILL_CATEGORIES.map(cat => {
                            const selected = selectedSkills.includes(cat);
                            const color = ({ Tech: C.emerald, Music: C.coral, Career: C.gold, Wellness: C.emeraldLight, Creative: C.coralLight, Language: "#E8A838", Education: C.emerald, Sports: C.coral, Other: C.muted } as Record<string, string>)[cat] || C.muted;
                            return (
                                <Chip key={cat} label={cat} onClick={() => toggleSkill(cat)}
                                    icon={selected ? <CheckCircle sx={{ fontSize: 14, color: `${color} !important` }} /> : undefined}
                                    sx={{
                                        cursor: "pointer", fontWeight: 600, fontSize: 13,
                                        background: selected ? color + "20" : "rgba(240,237,232,0.05)",
                                        color: selected ? color : C.muted,
                                        border: `1px solid ${selected ? color + "55" : C.border}`,
                                        "&:hover": { background: color + "18" }, transition: "all 0.2s",
                                    }}
                                />
                            );
                        })}
                    </Stack>

                    {selectedSkills.length > 0 && (
                        <Box sx={{ p: 2, borderRadius: "12px", background: `${C.emerald}0A`, border: `1px solid ${C.emerald}22`, mb: 3 }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Psychology sx={{ fontSize: 16, color: C.emerald }} />
                                <Typography sx={{ fontSize: 13, color: C.emerald, fontWeight: 600 }}>
                                    {selectedSkills.length} categor{selectedSkills.length === 1 ? "y" : "ies"} selected
                                </Typography>
                            </Stack>
                            <Typography sx={{ fontSize: 12, color: C.muted, mt: 0.5 }}>
                                We&apos;ll find matches for: {selectedSkills.join(", ")}
                            </Typography>
                        </Box>
                    )}

                    <Stack direction="row" spacing={1.5}>
                        <Button fullWidth startIcon={<ArrowBack sx={{ fontSize: 16 }} />} onClick={() => setStep(2)} sx={{ border: `1px solid ${C.border}`, color: C.muted, textTransform: "none", borderRadius: "12px", py: 1.5, fontSize: 14, "&:hover": { borderColor: C.emerald, color: C.emerald } }}>Back</Button>
                        <Button fullWidth variant="contained" endIcon={<ArrowForward />} onClick={handleFinish} disabled={loading} sx={{ background: `linear-gradient(135deg,${C.emerald},${C.coral})`, color: "#fff", textTransform: "none", borderRadius: "12px", py: 1.5, fontSize: 14, fontWeight: 700, boxShadow: "none", "&:hover": { boxShadow: `0 4px 20px ${C.emerald}44` } }}>
                            {loading ? "Creating account…" : "Join SkillBridge"}
                        </Button>
                    </Stack>

                    <Typography sx={{ textAlign: "center", color: C.faint, fontSize: 12, mt: 2 }}>
                        By joining you agree to our Terms of Service and Privacy Policy
                    </Typography>
                    {error && (
                        <Typography sx={{ color: "#F43A3A", fontSize: 13, textAlign: "center", mt: 1 }}>{error}</Typography>
                    )}
                </Box>
            )}
        </Box>
    );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function AuthPage() {
    const router = useRouter();
    const [mode, setMode] = useState<"login" | "register">("login");

    return (
        <Box sx={{ background: C.ink, minHeight: "100vh", display: "flex", color: C.text }}>
            <LeftPanel />
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", px: { xs: 3, md: 6 }, py: 6, position: "relative" }}>
                <Button startIcon={<ArrowBack sx={{ fontSize: 15 }} />} onClick={() => router.push("/")} sx={{ position: "absolute", top: 24, left: 24, color: C.muted, textTransform: "none", fontSize: 13, "&:hover": { color: C.emerald, background: "transparent" } }}>
                    Back to home
                </Button>
                {mode === "login"
                    ? <LoginForm onSwitch={() => setMode("register")} />
                    : <RegisterForm onSwitch={() => setMode("login")} />
                }
            </Box>
        </Box>
    );
}