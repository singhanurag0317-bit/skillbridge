"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Box, Button, Card, CardContent, Chip, Container,
  Grid, Stack, Typography, Avatar,
} from "@mui/material";
import {
  AutoAwesome, EmojiPeople, LocationOn, Psychology,
  Star, TrendingUp, Handshake, Groups, VolunteerActivism,
  ArrowForward, FormatQuote,
} from "@mui/icons-material";

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

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Explore skills", href: "/explore" },
  { label: "Impact", href: "/impact" },
  { label: "Community", href: "/dashboard" },
];

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

const HOW_IT_WORKS = [
  { step: "01", title: "List your skill", desc: "Tell us what you're great at. Teaching, coding, cooking — anything goes." },
  { step: "02", title: "Get matched", desc: "Our AI pairs you with people nearby who need exactly what you offer." },
  { step: "03", title: "Connect & share", desc: "Chat, schedule, and meet up. Build real relationships in your community." },
  { step: "04", title: "Track your impact", desc: "Every session earns you an impact score. See the difference you're making." },
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

// ─── useInView ────────────────────────────────────────────────────────────────
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

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <Box component="nav" sx={{
      position: "sticky", top: 0, zIndex: 100,
      px: { xs: 2, md: 6 }, py: 1.5,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      backdropFilter: "blur(16px)",
      background: scrolled ? "rgba(8,15,30,0.94)" : "transparent",
      borderBottom: scrolled ? `1px solid ${C.border}` : "none",
      transition: "background 0.3s",
    }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box sx={{ width: 34, height: 34, borderRadius: "10px", background: `linear-gradient(135deg,${C.emerald},${C.coral})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Handshake sx={{ fontSize: 18, color: "#fff" }} />
        </Box>
        <Typography sx={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 20, color: C.text, letterSpacing: "-0.3px" }}>
          SkillBridge
        </Typography>
      </Stack>

      <Stack direction="row" spacing={3} sx={{ display: { xs: "none", md: "flex" } }}>
        {NAV_LINKS.map(l => (
          <Typography key={l.label} component={Link} href={l.href} sx={{ color: C.muted, fontSize: 14, cursor: "pointer", "&:hover": { color: C.emerald }, transition: "color 0.2s", textDecoration: "none" }}>{l.label}</Typography>
        ))}
      </Stack>

      <Stack direction="row" spacing={1.5}>
        <Button component={Link} href="/auth/login" variant="text" sx={{ color: C.muted, fontSize: 13, textTransform: "none", "&:hover": { color: C.text } }}>Sign in</Button>
        <Button component={Link} href="/auth/login" variant="contained" sx={{ background: `linear-gradient(135deg,${C.emerald},${C.coral})`, color: "#fff", fontSize: 13, textTransform: "none", borderRadius: "10px", px: 2.5, fontWeight: 600, boxShadow: "none", "&:hover": { boxShadow: `0 4px 20px ${C.emerald}55` } }}>
          Join free
        </Button>
      </Stack>
    </Box>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <Box sx={{ minHeight: "92vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", pt: 6, pb: 10 }}>
      <Box sx={{ position: "absolute", top: "10%", left: "5%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle,${C.emerald}1A 0%,transparent 70%)`, pointerEvents: "none" }} />
      <Box sx={{ position: "absolute", bottom: "5%", right: "2%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle,${C.coral}1A 0%,transparent 70%)`, pointerEvents: "none" }} />
      <Box sx={{ position: "absolute", top: "40%", right: "25%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle,${C.gold}10 0%,transparent 70%)`, pointerEvents: "none" }} />
      <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            <Chip label="Open Innovation · Smart Resource Allocation" sx={{ mb: 3, background: `${C.emerald}1A`, color: C.emerald, border: `1px solid ${C.emerald}44`, fontWeight: 600, fontSize: 12 }} />

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
              <Button component={Link} href="/auth/login" variant="contained" size="large" endIcon={<ArrowForward />} sx={{
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

          <Grid item xs={12} md={5} sx={{ display: { xs: "none", md: "block" } }}>
            <Box sx={{ position: "relative", height: 420 }}>
              {SKILLS_SHOWCASE.slice(0, 4).map((s, i) => {
                const positions = [{ top: 0, left: 20 }, { top: 60, right: 0 }, { top: 200, left: 0 }, { top: 260, right: 20 }];
                return (
                  <Box key={s.skill} sx={{
                    position: "absolute", ...positions[i],
                    animation: `${i % 2 === 0 ? "floatA" : "floatB"} ${3 + i * 0.4}s ease-in-out infinite`,
                    "@keyframes floatA": { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
                    "@keyframes floatB": { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(10px)" } },
                  }}>
                    <Card sx={{ background: "rgba(240,237,232,0.05)", backdropFilter: "blur(12px)", border: `1px solid ${C.border}`, borderRadius: "16px", minWidth: 200 }}>
                      <CardContent sx={{ p: "14px 18px !important" }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                          <Chip label={s.tag} size="small" sx={{ background: TAG_COLORS[s.tag] + "22", color: TAG_COLORS[s.tag], fontWeight: 700, fontSize: 10, height: 20 }} />
                          <Stack direction="row" alignItems="center" spacing={0.3}>
                            <Star sx={{ fontSize: 12, color: C.gold }} />
                            <Typography sx={{ fontSize: 11, color: C.gold, fontWeight: 600 }}>{s.rating}</Typography>
                          </Stack>
                        </Stack>
                        <Typography sx={{ color: C.text, fontWeight: 600, fontSize: 14 }}>{s.skill}</Typography>
                        <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                          <LocationOn sx={{ fontSize: 11, color: C.faint }} />
                          <Typography sx={{ fontSize: 11, color: C.faint }}>{s.person} · {s.area}</Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Box>
                );
              })}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const { ref, visible } = useInView();
  return (
    <Box ref={ref} sx={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, py: 4, background: "rgba(240,237,232,0.02)" }}>
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="space-around">
          {STATS.map((s, i) => (
            <Grid item xs={6} md={3} key={s.label}>
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

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const { ref, visible } = useInView();
  return (
    <Box ref={ref} sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Chip label="Simple process" sx={{ mb: 2, background: `${C.coral}1A`, color: C.coral, border: `1px solid ${C.coral}44`, fontWeight: 600 }} />
          <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: { xs: 32, md: 46 }, fontWeight: 800, color: C.text }}>
            How SkillBridge works
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {HOW_IT_WORKS.map((item, i) => (
            <Grid item xs={12} sm={6} md={3} key={item.step}>
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
      </Container>
    </Box>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
function Features() {
  const { ref, visible } = useInView();
  return (
    <Box ref={ref} sx={{ py: { xs: 8, md: 12 }, background: "rgba(240,237,232,0.015)" }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={5}>
            <Chip label="Built for community" sx={{ mb: 2, background: `${C.gold}1A`, color: C.gold, border: `1px solid ${C.gold}44`, fontWeight: 600 }} />
            <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: { xs: 32, md: 44 }, fontWeight: 800, color: C.text, lineHeight: 1.2, mb: 2 }}>
              Everything you need to share knowledge
            </Typography>
            <Typography sx={{ color: C.muted, fontSize: 16, lineHeight: 1.8 }}>
              Powerful tools that get out of your way. SkillBridge focuses on human connection — the tech just makes it easier.
            </Typography>
          </Grid>
          <Grid item xs={12} md={7}>
            <Grid container spacing={2.5}>
              {FEATURES.map((f, i) => (
                <Grid item xs={12} sm={6} key={f.title}>
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

// ─── Skills Showcase ──────────────────────────────────────────────────────────
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
            <Grid item xs={12} sm={6} md={4} key={s.skill}>
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

// ─── Testimonials ─────────────────────────────────────────────────────────────
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
            <Grid item xs={12} md={4} key={t.name}>
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

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <Box sx={{ py: { xs: 10, md: 14 } }}>
      <Container maxWidth="md">
        <Card sx={{
          background: `linear-gradient(135deg,${C.emerald}18,${C.coral}18)`,
          border: `1px solid ${C.emerald}33`, borderRadius: "28px",
          p: { xs: 4, md: 7 }, textAlign: "center", position: "relative", overflow: "hidden",
        }}>
          <Box sx={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle,${C.coral}18,transparent 70%)`, pointerEvents: "none" }} />
          <Box sx={{ position: "absolute", bottom: -40, left: -40, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle,${C.emerald}18,transparent 70%)`, pointerEvents: "none" }} />
          <Stack direction="row" justifyContent="center" spacing={1} mb={3}>
            <Groups sx={{ fontSize: 28, color: C.emerald }} />
            <VolunteerActivism sx={{ fontSize: 28, color: C.coral }} />
            <AutoAwesome sx={{ fontSize: 28, color: C.gold }} />
          </Stack>
          <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: { xs: 32, md: 46 }, fontWeight: 800, color: C.text, lineHeight: 1.15, mb: 2 }}>
            Your skill is someone's breakthrough
          </Typography>
          <Typography sx={{ color: C.muted, fontSize: 17, mb: 5, maxWidth: 480, mx: "auto", lineHeight: 1.75 }}>
            Join thousands of people who are already building richer, more connected communities — one shared skill at a time.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Button component={Link} href="/auth/login" variant="contained" size="large" endIcon={<ArrowForward />} sx={{
              background: `linear-gradient(135deg,${C.emerald},${C.coral})`, color: "#fff",
              fontSize: 16, textTransform: "none", borderRadius: "14px", px: 5, py: 1.8, fontWeight: 700, boxShadow: "none",
              "&:hover": { boxShadow: `0 8px 32px ${C.emerald}55`, transform: "translateY(-2px)" }, transition: "all 0.2s",
            }}>Get started — it&apos;s free</Button>
            <Button component={Link} href="/#how-it-works" variant="outlined" size="large" sx={{
              borderColor: C.border, color: C.text, fontSize: 16, textTransform: "none", borderRadius: "14px", px: 5, py: 1.8,
              "&:hover": { borderColor: C.coral, background: `${C.coral}10` },
            }}>See how it works</Button>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <Box sx={{ borderTop: `1px solid ${C.border}`, py: 4 }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 28, height: 28, borderRadius: "8px", background: `linear-gradient(135deg,${C.emerald},${C.coral})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Handshake sx={{ fontSize: 14, color: "#fff" }} />
            </Box>
            <Typography sx={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, color: C.text, fontSize: 16 }}>SkillBridge</Typography>
          </Stack>
          <Typography sx={{ color: C.faint, fontSize: 13 }}>Built for Google Hackathon 2025 · Smart Resource Allocation</Typography>
          <Stack direction="row" spacing={3}>
            {["Privacy", "Terms", "Contact"].map(l => (
              <Typography key={l} sx={{ color: C.faint, fontSize: 13, cursor: "pointer", "&:hover": { color: C.emerald }, transition: "color 0.2s" }}>{l}</Typography>
            ))}
          </Stack>
        </Stack>
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
      <StatsBar />
      <HowItWorks />
      <Features />
      <SkillsShowcase />
      <Testimonials />
      <CTA />
      <Footer />
    </Box>
  );
}
