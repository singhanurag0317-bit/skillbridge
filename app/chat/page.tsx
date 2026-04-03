"use client";
import React, { useState, useRef, useEffect } from "react";
import {
    Box, Button, Card, Chip, Container, Stack,
    Typography, Avatar, IconButton, Divider, Badge,
    TextField, InputAdornment,
} from "@mui/material";
import {
    Send, Search, MoreVert, Phone, VideoCall,
    AttachFile, EmojiEmotions, CheckCircle, Done, DoneAll,
    LocationOn, CalendarMonth, Star, Handshake,
    ArrowBack, FiberManualRecord, Psychology, Schedule,
} from "@mui/icons-material";

// ─── Color tokens ─────────────────────────────────────────────────────────────
const C = {
    emerald: "#10B981",
    emeraldLight: "#34D399",
    coral: "#F4623A",
    coralLight: "#F87B58",
    gold: "#F4B83A",
    ink: "#080F1E",
    card: "#0E1829",
    surface: "#111D35",
    text: "#F0EDE8",
    muted: "rgba(240,237,232,0.52)",
    faint: "rgba(240,237,232,0.22)",
    border: "rgba(240,237,232,0.07)",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const CONVERSATIONS = [
    {
        id: 1, name: "Priya S.", initials: "PS", color: C.emerald,
        skill: "Python tutoring", lastMessage: "That makes sense! I'll try the OOP exercise tonight.",
        time: "2m ago", unread: 2, online: true,
        scheduled: "Today, 6:00 PM",
    },
    {
        id: 2, name: "Rohan K.", initials: "RK", color: C.coral,
        skill: "Resume writing", lastMessage: "Can we reschedule to Saturday morning?",
        time: "1h ago", unread: 1, online: false,
        scheduled: "Sat, 10:00 AM",
    },
    {
        id: 3, name: "Meera P.", initials: "MP", color: C.gold,
        skill: "Python tutoring", lastMessage: "Thank you so much! The session was amazing 🙌",
        time: "Yesterday", unread: 0, online: true,
        scheduled: null,
    },
    {
        id: 4, name: "Aditya N.", initials: "AN", color: C.coralLight,
        skill: "Guitar lessons", lastMessage: "See you next week then!",
        time: "2d ago", unread: 0, online: false,
        scheduled: null,
    },
    {
        id: 5, name: "Kavya R.", initials: "KR", color: C.emeraldLight,
        skill: "Yoga sessions", lastMessage: "I sent you the location pin",
        time: "3d ago", unread: 0, online: true,
        scheduled: null,
    },
];

const MESSAGES_BY_CONVO: Record<number, Message[]> = {
    1: [
        { id: 1, from: "them", text: "Hi! I saw your Python tutoring listing. I'm a complete beginner — is that okay?", time: "5:12 PM", read: true },
        { id: 2, from: "me", text: "Of course! That's actually where I love to start. We'll go from zero to writing real scripts.", time: "5:14 PM", read: true },
        { id: 3, from: "them", text: "Amazing! What do I need to prepare?", time: "5:15 PM", read: true },
        { id: 4, from: "me", text: "Just install Python from python.org — I'll help you if you get stuck. And bring any questions you have!", time: "5:16 PM", read: true },
        { id: 5, from: "them", text: "Perfect. I installed it already! Got a bit confused with PATH variables though 😅", time: "5:20 PM", read: true },
        { id: 6, from: "me", text: "Ha, that trips everyone up the first time! Don't worry, we'll fix it at the start of the session. Super easy once you see it.", time: "5:22 PM", read: true },
        { id: 7, from: "them", text: "So relieved to hear that. Also — should I try any exercises before we meet?", time: "5:25 PM", read: true },
        { id: 8, from: "me", text: "Try this: write a program that prints your name 10 times using a loop. Don't worry if it doesn't work — we'll debug it together.", time: "5:27 PM", read: true },
        { id: 9, from: "them", text: "On it! Just tried it and got it working 🎉 Used a for loop with range(10)", time: "5:45 PM", read: true },
        { id: 10, from: "me", text: "That's exactly right! Great job. You're already thinking like a programmer.", time: "5:47 PM", read: true },
        { id: 11, from: "them", text: "That makes sense! I'll try the OOP exercise tonight.", time: "6:02 PM", read: false },
        { id: 12, from: "them", text: "See you at 6 PM!", time: "6:03 PM", read: false },
    ],
    2: [
        { id: 1, from: "them", text: "Hey Anurag, I need help with my resume. I've been applying for 3 months with no calls.", time: "10:00 AM", read: true },
        { id: 2, from: "me", text: "I can definitely help! Can you share your current resume so I can take a look?", time: "10:05 AM", read: true },
        { id: 3, from: "them", text: "Sure, I'll bring it to our session. Is Wednesday evening fine?", time: "10:08 AM", read: true },
        { id: 4, from: "me", text: "Wednesday at 6 PM works great for me!", time: "10:10 AM", read: true },
        { id: 5, from: "them", text: "Can we reschedule to Saturday morning?", time: "11:30 AM", read: false },
    ],
    3: [
        { id: 1, from: "me", text: "Hey Meera, all set for our session today?", time: "9:00 AM", read: true },
        { id: 2, from: "them", text: "Yes! Super excited. I've been practising the exercises you sent.", time: "9:05 AM", read: true },
        { id: 3, from: "me", text: "Perfect! We'll build on that today. See you at 6.", time: "9:07 AM", read: true },
        { id: 4, from: "them", text: "Thank you so much! The session was amazing 🙌", time: "7:30 PM", read: true },
    ],
    4: [
        { id: 1, from: "them", text: "Great guitar session today! Really getting the hang of the G chord.", time: "4:00 PM", read: true },
        { id: 2, from: "me", text: "You improved a lot! Keep practising the chord transitions.", time: "4:15 PM", read: true },
        { id: 3, from: "them", text: "See you next week then!", time: "4:17 PM", read: true },
    ],
    5: [
        { id: 1, from: "them", text: "Hi! I saw your profile and would love to do yoga sessions with you.", time: "10:00 AM", read: true },
        { id: 2, from: "me", text: "That sounds great! Are you a beginner or do you have some experience?", time: "10:10 AM", read: true },
        { id: 3, from: "them", text: "Beginner mostly. I sent you the location pin", time: "10:30 AM", read: true },
    ],
};

interface Message {
    id: number;
    from: "me" | "them";
    text: string;
    time: string;
    read: boolean;
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
    return (
        <Box sx={{
            px: { xs: 2, md: 4 }, py: 1.5,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: `1px solid ${C.border}`,
            background: "rgba(8,15,30,0.97)", backdropFilter: "blur(16px)",
            position: "sticky", top: 0, zIndex: 100,
        }}>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ width: 30, height: 30, borderRadius: "9px", background: `linear-gradient(135deg,${C.emerald},${C.coral})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Handshake sx={{ fontSize: 15, color: "#fff" }} />
                </Box>
                <Typography sx={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 17, color: C.text }}>SkillBridge</Typography>
            </Stack>
            <Stack direction="row" spacing={3} sx={{ display: { xs: "none", md: "flex" } }}>
                {["Dashboard", "Explore", "My Skills", "Messages", "Impact"].map((l, i) => (
                    <Typography key={l} sx={{ color: i === 3 ? C.emerald : C.muted, fontSize: 14, cursor: "pointer", borderBottom: i === 3 ? `2px solid ${C.emerald}` : "2px solid transparent", pb: 0.3, "&:hover": { color: C.text }, transition: "color 0.2s" }}>{l}</Typography>
                ))}
            </Stack>
            <Avatar sx={{ width: 32, height: 32, background: `linear-gradient(135deg,${C.emerald},${C.coral})`, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>AS</Avatar>
        </Box>
    );
}

// ─── Conversation List ────────────────────────────────────────────────────────
function ConversationList({ activeId, onSelect }: { activeId: number; onSelect: (id: number) => void }) {
    const [search, setSearch] = useState("");
    const filtered = CONVERSATIONS.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.skill.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box sx={{
            width: { xs: "100%", md: 320 }, flexShrink: 0,
            borderRight: `1px solid ${C.border}`,
            display: "flex", flexDirection: "column",
            height: "calc(100vh - 56px)",
            background: "rgba(8,15,30,0.6)",
        }}>
            {/* Header */}
            <Box sx={{ p: 2.5, borderBottom: `1px solid ${C.border}` }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 20 }}>Messages</Typography>
                    <Chip label={CONVERSATIONS.reduce((a, c) => a + c.unread, 0)} size="small" sx={{ background: `${C.coral}22`, color: C.coral, fontWeight: 700, fontSize: 11 }} />
                </Stack>
                <TextField
                    fullWidth size="small" placeholder="Search conversations…"
                    value={search} onChange={e => setSearch(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: C.faint }} /></InputAdornment> }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "12px", background: "rgba(240,237,232,0.04)",
                            fontSize: 13, color: C.text,
                            "& fieldset": { borderColor: C.border },
                            "&:hover fieldset": { borderColor: `${C.emerald}44` },
                            "&.Mui-focused fieldset": { borderColor: C.emerald },
                        },
                        "& input::placeholder": { color: C.faint },
                    }}
                />
            </Box>

            {/* List */}
            <Box sx={{ flex: 1, overflowY: "auto", "&::-webkit-scrollbar": { width: 4 }, "&::-webkit-scrollbar-thumb": { background: C.border, borderRadius: 2 } }}>
                {filtered.map(convo => (
                    <Box key={convo.id} onClick={() => onSelect(convo.id)} sx={{
                        px: 2.5, py: 2, cursor: "pointer",
                        background: activeId === convo.id ? `${C.emerald}0D` : "transparent",
                        borderLeft: `3px solid ${activeId === convo.id ? C.emerald : "transparent"}`,
                        "&:hover": { background: activeId === convo.id ? `${C.emerald}0D` : "rgba(240,237,232,0.03)" },
                        transition: "all 0.15s",
                    }}>
                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                            <Box sx={{ position: "relative", flexShrink: 0 }}>
                                <Avatar sx={{ width: 44, height: 44, background: convo.color, fontSize: 15, fontWeight: 700 }}>{convo.initials}</Avatar>
                                {convo.online && (
                                    <Box sx={{ position: "absolute", bottom: 1, right: 1, width: 10, height: 10, borderRadius: "50%", background: C.emerald, border: `2px solid ${C.ink}` }} />
                                )}
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography sx={{ color: C.text, fontWeight: convo.unread > 0 ? 700 : 600, fontSize: 14 }}>{convo.name}</Typography>
                                    <Typography sx={{ color: C.faint, fontSize: 11 }}>{convo.time}</Typography>
                                </Stack>
                                <Typography sx={{ color: C.faint, fontSize: 11, mb: 0.4 }}>{convo.skill}</Typography>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography sx={{ color: convo.unread > 0 ? C.muted : C.faint, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160, fontWeight: convo.unread > 0 ? 500 : 400 }}>
                                        {convo.lastMessage}
                                    </Typography>
                                    {convo.unread > 0 && (
                                        <Box sx={{ width: 18, height: 18, borderRadius: "50%", background: C.coral, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <Typography sx={{ fontSize: 10, color: "#fff", fontWeight: 700 }}>{convo.unread}</Typography>
                                        </Box>
                                    )}
                                </Stack>
                            </Box>
                        </Stack>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

// ─── Chat Window ──────────────────────────────────────────────────────────────
function ChatWindow({ convoId }: { convoId: number }) {
    const convo = CONVERSATIONS.find(c => c.id === convoId)!;
    const [messages, setMessages] = useState<Message[]>(MESSAGES_BY_CONVO[convoId] || []);
    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages(MESSAGES_BY_CONVO[convoId] || []);
        setInput("");
    }, [convoId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const send = () => {
        if (!input.trim()) return;
        const newMsg: Message = {
            id: messages.length + 1,
            from: "me",
            text: input.trim(),
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            read: false,
        };
        setMessages(prev => [...prev, newMsg]);
        setInput("");
    };

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
    };

    // Group messages by sender for bubble grouping
    return (
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", height: "calc(100vh - 56px)", minWidth: 0 }}>
            {/* Chat header */}
            <Box sx={{ px: 3, py: 1.8, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(8,15,30,0.8)", backdropFilter: "blur(8px)" }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <IconButton sx={{ display: { md: "none" }, color: C.muted, p: 0.5 }}><ArrowBack sx={{ fontSize: 18 }} /></IconButton>
                    <Box sx={{ position: "relative" }}>
                        <Avatar sx={{ width: 40, height: 40, background: convo.color, fontSize: 14, fontWeight: 700 }}>{convo.initials}</Avatar>
                        {convo.online && <Box sx={{ position: "absolute", bottom: 1, right: 1, width: 9, height: 9, borderRadius: "50%", background: C.emerald, border: `2px solid ${C.ink}` }} />}
                    </Box>
                    <Box>
                        <Stack direction="row" alignItems="center" spacing={0.8}>
                            <Typography sx={{ color: C.text, fontWeight: 600, fontSize: 15 }}>{convo.name}</Typography>
                            {convo.online && <Typography sx={{ fontSize: 11, color: C.emerald, fontWeight: 600 }}>Online</Typography>}
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Psychology sx={{ fontSize: 11, color: C.faint }} />
                            <Typography sx={{ fontSize: 12, color: C.faint }}>{convo.skill}</Typography>
                            {convo.scheduled && (
                                <>
                                    <Typography sx={{ fontSize: 11, color: C.faint }}>·</Typography>
                                    <Schedule sx={{ fontSize: 11, color: C.emerald }} />
                                    <Typography sx={{ fontSize: 12, color: C.emerald, fontWeight: 600 }}>{convo.scheduled}</Typography>
                                </>
                            )}
                        </Stack>
                    </Box>
                </Stack>
                <Stack direction="row" spacing={0.5}>
                    <IconButton sx={{ color: C.muted, "&:hover": { color: C.emerald, background: `${C.emerald}10` } }}><Phone sx={{ fontSize: 19 }} /></IconButton>
                    <IconButton sx={{ color: C.muted, "&:hover": { color: C.emerald, background: `${C.emerald}10` } }}><VideoCall sx={{ fontSize: 19 }} /></IconButton>
                    <IconButton sx={{ color: C.muted, "&:hover": { color: C.text } }}><MoreVert sx={{ fontSize: 19 }} /></IconButton>
                </Stack>
            </Box>

            {/* Messages */}
            <Box sx={{
                flex: 1, overflowY: "auto", px: { xs: 2, md: 3 }, py: 2.5,
                display: "flex", flexDirection: "column", gap: 0.5,
                "&::-webkit-scrollbar": { width: 4 },
                "&::-webkit-scrollbar-thumb": { background: C.border, borderRadius: 2 },
            }}>
                {messages.map((msg, i) => {
                    const isMe = msg.from === "me";
                    const prevMsg = i > 0 ? messages[i - 1] : null;
                    const showAvatar = !isMe && (!prevMsg || prevMsg.from === "me");
                    const isLastInGroup = !messages[i + 1] || messages[i + 1].from !== msg.from;

                    return (
                        <Box key={msg.id} sx={{ display: "flex", flexDirection: isMe ? "row-reverse" : "row", alignItems: "flex-end", gap: 1, mb: isLastInGroup ? 1.5 : 0.2 }}>
                            {/* Avatar for them */}
                            {!isMe && (
                                <Avatar sx={{ width: 28, height: 28, background: convo.color, fontSize: 10, fontWeight: 700, flexShrink: 0, opacity: showAvatar ? 1 : 0 }}>
                                    {convo.initials}
                                </Avatar>
                            )}

                            <Box sx={{ maxWidth: "68%", display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                                <Box sx={{
                                    px: 2, py: 1.2,
                                    background: isMe ? `linear-gradient(135deg,${C.emerald},${C.emeraldLight}88)` : "rgba(240,237,232,0.07)",
                                    borderRadius: isMe
                                        ? "18px 18px 4px 18px"
                                        : "18px 18px 18px 4px",
                                    border: isMe ? "none" : `1px solid ${C.border}`,
                                    animation: `bubbleIn 0.2s ease`,
                                    "@keyframes bubbleIn": { from: { opacity: 0, transform: "translateY(6px)" }, to: { opacity: 1, transform: "translateY(0)" } },
                                }}>
                                    <Typography sx={{ color: isMe ? "#fff" : C.text, fontSize: 14, lineHeight: 1.6 }}>
                                        {msg.text}
                                    </Typography>
                                </Box>
                                {isLastInGroup && (
                                    <Stack direction="row" alignItems="center" spacing={0.4} mt={0.4}>
                                        <Typography sx={{ fontSize: 10, color: C.faint }}>{msg.time}</Typography>
                                        {isMe && (
                                            msg.read
                                                ? <DoneAll sx={{ fontSize: 13, color: C.emerald }} />
                                                : <Done sx={{ fontSize: 13, color: C.faint }} />
                                        )}
                                    </Stack>
                                )}
                            </Box>
                        </Box>
                    );
                })}
                <div ref={bottomRef} />
            </Box>

            {/* Input bar */}
            <Box sx={{ px: { xs: 2, md: 3 }, py: 2, borderTop: `1px solid ${C.border}`, background: "rgba(8,15,30,0.8)" }}>
                <Stack direction="row" alignItems="flex-end" spacing={1.5}>
                    <Stack direction="row" spacing={0.5}>
                        <IconButton size="small" sx={{ color: C.faint, "&:hover": { color: C.coral } }}>
                            <AttachFile sx={{ fontSize: 20 }} />
                        </IconButton>
                        <IconButton size="small" sx={{ color: C.faint, "&:hover": { color: C.gold } }}>
                            <EmojiEmotions sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Stack>

                    <TextField
                        fullWidth multiline maxRows={4}
                        placeholder="Type a message…"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKey}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "14px", background: "rgba(240,237,232,0.05)",
                                fontSize: 14, color: C.text, py: 1.2, px: 1.5,
                                "& fieldset": { borderColor: C.border },
                                "&:hover fieldset": { borderColor: `${C.emerald}44` },
                                "&.Mui-focused fieldset": { borderColor: C.emerald },
                            },
                            "& textarea::placeholder": { color: C.faint },
                        }}
                    />

                    <IconButton onClick={send} disabled={!input.trim()} sx={{
                        width: 44, height: 44, borderRadius: "12px",
                        background: input.trim() ? `linear-gradient(135deg,${C.emerald},${C.coral})` : "rgba(240,237,232,0.06)",
                        color: input.trim() ? "#fff" : C.faint,
                        transition: "all 0.2s",
                        "&:hover": { transform: input.trim() ? "scale(1.05)" : "none" },
                        "&.Mui-disabled": { background: "rgba(240,237,232,0.06)", color: C.faint },
                    }}>
                        <Send sx={{ fontSize: 18 }} />
                    </IconButton>
                </Stack>
                <Typography sx={{ fontSize: 11, color: C.faint, mt: 0.8, textAlign: "center" }}>
                    Press Enter to send · Shift+Enter for new line
                </Typography>
            </Box>
        </Box>
    );
}

// ─── Session Info Panel ───────────────────────────────────────────────────────
function SessionPanel({ convoId }: { convoId: number }) {
    const convo = CONVERSATIONS.find(c => c.id === convoId)!;
    return (
        <Box sx={{
            width: 280, flexShrink: 0,
            borderLeft: `1px solid ${C.border}`,
            height: "calc(100vh - 56px)",
            overflowY: "auto", p: 2.5,
            display: { xs: "none", lg: "block" },
            background: "rgba(8,15,30,0.4)",
            "&::-webkit-scrollbar": { width: 4 },
            "&::-webkit-scrollbar-thumb": { background: C.border, borderRadius: 2 },
        }}>
            {/* Profile */}
            <Box sx={{ textAlign: "center", mb: 3 }}>
                <Box sx={{ position: "relative", display: "inline-block", mb: 1.5 }}>
                    <Avatar sx={{ width: 64, height: 64, background: convo.color, fontSize: 22, fontWeight: 700, mx: "auto" }}>{convo.initials}</Avatar>
                    {convo.online && <Box sx={{ position: "absolute", bottom: 2, right: 2, width: 12, height: 12, borderRadius: "50%", background: C.emerald, border: `2px solid ${C.ink}` }} />}
                </Box>
                <Typography sx={{ color: C.text, fontWeight: 700, fontSize: 16 }}>{convo.name}</Typography>
                <Typography sx={{ color: C.faint, fontSize: 12, mb: 1 }}>{convo.skill}</Typography>
                <Stack direction="row" justifyContent="center" spacing={0.3}>
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} sx={{ fontSize: 13, color: C.gold }} />)}
                    <Typography sx={{ fontSize: 12, color: C.gold, ml: 0.5 }}>4.9</Typography>
                </Stack>
            </Box>

            <Divider sx={{ borderColor: C.border, mb: 2.5 }} />

            {/* Session info */}
            {convo.scheduled && (
                <Card sx={{ background: `${C.emerald}0D`, border: `1px solid ${C.emerald}22`, borderRadius: "14px", p: 2, mb: 2.5 }}>
                    <Stack direction="row" alignItems="center" spacing={0.8} mb={1}>
                        <CalendarMonth sx={{ fontSize: 16, color: C.emerald }} />
                        <Typography sx={{ color: C.emerald, fontWeight: 600, fontSize: 13 }}>Upcoming session</Typography>
                    </Stack>
                    <Typography sx={{ color: C.text, fontWeight: 600, fontSize: 14 }}>{convo.scheduled}</Typography>
                    <Typography sx={{ color: C.faint, fontSize: 12, mt: 0.3 }}>{convo.skill}</Typography>
                    <Stack direction="row" spacing={1} mt={1.5}>
                        <Button size="small" fullWidth sx={{ background: `${C.emerald}18`, color: C.emerald, textTransform: "none", borderRadius: "8px", fontSize: 12, "&:hover": { background: `${C.emerald}28` } }}>
                            Confirm
                        </Button>
                        <Button size="small" fullWidth sx={{ background: "rgba(240,237,232,0.05)", color: C.muted, textTransform: "none", borderRadius: "8px", fontSize: 12, "&:hover": { background: "rgba(240,237,232,0.08)" } }}>
                            Reschedule
                        </Button>
                    </Stack>
                </Card>
            )}

            {/* Quick actions */}
            <Typography sx={{ color: C.faint, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", mb: 1.5 }}>Quick actions</Typography>
            <Stack spacing={1} mb={2.5}>
                {[
                    { icon: <CalendarMonth sx={{ fontSize: 15 }} />, label: "Schedule session", color: C.emerald },
                    { icon: <LocationOn sx={{ fontSize: 15 }} />, label: "Share location", color: C.coral },
                    { icon: <CheckCircle sx={{ fontSize: 15 }} />, label: "Mark complete", color: C.gold },
                ].map(action => (
                    <Button key={action.label} fullWidth startIcon={action.icon} sx={{
                        justifyContent: "flex-start", color: action.color,
                        background: action.color + "10", border: `1px solid ${action.color}22`,
                        textTransform: "none", borderRadius: "10px", fontSize: 13, py: 1,
                        "&:hover": { background: action.color + "1A", borderColor: action.color + "44" },
                    }}>
                        {action.label}
                    </Button>
                ))}
            </Stack>

            <Divider sx={{ borderColor: C.border, mb: 2 }} />

            {/* Skill info */}
            <Typography sx={{ color: C.faint, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", mb: 1.5 }}>About the skill</Typography>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <Psychology sx={{ fontSize: 16, color: C.emerald }} />
                <Typography sx={{ color: C.text, fontWeight: 600, fontSize: 14 }}>{convo.skill}</Typography>
            </Stack>
            <Typography sx={{ color: C.muted, fontSize: 13, lineHeight: 1.7, mb: 1.5 }}>
                Hands-on, project-based learning at your own pace. Sessions tailored to your level.
            </Typography>
            <Button fullWidth variant="outlined" size="small" sx={{
                borderColor: `${C.emerald}33`, color: C.emerald,
                textTransform: "none", borderRadius: "10px", fontSize: 13,
                "&:hover": { borderColor: C.emerald, background: `${C.emerald}08` },
            }}>
                View skill page
            </Button>
        </Box>
    );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function ChatPage() {
    const [activeConvo, setActiveConvo] = useState(1);

    return (
        <Box sx={{ background: C.ink, height: "100vh", display: "flex", flexDirection: "column", color: C.text }}>
            <Navbar />
            <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
                <ConversationList activeId={activeConvo} onSelect={setActiveConvo} />
                <ChatWindow convoId={activeConvo} />
                <SessionPanel convoId={activeConvo} />
            </Box>
        </Box>
    );
}