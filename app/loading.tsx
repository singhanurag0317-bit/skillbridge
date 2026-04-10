// app/loading.tsx — Root loading screen shown by Next.js during page transitions

import React from "react";
import { Box, Stack } from "@mui/material";
import { Handshake } from "@mui/icons-material";

const C = { emerald: "#10B981", coral: "#F4623A", ink: "#080F1E", border: "rgba(240,237,232,0.07)" };

export default function Loading() {
    return (
        <Box sx={{
            background: "transparent", minHeight: "100vh",
            display: "flex", alignItems: "center", justifyContent: "center",
        }}>
            <Stack alignItems="center" spacing={3}>
                {/* Animated logo */}
                <Box sx={{
                    width: 56, height: 56, borderRadius: "16px",
                    background: `linear-gradient(135deg,${C.emerald},${C.coral})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    animation: "pulse 1.5s ease-in-out infinite",
                    "@keyframes pulse": {
                        "0%, 100%": { transform: "scale(1)", opacity: 1 },
                        "50%": { transform: "scale(1.08)", opacity: 0.8 },
                    },
                }}>
                    <Handshake sx={{ fontSize: 28, color: "#fff" }} />
                </Box>

                {/* Skeleton bars */}
                <Stack spacing={1.2} alignItems="center">
                    {[80, 120, 64].map((w, i) => (
                        <Box
                            key={i}
                            sx={{
                                width: w, height: 8, borderRadius: 4,
                                background: "rgba(240,237,232,0.07)",
                                animation: `shimmer 1.6s ease ${i * 0.15}s infinite`,
                                "@keyframes shimmer": {
                                    "0%, 100%": { opacity: 0.4 },
                                    "50%": { opacity: 0.9 },
                                },
                            }}
                        />
                    ))}
                </Stack>
            </Stack>
        </Box>
    );
}
