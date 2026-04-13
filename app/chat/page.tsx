"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { messagesApi, usersApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
    Box, Button, Card, Stack,
    Typography, Avatar, IconButton, Divider, Badge,
    TextField, InputAdornment, CircularProgress,
} from "@mui/material";
import {
    Send, Search, MoreVert, Phone, VideoCall,
    AttachFile, EmojiEmotions, Done, DoneAll,
    ArrowBack, Psychology, Schedule,
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

// ─── Export ───────────────────────────────────────────────────────────────────
export default function ChatPage() {
    const { user: me, loading: authLoading } = useAuth();
    const searchParams = useSearchParams();
    const targetUserId = searchParams.get("user");

    const [conversations, setConversations] = useState<any[]>([]);
    const [activeConvo, setActiveConvo] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    const fetchConvos = useCallback(async () => {
        try {
            const res = await messagesApi.getConversations();
            if (res.success) {
                setConversations(res.data);
                // If we have a target user from query, find or "create" a placeholder convo
                if (targetUserId && !activeConvo) {
                    const existing = res.data.find((c: any) => c.userId === targetUserId);
                    if (existing) {
                        setActiveConvo(existing);
                    } else {
                        // Fetch the target user details to show a placeholder
                        const uRes = await usersApi.getProfile(targetUserId);
                        if (uRes.success) {
                            setActiveConvo({
                                userId: uRes.data.id,
                                name: uRes.data.name,
                                initials: uRes.data.initials || uRes.data.name[0],
                                online: false,
                                skill: "New conversation"
                            });
                        }
                    }
                } else if (!activeConvo && res.data.length > 0) {
                    setActiveConvo(res.data[0]);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [targetUserId, activeConvo]);

    const fetchMessages = useCallback(async () => {
        if (!activeConvo?.userId) return;
        try {
            const res = await messagesApi.getMessages(activeConvo.userId);
            if (res.success) setMessages(res.data);
        } catch (e) {
            console.error(e);
        }
    }, [activeConvo]);

    useEffect(() => {
        if (!authLoading) fetchConvos();
    }, [authLoading, fetchConvos]);

    useEffect(() => {
        fetchMessages();
        // Poll for new messages every 5 seconds for "real-life" feel
        const timer = setInterval(fetchMessages, 5000);
        return () => clearInterval(timer);
    }, [fetchMessages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !activeConvo) return;
        const text = input.trim();
        setInput("");
        try {
            const res = await messagesApi.send({ receiverId: activeConvo.userId, content: text });
            if (res.success) {
                setMessages(prev => [...prev, res.data]);
                fetchConvos(); // Update last message in list
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (authLoading || (loading && conversations.length === 0)) return (
        <Box sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.ink }}>
            <CircularProgress sx={{ color: C.emerald }} />
        </Box>
    );

    return (
        <Box sx={{ background: C.ink, height: "100vh", display: "flex", flexDirection: "column", color: C.text, overflow: "hidden" }}>
            <Navbar />
            <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
                
                {/* Conversations Sidebar */}
                <Box sx={{ width: { xs: "100%", md: 320 }, borderRight: `1px solid ${C.border}`, display: { xs: activeConvo ? "none" : "flex", md: "flex" }, flexDirection: "column" }}>
                    <Box sx={{ p: 2 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 20, mb: 2 }}>Messages</Typography>
                        <TextField fullWidth size="small" placeholder="Search..." InputProps={{ startAdornment: <Search sx={{ fontSize: 18, color: C.faint }} /> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", background: "rgba(240,237,232,0.05)", color: C.text } }} />
                    </Box>
                    <Stack sx={{ flex: 1, overflowY: "auto" }}>
                        {conversations.map(c => (
                            <Box key={c.userId} onClick={() => setActiveConvo(c)} sx={{ p: 2, cursor: "pointer", background: activeConvo?.userId === c.userId ? `${C.emerald}10` : "transparent", borderLeft: activeConvo?.userId === c.userId ? `3px solid ${C.emerald}` : "3px solid transparent", "&:hover": { background: "rgba(240,237,232,0.03)" } }}>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Avatar sx={{ background: C.emerald }}>{c.initials || c.name[0]}</Avatar>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{c.name}</Typography>
                                        <Typography sx={{ fontSize: 12, color: C.faint, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.lastMessage || "No messages yet"}</Typography>
                                    </Box>
                                    {c.unread > 0 && <Badge badgeContent={c.unread} color="error" />}
                                </Stack>
                            </Box>
                        ))}
                    </Stack>
                </Box>

                {/* Chat Area */}
                <Box sx={{ flex: 1, display: { xs: activeConvo ? "flex" : "none", md: "flex" }, flexDirection: "column" }}>
                    {activeConvo ? (
                        <>
                            <Box sx={{ p: 2, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                    <IconButton onClick={() => setActiveConvo(null)} sx={{ display: { md: "none" }, color: C.text }}><ArrowBack /></IconButton>
                                    <Avatar sx={{ background: C.emerald }}>{activeConvo.initials || activeConvo.name[0]}</Avatar>
                                    <Box>
                                        <Typography sx={{ fontWeight: 600 }}>{activeConvo.name}</Typography>
                                        <Typography sx={{ fontSize: 12, color: C.emerald }}>{activeConvo.online ? "Online" : activeConvo.skill}</Typography>
                                    </Box>
                                </Stack>
                            </Box>
                            
                            <Box sx={{ flex: 1, overflowY: "auto", p: 3, display: "flex", flexDirection: "column", gap: 1.5 }}>
                                {messages.map((m: any) => {
                                    const isMe = String(m.senderId) === String(me?.id);
                                    return (
                                        <Box key={m.id} sx={{ alignSelf: isMe ? "flex-end" : "flex-start", maxWidth: "70%" }}>
                                            <Box sx={{ p: 1.5, borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: isMe ? C.emerald : "rgba(240,237,232,0.08)" }}>
                                                <Typography sx={{ fontSize: 14 }}>{m.content}</Typography>
                                            </Box>
                                            <Typography sx={{ fontSize: 10, color: C.faint, mt: 0.5, textAlign: isMe ? "right" : "left" }}>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
                                        </Box>
                                    );
                                })}
                                <div ref={bottomRef} />
                            </Box>

                            <Box sx={{ p: 2, borderTop: `1px solid ${C.border}` }}>
                                <Stack direction="row" spacing={1.5}>
                                    <TextField fullWidth placeholder="Type a message..." value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === "Enter" && handleSend()} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", background: "rgba(240,237,232,0.05)", color: C.text } }} />
                                    <IconButton onClick={handleSend} sx={{ background: C.emerald, color: "#fff", "&:hover": { background: C.emeraldLight } }}><Send /></IconButton>
                                </Stack>
                            </Box>
                        </>
                    ) : (
                        <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Typography sx={{ color: C.faint }}>Select a conversation to start chatting</Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}