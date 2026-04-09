import React from "react";
import Link from "next/link";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Handshake } from "@mui/icons-material";

const C = {
  emerald: "#10B981",
  coral: "#F4623A",
  ink: "#080F1E",
  text: "#F0EDE8",
  muted: "rgba(240,237,232,0.52)",
  faint: "rgba(240,237,232,0.22)",
  border: "rgba(240,237,232,0.07)",
};

export default function Footer() {
  return (
    <Box sx={{ borderTop: `1px solid ${C.border}`, py: 4, background: C.ink }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 28, height: 28, borderRadius: "8px", background: `linear-gradient(135deg,${C.emerald},${C.coral})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Handshake sx={{ fontSize: 14, color: "#fff" }} />
            </Box>
            <Typography sx={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, color: C.text, fontSize: 16 }}>SkillBridge</Typography>
          </Stack>
          <Typography sx={{ color: C.faint, fontSize: 13 }}>&copy; 2026 SkillBridge. All rights reserved.</Typography>
          <Stack direction={{ xs: "column", md: "row" }} alignItems="center" spacing={3}>
            <Typography component={Link} href="/privacy" sx={{ color: C.faint, fontSize: 13, textDecoration: "none", "&:hover": { color: C.emerald }, transition: "color 0.2s" }}>Privacy Policy</Typography>
            <Typography component={Link} href="/terms" sx={{ color: C.faint, fontSize: 13, textDecoration: "none", "&:hover": { color: C.emerald }, transition: "color 0.2s" }}>Terms of Service</Typography>
            <Typography sx={{ color: C.faint, fontSize: 13, textDecoration: "none", "& a": { color: "inherit", textDecoration: "none", transition: "color 0.2s" }, "& a:hover": { color: C.emerald } }}>Contact: <a href="mailto:hello@skillbridge.com">hello@skillbridge.com</a></Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
