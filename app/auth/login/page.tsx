"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
    Box, Button, Container, Grid, Stack,
    Typography, Avatar, TextField, Divider, 
    CircularProgress, IconButton, InputAdornment,
} from "@mui/material";
import {
    CheckCircle, Google, Visibility, VisibilityOff,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

// ─── Constants ────────────────────────────────────────────────────────────────
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

const DEMO_ACCOUNTS = [
    { name: "Aarav Mehta", email: "aarav@demo.com", role: "Expert Mentor" },
    { name: "Priya Sharma", email: "priya@demo.com", role: "Community Lead" },
    { name: "Rahul Krishnan", email: "rahul@demo.com", role: "Active Member" },
];

// ─── Demo Mode Toggle ─────────────────────────────────────────────────────────
function DemoModeSection({ onSelect }: { onSelect: (email: string) => void }) {
    return (
        <Box sx={{ mt: 1.5, p: 2, borderRadius: "16px", background: `${C.gold}08`, border: `1px dashed ${C.gold}33` }}>
            <Typography sx={{ color: C.gold, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", mb: 1.5, textAlign: "center" }}>
                Developer Demo Accounts
            </Typography>
            <Stack direction="row" spacing={1}>
                {DEMO_ACCOUNTS.map(acc => (
                    <Button 
                        key={acc.email} 
                        fullWidth 
                        onClick={() => onSelect(acc.email)}
                        sx={{ 
                            flex: 1, p: 1, minWidth: 0, textTransform: "none", display: "flex", flexDirection: "column",
                            border: `1px solid ${C.border}`, borderRadius: "10px", background: "rgba(8,15,30,0.4)",
                            "&:hover": { borderColor: C.gold, background: `${C.gold}10` }
                        }}
                    >
                        <Avatar sx={{ width: 24, height: 24, fontSize: 10, mb: 0.5, background: C.gold }}>{acc.name[0]}</Avatar>
                        <Typography sx={{ color: C.text, fontSize: 9, fontWeight: 600, whiteSpace: "nowrap" }}>{acc.name.split(" ")[0]}</Typography>
                    </Button>
                ))}
            </Stack>
        </Box>
    );
}

// ─── LoginForm ────────────────────────────────────────────────────────────────
function LoginForm({ 
    onToggle, 
    onSuccess 
}: { 
    onToggle: () => void;
    onSuccess: () => void;
}) {
    const { login, googleLogin } = useAuth();
    const { success, error: toastError } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSandbox, setShowSandbox] = useState(false);
    const [guest, setGuest] = useState({ name: "", email: "" });

    const handleLogin = async () => {
        if (!email || !password) return setError("Please fill in both fields.");
        setLoading(true);
        setError("");
        try {
            await login(email, password);
            success("Welcome back!");
            onSuccess();
        } catch (e: any) {
            setError(e.response?.data?.detail || "Invalid credentials.");
            toastError("Login failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleGuestAction = async (demoEmail?: string) => {
        setLoading(true);
        setError("");
        try {
            const emailToUse = demoEmail || guest.email;
            if (!emailToUse) throw new Error("Email is required.");
            const acc = DEMO_ACCOUNTS.find(a => a.email === emailToUse);
            await googleLogin({
                email: emailToUse,
                name: acc?.name || guest.name || emailToUse.split("@")[0],
                image: `https://ui-avatars.com/api/?name=${acc?.name || guest.name || "G"}&background=random`
            });
            success("Logged in successfully!");
            onSuccess();
        } catch (e: any) {
            setError(e.message || "Sign-in failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ animation: "fadeIn 0.5s ease" }}>
            <Typography sx={{ color: C.text, fontWeight: 700, fontSize: 24, mb: 1 }}>Sign in</Typography>
            <Typography sx={{ color: C.muted, fontSize: 14, mb: 3.5 }}>Continue your journey on SkillBridge</Typography>
            
            {error && (
                <Box sx={{ p: 1.5, mb: 2.5, borderRadius: "10px", background: "rgba(244,98,58,0.1)", border: `1px solid ${C.coral}33` }}>
                    <Typography sx={{ color: C.coral, fontSize: 13, textAlign: "center", fontWeight: 500 }}>{error}</Typography>
                </Box>
            )}

            {!showSandbox ? (
                <Button 
                    fullWidth onClick={() => setShowSandbox(true)} disabled={loading}
                    startIcon={<Google sx={{ color: C.coral }} />}
                    sx={{ p: 1.5, borderRadius: "14px", border: `1px solid ${C.border}`, color: C.text, textTransform: "none", fontSize: 14, fontWeight: 600, "&:hover": { background: "rgba(240,237,232,0.05)", borderColor: C.muted } }}
                >
                    Continue with Google
                </Button>
            ) : (
                <Box sx={{ p: 2.5, borderRadius: "20px", background: "rgba(240,237,232,0.03)", border: `1px solid ${C.emerald}33`, animation: "slideUp 0.3s ease" }}>
                    <Typography sx={{ color: C.emerald, fontSize: 11, fontWeight: 900, mb: 2.5, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.1em" }}>Google Sandbox Login</Typography>
                    <Stack spacing={2}>
                        <TextField fullWidth size="small" placeholder="Your Name" value={guest.name} onChange={e => setGuest(g => ({ ...g, name: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", background: "rgba(240,237,232,0.02)", color: "#fff", "& fieldset": { borderColor: C.border } } }} />
                        <TextField fullWidth size="small" placeholder="Your real email (from your PC)" value={guest.email} onChange={e => setGuest(g => ({ ...g, email: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", background: "rgba(240,237,232,0.02)", color: "#fff", "& fieldset": { borderColor: C.border } } }} />
                        <Button fullWidth variant="contained" disabled={loading} onClick={() => handleGuestAction()} sx={{ py: 1.2, background: C.emerald, color: "#fff", borderRadius: "10px", textTransform: "none", fontWeight: 700 }}>
                            {loading ? "Signing in..." : "Sign in with my Email"}
                        </Button>
                        <DemoModeSection onSelect={(email) => handleGuestAction(email)} />
                        <Button fullWidth onClick={() => setShowSandbox(false)} sx={{ color: C.muted, textTransform: "none", fontSize: 12 }}>Back to regular login</Button>
                    </Stack>
                </Box>
            )}

            {!showSandbox && (
                <>
                    <Box sx={{ mt: 3, position: "relative", textAlign: "center" }}>
                        <Divider sx={{ borderColor: C.border }}>
                            <Typography sx={{ px: 2, fontSize: 11, color: C.faint, fontWeight: 700 }}>OR EMAIL/PASSWORD</Typography>
                        </Divider>
                    </Box>

                    <Stack spacing={2.5} mt={3}>
                        <TextField 
                            fullWidth label="Email address" placeholder="name@example.com"
                            value={email} onChange={e => setEmail(e.target.value)}
                            InputLabelProps={{ sx: { color: C.muted, fontSize: 14 } }}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", background: "rgba(240,237,232,0.03)", color: C.text, "& fieldset": { borderColor: C.border } } }}
                        />
                        <Box>
                            <TextField 
                                fullWidth label="Password" 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••"
                                value={password} onChange={e => setPassword(e.target.value)}
                                InputLabelProps={{ sx: { color: C.muted, fontSize: 14 } }}
                                onKeyDown={e => e.key === "Enter" && handleLogin()}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: C.faint }}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", background: "rgba(240,237,232,0.03)", color: C.text, "& fieldset": { borderColor: C.border } } }}
                            />
                            <Typography sx={{ mt: 1, color: C.coral, fontSize: 12, textAlign: "right", cursor: "pointer", fontWeight: 600 }}>Forgot password?</Typography>
                        </Box>
                        <Button 
                            fullWidth variant="contained" onClick={handleLogin} disabled={loading}
                            sx={{ p: 1.6, borderRadius: "14px", background: `linear-gradient(135deg,${C.emerald},${C.coral})`, color: "#fff", fontWeight: 800, textTransform: "none", fontSize: 16, "&:hover": { transform: "translateY(-1px)", boxShadow: `0 8px 25px ${C.emerald}44` } }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Sign in"}
                        </Button>
                    </Stack>
                </>
            )}

            <Typography sx={{ mt: 4, textAlign: "center", color: C.muted, fontSize: 14 }}>
                Don&apos;t have an account? <span onClick={onToggle} style={{ color: C.emerald, fontWeight: 700, cursor: "pointer" }}>Create one free</span>
            </Typography>
        </Box>
    );
}

// ─── RegisterForm ─────────────────────────────────────────────────────────────
function RegisterForm({ onToggle, onSuccess }: { onToggle: () => void; onSuccess: () => void }) {
    const { register, googleLogin } = useAuth();
    const { success, error: toastError } = useToast();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSandbox, setShowSandbox] = useState(false);
    const [guest, setGuest] = useState({ name: "", email: "" });

    const handleRegister = async () => {
        if (!name || !email || !password) return setError("Please fill in fields.");
        setLoading(true);
        setError("");
        try {
            await register({ name, email, password, location });
            success("Account created successfully!");
            onSuccess();
        } catch (e: any) {
            setError(e.response?.data?.detail || "Registration failed.");
            toastError("Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleGuestAction = async (demoEmail?: string) => {
        setLoading(true);
        setError("");
        try {
            const emailToUse = demoEmail || guest.email;
            if (!emailToUse) throw new Error("Email is required.");
            const acc = DEMO_ACCOUNTS.find(a => a.email === emailToUse);
            await googleLogin({
                email: emailToUse,
                name: acc?.name || guest.name || emailToUse.split("@")[0],
                image: `https://ui-avatars.com/api/?name=${acc?.name || guest.name || "G"}&background=random`
            });
            success("Joined successfully!");
            onSuccess();
        } catch (e: any) {
            setError(e.message || "Sign-up failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ animation: "fadeIn 0.5s ease" }}>
            <Typography sx={{ color: C.text, fontWeight: 700, fontSize: 24, mb: 1 }}>Join SkillBridge</Typography>
            <Typography sx={{ color: C.muted, fontSize: 14, mb: 3.5 }}>Start sharing and learning today</Typography>

            {error && (
                <Box sx={{ p: 1.5, mb: 2.5, borderRadius: "10px", background: "rgba(244,98,58,0.1)", border: `1px solid ${C.coral}33` }}>
                    <Typography sx={{ color: C.coral, fontSize: 13, textAlign: "center", fontWeight: 500 }}>{error}</Typography>
                </Box>
            )}

            {!showSandbox ? (
                <Button 
                    fullWidth onClick={() => setShowSandbox(true)} disabled={loading}
                    startIcon={<Google sx={{ color: C.coral }} />}
                    sx={{ p: 1.5, borderRadius: "14px", border: `1px solid ${C.border}`, color: C.text, textTransform: "none", fontSize: 14, fontWeight: 600, "&:hover": { background: "rgba(240,237,232,0.05)", borderColor: C.muted } }}
                >
                    Sign up with Google
                </Button>
            ) : (
                <Box sx={{ p: 2.5, borderRadius: "20px", background: "rgba(240,237,232,0.03)", border: `1px solid ${C.emerald}33`, animation: "slideUp 0.3s ease" }}>
                    <Typography sx={{ color: C.emerald, fontSize: 11, fontWeight: 900, mb: 2.5, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.1em" }}>Google Sandbox Signup</Typography>
                    <Stack spacing={2}>
                        <TextField fullWidth size="small" placeholder="Your Name" value={guest.name} onChange={e => setGuest(g => ({ ...g, name: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", background: "rgba(240,237,232,0.02)", color: "#fff", "& fieldset": { borderColor: C.border } } }} />
                        <TextField fullWidth size="small" placeholder="Your real email (from your PC)" value={guest.email} onChange={e => setGuest(g => ({ ...g, email: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", background: "rgba(240,237,232,0.02)", color: "#fff", "& fieldset": { borderColor: C.border } } }} />
                        <Button fullWidth variant="contained" disabled={loading} onClick={() => handleGuestAction()} sx={{ py: 1.2, background: C.emerald, color: "#fff", borderRadius: "10px", textTransform: "none", fontWeight: 700 }}>
                            {loading ? "Joining..." : "Join with my Email"}
                        </Button>
                        <DemoModeSection onSelect={(email) => handleGuestAction(email)} />
                        <Button fullWidth onClick={() => setShowSandbox(false)} sx={{ color: C.muted, textTransform: "none", fontSize: 12 }}>Back to regular signup</Button>
                    </Stack>
                </Box>
            )}

            {!showSandbox && (
                <>
                    <Box sx={{ mt: 3, position: "relative", textAlign: "center" }}>
                        <Divider sx={{ borderColor: C.border }}>
                            <Typography sx={{ px: 2, fontSize: 11, color: C.faint, fontWeight: 700 }}>OR USE EMAIL</Typography>
                        </Divider>
                    </Box>

                    <Stack spacing={2} mt={3}>
                        <TextField 
                            fullWidth label="Full Name" placeholder="John Doe"
                            value={name} onChange={e => setName(e.target.value)}
                            InputLabelProps={{ sx: { color: C.muted, fontSize: 14 } }}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", background: "rgba(240,237,232,0.03)", color: C.text, "& fieldset": { borderColor: C.border } } }}
                        />
                        <TextField 
                            fullWidth label="Email" placeholder="name@example.com"
                            value={email} onChange={e => setEmail(e.target.value)}
                            InputLabelProps={{ sx: { color: C.muted, fontSize: 14 } }}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", background: "rgba(240,237,232,0.03)", color: C.text, "& fieldset": { borderColor: C.border } } }}
                        />
                        <TextField 
                            fullWidth label="Password" type="password" placeholder="••••••••"
                            value={password} onChange={e => setPassword(e.target.value)}
                            InputLabelProps={{ sx: { color: C.muted, fontSize: 14 } }}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", background: "rgba(240,237,232,0.03)", color: C.text, "& fieldset": { borderColor: C.border } } }}
                        />
                        <TextField 
                            fullWidth label="Location" placeholder="Mathura, UP"
                            value={location} onChange={e => setLocation(e.target.value)}
                            InputLabelProps={{ sx: { color: C.muted, fontSize: 14 } }}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", background: "rgba(240,237,232,0.03)", color: C.text, "& fieldset": { borderColor: C.border } } }}
                        />
                        <Button 
                            fullWidth variant="contained" onClick={handleRegister} disabled={loading}
                            sx={{ mt: 1, p: 1.6, borderRadius: "14px", background: `linear-gradient(135deg,${C.emerald},${C.coral})`, color: "#fff", fontWeight: 800, textTransform: "none", fontSize: 16, "&:hover": { transform: "translateY(-1px)", boxShadow: `0 8px 25px ${C.emerald}44` } }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Create account"}
                        </Button>
                    </Stack>
                </>
            )}

            <Typography sx={{ mt: 4, textAlign: "center", color: C.muted, fontSize: 14 }}>
                Already have an account? <span onClick={onToggle} style={{ color: C.emerald, fontWeight: 700, cursor: "pointer" }}>Sign in</span>
            </Typography>
        </Box>
    );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function LoginPage() {
    const router = useRouter();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [mode, setMode] = useState<"login" | "register">("login");

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, authLoading, router]);

    if (authLoading) return null;

    return (
        <Box sx={{ minHeight: "100vh", background: C.ink, color: C.text, display: "flex", flexDirection: "column" }}>
            <Navbar />
            
            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
                <Container maxWidth="sm">
                    <Grid container spacing={0} sx={{ borderRadius: "28px", overflow: "hidden", border: `1px solid ${C.border}`, background: "rgba(240,237,232,0.012)", backdropFilter: "blur(20px)" }}>
                        {/* Left side (Visual/Branding) */}
                        <Grid size={{ xs: 0, md: 5 }} sx={{ display: { xs: "none", md: "flex" }, background: `linear-gradient(135deg,${C.emerald}15,${C.coral}15)`, borderRight: `1px solid ${C.border}`, p: 4, flexDirection: "column", justifyContent: "space-between" }}>
                            <Box>
                                <Typography sx={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 28, mb: 2, background: `linear-gradient(135deg,${C.emerald},${C.coral})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                    Bridge your skills, build your future.
                                </Typography>
                                <Typography sx={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>
                                    Join a community where knowledge is the only currency. Exchange your expertise for learning, completely free.
                                </Typography>
                            </Box>
                            
                            <Stack spacing={2}>
                                {[
                                    { label: "12k+ Sessions host", color: C.emerald },
                                    { label: "Community verified", color: C.gold },
                                    { label: "Zero fee forever", color: C.coral },
                                ].map(item => (
                                    <Stack key={item.label} direction="row" alignItems="center" spacing={1.5}>
                                        <CheckCircle sx={{ fontSize: 18, color: item.color }} />
                                        <Typography sx={{ color: C.muted, fontSize: 13, fontWeight: 500 }}>{item.label}</Typography>
                                    </Stack>
                                ))}
                            </Stack>
                        </Grid>

                        {/* Right side (Forms) */}
                        <Grid size={{ xs: 12, md: 7 }} sx={{ p: { xs: 4, md: 6 }, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {mode === "login" 
                                ? <LoginForm onToggle={() => setMode("register")} onSuccess={() => router.push("/dashboard")} />
                                : <RegisterForm onToggle={() => setMode("login")} onSuccess={() => router.push("/onboarding")} />
                            }
                        </Grid>
                    </Grid>

                    <Typography sx={{ mt: 4, mb: 2, textAlign: "center", fontSize: 12, color: C.faint }}>
                        &copy; 2026 SkillBridge Community. All rights reserved. Built with passion for knowledge sharing.
                    </Typography>
                </Container>
            </Box>
            
            <Footer />
        </Box>
    );
}