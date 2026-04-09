"use client";
// app/onboarding/page.tsx — First-time user onboarding flow (3 steps)

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Box, Button, Chip, Stack, TextField, Typography, LinearProgress,
} from "@mui/material";
import { ArrowForward, ArrowBack, CheckCircle, Handshake } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { SkillCategory } from "@/types";

const C = {
    emerald: "#10B981", coral: "#F4623A", gold: "#F4B83A",
    ink: "#080F1E", text: "#F0EDE8",
    muted: "rgba(240,237,232,0.52)", faint: "rgba(240,237,232,0.18)",
    border: "rgba(240,237,232,0.07)",
};

const CATEGORIES: { label: SkillCategory; emoji: string }[] = [
    { label: "Tech",      emoji: "💻" }, { label: "Career",    emoji: "💼" },
    { label: "Music",     emoji: "🎵" }, { label: "Wellness",  emoji: "🧘" },
    { label: "Creative",  emoji: "🎨" }, { label: "Language",  emoji: "🌍" },
];

const GOALS = [
    { label: "Teach skills I have",    emoji: "🎓" },
    { label: "Learn new skills",        emoji: "📚" },
    { label: "Do both",                 emoji: "🤝" },
];

const STEPS = ["Your goal", "Your skills", "Your location"];

export default function OnboardingPage() {
    const router = useRouter();
    const { user, updateUser } = useAuth();
    const { success } = useToast();

    const [step, setStep] = useState(0);
    const [goal, setGoal] = useState("");
    const [skills, setSkills] = useState<SkillCategory[]>([]);
    const [location, setLocation] = useState(user?.location ?? "");

    const toggleSkill = (s: SkillCategory) =>
        setSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

    const finish = () => {
        updateUser({ location });
        success("Welcome to SkillBridge! 🎉");
        router.push("/dashboard");
    };

    const progress = ((step + 1) / STEPS.length) * 100;

    return (
        <Box sx={{ background: "transparent", minHeight: "100vh", color: C.text, display: "flex", flexDirection: "column" }}>
            <Navbar />
            <Box sx={{
                flex: 1,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                px: 3, py: 8, position: "relative", overflow: "hidden",
            }}>
                {/* Background glows */}
                <Box sx={{ position: "absolute", top: "10%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle,${C.emerald}08,transparent 70%)`, pointerEvents: "none" }} />
                <Box sx={{ position: "absolute", bottom: "10%", right: "5%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle,${C.coral}08,transparent 70%)`, pointerEvents: "none" }} />

                <Box sx={{ width: "100%", maxWidth: 480, position: "relative", zIndex: 1 }}>

                {/* Progress */}
                <Stack direction="row" alignItems="center" spacing={2} mb={1.5}>
                    <LinearProgress variant="determinate" value={progress} sx={{ flex: 1, height: 5, borderRadius: 3, background: C.faint, "& .MuiLinearProgress-bar": { background: `linear-gradient(90deg,${C.emerald},${C.coral})`, borderRadius: 3 } }} />
                    <Typography sx={{ color: C.muted, fontSize: 13, flexShrink: 0 }}>Step {step + 1} of {STEPS.length}</Typography>
                </Stack>
                <Typography sx={{ color: C.muted, fontSize: 12, mb: 4 }}>{STEPS[step]}</Typography>

                {/* Step 1 — Goal */}
                {step === 0 && (
                    <Box>
                        <Typography sx={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: 28, mb: 1 }}>What brings you here?</Typography>
                        <Typography sx={{ color: C.muted, fontSize: 15, mb: 4 }}>We&apos;ll personalise your experience based on your goal.</Typography>
                        <Stack spacing={1.5}>
                            {GOALS.map(g => (
                                <Box key={g.label} onClick={() => setGoal(g.label)} sx={{
                                    p: 2.5, borderRadius: "16px", cursor: "pointer",
                                    border: `2px solid ${goal === g.label ? C.emerald : C.border}`,
                                    background: goal === g.label ? `${C.emerald}10` : "rgba(240,237,232,0.02)",
                                    display: "flex", alignItems: "center", gap: 2,
                                    transition: "all 0.2s",
                                }}>
                                    <Typography sx={{ fontSize: 28 }}>{g.emoji}</Typography>
                                    <Typography sx={{ color: goal === g.label ? C.emerald : C.text, fontWeight: goal === g.label ? 700 : 500, fontSize: 16 }}>{g.label}</Typography>
                                    {goal === g.label && <CheckCircle sx={{ color: C.emerald, ml: "auto", fontSize: 20 }} />}
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                )}

                {/* Step 2 — Skill categories */}
                {step === 1 && (
                    <Box>
                        <Typography sx={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: 28, mb: 1 }}>What are you into?</Typography>
                        <Typography sx={{ color: C.muted, fontSize: 15, mb: 4 }}>Pick the categories that interest you most. Select a few!</Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                            {CATEGORIES.map(c => {
                                const active = skills.includes(c.label);
                                return (
                                    <Box key={c.label} onClick={() => toggleSkill(c.label)} sx={{
                                        px: 2.5, py: 1.5, borderRadius: "14px", cursor: "pointer",
                                        border: `2px solid ${active ? C.emerald : C.border}`,
                                        background: active ? `${C.emerald}15` : "rgba(240,237,232,0.02)",
                                        display: "flex", alignItems: "center", gap: 1,
                                        transition: "all 0.15s",
                                    }}>
                                        <Typography sx={{ fontSize: 20 }}>{c.emoji}</Typography>
                                        <Typography sx={{ color: active ? C.emerald : C.text, fontWeight: active ? 700 : 500, fontSize: 14 }}>{c.label}</Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                )}

                {/* Step 3 — Location */}
                {step === 2 && (
                    <Box>
                        <Typography sx={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: 28, mb: 1 }}>Where are you based?</Typography>
                        <Typography sx={{ color: C.muted, fontSize: 15, mb: 4 }}>We&apos;ll show you skills and people nearby.</Typography>
                        <TextField fullWidth placeholder="e.g. Mathura, Uttar Pradesh" value={location} onChange={e => setLocation(e.target.value)}
                            sx={{ "& .MuiOutlinedInput-root": { color: C.text, borderRadius: "14px", fontSize: 16, "& fieldset": { borderColor: C.border }, "&:hover fieldset": { borderColor: `${C.emerald}66` }, "&.Mui-focused fieldset": { borderColor: C.emerald } } }}
                        />
                        <Stack direction="row" flexWrap="wrap" gap={1} mt={2.5}>
                            {["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Mathura"].map(city => (
                                <Chip key={city} label={city} onClick={() => setLocation(city)} size="small"
                                    sx={{ background: location === city ? `${C.emerald}20` : C.border, color: location === city ? C.emerald : C.muted, cursor: "pointer", "&:hover": { background: `${C.emerald}15` } }} />
                            ))}
                        </Stack>
                    </Box>
                )}

                {/* Navigation */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" mt={5}>
                    {step > 0 ? (
                        <Button startIcon={<ArrowBack />} onClick={() => setStep(s => s - 1)} sx={{ color: C.muted, textTransform: "none" }}>Back</Button>
                    ) : <Box />}
                    {step < STEPS.length - 1 ? (
                        <Button
                            variant="contained"
                            endIcon={<ArrowForward />}
                            disabled={step === 0 && !goal || step === 1 && skills.length === 0}
                            onClick={() => setStep(s => s + 1)}
                            sx={{ background: `linear-gradient(135deg,${C.emerald},${C.coral})`, color: "#fff", textTransform: "none", borderRadius: "14px", px: 3.5, py: 1.3, boxShadow: "none" }}
                        >
                            Continue
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            endIcon={<CheckCircle />}
                            disabled={!location.trim()}
                            onClick={finish}
                            sx={{ background: `linear-gradient(135deg,${C.emerald},${C.coral})`, color: "#fff", textTransform: "none", borderRadius: "14px", px: 3.5, py: 1.3, boxShadow: "none", fontWeight: 700 }}
                        >
                            Get started
                        </Button>
                    )}
                </Stack>
            </Box>
        </Box>
            <Footer />
        </Box>
    );
}
