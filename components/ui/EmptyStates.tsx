// components/ui/EmptyStates.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Drop-in empty state components for Dashboard and Explore.
// Usage:
//   import { EmptySkills, EmptyRequests, EmptyRecommended, EmptyExplore, EmptyChat } from "@/components/ui/EmptyStates";
// ─────────────────────────────────────────────────────────────────────────────
"use client";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Add, Explore, Psychology, Search, ChatBubbleOutline } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const C = {
    emerald: "#10B981",
    coral: "#F4623A",
    gold: "#F4B83A",
    text: "#F0EDE8",
    muted: "rgba(240,237,232,0.52)",
    faint: "rgba(240,237,232,0.22)",
    border: "rgba(240,237,232,0.07)",
};

// ─── Shared wrapper ───────────────────────────────────────────────────────────
function EmptyWrapper({
    icon, color, title, subtitle, actionLabel, actionIcon, onAction, secondaryLabel, onSecondary,
}: {
    icon: React.ReactNode;
    color: string;
    title: string;
    subtitle: string;
    actionLabel: string;
    actionIcon?: React.ReactNode;
    onAction: () => void;
    secondaryLabel?: string;
    onSecondary?: () => void;
}) {
    return (
        <Box sx={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", textAlign: "center",
            py: 7, px: 3,
            background: "rgba(240,237,232,0.02)",
            border: `1px dashed ${C.border}`,
            borderRadius: "20px",
            animation: "fadeIn 0.4s ease",
            "@keyframes fadeIn": { from: { opacity: 0, transform: "translateY(10px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        }}>
            {/* Icon circle */}
            <Box sx={{
                width: 72, height: 72, borderRadius: "50%",
                background: color + "15",
                border: `2px dashed ${color}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                mb: 2.5, color,
            }}>
                {icon}
            </Box>

            <Typography sx={{ fontFamily: "'Playfair Display',serif", color: C.text, fontWeight: 700, fontSize: 20, mb: 1 }}>
                {title}
            </Typography>
            <Typography sx={{ color: C.muted, fontSize: 14, lineHeight: 1.7, maxWidth: 340, mb: 3.5 }}>
                {subtitle}
            </Typography>

            <Stack direction="row" spacing={1.5} justifyContent="center">
                <Button variant="contained" startIcon={actionIcon} onClick={onAction} sx={{
                    background: `linear-gradient(135deg,${C.emerald},${C.coral})`,
                    color: "#fff", textTransform: "none", borderRadius: "12px",
                    px: 3, py: 1.2, fontSize: 14, fontWeight: 600, boxShadow: "none",
                    "&:hover": { boxShadow: `0 4px 20px ${C.emerald}44`, transform: "translateY(-1px)" },
                    transition: "all 0.2s",
                }}>
                    {actionLabel}
                </Button>
                {secondaryLabel && onSecondary && (
                    <Button variant="outlined" onClick={onSecondary} sx={{
                        borderColor: C.border, color: C.muted,
                        textTransform: "none", borderRadius: "12px", px: 3, py: 1.2, fontSize: 14,
                        "&:hover": { borderColor: C.emerald, color: C.emerald },
                    }}>
                        {secondaryLabel}
                    </Button>
                )}
            </Stack>
        </Box>
    );
}

// ─── 1. No skills listed yet (Dashboard → My Skills) ─────────────────────────
export function EmptySkills() {
    const router = useRouter();
    return (
        <EmptyWrapper
            icon={<Psychology sx={{ fontSize: 32 }} />}
            color={C.emerald}
            title="No skills listed yet"
            subtitle="Share what you know with your community. List a skill and start getting session requests today."
            actionLabel="Add your first skill"
            actionIcon={<Add sx={{ fontSize: 18 }} />}
            onAction={() => router.push("/dashboard")}
        />
    );
}

// ─── 2. No requests yet (Dashboard → Requests) ───────────────────────────────
export function EmptyRequests() {
    const router = useRouter();
    return (
        <EmptyWrapper
            icon={<ChatBubbleOutline sx={{ fontSize: 32 }} />}
            color={C.coral}
            title="No requests yet"
            subtitle="Once people find your skills and want to learn from you, their requests will show up here."
            actionLabel="Explore skills"
            actionIcon={<Explore sx={{ fontSize: 18 }} />}
            onAction={() => router.push("/explore")}
            secondaryLabel="Add a skill"
            onSecondary={() => router.push("/dashboard")}
        />
    );
}

// ─── 3. No recommendations yet (Dashboard → Recommended) ─────────────────────
export function EmptyRecommended() {
    const router = useRouter();
    return (
        <EmptyWrapper
            icon={<Search sx={{ fontSize: 32 }} />}
            color={C.gold}
            title="No matches found nearby"
            subtitle="Our AI hasn't found strong matches yet. Try updating your location or browsing the Explore page."
            actionLabel="Browse all skills"
            actionIcon={<Explore sx={{ fontSize: 18 }} />}
            onAction={() => router.push("/explore")}
        />
    );
}

// ─── 4. No search results (Explore page) ─────────────────────────────────────
export function EmptyExplore({ onClear }: { onClear: () => void }) {
    return (
        <EmptyWrapper
            icon={<Search sx={{ fontSize: 32 }} />}
            color={C.emerald}
            title="No skills found"
            subtitle="We couldn't find any skills matching your filters. Try adjusting your search, category, or distance."
            actionLabel="Clear all filters"
            onAction={onClear}
            secondaryLabel="Browse everything"
            onSecondary={onClear}
        />
    );
}

// ─── 5. No messages yet (Chat page) ──────────────────────────────────────────
export function EmptyChat() {
    const router = useRouter();
    return (
        <EmptyWrapper
            icon={<ChatBubbleOutline sx={{ fontSize: 32 }} />}
            color={C.emerald}
            title="No conversations yet"
            subtitle="When you request a skill session or someone requests yours, your conversations will appear here."
            actionLabel="Find skills to learn"
            actionIcon={<Explore sx={{ fontSize: 18 }} />}
            onAction={() => router.push("/explore")}
        />
    );
}

// ─── 6. No reviews yet (Profile page) ────────────────────────────────────────
export function EmptyReviews() {
    const router = useRouter();
    return (
        <EmptyWrapper
            icon={<Psychology sx={{ fontSize: 32 }} />}
            color={C.coral}
            title="No reviews yet"
            subtitle="Complete a few skill sessions and your reviews will show up here. Start by listing a skill!"
            actionLabel="Add a skill"
            actionIcon={<Add sx={{ fontSize: 18 }} />}
            onAction={() => router.push("/dashboard")}
        />
    );
}