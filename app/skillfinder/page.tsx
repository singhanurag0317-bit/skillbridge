"use client";
import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
    Box, Typography, Button, Chip, IconButton, Stack,
    Avatar, TextField, InputAdornment,
} from "@mui/material";
import {
    Search, LocationOn, Star, Map as MapIcon,
    ViewList, FilterList, Close, ArrowForward,
    Verified, TrendingUp, MyLocation, FiberManualRecord,
} from "@mui/icons-material";
import SkillFinderMap, { SkillFinderCourse } from "@/components/ui/SkillFinderMap";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
    teal:      "#00F5D4",
    tealDim:   "#00C4AA",
    tealGlow:  "rgba(0,245,212,0.15)",
    navy:      "#050D1A",
    navyMid:   "#070E1C",
    navyCard:  "rgba(10,22,40,0.85)",
    navyLight: "rgba(15,31,61,0.6)",
    text:      "#E8F4F8",
    muted:     "rgba(232,244,248,0.55)",
    faint:     "rgba(232,244,248,0.18)",
    border:    "rgba(0,245,212,0.10)",
    borderAlt: "rgba(232,244,248,0.07)",
    gold:      "#FFD166",
    coral:     "#FF6B6B",
    purple:    "#9B8FFF",
    blue:      "#5BC4FF",
};

// ─── Mock course data ─────────────────────────────────────────────────────────
const COURSES: SkillFinderCourse[] = [
    {
        id: 1, title: "Python Programming Bootcamp", provider: "Alex Chen",
        category: "Tech", rating: 4.9, reviews: 312, distance: "0.4 mi",
        emoji: "🐍", color: C.teal, tags: ["Python", "Beginner", "Live"],
        description: "Master Python from scratch with hands-on projects. Ideal for beginners aiming to land a tech role.",
    },
    {
        id: 2, title: "UI/UX Design Fundamentals", provider: "Sofia Reyes",
        category: "Design", rating: 4.8, reviews: 218, distance: "0.7 mi",
        emoji: "🎨", color: C.purple, tags: ["Figma", "Design", "Portfolio"],
        description: "Learn how to think like a designer. Build real-world interfaces using Figma and design systems.",
    },
    {
        id: 3, title: "Machine Learning Essentials", provider: "Dr. Priya Sharma",
        category: "Tech", rating: 4.7, reviews: 189, distance: "1.1 mi",
        emoji: "🤖", color: C.blue, tags: ["ML", "Python", "Advanced"],
        description: "Dive deep into supervised learning, neural nets, and real-world ML pipelines.",
    },
    {
        id: 4, title: "Digital Marketing Mastery", provider: "Marcus Hill",
        category: "Business", rating: 4.6, reviews: 431, distance: "1.4 mi",
        emoji: "📈", color: C.gold, tags: ["SEO", "Ads", "Analytics"],
        description: "Grow any brand from zero to viral. Covers SEO, paid media, email, and conversion funnels.",
    },
    {
        id: 5, title: "Spanish for Beginners", provider: "Isabella Vega",
        category: "Language", rating: 4.9, reviews: 284, distance: "0.9 mi",
        emoji: "🇪🇸", color: C.coral, tags: ["Spanish", "Conversational", "Live"],
        description: "Start speaking Spanish in 4 weeks. Small groups, real conversations, total beginner welcome.",
    },
    {
        id: 6, title: "Photography & Lightroom", provider: "Jamie Park",
        category: "Creative", rating: 4.8, reviews: 162, distance: "1.8 mi",
        emoji: "📸", color: "#FF9A3C", tags: ["Photo", "Lightroom", "Hands-on"],
        description: "Shoot and edit like a pro. Covers composition, golden hour, and full Lightroom workflow.",
    },
    {
        id: 7, title: "Yoga & Mindfulness", provider: "Ananya Krishnan",
        category: "Wellness", rating: 4.9, reviews: 561, distance: "0.3 mi",
        emoji: "🧘", color: "#A78BFA", tags: ["Yoga", "Meditation", "Morning"],
        description: "Start every day with calm. Beginner flows, breath work, and mindful routines.",
    },
    {
        id: 8, title: "Public Speaking & Confidence", provider: "Tyler Brooks",
        category: "Career", rating: 4.7, reviews: 273, distance: "2.1 mi",
        emoji: "🎤", color: "#34D399", tags: ["Speaking", "Leadership", "Workshop"],
        description: "Conquer stage fright. Practical techniques for presentations, pitches, and interviews.",
    },
];

const CATEGORIES = ["All", "Tech", "Design", "Business", "Language", "Creative", "Wellness", "Career"];

const CAT_COLORS: Record<string, string> = {
    Tech: C.teal, Design: C.purple, Business: C.gold,
    Language: C.coral, Creative: "#FF9A3C", Wellness: "#A78BFA",
    Career: "#34D399", All: C.muted,
};

// ─── Star rating renderer ─────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
    return (
        <Stack direction="row" alignItems="center" spacing={0.3}>
            {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} sx={{
                    fontSize: 13,
                    color: s <= Math.round(rating) ? C.gold : "rgba(255,209,102,0.2)",
                }} />
            ))}
        </Stack>
    );
}

// ─── Skill Card ───────────────────────────────────────────────────────────────
function SkillCard({
    course, selected, hovered, onClick, onHover,
}: {
    course: SkillFinderCourse;
    selected: boolean;
    hovered: boolean;
    onClick: () => void;
    onHover: (v: boolean) => void;
}) {
    const active = selected || hovered;

    return (
        <Box
            id={`skill-card-${course.id}`}
            onClick={onClick}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
            sx={{
                borderRadius: "18px",
                border: `1px solid ${active ? course.color + "55" : C.border}`,
                background: active
                    ? `linear-gradient(135deg, rgba(5,13,26,0.98), ${course.color}0D)`
                    : C.navyCard,
                backdropFilter: "blur(16px)",
                p: "16px 18px",
                cursor: "pointer",
                transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                boxShadow: active
                    ? `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${course.color}33, inset 0 0 24px ${course.color}08`
                    : "0 2px 12px rgba(0,0,0,0.3)",
                transform: active ? "translateX(4px)" : "translateX(0)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Selected indicator bar */}
            {active && (
                <Box sx={{
                    position: "absolute", left: 0, top: 0,
                    width: 3, height: "100%",
                    background: `linear-gradient(180deg, ${course.color}, transparent)`,
                    borderRadius: "3px 0 0 3px",
                }} />
            )}

            {/* Top row: thumbnail + title */}
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
                {/* Emoji thumbnail */}
                <Box sx={{
                    width: 54, height: 54, flexShrink: 0,
                    borderRadius: "14px",
                    background: `linear-gradient(135deg, ${course.color}22, ${course.color}11)`,
                    border: `1px solid ${course.color}33`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 26,
                    boxShadow: active ? `0 0 16px ${course.color}33` : "none",
                    transition: "all 0.25s",
                }}>
                    {course.emoji}
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{
                        color: C.text, fontWeight: 700, fontSize: 14,
                        lineHeight: 1.3, mb: 0.3,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                        {course.title}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.6 }}>
                        <Avatar sx={{
                            width: 16, height: 16, fontSize: 9,
                            background: course.color, fontWeight: 700,
                        }}>
                            {course.provider[0]}
                        </Avatar>
                        <Typography sx={{ color: C.muted, fontSize: 12 }}>
                            {course.provider}
                        </Typography>
                        <Verified sx={{ fontSize: 12, color: C.teal }} />
                    </Stack>

                    {/* Rating + reviews */}
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Stars rating={course.rating} />
                        <Typography sx={{ color: C.gold, fontWeight: 700, fontSize: 12 }}>
                            {course.rating}
                        </Typography>
                        <Typography sx={{ color: C.faint, fontSize: 11 }}>
                            ({course.reviews.toLocaleString()})
                        </Typography>
                    </Stack>
                </Box>

                {/* Distance badge */}
                <Box sx={{
                    flexShrink: 0,
                    background: `${course.color}15`,
                    border: `1px solid ${course.color}30`,
                    borderRadius: "10px",
                    px: 1, py: 0.5,
                    display: "flex", alignItems: "center", gap: 0.3,
                }}>
                    <LocationOn sx={{ fontSize: 10, color: course.color }} />
                    <Typography sx={{ color: course.color, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
                        {course.distance}
                    </Typography>
                </Box>
            </Stack>

            {/* Description */}
            <Typography sx={{
                color: C.muted, fontSize: 12.5, lineHeight: 1.6,
                mt: 1.5, mb: 1.5,
                display: "-webkit-box", WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
                {course.description}
            </Typography>

            {/* Tags + CTA */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={0.6} sx={{ flexWrap: "wrap", gap: 0.6 }}>
                    {course.tags.slice(0, 2).map(tag => (
                        <Chip key={tag} label={tag} size="small" sx={{
                            height: 20, fontSize: 10, fontWeight: 700,
                            background: `${course.color}15`,
                            color: course.color,
                            border: `1px solid ${course.color}28`,
                        }} />
                    ))}
                </Stack>
                <Button
                    size="small"
                    endIcon={<ArrowForward sx={{ fontSize: 12 }} />}
                    sx={{
                        color: active ? course.color : C.muted,
                        textTransform: "none", fontSize: 12, fontWeight: 700,
                        "&:hover": { color: course.color, background: "transparent" },
                        minWidth: 0, px: 0, py: 0,
                        transition: "all 0.2s",
                    }}
                >
                    Details
                </Button>
            </Stack>
        </Box>
    );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function SkillFinderHeader({
    query, setQuery, viewMode, setViewMode,
}: {
    query: string;
    setQuery: (v: string) => void;
    viewMode: "split" | "map" | "list";
    setViewMode: (v: "split" | "map" | "list") => void;
}) {
    return (
        <Box sx={{
            height: 70,
            px: { xs: 2, md: 4 },
            display: "flex", alignItems: "center", gap: 2,
            background: "rgba(5,13,26,0.96)",
            backdropFilter: "blur(24px)",
            borderBottom: `1px solid ${C.border}`,
            position: "relative", zIndex: 50, flexShrink: 0,
        }}>
            {/* Logo */}
            <Stack direction="row" alignItems="center" spacing={1.2} component={Link} href="/"
                sx={{ textDecoration: "none", flexShrink: 0 }}>
                <Box sx={{
                    width: 36, height: 36, borderRadius: "10px",
                    background: `linear-gradient(135deg, ${C.teal}, ${C.tealDim})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 0 18px ${C.teal}55`,
                    fontSize: 18,
                }}>
                    🎯
                </Box>
                <Typography sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 900, fontSize: 20,
                    background: `linear-gradient(90deg, ${C.teal}, #a0f0e8)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "-0.04em",
                }}>
                    SkillFinder
                </Typography>
            </Stack>

            {/* Search bar */}
            <TextField
                placeholder="Search courses, skills, topics…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                size="small"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search sx={{ fontSize: 18, color: C.faint }} />
                        </InputAdornment>
                    ),
                    endAdornment: query ? (
                        <InputAdornment position="end">
                            <IconButton size="small" onClick={() => setQuery("")} sx={{ color: C.faint }}>
                                <Close sx={{ fontSize: 14 }} />
                            </IconButton>
                        </InputAdornment>
                    ) : null,
                }}
                sx={{
                    flex: 1, maxWidth: 420,
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        background: "rgba(232,244,248,0.04)",
                        color: C.text, fontSize: 14,
                        "& fieldset": { borderColor: C.borderAlt },
                        "&:hover fieldset": { borderColor: `${C.teal}44` },
                        "&.Mui-focused fieldset": { borderColor: C.teal, borderWidth: 1 },
                    },
                    "& input::placeholder": { color: C.faint },
                }}
            />

            {/* Location pill */}
            <Box sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center", gap: 0.6,
                background: "rgba(232,244,248,0.04)",
                border: `1px solid ${C.borderAlt}`,
                borderRadius: "12px", px: 1.5, py: 0.9,
                cursor: "pointer", flexShrink: 0,
                "&:hover": { borderColor: `${C.teal}44` },
                transition: "all 0.2s",
            }}>
                <MyLocation sx={{ fontSize: 15, color: C.teal }} />
                <Typography sx={{ color: C.text, fontSize: 13, fontWeight: 600 }}>
                    San Francisco
                </Typography>
            </Box>

            <Box sx={{ flex: 1 }} />

            {/* View mode toggle */}
            <Box sx={{
                display: { xs: "none", md: "flex" },
                background: "rgba(232,244,248,0.04)",
                border: `1px solid ${C.borderAlt}`,
                borderRadius: "12px", p: 0.5, gap: 0.5,
            }}>
                {([
                    { id: "list", icon: <ViewList sx={{ fontSize: 16 }} /> },
                    { id: "split", icon: <FilterList sx={{ fontSize: 16 }} /> },
                    { id: "map", icon: <MapIcon sx={{ fontSize: 16 }} /> },
                ] as const).map(({ id, icon }) => (
                    <IconButton
                        key={id}
                        size="small"
                        onClick={() => setViewMode(id)}
                        aria-label={`${id} view`}
                        id={`view-mode-${id}`}
                        sx={{
                            width: 32, height: 32,
                            borderRadius: "8px",
                            color: viewMode === id ? C.teal : C.muted,
                            background: viewMode === id ? C.tealGlow : "transparent",
                            border: `1px solid ${viewMode === id ? C.border : "transparent"}`,
                            "&:hover": { color: C.teal, background: C.tealGlow },
                            transition: "all 0.2s",
                        }}
                    >
                        {icon}
                    </IconButton>
                ))}
            </Box>

            {/* CTA */}
            <Button
                variant="contained"
                sx={{
                    background: `linear-gradient(135deg, ${C.teal}, ${C.tealDim})`,
                    color: C.navy, fontWeight: 800, fontSize: 13,
                    textTransform: "none", borderRadius: "12px",
                    px: 3, py: 1.1, flexShrink: 0,
                    boxShadow: `0 4px 20px ${C.teal}44`,
                    "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 8px 28px ${C.teal}55`,
                        background: `linear-gradient(135deg, #1AFFDF, ${C.teal})`,
                    },
                    transition: "all 0.25s",
                }}
            >
                Join Now
            </Button>
        </Box>
    );
}

// ─── Category bar ─────────────────────────────────────────────────────────────
function CategoryBar({
    active, setActive, count,
}: {
    active: string; setActive: (v: string) => void; count: number;
}) {
    return (
        <Box sx={{
            px: { xs: 2, md: 4 }, py: 1.5,
            display: "flex", alignItems: "center", gap: 1.5,
            borderBottom: `1px solid ${C.borderAlt}`,
            overflowX: "auto",
            "&::-webkit-scrollbar": { height: 0 },
            background: "rgba(5,13,26,0.92)",
            backdropFilter: "blur(16px)",
            flexShrink: 0,
        }}>
            {CATEGORIES.map(cat => {
                const color = CAT_COLORS[cat] || C.teal;
                const isActive = active === cat;
                return (
                    <Chip
                        key={cat}
                        label={cat}
                        onClick={() => setActive(cat)}
                        size="small"
                        sx={{
                            cursor: "pointer", fontWeight: 700, fontSize: 12,
                            flexShrink: 0, height: 28,
                            background: isActive ? `${color}22` : "rgba(232,244,248,0.04)",
                            color: isActive ? color : C.muted,
                            border: `1px solid ${isActive ? color + "55" : C.borderAlt}`,
                            boxShadow: isActive ? `0 0 12px ${color}33` : "none",
                            transition: "all 0.2s",
                            "&:hover": { background: `${color}18`, color, borderColor: `${color}44` },
                        }}
                    />
                );
            })}
            <Box sx={{ flex: 1 }} />
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
                <FiberManualRecord sx={{ fontSize: 8, color: C.teal }} />
                <Typography sx={{ color: C.muted, fontSize: 12, whiteSpace: "nowrap" }}>
                    <strong style={{ color: C.text }}>{count}</strong> courses found
                </Typography>
            </Stack>
        </Box>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SkillFinderPage() {
    const [query, setQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<"split" | "map" | "list">("split");

    const filtered = useMemo(() => {
        return COURSES.filter(c => {
            const matchCat = activeCategory === "All" || c.category === activeCategory;
            const matchQ = !query || [c.title, c.provider, c.category, ...c.tags]
                .some(s => s.toLowerCase().includes(query.toLowerCase()));
            return matchCat && matchQ;
        });
    }, [query, activeCategory]);

    const handleCardClick = useCallback((id: number) => {
        setSelectedId(prev => prev === id ? null : id);
    }, []);

    return (
        <Box sx={{
            height: "100vh", overflow: "hidden",
            display: "flex", flexDirection: "column",
            background: C.navy,
            fontFamily: "'DM Sans', sans-serif",
        }}>
            {/* Header */}
            <SkillFinderHeader
                query={query} setQuery={setQuery}
                viewMode={viewMode} setViewMode={setViewMode}
            />

            {/* Category bar */}
            <CategoryBar
                active={activeCategory}
                setActive={setActiveCategory}
                count={filtered.length}
            />

            {/* Body: split or single panel */}
            <Box sx={{
                flex: 1, display: "flex", overflow: "hidden",
                flexDirection: { xs: "column", md: "row" },
            }}>

                {/* ─── Left panel: skill cards ─── */}
                {viewMode !== "map" && (
                    <Box sx={{
                        width: { xs: "100%", md: viewMode === "split" ? 380 : "100%" },
                        flexShrink: 0,
                        display: "flex", flexDirection: "column",
                        borderRight: { md: `1px solid ${C.border}` },
                        overflow: "hidden",
                    }}>
                        {/* Sort/count bar */}
                        <Stack direction="row" alignItems="center" justifyContent="space-between"
                            sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${C.borderAlt}`, flexShrink: 0 }}>
                            <Typography sx={{ color: C.muted, fontSize: 12 }}>
                                Sort by: <strong style={{ color: C.text }}>Distance</strong>
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <TrendingUp sx={{ fontSize: 13, color: C.teal }} />
                                <Typography sx={{ color: C.teal, fontSize: 12, fontWeight: 700 }}>
                                    Top rated first
                                </Typography>
                            </Stack>
                        </Stack>

                        {/* Scrollable card list */}
                        <Box sx={{
                            flex: 1, overflowY: "auto", px: 2, py: 2,
                            display: "flex", flexDirection: "column", gap: 1.5,
                            "&::-webkit-scrollbar": { width: 4 },
                            "&::-webkit-scrollbar-track": { background: "transparent" },
                            "&::-webkit-scrollbar-thumb": {
                                background: C.border, borderRadius: 4,
                                "&:hover": { background: `${C.teal}44` },
                            },
                        }}>
                            {filtered.length === 0 ? (
                                <Box sx={{
                                    flex: 1, display: "flex", flexDirection: "column",
                                    alignItems: "center", justifyContent: "center", py: 8,
                                    gap: 1.5,
                                }}>
                                    <Typography sx={{ fontSize: 40 }}>🔍</Typography>
                                    <Typography sx={{ color: C.muted, fontSize: 15, fontWeight: 600 }}>
                                        No courses match
                                    </Typography>
                                    <Typography sx={{ color: C.faint, fontSize: 13 }}>
                                        Try a different search or category
                                    </Typography>
                                    <Button
                                        size="small"
                                        onClick={() => { setQuery(""); setActiveCategory("All"); }}
                                        sx={{ color: C.teal, textTransform: "none", fontSize: 13 }}
                                    >
                                        Clear filters
                                    </Button>
                                </Box>
                            ) : (
                                filtered.map(course => (
                                    <SkillCard
                                        key={course.id}
                                        course={course}
                                        selected={selectedId === course.id}
                                        hovered={hoveredId === course.id}
                                        onClick={() => handleCardClick(course.id)}
                                        onHover={v => setHoveredId(v ? course.id : null)}
                                    />
                                ))
                            )}
                        </Box>
                    </Box>
                )}

                {/* ─── Right panel: map ─── */}
                {viewMode !== "list" && (
                    <Box sx={{ flex: 1, position: "relative", overflow: "hidden" }}>
                        <SkillFinderMap
                            courses={filtered}
                            selectedId={selectedId}
                            hoveredId={hoveredId}
                            onSelect={(id) => {
                                setSelectedId(prev => prev === id ? null : id);
                                // Also scroll card into view
                                const el = document.getElementById(`skill-card-${id}`);
                                el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                            }}
                            onHover={(id) => setHoveredId(id)}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
}
