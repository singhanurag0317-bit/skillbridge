"use client";

import React from "react";
import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const C = { ink: "#080F1E", text: "#F0EDE8", muted: "rgba(240,237,232,0.52)", border: "rgba(240,237,232,0.07)", emerald: "#10B981" };

export default function TermsOfService() {
  return (
    <Box sx={{ background: C.ink, minHeight: "100vh", color: C.text, py: 10 }}>
      <Container maxWidth="md">
        <Button component={Link} href="/" startIcon={<ArrowBack />} sx={{ color: C.emerald, textTransform: "none", mb: 6, "&:hover": { background: "rgba(16,185,129,0.1)" } }}>
          Back to Home
        </Button>
        <Typography variant="h3" sx={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, mb: 4 }}>
          Terms of Service
        </Typography>
        <Box sx={{ "& p, & h5": { mb: 3 } }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 4 }}>1. Acceptance of Terms</Typography>
          <Typography sx={{ color: C.muted, lineHeight: 1.8 }}>
            By accessing or using the SkillBridge platform, you agree to be bound by these terms. If you disagree with any part of the terms, then you may not access the service.
          </Typography>
          
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 4 }}>2. Community Guidelines</Typography>
          <Typography sx={{ color: C.muted, lineHeight: 1.8 }}>
            Our platform is built on mutual respect and free value exchange. Users are expected to maintain professional behavior during skill exchange sessions. Any form of harassment, discrimination, or abusive behavior will result in immediate account termination.
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 600, mt: 4 }}>3. User Conduct</Typography>
          <Typography sx={{ color: C.muted, lineHeight: 1.8 }}>
            You agree to use our platform only for lawful purposes. You represent that the skills you offer are within your capability and that you will not misrepresent your qualifications. Skill trading happens at your own risk.
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 600, mt: 4 }}>4. Changes to Terms</Typography>
          <Typography sx={{ color: C.muted, lineHeight: 1.8 }}>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days notice prior to any new terms taking effect.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
