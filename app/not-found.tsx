"use client";
// app/not-found.tsx — Custom 404 page matching SkillBridge design

import React from "react";
import Link from "next/link";
import { Box, Button, Stack, Typography } from "@mui/material";
import { ArrowForward, Handshake } from "@mui/icons-material";

const C = {
    emerald: "#10B981",
    coral: "#F4623A",
    ink: "#080F1E",
    text: "#F0EDE8",
    muted: "rgba(240,237,232,0.52)",
    faint: "rgba(240,237,232,0.22)",
    border: "rgba(240,237,232,0.07)",
};

export default function NotFound() {
    return (
        <Box sx={{
            background: C.ink, minHeight: "100vh", color: C.text,
            display: "flex", flexDirection: "column",
        }}>
            {/* Navbar */}
            <Box sx={{
                px: { xs: 2, md: 4 }, py: 1.5,
                display: "flex", alignItems: "center",
                borderBottom: `1px solid ${C.border}`,
                background: "rgba(8,15,30,0.95)", backdropFilter: "blur(16px)",
            }}>
                <Stack direction="row" alignItems="center" spacing={1} component={Link} href="/" sx={{ textDecoration: "none" }}>
                    <Box sx={{
                        width: 32, height: 32, borderRadius: "9px",
                        background: `linear-gradient(135deg,${C.emerald},${C.coral})`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <Handshake sx={{ fontSize: 16, color: "#fff" }} />
                    </Box>
                    <Typography sx={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 18, color: C.text }}>
                        SkillBridge
                    </Typography>
                </Stack>
            </Box>

            {/* Body */}
            <Box sx={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                px: 3, textAlign: "center", position: "relative", overflow: "hidden",
            }}>
                {/* Glow blobs */}
                <Box sx={{ position: "absolute", top: "20%", left: "10%", width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle,${C.emerald}10,transparent 70%)`, pointerEvents: "none" }} />
                <Box sx={{ position: "absolute", bottom: "15%", right: "8%", width: 260, height: 260, borderRadius: "50%", background: `radial-gradient(circle,${C.coral}10,transparent 70%)`, pointerEvents: "none" }} />

                {/* 404 */}
                <Typography sx={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: { xs: 100, md: 160 },
                    fontWeight: 800,
                    lineHeight: 1,
                    background: `linear-gradient(135deg,${C.emerald},${C.coral})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 2,
                }}>
                    404
                </Typography>

                <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: { xs: 24, md: 32 }, fontWeight: 700, color: C.text, mb: 1.5 }}>
                    Page not found
                </Typography>
                <Typography sx={{ color: C.muted, fontSize: 16, maxWidth: 420, lineHeight: 1.7, mb: 5 }}>
                    Looks like this page doesn&apos;t exist. Maybe the skill you&apos;re looking for moved, or the link is wrong.
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Button
                        component={Link} href="/"
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForward />}
                        sx={{
                            background: `linear-gradient(135deg,${C.emerald},${C.coral})`,
                            color: "#fff", textTransform: "none", borderRadius: "12px",
                            px: 4, py: 1.5, fontSize: 15, fontWeight: 700, boxShadow: "none",
                            "&:hover": { boxShadow: `0 6px 24px ${C.emerald}55`, transform: "translateY(-1px)" },
                            transition: "all 0.2s",
                        }}
                    >
                        Go home
                    </Button>
                    <Button
                        component={Link} href="/explore"
                        variant="outlined"
                        size="large"
                        sx={{
                            borderColor: C.border, color: C.text, textTransform: "none",
                            borderRadius: "12px", px: 4, py: 1.5, fontSize: 15,
                            "&:hover": { borderColor: C.emerald, background: `${C.emerald}10` },
                        }}
                    >
                        Browse skills
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}
