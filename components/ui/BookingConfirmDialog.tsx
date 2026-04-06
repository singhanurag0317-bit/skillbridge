"use client";
// components/ui/BookingConfirmDialog.tsx — Session booking confirm dialog

import React, { useState } from "react";
import {
    Dialog, DialogContent, Box, Button, Chip, Stack, TextField, Typography, Avatar, IconButton,
} from "@mui/material";
import { Close, CheckCircle, CalendarToday, AccessTime, LocationOn } from "@mui/icons-material";
import { useToast } from "@/context/ToastContext";

const C = {
    emerald: "#10B981", coral: "#F4623A", gold: "#F4B83A",
    text: "#F0EDE8", muted: "rgba(240,237,232,0.52)",
    border: "rgba(240,237,232,0.08)", card: "rgba(240,237,232,0.04)",
};

interface Props {
    open: boolean;
    onClose: () => void;
    skillTitle: string;
    providerName: string;
    providerInitials: string;
    selectedSlot: string;
}

export default function BookingConfirmDialog({ open, onClose, skillTitle, providerName, providerInitials, selectedSlot }: Props) {
    const { success } = useToast();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 900)); // TODO: call requestsApi.create(...)
        setLoading(false);
        setConfirmed(true);
        success("Session requested! You'll hear back within 2 hours.");
        setTimeout(() => { onClose(); setConfirmed(false); setMessage(""); }, 2000);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: { background: "#0e1829", borderRadius: "22px", border: `1px solid ${C.border}` },
            }}
            BackdropProps={{ sx: { backdropFilter: "blur(8px)" } }}
        >
            <DialogContent sx={{ p: 3.5 }}>
                {confirmed ? (
                    /* Success state */
                    <Stack alignItems="center" spacing={2} py={2}>
                        <Box sx={{ width: 64, height: 64, borderRadius: "50%", background: `${C.emerald}20`, display: "flex", alignItems: "center", justifyContent: "center", animation: "pop 0.4s ease", "@keyframes pop": { "0%": { transform: "scale(0.5)", opacity: 0 }, "100%": { transform: "scale(1)", opacity: 1 } } }}>
                            <CheckCircle sx={{ fontSize: 36, color: C.emerald }} />
                        </Box>
                        <Typography sx={{ color: C.text, fontWeight: 700, fontSize: 18, textAlign: "center" }}>Request sent!</Typography>
                        <Typography sx={{ color: C.muted, fontSize: 14, textAlign: "center" }}>
                            {providerName} will confirm within 2 hours.
                        </Typography>
                    </Stack>
                ) : (
                    <>
                        {/* Header */}
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
                            <Box>
                                <Typography sx={{ color: C.text, fontWeight: 700, fontSize: 18, fontFamily: "'Playfair Display',serif" }}>
                                    Confirm session
                                </Typography>
                                <Typography sx={{ color: C.muted, fontSize: 13, mt: 0.3 }}>Review your booking details</Typography>
                            </Box>
                            <IconButton onClick={onClose} sx={{ color: C.muted, p: 0.5 }}><Close sx={{ fontSize: 18 }} /></IconButton>
                        </Stack>

                        {/* Skill + Provider card */}
                        <Box sx={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "14px", p: 2, mb: 2.5 }}>
                            <Typography sx={{ color: C.text, fontWeight: 700, fontSize: 16, mb: 1.5 }}>{skillTitle}</Typography>
                            <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
                                <Avatar sx={{ width: 32, height: 32, background: `linear-gradient(135deg,${C.emerald},${C.coral})`, fontSize: 12, fontWeight: 700 }}>
                                    {providerInitials}
                                </Avatar>
                                <Typography sx={{ color: C.muted, fontSize: 13 }}>with <strong style={{ color: C.text }}>{providerName}</strong></Typography>
                            </Stack>
                            {selectedSlot && (
                                <Chip icon={<CalendarToday sx={{ fontSize: 12, color: `${C.emerald} !important` }} />}
                                    label={selectedSlot} size="small"
                                    sx={{ background: `${C.emerald}15`, color: C.emerald, fontSize: 12 }} />
                            )}
                        </Box>

                        {/* Details row */}
                        <Stack direction="row" spacing={2} mb={2.5}>
                            {[
                                { icon: <AccessTime sx={{ fontSize: 13 }} />, text: "1 hour" },
                                { icon: <LocationOn sx={{ fontSize: 13 }} />, text: "Online" },
                            ].map(({ icon, text }) => (
                                <Stack key={text} direction="row" alignItems="center" spacing={0.5}>
                                    <Box sx={{ color: C.muted }}>{icon}</Box>
                                    <Typography sx={{ color: C.muted, fontSize: 12 }}>{text}</Typography>
                                </Stack>
                            ))}
                        </Stack>

                        {/* Message */}
                        <TextField fullWidth multiline rows={2} placeholder={`Introduce yourself to ${providerName}…`}
                            value={message} onChange={e => setMessage(e.target.value)}
                            sx={{
                                mb: 2.5,
                                "& .MuiOutlinedInput-root": {
                                    color: C.text, borderRadius: "12px", fontSize: 13,
                                    "& fieldset": { borderColor: C.border },
                                    "&:hover fieldset": { borderColor: `${C.emerald}55` },
                                    "&.Mui-focused fieldset": { borderColor: C.emerald },
                                },
                            }}
                        />

                        {/* Actions */}
                        <Stack direction="row" spacing={1.5}>
                            <Button onClick={onClose} fullWidth variant="outlined"
                                sx={{ borderColor: C.border, color: C.muted, textTransform: "none", borderRadius: "12px" }}>
                                Cancel
                            </Button>
                            <Button onClick={handleConfirm} fullWidth variant="contained" disabled={loading}
                                sx={{ background: `linear-gradient(135deg,${C.emerald},${C.coral})`, color: "#fff", textTransform: "none", borderRadius: "12px", boxShadow: "none", fontWeight: 700 }}>
                                {loading ? "Sending…" : "Confirm"}
                            </Button>
                        </Stack>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
