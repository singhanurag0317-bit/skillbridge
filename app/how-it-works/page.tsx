"use client";
import React, { useEffect, useRef, useState } from "react";
import { Box, Card, Chip, Container, Grid, Typography } from "@mui/material";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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

const HOW_IT_WORKS = [
  { step: "01", title: "List your skill", desc: "Tell us what you're great at. Teaching Python, playing guitar, gardening, or professional mentoring — anything goes. It's completely free to share." },
  { step: "02", title: "Get matched", desc: "Our AI pairs you with people in your neighborhood who need exactly what you offer. You can also search the map for skills you want to learn." },
  { step: "03", title: "Connect & share", desc: "Use our secure chat to talk, schedule a session, and meet up in person or via video call. Build real relationships in your community." },
  { step: "04", title: "Track your impact", desc: "Every session you host earns you impact points and badges. See your score grow as you help your neighbors reach their goals." },
];

const FAQS = [
  { q: "Is it really free?", a: "Yes. SkillBridge is built on the principle of a gift economy. No money ever changes hands between users." },
  { q: "How do I stay safe?", a: "We recommend meeting in public places for the first session. Our rating system and verified profiles help build trust." },
  { q: "What skills can I share?", a: "Anything that adds value! From academic tutoring and coding to cooking, yoga, or playing an instrument." },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export default function HowItWorksPage() {
  const { ref, visible } = useInView();
  return (
    <Box sx={{ background: "transparent", minHeight: "100vh", color: C.text }}>
      <Navbar />
      <Box ref={ref} sx={{ py: { xs: 8, md: 12 }, flexGrow: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8, mt: 4 }}>
            <Chip label="Simple process" sx={{ mb: 2, background: `${C.coral}1A`, color: C.coral, border: `1px solid ${C.coral}44`, fontWeight: 600 }} />
            <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: { xs: 32, md: 46 }, fontWeight: 800, color: C.text }}>
              How SkillBridge works
            </Typography>
          </Box>
          <Grid container spacing={3} sx={{ mb: 10 }}>
            {HOW_IT_WORKS.map((item, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.step}>
                <Box sx={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: `all 0.6s ease ${i * 0.12}s` }}>
                  <Card sx={{
                    background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3, height: "100%",
                    "&:hover": { border: `1px solid ${C.emerald}44`, background: `${C.emerald}06` }, transition: "all 0.3s",
                  }}>
                    <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: 48, fontWeight: 800, color: "rgba(240,237,232,0.06)", lineHeight: 1, mb: 2 }}>{item.step}</Typography>
                    <Typography sx={{ color: C.text, fontWeight: 700, fontSize: 17, mb: 1 }}>{item.title}</Typography>
                    <Typography sx={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}>{item.desc}</Typography>
                  </Card>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* FAQ Section */}
          <Box sx={{ pt: 6 }}>
            <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, textAlign: "center", mb: 6 }}>
              Frequently Asked Questions
            </Typography>
            <Grid container spacing={4}>
              {FAQS.map((faq, i) => (
                <Grid size={{ xs: 12, md: 4 }} key={i}>
                  <Box sx={{ p: 2 }}>
                    <Typography sx={{ color: C.emerald, fontWeight: 700, mb: 1, fontSize: 18 }}>{faq.q}</Typography>
                    <Typography sx={{ color: C.muted, fontSize: 15, lineHeight: 1.7 }}>{faq.a}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
