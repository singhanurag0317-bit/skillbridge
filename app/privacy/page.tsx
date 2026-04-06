"use client";

import React from "react";
import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const C = { ink: "#080F1E", text: "#F0EDE8", muted: "rgba(240,237,232,0.52)", border: "rgba(240,237,232,0.07)", emerald: "#10B981" };

export default function PrivacyPolicy() {
  return (
    <Box sx={{ background: C.ink, minHeight: "100vh", color: C.text, py: 10 }}>
      <Container maxWidth="md">
        <Button component={Link} href="/" startIcon={<ArrowBack />} sx={{ color: C.emerald, textTransform: "none", mb: 6, "&:hover": { background: "rgba(16,185,129,0.1)" } }}>
          Back to Home
        </Button>
        <Typography variant="h3" sx={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, mb: 4 }}>
          Privacy Policy
        </Typography>
        <Box sx={{ "& p, & h5": { mb: 3 } }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 4 }}>1. Information We Collect</Typography>
          <Typography sx={{ color: C.muted, lineHeight: 1.8 }}>
            We collect information you provide directly to us when you create an account, update your profile, use the interactive features of our services, or communicate with us. The types of information we may collect include your name, email address, location, and the skills you offer or need.
          </Typography>
          
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 4 }}>2. How We Use Your Information</Typography>
          <Typography sx={{ color: C.muted, lineHeight: 1.8 }}>
             We use the information we collect to provide, maintain, and improve our services, to process transactions, to send you related information, and to facilitate connections between users based on skills and proximity.
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 600, mt: 4 }}>3. Sharing of Information</Typography>
          <Typography sx={{ color: C.muted, lineHeight: 1.8 }}>
             We may share information about you as follows or as otherwise described in this Privacy Policy: with other users to facilitate the skill exchange process; with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 600, mt: 4 }}>4. Contact Us</Typography>
          <Typography sx={{ color: C.muted, lineHeight: 1.8 }}>
             If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:hello@skillbridge.com" style={{ color: C.emerald, textDecoration: "none" }}>hello@skillbridge.com</a>.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
