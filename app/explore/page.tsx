"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
    Box, Button, Card, Chip, Container, Grid, Stack,
    Typography, Avatar, IconButton, TextField, InputAdornment,
    Slider, Divider, Badge,
} from "@mui/material";
import {
    Search, LocationOn, Star, People, AccessTime,
    Handshake, FilterList, GridView, Map, Close,
    ArrowForward, FiberManualRecord, Psychology,
    TuneRounded, MyLocation,
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
const CATEGORIES = ["All", "Tech", "Music", "Career", "Wellness", "Creative", "Language", "Education", "Sports"];

const CAT_COLORS: Record<string, string> = {
    Tech: C.emerald, Music: C.coral, Career: C.gold,
    Wellness: C.emeraldLight, Creative: C.coralLight,
    Language: "#E8A838", Education: C.emerald, Sports: C.coral, All: C.muted,
};

const ALL_SKILLS = [
    { id: 1, title: "Python tutoring", category: "Tech", person: "Anurag S.", location: "Mathura", distance: 0.5, rating: 4.9, sessions: 24, available: true, initials: "AS", color: C.emerald, desc: "From basics to APIs. Beginner friendly." },
    { id: 2, title: "Guitar lessons", category: "Music", person: "Arjun M.", location: "Mathura", distance: 1.2, rating: 4.8, sessions: 15, available: true, initials: "AM", color: C.coral, desc: "Acoustic, chords, strumming, music theory." },
    { id: 3, title: "Resume writing", category: "Career", person: "Priya S.", location: "Agra", distance: 2.4, rating: 5.0, sessions: 18, available: true, initials: "PS", color: C.gold, desc: "ATS-friendly resumes and LinkedIn profiles." },
    { id: 4, title: "Yoga sessions", category: "Wellness", person: "Kavya R.", location: "Mathura", distance: 0.8, rating: 4.9, sessions: 31, available: true, initials: "KR", color: C.emeraldLight, desc: "Morning yoga for beginners and intermediates." },
    { id: 5, title: "UI/UX Design", category: "Creative", person: "Sneha V.", location: "Noida", distance: 3.1, rating: 5.0, sessions: 12, available: false, initials: "SV", color: C.coralLight, desc: "Figma, design systems, user research basics." },
    { id: 6, title: "Spoken English", category: "Language", person: "Rahul J.", location: "Agra", distance: 2.1, rating: 4.8, sessions: 22, available: true, initials: "RJ", color: "#E8A838", desc: "Fluency, pronunciation, confidence building." },
    { id: 7, title: "Data Science intro", category: "Tech", person: "Meera P.", location: "Delhi", distance: 4.5, rating: 4.7, sessions: 9, available: true, initials: "MP", color: C.emerald, desc: "Pandas, NumPy, matplotlib and basic ML." },
    { id: 8, title: "Cooking classes", category: "Education", person: "Fatima K.", location: "Lucknow", distance: 5.2, rating: 4.9, sessions: 27, available: true, initials: "FK", color: C.coral, desc: "Indian and continental recipes from scratch." },
    { id: 9, title: "Photography basics", category: "Creative", person: "Aditya N.", location: "Jaipur", distance: 6.1, rating: 4.7, sessions: 11, available: false, initials: "AN", color: C.coralLight, desc: "Composition, lighting, and editing in Lightroom." },
    { id: 10, title: "JavaScript basics", category: "Tech", person: "Rohan K.", location: "Delhi", distance: 4.8, rating: 4.8, sessions: 14, available: true, initials: "RK", color: C.emerald, desc: "DOM, events, ES6 features and async JS." },
    { id: 11, title: "Badminton coaching", category: "Sports", person: "Vikram S.", location: "Mathura", distance: 1.5, rating: 4.6, sessions: 8, available: true, initials: "VS", color: C.coral, desc: "Footwork, smash, defence for all levels." },
    { id: 12, title: "Hindi calligraphy", category: "Creative", person: "Nisha P.", location: "Agra", distance: 2.8, rating: 5.0, sessions: 6, available: true, initials: "NP", color: C.coralLight, desc: "Devanagari script, brush pens and ink art." },
];

// Map pin positions (simulated — relative % positions on the map)
const MAP_PINS = [
    { id: 1, x: 38, y: 42, title: "Python tutoring", color: C.emerald },
    { id: 2, x: 52, y: 55, title: "Guitar lessons", color: C.coral },
    { id: 3, x: 65, y: 35, title: "Resume writing", color: C.gold },
    { id: 4, x: 44, y: 62, title: "Yoga sessions", color: C.emeraldLight },
    { id: 5, x: 72, y: 48, title: "UI/UX Design", color: C.coralLight },
    { id: 6, x: 58, y: 70, title: "Spoken English", color: "#E8A838" },
    { id: 7, x: 30, y: 30, title: "Data Science", color: C.emerald },
    { id: 8, x: 80, y: 60, title: "Cooking classes", color: C.coral },
    { id: 9, x: 22, y: 65, title: "Photography", color: C.coralLight },
    { id: 10, x: 48, y: 28, title: "JavaScript", color: C.emerald },
    { id: 11, x: 35, y: 75, title: "Badminton", color: C.coral },
    { id: 12, x: 68, y: 22, title: "Calligraphy", color: C.coralLight },
];



// ─── Search Hero ──────────────────────────────────────────────────────────────
function SearchHero({ query, setQuery }: { query: string; setQuery: (v: string) => void }) {
    return (
        <Box sx={{
            background: `linear-gradient(135deg,${C.emerald}0D,${C.coral}08)`,
            border: `1px solid ${C.emerald}18`, borderRadius: "24px",
            p: { xs: 3, md: 4 }, mb: 3, position: "relative", overflow: "hidden",
        }}>
            <Box sx={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle,${C.coral}12,transparent 70%)`, pointerEvents: "none" }} />
            <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 800, fontSize: { xs: 24, md: 32 }, mb: 0.8 }}>
                Explore skills near you
            </Typography>
            <Typography sx={{ color: C.muted, fontSize: 15, mb: 3 }}>
                Find people nearby who are sharing what they know — completely free.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <TextField
                    fullWidth placeholder="Search skills, topics, or people…"
                    value={query} onChange={e => setQuery(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 20, color: C.faint }} /></InputAdornment>,
                        endAdornment: query ? <InputAdornment position="end"><IconButton size="small" onClick={() => setQuery("")} sx={{ color: C.faint }}><Close sx={{ fontSize: 16 }} /></IconButton></InputAdornment> : null,
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "14px", background: "rgba(240,237,232,0.05)",
                            fontSize: 15, color: C.text,
                            "& fieldset": { borderColor: C.border },
                            "&:hover fieldset": { borderColor: `${C.emerald}44` },
                            "&.Mui-focused fieldset": { borderColor: C.emerald },
                        },
                        "& input::placeholder": { color: C.faint },
                    }}
                />
                <Button variant="contained" sx={{
                    background: `linear-gradient(135deg,${C.emerald},${C.coral})`, color: "#fff",
                    textTransform: "none", borderRadius: "14px", px: 3.5, fontSize: 15,
                    fontWeight: 600, boxShadow: "none", whiteSpace: "nowrap",
                    "&:hover": { boxShadow: `0 4px 20px ${C.emerald}44` },
                }}>
                    Search
                </Button>
                <Button startIcon={<MyLocation sx={{ fontSize: 17 }} />} sx={{
                    borderColor: C.border, color: C.muted, border: "1px solid",
                    textTransform: "none", borderRadius: "14px", px: 2.5, fontSize: 14, whiteSpace: "nowrap",
                    "&:hover": { borderColor: C.emerald, color: C.emerald },
                }}>
                    Near me
                </Button>
            </Stack>
        </Box>
    );
}

// ─── Category Pills ───────────────────────────────────────────────────────────
function CategoryPills({ active, setActive }: { active: string; setActive: (c: string) => void }) {
    return (
        <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: "auto", pb: 0.5, "&::-webkit-scrollbar": { height: 0 } }}>
            {CATEGORIES.map(cat => (
                <Chip key={cat} label={cat} onClick={() => setActive(cat)} sx={{
                    cursor: "pointer", fontWeight: 600, fontSize: 13, flexShrink: 0,
                    background: active === cat ? (CAT_COLORS[cat] || C.emerald) + "22" : "rgba(240,237,232,0.05)",
                    color: active === cat ? (CAT_COLORS[cat] || C.emerald) : C.muted,
                    border: `1px solid ${active === cat ? (CAT_COLORS[cat] || C.emerald) + "55" : C.border}`,
                    "&:hover": { background: (CAT_COLORS[cat] || C.emerald) + "18" },
                    transition: "all 0.2s",
                }} />
            ))}
        </Stack>
    );
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────
function FilterSidebar({
    maxDist, setMaxDist, minRating, setMinRating,
    onlyAvailable, setOnlyAvailable, onClear,
}: {
    maxDist: number; setMaxDist: (v: number) => void;
    minRating: number; setMinRating: (v: number) => void;
    onlyAvailable: boolean; setOnlyAvailable: (v: boolean) => void;
    onClear: () => void;
}) {
    return (
        <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 2.5, position: "sticky", top: 80 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <TuneRounded sx={{ fontSize: 18, color: C.emerald }} />
                    <Typography sx={{ color: C.text, fontWeight: 700, fontSize: 16 }}>Filters</Typography>
                </Stack>
                <Typography onClick={onClear} sx={{ fontSize: 12, color: C.coral, cursor: "pointer", fontWeight: 600, "&:hover": { opacity: 0.8 } }}>Clear all</Typography>
            </Stack>

            {/* Distance */}
            <Box sx={{ mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" mb={1.5}>
                    <Typography sx={{ color: C.muted, fontSize: 13, fontWeight: 600 }}>Max distance</Typography>
                    <Typography sx={{ color: C.emerald, fontSize: 13, fontWeight: 700 }}>{maxDist} km</Typography>
                </Stack>
                <Slider value={maxDist} onChange={(_, v) => setMaxDist(v as number)} min={1} max={20} step={1}
                    sx={{
                        color: C.emerald,
                        "& .MuiSlider-thumb": { width: 16, height: 16, background: C.emerald, "&:hover": { boxShadow: `0 0 0 8px ${C.emerald}22` } },
                        "& .MuiSlider-track": { background: `linear-gradient(90deg,${C.emerald},${C.coral})`, border: "none" },
                        "& .MuiSlider-rail": { background: C.border },
                    }}
                />
                <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: 10, color: C.faint }}>1 km</Typography>
                    <Typography sx={{ fontSize: 10, color: C.faint }}>20 km</Typography>
                </Stack>
            </Box>

            <Divider sx={{ borderColor: C.border, mb: 3 }} />

            {/* Min rating */}
            <Box sx={{ mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" mb={1.5}>
                    <Typography sx={{ color: C.muted, fontSize: 13, fontWeight: 600 }}>Min rating</Typography>
                    <Typography sx={{ color: C.gold, fontSize: 13, fontWeight: 700 }}>{minRating}+</Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                    {[4.0, 4.5, 4.7, 4.9].map(r => (
                        <Chip key={r} label={r} size="small" onClick={() => setMinRating(r)} sx={{
                            cursor: "pointer", fontWeight: 600, fontSize: 11, flex: 1,
                            background: minRating === r ? `${C.gold}22` : "rgba(240,237,232,0.04)",
                            color: minRating === r ? C.gold : C.muted,
                            border: `1px solid ${minRating === r ? C.gold + "55" : C.border}`,
                            "&:hover": { background: `${C.gold}15` },
                        }} />
                    ))}
                </Stack>
            </Box>

            <Divider sx={{ borderColor: C.border, mb: 3 }} />

            {/* Availability */}
            <Box sx={{ mb: 2 }}>
                <Typography sx={{ color: C.muted, fontSize: 13, fontWeight: 600, mb: 1.5 }}>Availability</Typography>
                <Box onClick={() => setOnlyAvailable(!onlyAvailable)} sx={{
                    p: 1.5, borderRadius: "12px", cursor: "pointer",
                    background: onlyAvailable ? `${C.emerald}12` : "rgba(240,237,232,0.03)",
                    border: `1px solid ${onlyAvailable ? C.emerald + "44" : C.border}`,
                    "&:hover": { borderColor: C.emerald + "33" }, transition: "all 0.2s",
                }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <FiberManualRecord sx={{ fontSize: 10, color: onlyAvailable ? C.emerald : C.faint }} />
                            <Typography sx={{ fontSize: 13, color: onlyAvailable ? C.emerald : C.muted, fontWeight: onlyAvailable ? 600 : 400 }}>
                                Available now
                            </Typography>
                        </Stack>
                        <Box sx={{ width: 32, height: 18, borderRadius: "9px", background: onlyAvailable ? C.emerald : "rgba(240,237,232,0.1)", transition: "background 0.2s", position: "relative" }}>
                            <Box sx={{ position: "absolute", top: 2, left: onlyAvailable ? 14 : 2, width: 14, height: 14, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </Card>
    );
}

// ─── Skill Card ───────────────────────────────────────────────────────────────
function SkillCard({ skill, index }: { skill: typeof ALL_SKILLS[0]; index: number }) {
    const [hovered, setHovered] = useState(false);
    return (
        <Card
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                background: "rgba(240,237,232,0.03)", border: `1px solid ${hovered ? skill.color + "55" : C.border}`,
                borderRadius: "18px", p: 2.5, cursor: "pointer",
                transform: hovered ? "translateY(-4px)" : "translateY(0)",
                boxShadow: hovered ? `0 12px 40px ${skill.color}18` : "none",
                animation: `fadeUp 0.45s ease ${index * 0.06}s both`,
                "@keyframes fadeUp": { from: { opacity: 0, transform: "translateY(14px)" }, to: { opacity: 1, transform: "translateY(0)" } },
                transition: "all 0.25s",
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Avatar sx={{ width: 40, height: 40, background: skill.color, fontSize: 13, fontWeight: 700 }}>{skill.initials}</Avatar>
                    <Box>
                        <Typography sx={{ color: C.text, fontWeight: 700, fontSize: 15 }}>{skill.title}</Typography>
                        <Typography sx={{ color: C.faint, fontSize: 12 }}>{skill.person}</Typography>
                    </Box>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={0.4}>
                    <Star sx={{ fontSize: 13, color: C.gold }} />
                    <Typography sx={{ fontSize: 13, color: C.gold, fontWeight: 600 }}>{skill.rating}</Typography>
                </Stack>
            </Stack>

            <Typography sx={{ color: C.muted, fontSize: 13, lineHeight: 1.6, mb: 1.5 }}>{skill.desc}</Typography>

            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
                <Stack direction="row" spacing={1.5}>
                    <Chip label={skill.category} size="small" sx={{ height: 20, fontSize: 10, fontWeight: 700, background: skill.color + "20", color: skill.color }} />
                    <Stack direction="row" alignItems="center" spacing={0.4}>
                        <LocationOn sx={{ fontSize: 11, color: C.faint }} />
                        <Typography sx={{ fontSize: 11, color: C.faint }}>{skill.distance} km</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.4}>
                        <People sx={{ fontSize: 11, color: C.faint }} />
                        <Typography sx={{ fontSize: 11, color: C.faint }}>{skill.sessions}</Typography>
                    </Stack>
                </Stack>
                {skill.available
                    ? <Stack direction="row" alignItems="center" spacing={0.4}><FiberManualRecord sx={{ fontSize: 9, color: C.emerald }} /><Typography sx={{ fontSize: 11, color: C.emerald, fontWeight: 600 }}>Available</Typography></Stack>
                    : <Typography sx={{ fontSize: 11, color: C.faint }}>Unavailable</Typography>
                }
            </Stack>

            <Button component={Link} href={`/skill/${skill.id}`} fullWidth variant="outlined" endIcon={<ArrowForward sx={{ fontSize: 14 }} />} sx={{
                borderColor: skill.color + "44", color: skill.color,
                textTransform: "none", borderRadius: "10px", fontSize: 13,
                opacity: hovered ? 1 : 0.7,
                "&:hover": { borderColor: skill.color, background: skill.color + "10" },
                transition: "all 0.2s",
            }}>
                Request session
            </Button>
        </Card>
    );
}

// ─── Map View ─────────────────────────────────────────────────────────────────
function MapView({ activePin, setActivePin }: { activePin: number | null; setActivePin: (id: number | null) => void }) {
    const activeSkill = activePin ? ALL_SKILLS.find(s => s.id === activePin) : null;

    return (
        <Box sx={{ position: "relative", borderRadius: "20px", overflow: "hidden", border: `1px solid ${C.border}`, height: 520 }}>
            {/* Simulated map background */}
            <Box sx={{
                position: "absolute", inset: 0,
                background: `
          linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px),
          radial-gradient(ellipse at 40% 50%, rgba(16,185,129,0.06) 0%, transparent 60%),
          radial-gradient(ellipse at 70% 30%, rgba(244,98,58,0.05) 0%, transparent 50%),
          #0A1628
        `,
                backgroundSize: "40px 40px, 40px 40px, 100% 100%, 100% 100%, 100% 100%",
            }} />

            {/* Road-like lines */}
            {[[15, 20, 85, 20], [15, 45, 85, 45], [15, 70, 85, 70], [30, 10, 30, 90], [55, 10, 55, 90], [75, 10, 75, 90]].map(([x1, y1, x2, y2], i) => (
                <Box key={i} sx={{
                    position: "absolute", background: "rgba(240,237,232,0.04)", borderRadius: 1,
                    left: `${x1}%`, top: `${y1}%`,
                    width: x1 === x2 ? 1 : `${x2 - x1}%`,
                    height: x1 === x2 ? `${y2 - y1}%` : 1,
                }} />
            ))}

            {/* Pins */}
            {MAP_PINS.map(pin => (
                <Box key={pin.id} onClick={() => setActivePin(pin.id === activePin ? null : pin.id)} sx={{
                    position: "absolute", left: `${pin.x}%`, top: `${pin.y}%`,
                    transform: "translate(-50%,-100%)",
                    cursor: "pointer", zIndex: activePin === pin.id ? 10 : 1,
                    transition: "transform 0.2s",
                    "&:hover": { transform: "translate(-50%,-110%) scale(1.1)" },
                }}>
                    {/* Pin shape */}
                    <Box sx={{ position: "relative" }}>
                        <Box sx={{
                            width: activePin === pin.id ? 44 : 34, height: activePin === pin.id ? 44 : 34,
                            borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)",
                            background: activePin === pin.id ? pin.color : pin.color + "bb",
                            border: `2px solid ${activePin === pin.id ? "#fff" : pin.color + "44"}`,
                            boxShadow: activePin === pin.id ? `0 4px 20px ${pin.color}66` : "none",
                            transition: "all 0.2s",
                        }} />
                        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%) rotate(45deg)" }}>
                            <Psychology sx={{ fontSize: activePin === pin.id ? 18 : 14, color: "#fff" }} />
                        </Box>
                    </Box>
                </Box>
            ))}

            {/* Active pin popup */}
            {activeSkill && (
                <Box sx={{
                    position: "absolute", left: `${MAP_PINS.find(p => p.id === activePin)!.x}%`,
                    top: `${MAP_PINS.find(p => p.id === activePin)!.y}%`,
                    transform: "translate(-50%, -230%)", zIndex: 20, minWidth: 220,
                }}>
                    <Card sx={{
                        background: "rgba(14,24,41,0.97)", border: `1px solid ${activeSkill.color}44`,
                        borderRadius: "14px", p: 2,
                        boxShadow: `0 8px 32px rgba(0,0,0,0.5)`,
                        animation: "popIn 0.2s ease",
                        "@keyframes popIn": { from: { opacity: 0, transform: "scale(0.9)" }, to: { opacity: 1, transform: "scale(1)" } },
                    }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                            <Typography sx={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{activeSkill.title}</Typography>
                            <IconButton size="small" onClick={() => setActivePin(null)} sx={{ color: C.faint, p: 0.2 }}>
                                <Close sx={{ fontSize: 14 }} />
                            </IconButton>
                        </Stack>
                        <Typography sx={{ color: C.faint, fontSize: 12, mb: 1 }}>{activeSkill.person} · {activeSkill.location}</Typography>
                        <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                            <Star sx={{ fontSize: 12, color: C.gold }} />
                            <Typography sx={{ fontSize: 12, color: C.gold, fontWeight: 600 }}>{activeSkill.rating}</Typography>
                            <Typography sx={{ fontSize: 12, color: C.faint }}>· {activeSkill.distance} km away</Typography>
                        </Stack>
                        <Button fullWidth size="small" sx={{
                            background: `linear-gradient(135deg,${activeSkill.color},${activeSkill.color}88)`,
                            color: "#fff", textTransform: "none", borderRadius: "8px", fontSize: 12,
                        }}>
                            View skill
                        </Button>
                    </Card>
                </Box>
            )}

            {/* Map controls */}
            <Stack sx={{ position: "absolute", right: 16, top: 16 }} spacing={1}>
                {["+", "−"].map(btn => (
                    <Box key={btn} sx={{
                        width: 36, height: 36, borderRadius: "10px",
                        background: "rgba(14,24,41,0.9)", border: `1px solid ${C.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: C.muted, fontSize: 18, fontWeight: 300,
                        "&:hover": { color: C.emerald, borderColor: C.emerald + "44" }, transition: "all 0.15s",
                    }}>{btn}</Box>
                ))}
            </Stack>

            {/* Legend */}
            <Box sx={{ position: "absolute", left: 16, bottom: 16, background: "rgba(8,15,30,0.9)", border: `1px solid ${C.border}`, borderRadius: "12px", px: 2, py: 1.2 }}>
                <Typography sx={{ fontSize: 11, color: C.faint, mb: 0.8 }}>SKILL PROVIDERS</Typography>
                <Stack direction="row" spacing={1.5}>
                    {[{ color: C.emerald, label: "Tech" }, { color: C.coral, label: "Music/Sports" }, { color: C.gold, label: "Career" }].map(l => (
                        <Stack key={l.label} direction="row" alignItems="center" spacing={0.5}>
                            <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
                            <Typography sx={{ fontSize: 10, color: C.faint }}>{l.label}</Typography>
                        </Stack>
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function ExplorePage() {
    const [query, setQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
    const [maxDist, setMaxDist] = useState(10);
    const [minRating, setMinRating] = useState(4.0);
    const [onlyAvailable, setOnlyAvailable] = useState(false);
    const [showFilters, setShowFilters] = useState(true);
    const [activePin, setActivePin] = useState<number | null>(null);

    const filtered = useMemo(() => ALL_SKILLS.filter(s => {
        if (activeCategory !== "All" && s.category !== activeCategory) return false;
        if (s.distance > maxDist) return false;
        if (s.rating < minRating) return false;
        if (onlyAvailable && !s.available) return false;
        if (query && !s.title.toLowerCase().includes(query.toLowerCase()) && !s.person.toLowerCase().includes(query.toLowerCase())) return false;
        return true;
    }), [activeCategory, maxDist, minRating, onlyAvailable, query]);

    const clearFilters = () => { setMaxDist(10); setMinRating(4.0); setOnlyAvailable(false); setActiveCategory("All"); setQuery(""); };

    return (
        <Box sx={{ background: "transparent", minHeight: "100vh", color: C.text, display: "flex", flexDirection: "column" }}>
            <Navbar />
            <Container maxWidth="xl" sx={{ py: 4, flexGrow: 1 }}>
                <SearchHero query={query} setQuery={setQuery} />
                <CategoryPills active={activeCategory} setActive={setActiveCategory} />

                {/* Toolbar */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Typography sx={{ color: C.muted, fontSize: 14 }}>
                            <strong style={{ color: C.text }}>{filtered.length}</strong> skills found
                        </Typography>
                        {(activeCategory !== "All" || maxDist !== 10 || minRating !== 4.0 || onlyAvailable) && (
                            <Chip label="Filters active" size="small" onDelete={clearFilters} sx={{ background: `${C.coral}18`, color: C.coral, fontSize: 11, "& .MuiChip-deleteIcon": { color: C.coral } }} />
                        )}
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <IconButton onClick={() => setShowFilters(f => !f)} sx={{ color: showFilters ? C.emerald : C.muted, background: showFilters ? `${C.emerald}12` : "transparent", borderRadius: "10px", "&:hover": { background: `${C.emerald}12` } }}>
                            <Badge badgeContent={[maxDist !== 10, minRating !== 4.0, onlyAvailable].filter(Boolean).length || 0} sx={{ "& .MuiBadge-badge": { background: C.coral, color: "#fff", fontSize: 9, minWidth: 14, height: 14 } }}>
                                <FilterList sx={{ fontSize: 20 }} />
                            </Badge>
                        </IconButton>
                        <Stack direction="row" sx={{ border: `1px solid ${C.border}`, borderRadius: "10px", overflow: "hidden" }}>
                            {(["grid", "map"] as const).map(mode => (
                                <IconButton key={mode} onClick={() => setViewMode(mode)} sx={{
                                    borderRadius: 0, color: viewMode === mode ? C.emerald : C.muted,
                                    background: viewMode === mode ? `${C.emerald}12` : "transparent",
                                    "&:hover": { background: `${C.emerald}0A` },
                                }}>
                                    {mode === "grid" ? <GridView sx={{ fontSize: 20 }} /> : <Map sx={{ fontSize: 20 }} />}
                                </IconButton>
                            ))}
                        </Stack>
                    </Stack>
                </Stack>

                {/* Main layout */}
                <Grid container spacing={3}>
                    {/* Filter sidebar */}
                    {showFilters && (
                        <Grid size={{ xs: 12, md: 3 }}>
                            <FilterSidebar
                                maxDist={maxDist} setMaxDist={setMaxDist}
                                minRating={minRating} setMinRating={setMinRating}
                                onlyAvailable={onlyAvailable} setOnlyAvailable={setOnlyAvailable}
                                onClear={clearFilters}
                            />
                        </Grid>
                    )}

                    {/* Content */}
                    <Grid size={{ xs: 12, md: showFilters ? 9 : 12 }}>
                        {viewMode === "grid" ? (
                            filtered.length > 0 ? (
                                <Grid container spacing={2.5}>
                                    {filtered.map((skill, i) => (
                                        <Grid size={{ xs: 12, sm: 6, lg: showFilters ? 4 : 3 }} key={skill.id}>
                                            <SkillCard skill={skill} index={i} />
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Box sx={{ textAlign: "center", py: 10 }}>
                                    <Psychology sx={{ fontSize: 48, color: C.faint, mb: 2 }} />
                                    <Typography sx={{ color: C.muted, fontSize: 18, fontWeight: 600, mb: 1 }}>No skills found</Typography>
                                    <Typography sx={{ color: C.faint, fontSize: 14, mb: 3 }}>Try adjusting your filters or search query</Typography>
                                    <Button onClick={clearFilters} variant="outlined" sx={{ borderColor: C.emerald + "44", color: C.emerald, textTransform: "none", borderRadius: "10px" }}>Clear all filters</Button>
                                </Box>
                            )
                        ) : (
                            <MapView activePin={activePin} setActivePin={setActivePin} />
                        )}
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </Box>
    );
}