// components/ui/SkillCard.tsx
// Reusable skill card — used in Explore, Dashboard recommended section, etc.

import React from "react";
import Link from "next/link";
import { Box, Button, Card, Chip, Stack, Typography, Avatar } from "@mui/material";
import { LocationOn, Star, ArrowForward, AccessTime } from "@mui/icons-material";
import type { Skill } from "@/types";

const C = {
    emerald: "#10B981",
    coral: "#F4623A",
    gold: "#F4B83A",
    text: "#F0EDE8",
    muted: "rgba(240,237,232,0.52)",
    faint: "rgba(240,237,232,0.22)",
    border: "rgba(240,237,232,0.07)",
};

const CATEGORY_COLORS: Record<string, string> = {
    Tech: C.emerald, Career: C.coral, Music: C.gold,
    Wellness: "#34D399", Creative: "#F87B58", Language: "#E8A838",
};

interface SkillCardProps {
    skill: Skill;
    compact?: boolean; // smaller card for grid layouts
}

export default function SkillCard({ skill, compact = false }: SkillCardProps) {
    const color = skill.color ?? CATEGORY_COLORS[skill.category] ?? C.emerald;

    return (
        <Card sx={{
            background: "rgba(240,237,232,0.03)",
            border: `1px solid ${C.border}`,
            borderRadius: "18px",
            p: compact ? 2 : 2.5,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
            "&:hover": { borderColor: color + "55", transform: "translateY(-3px)" },
            transition: "all 0.25s",
        }}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                <Chip
                    label={skill.category}
                    size="small"
                    sx={{ height: 22, fontSize: 11, fontWeight: 700, background: color + "20", color }}
                />
                <Stack direction="row" alignItems="center" spacing={0.3}>
                    <Star sx={{ fontSize: 13, color: C.gold }} />
                    <Typography sx={{ fontSize: 12, color: C.gold, fontWeight: 600 }}>{skill.rating}</Typography>
                    {!compact && (
                        <Typography sx={{ fontSize: 11, color: C.faint }}>({skill.sessions})</Typography>
                    )}
                </Stack>
            </Stack>

            {/* Title */}
            <Typography sx={{ color: C.text, fontWeight: 700, fontSize: compact ? 14 : 16, mb: 0.5, flex: 1 }}>
                {skill.title}
            </Typography>

            {!compact && skill.description && (
                <Typography sx={{ color: C.muted, fontSize: 13, lineHeight: 1.6, mb: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {skill.description}
                </Typography>
            )}

            {/* Meta */}
            <Stack direction="row" flexWrap="wrap" gap={1.5} mb={1.5} mt="auto">
                {skill.user?.name && (
                    <Stack direction="row" alignItems="center" spacing={0.8}>
                        <Avatar sx={{ width: 20, height: 20, fontSize: 9, fontWeight: 700, background: color }}>
                            {skill.user.initials ?? skill.user.name[0]}
                        </Avatar>
                        <Typography sx={{ fontSize: 12, color: C.muted }}>{skill.user.name}</Typography>
                    </Stack>
                )}
                {skill.distance && (
                    <Stack direction="row" alignItems="center" spacing={0.4}>
                        <LocationOn sx={{ fontSize: 12, color }} />
                        <Typography sx={{ fontSize: 12, color, fontWeight: 600 }}>{skill.distance}</Typography>
                    </Stack>
                )}
                {skill.duration && !compact && (
                    <Stack direction="row" alignItems="center" spacing={0.4}>
                        <AccessTime sx={{ fontSize: 12, color: C.faint }} />
                        <Typography sx={{ fontSize: 12, color: C.faint }}>{skill.duration}</Typography>
                    </Stack>
                )}
            </Stack>

            {/* CTA */}
            <Button
                component={Link}
                href={`/skill/${skill.id}`}
                fullWidth
                variant="outlined"
                endIcon={<ArrowForward sx={{ fontSize: 14 }} />}
                sx={{
                    borderColor: color + "44", color,
                    textTransform: "none", borderRadius: "10px",
                    fontSize: 13,
                    "&:hover": { borderColor: color, background: color + "10" },
                }}
            >
                {compact ? "View" : "Request session"}
            </Button>
        </Card>
    );
}
