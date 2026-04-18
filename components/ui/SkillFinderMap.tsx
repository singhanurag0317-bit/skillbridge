"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Chip, IconButton } from "@mui/material";
import {
    LocationOn, Star, Close, ArrowForward, MyLocation,
    Add, Remove, Navigation,
} from "@mui/icons-material";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
    teal: "#00F5D4",
    tealDim: "#00C4AA",
    tealGlow: "rgba(0,245,212,0.18)",
    tealFaint: "rgba(0,245,212,0.08)",
    navy: "#050D1A",
    navyMid: "#0A1628",
    navyLight: "#0F1F3D",
    text: "#E8F4F8",
    muted: "rgba(232,244,248,0.55)",
    faint: "rgba(232,244,248,0.18)",
    border: "rgba(0,245,212,0.12)",
    gold: "#FFD166",
    coral: "#FF6B6B",
    pinActive: "#00F5D4",
    pinDefault: "#2DD4BF",
};

// ─── Skill pin positions (deterministic from index) ──────────────────────────
function getPinStyle(index: number, total: number) {
    // Distribute pins across the map in a visually appealing way
    const positions: [number, number][] = [
        [22, 35], [65, 20], [42, 55], [78, 62],
        [15, 70], [55, 40], [82, 30], [35, 75],
        [68, 78], [50, 18], [28, 48], [72, 50],
    ];
    const [x, y] = positions[index % positions.length];
    return { left: `${x}%`, top: `${y}%` };
}

// ─── Map Grid lines (SVG roads) ───────────────────────────────────────────────
function MapGrid() {
    return (
        <svg
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
            preserveAspectRatio="none"
        >
            {/* Horizontal roads */}
            <line x1="0" y1="30%" x2="100%" y2="30%" stroke={C.border} strokeWidth="1" />
            <line x1="0" y1="55%" x2="100%" y2="55%" stroke={C.border} strokeWidth="0.6" />
            <line x1="0" y1="75%" x2="100%" y2="75%" stroke="rgba(0,245,212,0.06)" strokeWidth="1" />
            {/* Vertical roads */}
            <line x1="40%" y1="0" x2="40%" y2="100%" stroke={C.border} strokeWidth="1" />
            <line x1="70%" y1="0" x2="70%" y2="100%" stroke={C.border} strokeWidth="0.6" />
            <line x1="22%" y1="0" x2="22%" y2="100%" stroke="rgba(0,245,212,0.06)" strokeWidth="1" />
            {/* Diagonal accent */}
            <line x1="0" y1="100%" x2="30%" y2="30%" stroke="rgba(0,245,212,0.04)" strokeWidth="1" />
            <line x1="70%" y1="0" x2="100%" y2="80%" stroke="rgba(0,245,212,0.04)" strokeWidth="1" />
            {/* Zone blocks (city blocks) */}
            <rect x="41%" y="31%" width="28%" height="23%" fill="rgba(0,245,212,0.02)" />
            <rect x="0" y="56%" width="39%" height="18%" fill="rgba(0,245,212,0.015)" />
            <rect x="71%" y="31%" width="29%" height="23%" fill="rgba(255,107,107,0.02)" />
        </svg>
    );
}

// ─── Map Pin ──────────────────────────────────────────────────────────────────
function MapPin({
    skill, index, selected, hovered, onClick, onHover,
}: {
    skill: SkillFinderCourse;
    index: number;
    selected: boolean;
    hovered: boolean;
    onClick: () => void;
    onHover: (v: boolean) => void;
}) {
    const active = selected || hovered;
    const style = getPinStyle(index, 12);

    return (
        <Box
            onClick={onClick}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
            sx={{
                position: "absolute",
                ...style,
                transform: "translate(-50%, -50%)",
                zIndex: active ? 20 : 10,
                cursor: "pointer",
            }}
        >
            {/* Outer pulse ring */}
            {active && (
                <Box sx={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 64, height: 64,
                    borderRadius: "50%",
                    border: `1px solid ${C.teal}`,
                    animation: "outerPulse 1.8s ease-out infinite",
                    "@keyframes outerPulse": {
                        "0%": { transform: "translate(-50%, -50%) scale(0.6)", opacity: 0.8 },
                        "100%": { transform: "translate(-50%, -50%) scale(2)", opacity: 0 },
                    },
                    pointerEvents: "none",
                }} />
            )}
            {/* Mid pulse ring */}
            <Box sx={{
                position: "absolute",
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 48, height: 48,
                borderRadius: "50%",
                border: `1px solid ${C.teal}`,
                animation: "midPulse 2.4s ease-out infinite",
                animationDelay: `${index * 0.3}s`,
                "@keyframes midPulse": {
                    "0%": { transform: "translate(-50%, -50%) scale(0.8)", opacity: 0.6 },
                    "100%": { transform: "translate(-50%, -50%) scale(1.6)", opacity: 0 },
                },
                pointerEvents: "none",
            }} />
            {/* Pin body */}
            <Box sx={{
                width: active ? 44 : 36,
                height: active ? 44 : 36,
                borderRadius: "50%",
                background: active
                    ? `radial-gradient(circle, ${C.teal}33, ${C.teal}11)`
                    : `radial-gradient(circle, ${C.tealGlow}, transparent)`,
                border: `2px solid ${active ? C.teal : C.tealDim}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: active ? `0 0 20px ${C.teal}88, 0 0 40px ${C.teal}33` : `0 0 10px ${C.teal}44`,
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                position: "relative",
            }}>
                <LocationOn sx={{ fontSize: active ? 22 : 18, color: C.teal }} />
            </Box>
            {/* Label bubble on hover */}
            {active && (
                <Box sx={{
                    position: "absolute",
                    bottom: "calc(100% + 8px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(5,13,26,0.95)",
                    backdropFilter: "blur(12px)",
                    border: `1px solid ${C.border}`,
                    borderRadius: "10px",
                    px: 1.5, py: 0.8,
                    whiteSpace: "nowrap",
                    animation: "fadeUp 0.2s ease",
                    "@keyframes fadeUp": {
                        from: { opacity: 0, transform: "translateX(-50%) translateY(6px)" },
                        to: { opacity: 1, transform: "translateX(-50%) translateY(0)" },
                    },
                    pointerEvents: "none",
                    zIndex: 30,
                }}>
                    <Typography sx={{ color: C.text, fontSize: 11, fontWeight: 700 }}>
                        {skill.title}
                    </Typography>
                    <Typography sx={{ color: C.teal, fontSize: 10 }}>
                        {skill.distance}
                    </Typography>
                    {/* Arrow */}
                    <Box sx={{
                        position: "absolute", bottom: -5, left: "50%",
                        transform: "translateX(-50%)",
                        width: 8, height: 5,
                        background: C.border,
                        clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    }} />
                </Box>
            )}
        </Box>
    );
}

// ─── Popup card ───────────────────────────────────────────────────────────────
function MapPopup({ skill, onClose, onEnroll }: { skill: SkillFinderCourse; onClose: () => void; onEnroll: () => void }) {
    return (
        <Box sx={{
            position: "absolute",
            bottom: 80, right: 24,
            width: 280,
            background: "rgba(5,13,26,0.96)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${C.border}`,
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px ${C.teal}22`,
            animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            "@keyframes popIn": {
                from: { opacity: 0, transform: "scale(0.85) translateY(20px)" },
                to: { opacity: 1, transform: "scale(1) translateY(0)" },
            },
            zIndex: 40,
        }}>
            {/* Thumbnail */}
            <Box sx={{
                height: 130,
                background: `linear-gradient(135deg, ${skill.color}33, ${C.navy})`,
                position: "relative",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
            }}>
                <Typography sx={{ fontSize: 56, lineHeight: 1 }}>{skill.emoji}</Typography>
                <Box sx={{
                    position: "absolute", inset: 0,
                    background: `linear-gradient(180deg, transparent 40%, rgba(5,13,26,0.9))`,
                }} />
                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{
                        position: "absolute", top: 8, right: 8,
                        background: "rgba(5,13,26,0.7)", backdropFilter: "blur(8px)",
                        color: C.muted, border: `1px solid ${C.border}`,
                        width: 28, height: 28,
                        "&:hover": { color: C.text, background: "rgba(5,13,26,0.9)" },
                    }}
                >
                    <Close sx={{ fontSize: 14 }} />
                </IconButton>
                <Chip
                    label={skill.category}
                    size="small"
                    sx={{
                        position: "absolute", bottom: 10, left: 12,
                        background: `${skill.color}22`,
                        border: `1px solid ${skill.color}44`,
                        color: skill.color,
                        fontSize: 10, fontWeight: 700, height: 20,
                    }}
                />
            </Box>
            {/* Content */}
            <Box sx={{ p: 2 }}>
                <Typography sx={{ color: C.text, fontWeight: 800, fontSize: 14, mb: 0.5, lineHeight: 1.3 }}>
                    {skill.title}
                </Typography>
                <Typography sx={{ color: C.muted, fontSize: 12, mb: 1.5, lineHeight: 1.5 }}>
                    {skill.provider}
                </Typography>
                <Box sx={{
                    display: "flex", justifyContent: "space-between",
                    mb: 2, p: 1.5,
                    background: "rgba(232,244,248,0.04)",
                    borderRadius: "10px", border: `1px solid ${C.border}`,
                }}>
                    <Box sx={{ textAlign: "center" }}>
                        <Typography sx={{ color: C.gold, fontWeight: 800, fontSize: 15 }}>
                            {"★".repeat(Math.round(skill.rating))}
                        </Typography>
                        <Typography sx={{ color: C.muted, fontSize: 10 }}>{skill.rating} rating</Typography>
                    </Box>
                    <Box sx={{ width: "1px", background: C.border }} />
                    <Box sx={{ textAlign: "center" }}>
                        <Typography sx={{ color: C.teal, fontWeight: 800, fontSize: 15 }}>
                            {skill.reviews}
                        </Typography>
                        <Typography sx={{ color: C.muted, fontSize: 10 }}>reviews</Typography>
                    </Box>
                    <Box sx={{ width: "1px", background: C.border }} />
                    <Box sx={{ textAlign: "center" }}>
                        <Typography sx={{ color: C.text, fontWeight: 800, fontSize: 15 }}>
                            {skill.distance}
                        </Typography>
                        <Typography sx={{ color: C.muted, fontSize: 10 }}>away</Typography>
                    </Box>
                </Box>
                <Button
                    fullWidth
                    onClick={onEnroll}
                    endIcon={<ArrowForward sx={{ fontSize: 14 }} />}
                    sx={{
                        background: `linear-gradient(135deg, ${C.teal}, ${C.tealDim})`,
                        color: C.navy,
                        fontWeight: 800, fontSize: 13,
                        textTransform: "none",
                        borderRadius: "12px",
                        py: 1.2,
                        "&:hover": {
                            background: `linear-gradient(135deg, #1AFFDF, ${C.teal})`,
                            boxShadow: `0 8px 24px ${C.teal}44`,
                        },
                        transition: "all 0.25s",
                    }}
                >
                    Enroll Now
                </Button>
            </Box>
        </Box>
    );
}

// ─── Zoom controls ────────────────────────────────────────────────────────────
function ZoomControls() {
    return (
        <Box sx={{
            position: "absolute", bottom: 80, left: 20, zIndex: 30,
            display: "flex", flexDirection: "column", gap: 0.5,
        }}>
            {[
                { icon: <Add sx={{ fontSize: 16 }} />, label: "zoom in" },
                { icon: <Remove sx={{ fontSize: 16 }} />, label: "zoom out" },
                { icon: <MyLocation sx={{ fontSize: 16 }} />, label: "my location" },
            ].map((btn, i) => (
                <IconButton
                    key={i}
                    size="small"
                    aria-label={btn.label}
                    sx={{
                        background: "rgba(5,13,26,0.85)",
                        backdropFilter: "blur(8px)",
                        border: `1px solid ${C.border}`,
                        color: C.muted,
                        width: 34, height: 34,
                        borderRadius: "10px",
                        "&:hover": {
                            color: C.teal,
                            borderColor: C.teal,
                            boxShadow: `0 0 12px ${C.teal}44`,
                        },
                        transition: "all 0.2s",
                    }}
                >
                    {btn.icon}
                </IconButton>
            ))}
        </Box>
    );
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface SkillFinderCourse {
    id: number;
    title: string;
    provider: string;
    category: string;
    rating: number;
    reviews: number;
    distance: string;
    emoji: string;
    color: string;
    tags: string[];
    description: string;
}

interface SkillFinderMapProps {
    courses: SkillFinderCourse[];
    selectedId: number | null;
    hoveredId: number | null;
    onSelect: (id: number) => void;
    onHover: (id: number | null) => void;
}

// ─── Main Map ─────────────────────────────────────────────────────────────────
export default function SkillFinderMap({
    courses, selectedId, hoveredId, onSelect, onHover,
}: SkillFinderMapProps) {
    const [popup, setPopup] = useState<SkillFinderCourse | null>(null);

    useEffect(() => {
        if (selectedId !== null) {
            const course = courses.find(c => c.id === selectedId);
            setPopup(course ?? null);
        } else {
            setPopup(null);
        }
    }, [selectedId, courses]);

    return (
        <Box sx={{
            width: "100%", height: "100%",
            background: C.navy,
            position: "relative", overflow: "hidden",
            borderRadius: { xs: 0, md: "0 0 0 0" },
        }}>
            {/* Background texture: dot grid */}
            <Box sx={{
                position: "absolute", inset: 0,
                backgroundImage: `radial-gradient(${C.faint} 1px, transparent 1px)`,
                backgroundSize: "28px 28px",
                pointerEvents: "none",
            }} />
            {/* Ambient glow blobs */}
            <Box sx={{
                position: "absolute", top: "10%", left: "30%",
                width: "40%", height: "40%",
                borderRadius: "50%",
                background: `radial-gradient(ellipse, ${C.tealFaint} 0%, transparent 70%)`,
                filter: "blur(40px)",
                pointerEvents: "none",
            }} />
            <Box sx={{
                position: "absolute", bottom: "5%", right: "20%",
                width: "35%", height: "35%",
                borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(255,107,107,0.06) 0%, transparent 70%)",
                filter: "blur(50px)",
                pointerEvents: "none",
            }} />

            {/* SVG grid/roads */}
            <MapGrid />

            {/* "SKILL CLUSTERS" label overlay */}
            {[
                { label: "Downtown Hub", left: "42%", top: "28%", color: C.teal },
                { label: "West Side", left: "15%", top: "65%", color: C.muted },
                { label: "Tech District", left: "62%", top: "52%", color: C.muted },
            ].map((zone) => (
                <Typography key={zone.label} sx={{
                    position: "absolute",
                    left: zone.left, top: zone.top,
                    fontSize: 9, fontWeight: 700,
                    color: zone.color,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    opacity: 0.5,
                    pointerEvents: "none",
                    userSelect: "none",
                }}>
                    {zone.label}
                </Typography>
            ))}

            {/* Map pins */}
            {courses.map((course, i) => (
                <MapPin
                    key={course.id}
                    skill={course}
                    index={i}
                    selected={selectedId === course.id}
                    hovered={hoveredId === course.id}
                    onClick={() => onSelect(course.id)}
                    onHover={(v) => onHover(v ? course.id : null)}
                />
            ))}

            {/* Popup card */}
            {popup && (
                <MapPopup
                    skill={popup}
                    onClose={() => { setPopup(null); onSelect(-1); }}
                    onEnroll={() => { /* navigate to enroll */ }}
                />
            )}

            {/* Top-left badge */}
            <Box sx={{
                position: "absolute", top: 16, left: 16, zIndex: 20,
                background: "rgba(5,13,26,0.85)",
                backdropFilter: "blur(12px)",
                border: `1px solid ${C.border}`,
                borderRadius: "14px", px: 2, py: 1,
                display: "flex", alignItems: "center", gap: 1,
            }}>
                <Box sx={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: C.teal,
                    boxShadow: `0 0 8px ${C.teal}`,
                    animation: "blink 2s ease infinite",
                    "@keyframes blink": {
                        "0%, 100%": { opacity: 1 },
                        "50%": { opacity: 0.4 },
                    },
                }} />
                <Typography sx={{ color: C.text, fontSize: 12, fontWeight: 700 }}>
                    {courses.length} skills near you
                </Typography>
            </Box>

            {/* Compass */}
            <Box sx={{
                position: "absolute", top: 16, right: 16, zIndex: 20,
                background: "rgba(5,13,26,0.85)",
                backdropFilter: "blur(12px)",
                border: `1px solid ${C.border}`,
                borderRadius: "12px",
                width: 40, height: 40,
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                <Navigation sx={{ fontSize: 18, color: C.teal, transform: "rotate(45deg)" }} />
            </Box>

            {/* Zoom controls */}
            <ZoomControls />

            {/* Bottom watermark */}
            <Box sx={{
                position: "absolute", bottom: 16, left: 16, zIndex: 10,
                background: "rgba(5,13,26,0.7)",
                backdropFilter: "blur(8px)",
                border: `1px solid ${C.border}`,
                borderRadius: "8px", px: 1.5, py: 0.5,
            }}>
                <Typography sx={{ color: C.faint, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em" }}>
                    SKILLFINDER MAP • SAN FRANCISCO, CA
                </Typography>
            </Box>
        </Box>
    );
}
