// components/ui/TagChip.tsx
import React from "react";
import { Chip } from "@mui/material";
import type { SkillCategory } from "@/types";

const CATEGORY_COLORS: Record<string, string> = {
    Tech: "#10B981", Career: "#F4623A", Music: "#F4B83A",
    Wellness: "#34D399", Creative: "#F87B58", Language: "#E8A838",
};

interface TagChipProps {
    label: string;
    category?: SkillCategory | string;
    color?: string;         // override color
    size?: "small" | "medium";
    filled?: boolean;       // solid background vs. ghost (default)
    onClick?: () => void;
    active?: boolean;
}

export default function TagChip({
    label, category, color, size = "small", filled = false, onClick, active = false,
}: TagChipProps) {
    const c = color ?? CATEGORY_COLORS[category ?? label] ?? "#10B981";

    return (
        <Chip
            label={label}
            size={size}
            onClick={onClick}
            sx={{
                height: 24,
                fontSize: 11,
                fontWeight: 700,
                cursor: onClick ? "pointer" : "default",
                background: filled || active ? `${c}22` : "rgba(240,237,232,0.06)",
                color: filled || active ? c : "rgba(240,237,232,0.52)",
                border: active ? `1px solid ${c}55` : "1px solid transparent",
                "&:hover": onClick ? { background: `${c}22`, color: c } : {},
                transition: "all 0.2s",
            }}
        />
    );
}
