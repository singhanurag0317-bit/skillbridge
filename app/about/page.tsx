"use client";
import React, { useEffect, useRef, useState } from "react";
import { Box, Card, CardContent, Chip, Container, Grid, Stack, Typography, Avatar, Button } from "@mui/material";
import { LocationOn, Psychology, Star, TrendingUp, Handshake, EmojiPeople, FormatQuote, ArrowForward } from "@mui/icons-material";
import Link from "next/link";
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

const STATS = [
  { value: "12,400+", label: "Skills shared" },
  { value: "3,800+", label: "Community members" },
  { value: "94%", label: "Satisfaction rate" },
  { value: "28 cities", label: "Active regions" },
];

const FEATURES = [
  { icon: <Psychology sx={{ fontSize: 32 }} />, title: "AI-powered matching", desc: "Our engine reads your skills and needs, then surfaces the best community matches — no endless scrolling.", color: C.emerald },
  { icon: <LocationOn sx={{ fontSize: 32 }} />, title: "Hyperlocal first", desc: "Skills are most powerful when shared nearby. Google Maps integration surfaces people within walking distance.", color: C.coral },
  { icon: <Handshake sx={{ fontSize: 32 }} />, title: "Zero-cost exchange", desc: "No money changes hands. Offer what you know, receive what you need. Pure community value.", color: C.gold },
  { icon: <TrendingUp sx={{ fontSize: 32 }} />, title: "Impact tracking", desc: "See your real-world contribution — hours shared, people helped, and your community impact score.", color: C.coralLight },
];

const SKILLS_SHOWCASE = [
  { skill: "Guitar lessons", person: "Arjun M.", area: "Mathura", rating: 4.9, tag: "Music" },
  { skill: "Python tutoring", person: "Priya S.", area: "Agra", rating: 5.0, tag: "Tech" },
  { skill: "Resume writing", person: "Rohan K.", area: "Delhi", rating: 4.8, tag: "Career" },
  { skill: "Yoga sessions", person: "Meera P.", area: "Noida", rating: 4.9, tag: "Wellness" },
  { skill: "Cooking classes", person: "Kavya R.", area: "Lucknow", rating: 5.0, tag: "Lifestyle" },
  { skill: "Photography", person: "Aditya N.", area: "Jaipur", rating: 4.7, tag: "Creative" },
];

const TESTIMONIALS = [
  { quote: "I taught coding to 6 people in my neighbourhood and learned Hindustani music in return. SkillBridge changed how I see my community.", name: "Sneha Verma", role: "Software Engineer, Delhi", initials: "SV", color: C.emerald },
  { quote: "Found a yoga teacher 800 metres from my house. We've been meeting every morning for 3 months. Zero rupees spent.", name: "Rahul Joshi", role: "Product Manager, Noida", initials: "RJ", color: C.coral },
  { quote: "As an NGO coordinator, SkillBridge helped us match 200+ volunteers to the right roles in one week. Incredible tool.", name: "Fatima Khan", role: "NGO Director, Lucknow", initials: "FK", color: C.gold },
];

const TAG_COLORS: Record<string, string> = {
  Music: C.coral, Tech: C.emerald, Career: C.gold,
  Wellness: C.emeraldLight, Lifestyle: C.coralLight, Creative: "#E8A838",
};

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

function StatsBar() {
  const { ref, visible } = useInView();
  return (
    <Box ref={ref} sx={{ borderBottom: `1px solid ${C.border}`, py: 4, background: "rgba(240,237,232,0.02)" }}>
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="space-around">
          {STATS.map((s, i) => (
            <Grid size={{ xs: 6, md: 3 }} key={s.label}>
              <Box sx={{ textAlign: "center", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: `all 0.5s ease ${i * 0.1}s` }}>
                <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: { xs: 28, md: 36 }, fontWeight: 800, background: `linear-gradient(135deg,${C.emerald},${C.coral})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {s.value}
                </Typography>
                <Typography sx={{ color: C.muted, fontSize: 13 }}>{s.label}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

function Features() {
  const { ref, visible } = useInView();
  return (
    <Box ref={ref} sx={{ py: { xs: 8, md: 12 }, background: "rgba(240,237,232,0.015)" }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <Chip label="Built for community" sx={{ mb: 2, background: `${C.gold}1A`, color: C.gold, border: `1px solid ${C.gold}44`, fontWeight: 600 }} />
            <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: { xs: 32, md: 44 }, fontWeight: 800, color: C.text, lineHeight: 1.2, mb: 2 }}>
              Everything you need to share knowledge
            </Typography>
            <Typography sx={{ color: C.muted, fontSize: 16, lineHeight: 1.8 }}>
              Powerful tools that get out of your way. SkillBridge focuses on human connection — the tech just makes it easier.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Grid container spacing={2.5}>
              {FEATURES.map((f, i) => (
                <Grid size={{ xs: 12, sm: 6 }} key={f.title}>
                  <Box sx={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `all 0.5s ease ${i * 0.1}s` }}>
                    <Card sx={{
                      background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "18px", p: 3,
                      "&:hover": { borderColor: f.color + "55", transform: "translateY(-4px)", boxShadow: `0 12px 40px ${f.color}18` }, transition: "all 0.3s",
                    }}>
                      <Box sx={{ color: f.color, mb: 1.5 }}>{f.icon}</Box>
                      <Typography sx={{ color: C.text, fontWeight: 700, fontSize: 15, mb: 1 }}>{f.title}</Typography>
                      <Typography sx={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>{f.desc}</Typography>
                    </Card>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function SkillsShowcase() {
  const { ref, visible } = useInView();
  return (
    <Box ref={ref} sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: { xs: 30, md: 42 }, fontWeight: 800, color: C.text, mb: 1 }}>
            Skills being shared right now
          </Typography>
          <Typography sx={{ color: C.muted, fontSize: 16 }}>Real people, real skills, real impact</Typography>
        </Box>
        <Grid container spacing={2.5}>
          {SKILLS_SHOWCASE.map((s, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={s.skill}>
              <Box sx={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: `all 0.5s ease ${i * 0.08}s` }}>
                <Card sx={{
                  background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "18px", p: 2.5, cursor: "pointer",
                  "&:hover": { borderColor: TAG_COLORS[s.tag] + "55", background: TAG_COLORS[s.tag] + "08", transform: "translateY(-3px)" }, transition: "all 0.25s",
                }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                    <Chip label={s.tag} size="small" sx={{ background: TAG_COLORS[s.tag] + "20", color: TAG_COLORS[s.tag], fontWeight: 700, fontSize: 11 }} />
                    <Stack direction="row" alignItems="center" spacing={0.4}>
                      <Star sx={{ fontSize: 13, color: C.gold }} />
                      <Typography sx={{ fontSize: 13, color: C.gold, fontWeight: 600 }}>{s.rating}</Typography>
                    </Stack>
                  </Stack>
                  <Typography sx={{ color: C.text, fontWeight: 700, fontSize: 17, mb: 0.5 }}>{s.skill}</Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <EmojiPeople sx={{ fontSize: 14, color: C.faint }} />
                    <Typography sx={{ fontSize: 13, color: C.muted }}>{s.person}</Typography>
                    <Typography sx={{ fontSize: 13, color: C.faint }}>·</Typography>
                    <LocationOn sx={{ fontSize: 13, color: C.faint }} />
                    <Typography sx={{ fontSize: 13, color: C.muted }}>{s.area}</Typography>
                  </Stack>
                </Card>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Button component={Link} href="/explore" variant="outlined" size="large" endIcon={<ArrowForward />} sx={{
            borderColor: C.border, color: C.text, textTransform: "none", borderRadius: "12px", px: 4, py: 1.4, fontSize: 15,
            "&:hover": { borderColor: C.emerald, background: `${C.emerald}10` },
          }}>Explore all skills</Button>
        </Box>
      </Container>
    </Box>
  );
}

function Testimonials() {
  const { ref, visible } = useInView();
  return (
    <Box ref={ref} sx={{ py: { xs: 8, md: 12 }, background: "rgba(240,237,232,0.015)" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 7 }}>
          <Chip label="Community voices" sx={{ mb: 2, background: `${C.coral}1A`, color: C.coral, border: `1px solid ${C.coral}44`, fontWeight: 600 }} />
          <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: { xs: 30, md: 42 }, fontWeight: 800, color: C.text }}>
            Real stories, real impact
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {TESTIMONIALS.map((t, i) => (
            <Grid size={{ xs: 12, md: 4 }} key={t.name}>
              <Box sx={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `all 0.55s ease ${i * 0.12}s`, height: "100%" }}>
                <Card sx={{ background: "rgba(240,237,232,0.03)", border: `1px solid ${C.border}`, borderRadius: "20px", p: 3.5, height: "100%", "&:hover": { borderColor: t.color + "44" }, transition: "border 0.3s" }}>
                  <FormatQuote sx={{ fontSize: 32, color: t.color, mb: 1.5, opacity: 0.8 }} />
                  <Typography sx={{ color: "rgba(240,237,232,0.72)", fontSize: 15, lineHeight: 1.8, mb: 3, fontStyle: "italic" }}>&ldquo;{t.quote}&rdquo;</Typography>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Avatar sx={{ width: 40, height: 40, background: t.color, fontSize: 14, fontWeight: 700 }}>{t.initials}</Avatar>
                    <Box>
                      <Typography sx={{ color: C.text, fontWeight: 600, fontSize: 14 }}>{t.name}</Typography>
                      <Typography sx={{ color: C.muted, fontSize: 12 }}>{t.role}</Typography>
                    </Box>
                  </Stack>
                </Card>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default function AboutPage() {
  return (
    <Box sx={{ background: "transparent", minHeight: "100vh", color: C.text }}>
      <Navbar />
      <Box sx={{ pt: 4 }}>
         <StatsBar />
         <Features />
         <SkillsShowcase />
         <Testimonials />
      </Box>
      <Footer />
    </Box>
  );
}
