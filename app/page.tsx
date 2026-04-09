"use client";
import React from "react";
import Link from "next/link";
import { Box, Button, Chip, Container, Grid, Stack, Typography, Avatar } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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



// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <Box sx={{ minHeight: "92vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", pt: 6, pb: 10, background: "transparent" }}>
      {/* Subtle Grid for depth */}
      <Box sx={{ 
        position: "absolute", 
        inset: 0, 
        pointerEvents: "none",
        opacity: 0.1,
        backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
        backgroundSize: "64px 64px" 
      }} />


      

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>


            <Typography sx={{
              fontFamily: "'Playfair Display',serif",
              fontSize: { xs: 42, md: 66 }, fontWeight: 800, color: C.text, lineHeight: 1.1, mb: 2,
              "& span": { background: `linear-gradient(90deg,${C.emerald},${C.coral})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
            }}>
              Share a skill.<br /><span>Change a life.</span>
            </Typography>

            <Typography sx={{ color: C.muted, fontSize: { xs: 16, md: 18 }, lineHeight: 1.8, maxWidth: 540, mb: 4 }}>
              SkillBridge connects people who have knowledge with people who need it —
              completely free, hyperlocal, and powered by AI matching.
              Build real community, one skill at a time.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={5}>
              <Button component={Link} href="/auth/register" variant="contained" size="large" endIcon={<ArrowForward />} sx={{
                background: `linear-gradient(135deg,${C.emerald},${C.coral})`, color: "#fff",
                fontSize: 16, textTransform: "none", borderRadius: "12px", px: 4, py: 1.6, fontWeight: 700, boxShadow: "none",
                "&:hover": { boxShadow: `0 6px 28px ${C.emerald}55`, transform: "translateY(-1px)" }, transition: "all 0.2s",
              }}>Start sharing skills</Button>
              <Button component={Link} href="/explore" variant="outlined" size="large" sx={{
                borderColor: C.border, color: C.text, fontSize: 16, textTransform: "none", borderRadius: "12px", px: 4, py: 1.6,
                "&:hover": { borderColor: C.emerald, background: `${C.emerald}10` },
              }}>Browse skills nearby</Button>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Stack direction="row">
                {["SV", "RJ", "FK", "AM"].map((ini, i) => (
                  <Avatar key={ini} sx={{ width: 34, height: 34, fontSize: 12, fontWeight: 700, ml: i === 0 ? 0 : -1, background: [C.emerald, C.coral, C.gold, C.coralLight][i], border: `2px solid ${C.ink}` }}>{ini}</Avatar>
                ))}
              </Stack>
              <Typography sx={{ color: C.muted, fontSize: 13 }}>
                <strong style={{ color: C.text }}>3,800+ people</strong> already sharing skills
              </Typography>
            </Stack>
          </Grid>

            <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: "none", md: "block" }, position: "relative", height: 420 }}>
                {/* Visual placeholder replaced with generated premium visual */}
                <Box component="img" src="/skillbridge_hero_visual_1775722514556.png" sx={{ width: "100%", height: "100%", borderRadius: "20px", objectFit: "cover", border: `1px solid ${C.border}`, boxShadow: `0 12px 40px -12px ${C.emerald}44` }} />
            </Grid>
        </Grid>
      </Container>
    </Box>
  );
}



// ─── Export ───────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <Box sx={{ background: C.ink, minHeight: "100vh", color: C.text }}>
      <Navbar />
      <Hero />
      <Footer />
    </Box>
  );
}
