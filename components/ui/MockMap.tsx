"use client";
import React from "react";
import { Box, Typography, Avatar, Tooltip } from "@mui/material";
import { LocationOn } from "@mui/icons-material";

const C = {
    emerald: "#10B981",
    coral: "#F4623A",
    gold: "#F4B83A",
    ink: "#080F1E",
    text: "#F0EDE8",
    muted: "rgba(240,237,232,0.52)",
    faint: "rgba(240,237,232,0.12)",
    border: "rgba(240,237,232,0.07)",
};

interface MockMapProps {
    skills: any[];
    onSkillClick: (skill: any) => void;
}

export default function MockMap({ skills, onSkillClick }: MockMapProps) {
    // Generate semi-random positions for markers based on skill ID for consistency
    const getPos = (id: string | number) => {
        const hash = String(id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const x = (hash % 80) + 10; // 10% to 90%
        const y = ((hash * 7) % 60) + 20; // 20% to 80%
        return { x, y };
    };

    return (
        <Box sx={{
            width: "100%", height: "600px", background: C.ink,
            borderRadius: "24px", border: `1px solid ${C.border}`,
            position: "relative", overflow: "hidden",
            backgroundImage: `radial-gradient(${C.border} 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
        }}>
            {/* Map Background Elements */}
            <Box sx={{ position: "absolute", top: "20%", left: "15%", width: "40%", height: "30%", background: "rgba(240,237,232,0.02)", borderRadius: "60px 20px 80px 40px", filter: "blur(20px)" }} />
            <Box sx={{ position: "absolute", bottom: "15%", right: "10%", width: "30%", height: "40%", background: "rgba(16,185,129,0.03)", borderRadius: "40px 80px 20px 60px", filter: "blur(25px)" }} />
            
            {/* "Roads" */}
            <Box sx={{ position: "absolute", top: "50%", left: 0, width: "100%", height: "1px", background: C.border }} />
            <Box sx={{ position: "absolute", top: 0, left: "40%", width: "1px", height: "100%", background: C.border }} />
            <Box sx={{ position: "absolute", top: "30%", left: "70%", width: "1px", height: "100%", background: C.border }} />

            <Box sx={{ position: "absolute", top: 20, left: 20, zIndex: 2, background: "rgba(8,15,30,0.8)", backdropFilter: "blur(8px)", p: 1.5, borderRadius: "12px", border: `1px solid ${C.border}` }}>
                <Typography sx={{ color: C.text, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOn sx={{ color: C.emerald, fontSize: 16 }} />
                    Interactive Map View
                </Typography>
                <Typography sx={{ color: C.muted, fontSize: 11 }}>Found {skills.length} skills in your area</Typography>
            </Box>

            {skills.map((skill) => {
                const { x, y } = getPos(skill.id);
                return (
                    <Tooltip key={skill.id} title={
                        <Box sx={{ p: 0.5 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: 12 }}>{skill.title}</Typography>
                            <Typography sx={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>{skill.user?.name}</Typography>
                        </Box>
                    } arrow>
                        <Box
                            onClick={() => onSkillClick(skill)}
                            sx={{
                                position: "absolute", top: `${y}%`, left: `${x}%`,
                                transform: "translate(-50%, -50%)", cursor: "pointer",
                                transition: "all 0.2s",
                                "&:hover": { transform: "translate(-50%, -50%) scale(1.15)", zIndex: 10 },
                            }}
                        >
                            <Box sx={{
                                width: 44, height: 44, background: "rgba(16,185,129,0.15)",
                                borderRadius: "50%", border: `2px solid ${C.emerald}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                position: "relative",
                                "&::after": {
                                    content: '""', position: "absolute", top: -2, left: -2, right: -2, bottom: -2,
                                    borderRadius: "50%", border: `1px solid ${C.emerald}`,
                                    animation: "pulse 2s infinite",
                                },
                                "@keyframes pulse": { "0%": { transform: "scale(1)", opacity: 0.5 }, "100%": { transform: "scale(1.5)", opacity: 0 } },
                            }}>
                                <Avatar sx={{ width: 34, height: 34, background: C.emerald, fontSize: 11, fontWeight: 700 }}>
                                    {skill.user?.initials || skill.user?.name?.[0] || "?"}
                                </Avatar>
                            </Box>
                        </Box>
                    </Tooltip>
                );
            })}

            <Box sx={{ position: "absolute", bottom: 20, right: 20, zIndex: 2, background: "rgba(8,15,30,0.8)", backdropFilter: "blur(8px)", px: 2, py: 1, borderRadius: "20px", border: `1px solid ${C.border}` }}>
                <Typography sx={{ color: C.faint, fontSize: 10, fontWeight: 600 }}>MAP DATA: OPEN INNOVATION ENGINE</Typography>
            </Box>
        </Box>
    );
}
