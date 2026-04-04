// components/ui/UserAvatar.tsx
import React from "react";
import Link from "next/link";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import type { User } from "@/types";

const C = {
    emerald: "#10B981",
    coral: "#F4623A",
    text: "#F0EDE8",
    muted: "rgba(240,237,232,0.52)",
    faint: "rgba(240,237,232,0.22)",
};

interface UserAvatarProps {
    user: Partial<User>;
    size?: number;
    showName?: boolean;
    showRole?: boolean;
    showVerified?: boolean;
    linkToProfile?: boolean;
    color?: string; // override gradient
}

export default function UserAvatar({
    user,
    size = 40,
    showName = false,
    showRole = false,
    showVerified = true,
    linkToProfile = false,
    color,
}: UserAvatarProps) {
    const bg = color ?? `linear-gradient(135deg,${C.emerald},${C.coral})`;
    const fontSize = Math.round(size * 0.38);

    const avatar = (
        <Avatar sx={{ width: size, height: size, background: bg, fontSize, fontWeight: 700, flexShrink: 0 }}>
            {user.initials ?? user.name?.[0] ?? "?"}
        </Avatar>
    );

    if (!showName) {
        return linkToProfile && user.id ? (
            <Box component={Link} href={`/profile/${user.id}`} sx={{ textDecoration: "none" }}>
                {avatar}
            </Box>
        ) : avatar;
    }

    const inner = (
        <Stack direction="row" alignItems="center" spacing={1.5}>
            {avatar}
            <Box>
                <Stack direction="row" alignItems="center" spacing={0.6}>
                    <Typography sx={{ color: C.text, fontWeight: 700, fontSize: size * 0.35 }}>
                        {user.name}
                    </Typography>
                    {showVerified && user.verified && (
                        <CheckCircle sx={{ fontSize: 14, color: C.emerald }} />
                    )}
                </Stack>
                {showRole && user.role && (
                    <Typography sx={{ color: C.muted, fontSize: size * 0.28 }}>{user.role}</Typography>
                )}
            </Box>
        </Stack>
    );

    return linkToProfile && user.id ? (
        <Box component={Link} href={`/profile/${user.id}`} sx={{ textDecoration: "none" }}>{inner}</Box>
    ) : inner;
}
