"use client";
// components/forms/AddSkillModal.tsx — Modal form for creating a new skill

import React, { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, Button, Chip, IconButton, MenuItem, Select,
    Stack, TextField, Typography, FormControl, InputLabel,
} from "@mui/material";
import { Close, Add } from "@mui/icons-material";
import { useToast } from "@/context/ToastContext";
import { skillsApi } from "@/lib/api";
import type { SkillCategory } from "@/types";

const C = {
    emerald: "#10B981", coral: "#F4623A",
    text: "#F0EDE8", muted: "rgba(240,237,232,0.52)",
    border: "rgba(240,237,232,0.12)", card: "rgba(240,237,232,0.04)",
};

const CATEGORIES: SkillCategory[] = ["Tech", "Career", "Music", "Wellness", "Creative", "Language"];
const FORMATS = ["Online", "In-person", "Both"];
const DURATIONS = ["30 min", "45 min", "1 hour", "1.5 hours", "2 hours"];

interface Props { open: boolean; onClose: () => void; onAdded?: () => void; }

export default function AddSkillModal({ open, onClose, onAdded }: Props) {
    const { success } = useToast();
    const [loading, setLoading] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const [form, setForm] = useState({
        title: "", category: "Tech" as SkillCategory,
        description: "", duration: "1 hour",
        format: "Online", tags: [] as string[],
    });

    const set = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }));

    const addTag = () => {
        const t = tagInput.trim();
        if (t && !form.tags.includes(t) && form.tags.length < 6) {
            set("tags", [...form.tags, t]);
            setTagInput("");
        }
    };

    const removeTag = (t: string) => set("tags", form.tags.filter(x => x !== t));

    const handleSubmit = async () => {
        if (!form.title.trim() || !form.description.trim()) return;
        setLoading(true);
        try {
            await skillsApi.create({
                title: form.title,
                description: form.description,
                category: form.category,
                location: "Online / Mathura", // Default or get from user profile
                lat: 0,
                lng: 0,
                availability: [form.duration, form.format], // Simple mapping for now
                tags: form.tags,
            });
            success("Skill added successfully! 🎉");
            onAdded?.();
            onClose();
            setForm({ title: "", category: "Tech", description: "", duration: "1 hour", format: "Online", tags: [] });
        } catch (e: any) {
            console.error("Create skill error:", e);
        } finally {
            setLoading(false);
        }
    };

    const inputSx = {
        "& .MuiOutlinedInput-root": {
            color: C.text, borderRadius: "12px",
            "& fieldset": { borderColor: C.border },
            "&:hover fieldset": { borderColor: C.emerald + "66" },
            "&.Mui-focused fieldset": { borderColor: C.emerald },
        },
        "& .MuiInputLabel-root": { color: C.muted },
        "& .MuiInputLabel-root.Mui-focused": { color: C.emerald },
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { background: "#0e1829", borderRadius: "20px", border: `1px solid ${C.border}` },
            }}
            BackdropProps={{ sx: { backdropFilter: "blur(6px)" } }}
        >
            <DialogTitle sx={{ p: 3, pb: 1.5 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box>
                        <Typography sx={{ color: C.text, fontWeight: 700, fontSize: 20, fontFamily: "'Playfair Display',serif" }}>
                            Add a Skill
                        </Typography>
                        <Typography sx={{ color: C.muted, fontSize: 13, mt: 0.3 }}>Share what you can teach</Typography>
                    </Box>
                    <IconButton onClick={onClose} sx={{ color: C.muted }}><Close /></IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent sx={{ px: 3, py: 2 }}>
                <Stack spacing={2.5}>
                    {/* Title */}
                    <TextField fullWidth label="Skill title" placeholder="e.g. Python for Data Science" value={form.title} onChange={e => set("title", e.target.value)} sx={inputSx} />

                    {/* Category + Format row */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <FormControl fullWidth sx={inputSx}>
                            <InputLabel>Category</InputLabel>
                            <Select value={form.category} label="Category" onChange={e => set("category", e.target.value)} sx={{ color: C.text }}>
                                {CATEGORIES.map(c => <MenuItem key={c} value={c} sx={{ color: C.text }}>{c}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={inputSx}>
                            <InputLabel>Format</InputLabel>
                            <Select value={form.format} label="Format" onChange={e => set("format", e.target.value)} sx={{ color: C.text }}>
                                {FORMATS.map(f => <MenuItem key={f} value={f} sx={{ color: C.text }}>{f}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Stack>

                    {/* Duration */}
                    <FormControl fullWidth sx={inputSx}>
                        <InputLabel>Session duration</InputLabel>
                        <Select value={form.duration} label="Session duration" onChange={e => set("duration", e.target.value)} sx={{ color: C.text }}>
                            {DURATIONS.map(d => <MenuItem key={d} value={d} sx={{ color: C.text }}>{d}</MenuItem>)}
                        </Select>
                    </FormControl>

                    {/* Description */}
                    <TextField fullWidth multiline rows={3} label="Description" placeholder="What will students learn? What experience do you have?" value={form.description} onChange={e => set("description", e.target.value)} sx={inputSx} />

                    {/* Tags */}
                    <Box>
                        <Stack direction="row" spacing={1} mb={1}>
                            <TextField size="small" placeholder="Add tag (e.g. Beginner)" value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                                sx={{ flex: 1, ...inputSx }} />
                            <IconButton onClick={addTag} sx={{ color: C.emerald, border: `1px solid ${C.emerald}44`, borderRadius: "10px" }}><Add /></IconButton>
                        </Stack>
                        {form.tags.length > 0 && (
                            <Stack direction="row" flexWrap="wrap" gap={0.8}>
                                {form.tags.map(t => (
                                    <Chip key={t} label={t} size="small" onDelete={() => removeTag(t)}
                                        sx={{ background: `${C.emerald}20`, color: C.emerald, fontSize: 12, "& .MuiChip-deleteIcon": { color: C.emerald + "99" } }} />
                                ))}
                            </Stack>
                        )}
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pt: 1, pb: 3 }}>
                <Button onClick={onClose} sx={{ color: C.muted, textTransform: "none", mr: 1 }}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    disabled={loading || !form.title.trim() || !form.description.trim()}
                    variant="contained"
                    sx={{ background: `linear-gradient(135deg,${C.emerald},${C.coral})`, color: "#fff", textTransform: "none", borderRadius: "12px", px: 3, boxShadow: "none" }}
                >
                    {loading ? "Adding…" : "Add Skill"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
