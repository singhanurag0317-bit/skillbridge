"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { skillsApi } from "@/lib/api";
import {
    Box, Button, Card, Chip, Container, Grid, Stack,
    Typography, Avatar, IconButton, TextField, InputAdornment,
    Slider, Divider, Badge, CircularProgress,
} from "@mui/material";
import {
    Search, LocationOn, Star, People, AccessTime,
    FilterList, GridView, Map, Close,
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

const CATEGORIES = ["All", "Tech", "Music", "Career", "Wellness", "Creative", "Language", "Education", "Sports"];

const CAT_COLORS: Record<string, string> = {
    Tech: C.emerald, Music: C.coral, Career: C.gold,
    Wellness: C.emeraldLight, Creative: C.coralLight,
    Language: "#E8A838", Education: C.emerald, Sports: C.coral, All: C.muted,
};

// ─── Search Hero ──────────────────────────────────────────────────────────────
function SearchHero({ query, setQuery, onSearch }: { query: string; setQuery: (v: string) => void; onSearch: () => void }) {
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
                    onKeyPress={e => e.key === "Enter" && onSearch()}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 20, color: C.faint }} /></InputAdornment>,
                        endAdornment: query ? <InputAdornment position="end"><IconButton size="small" onClick={() => { setQuery(""); onSearch(); }} sx={{ color: C.faint }}><Close sx={{ fontSize: 16 }} /></IconButton></InputAdornment> : null,
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
                <Button variant="contained" onClick={onSearch} sx={{
                    background: `linear-gradient(135deg,${C.emerald},${C.coral})`, color: "#fff",
                    textTransform: "none", borderRadius: "14px", px: 3.5, fontSize: 15,
                    fontWeight: 600, boxShadow: "none", whiteSpace: "nowrap",
                    "&:hover": { boxShadow: `0 4px 20px ${C.emerald}44` },
                }}>
                    Search
                </Button>
            </Stack>
        </Box>
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

            <Box sx={{ mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" mb={1.5}>
                    <Typography sx={{ color: C.muted, fontSize: 13, fontWeight: 600 }}>Max distance</Typography>
                    <Typography sx={{ color: C.emerald, fontSize: 13, fontWeight: 700 }}>{maxDist} km</Typography>
                </Stack>
                <Slider value={maxDist} onChange={(_, v) => setMaxDist(v as number)} min={1} max={50} step={5}
                    sx={{
                        color: C.emerald,
                        "& .MuiSlider-thumb": { width: 16, height: 16, background: C.emerald },
                        "& .MuiSlider-track": { background: `linear-gradient(90deg,${C.emerald},${C.coral})`, border: "none" },
                        "& .MuiSlider-rail": { background: C.border },
                    }}
                />
            </Box>

            <Divider sx={{ borderColor: C.border, mb: 3 }} />

            <Box sx={{ mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" mb={1.5}>
                    <Typography sx={{ color: C.muted, fontSize: 13, fontWeight: 600 }}>Min rating</Typography>
                    <Typography sx={{ color: C.gold, fontSize: 13, fontWeight: 700 }}>{minRating}+</Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                    {[0, 4.0, 4.5, 4.8].map(r => (
                        <Chip key={r} label={r === 0 ? "Any" : r} size="small" onClick={() => setMinRating(r)} sx={{
                            cursor: "pointer", fontWeight: 600, fontSize: 11, flex: 1,
                            background: minRating === r ? `${C.gold}22` : "rgba(240,237,232,0.04)",
                            color: minRating === r ? C.gold : C.muted,
                            border: `1px solid ${minRating === r ? C.gold + "55" : C.border}`,
                        }} />
                    ))}
                </Stack>
            </Box>

            <Divider sx={{ borderColor: C.border, mb: 3 }} />

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
                        <Box sx={{ width: 32, height: 18, borderRadius: "9px", background: onlyAvailable ? C.emerald : "rgba(240,237,232,0.1)", position: "relative" }}>
                            <Box sx={{ position: "absolute", top: 2, left: onlyAvailable ? 14 : 2, width: 14, height: 14, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </Card>
    );
}

// ─── Skill Card ───────────────────────────────────────────────────────────────
function SkillCard({ skill, index }: { skill: any; index: number }) {
    const color = CAT_COLORS[skill.category] || C.emerald;
    const providerName = skill.user?.name || "Unknown";
    const initials = skill.user?.initials || providerName.slice(0, 2).toUpperCase();

    return (
        <Card sx={{
            background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`,
            borderRadius: "18px", p: 2.5, cursor: "pointer",
            animation: `fadeUp 0.45s ease ${index * 0.05}s both`,
            "@keyframes fadeUp": { from: { opacity: 0, transform: "translateY(14px)" }, to: { opacity: 1, transform: "translateY(0)" } },
            "&:hover": { borderColor: color + "55", transform: "translateY(-4px)", boxShadow: `0 12px 40px ${color}10` },
            transition: "all 0.25s",
            height: "100%", display: "flex", flexDirection: "column"
        }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Avatar sx={{ width: 40, height: 40, background: color, fontSize: 13, fontWeight: 700 }}>{initials}</Avatar>
                    <Box>
                        <Typography sx={{ color: C.text, fontWeight: 700, fontSize: 15 }}>{skill.title}</Typography>
                        <Typography sx={{ color: C.faint, fontSize: 12 }}>{providerName}</Typography>
                    </Box>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={0.4}>
                    <Star sx={{ fontSize: 13, color: C.gold }} />
                    <Typography sx={{ fontSize: 13, color: C.gold, fontWeight: 600 }}>{skill.rating?.toFixed(1) || "New"}</Typography>
                </Stack>
            </Stack>

            <Typography sx={{ color: C.muted, fontSize: 13, lineHeight: 1.6, mb: 1.5, flexGrow: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                {skill.description}
            </Typography>

            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Stack direction="row" spacing={1.5}>
                    <Chip label={skill.category} size="small" sx={{ height: 20, fontSize: 10, fontWeight: 700, background: color + "20", color: color }} />
                    <Stack direction="row" alignItems="center" spacing={0.4}>
                        <LocationOn sx={{ fontSize: 11, color: C.faint }} />
                        <Typography sx={{ fontSize: 11, color: C.faint }}>{skill.location || "Nearby"}</Typography>
                    </Stack>
                </Stack>
                {skill.active && <FiberManualRecord sx={{ fontSize: 10, color: C.emerald }} />}
            </Stack>

            <Button component={Link} href={`/skill/${skill.id}`} fullWidth variant="outlined" endIcon={<ArrowForward sx={{ fontSize: 14 }} />} sx={{
                borderColor: color + "44", color: color,
                textTransform: "none", borderRadius: "10px", fontSize: 13,
                "&:hover": { borderColor: color, background: color + "10" },
            }}>
                Request session
            </Button>
        </Card>
    );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function ExplorePage() {
    const [skills, setSkills] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [maxDist, setMaxDist] = useState(50);
    const [minRating, setMinRating] = useState(0);
    const [onlyAvailable, setOnlyAvailable] = useState(false);
    const [showFilters, setShowFilters] = useState(true);

    const fetchSkills = useCallback(async () => {
        setLoading(true);
        try {
            const res = await skillsApi.getAll({
                query: query || undefined,
                category: activeCategory === "All" ? undefined : (activeCategory as any),
                maxDistance: maxDist,
                minRating: minRating || undefined,
                available: onlyAvailable || undefined,
            });
            if (res.success) setSkills(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [query, activeCategory, maxDist, minRating, onlyAvailable]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSkills();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchSkills]);

    const clearFilters = () => {
        setQuery("");
        setActiveCategory("All");
        setMaxDist(20);
        setMinRating(0);
        setOnlyAvailable(false);
    };

    return (
        <Box sx={{ background: "transparent", minHeight: "100vh", color: C.text, display: "flex", flexDirection: "column" }}>
            <Navbar />
            <Container maxWidth="xl" sx={{ py: 4, flexGrow: 1 }}>
                <SearchHero query={query} setQuery={setQuery} onSearch={fetchSkills} />
                
                {/* Category Pills */}
                <Stack direction="row" spacing={1} sx={{ mb: 4, overflowX: "auto", pb: 0.5, "&::-webkit-scrollbar": { height: 0 } }}>
                    {CATEGORIES.map(cat => (
                        <Chip key={cat} label={cat} onClick={() => setActiveCategory(cat)} sx={{
                            cursor: "pointer", fontWeight: 600, fontSize: 13, flexShrink: 0,
                            background: activeCategory === cat ? (CAT_COLORS[cat] || C.emerald) + "22" : "rgba(240,237,232,0.05)",
                            color: activeCategory === cat ? (CAT_COLORS[cat] || C.emerald) : C.muted,
                            border: `1px solid ${activeCategory === cat ? (CAT_COLORS[cat] || C.emerald) + "55" : C.border}`,
                        }} />
                    ))}
                </Stack>

                <Grid container spacing={3}>
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

                    <Grid size={{ xs: 12, md: showFilters ? 9 : 12 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography sx={{ color: C.muted, fontSize: 15 }}>
                                Found <strong style={{ color: C.text }}>{skills.length}</strong> skills
                            </Typography>
                            <IconButton onClick={() => setShowFilters(!showFilters)} sx={{ color: C.muted }}>
                                <FilterList />
                            </IconButton>
                        </Stack>

                        {loading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                                <CircularProgress sx={{ color: C.emerald }} />
                            </Box>
                        ) : skills.length > 0 ? (
                            <Grid container spacing={3}>
                                {skills.map((skill, i) => (
                                    <Grid size={{ xs: 12, sm: 6, lg: showFilters ? 4 : 3 }} key={skill.id}>
                                        <SkillCard skill={skill} index={i} />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Box sx={{ textAlign: "center", py: 10, background: "rgba(240,237,232,0.02)", borderRadius: "20px", border: `1px dashed ${C.border}` }}>
                                <Psychology sx={{ fontSize: 48, color: C.faint, mb: 2 }} />
                                <Typography sx={{ color: C.muted, fontSize: 18, fontWeight: 600 }}>No matching skills found</Typography>
                                <Typography sx={{ color: C.faint, fontSize: 14, mb: 3 }}>Adjust your filters or try a different search term</Typography>
                                <Button onClick={clearFilters} variant="outlined" sx={{ borderColor: C.emerald, color: C.emerald, textTransform: "none" }}>Clear all</Button>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </Box>
    );
}