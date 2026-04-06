// app/chat/loading.tsx
import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";

const bg = "#080F1E";
const c  = "rgba(240,237,232,0.06)";

export default function ChatLoading() {
    return (
        <Box sx={{ background: bg, height: "100vh", display: "flex", flexDirection: "column" }}>
            <Box sx={{ px: 4, py: 2, borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Skeleton variant="rounded" width={140} height={28} sx={{ bgcolor: c }} />
                <Skeleton variant="circular" width={32} height={32} sx={{ bgcolor: c }} />
            </Box>
            <Stack direction="row" flex={1} overflow="hidden">
                {/* Sidebar */}
                <Box sx={{ width: 300, borderRight: "1px solid rgba(255,255,255,0.05)", p: 2 }}>
                    <Skeleton variant="rounded" height={40} sx={{ bgcolor: c, borderRadius: "12px", mb: 2 }} />
                    {[1,2,3,4,5].map(i => (
                        <Stack key={i} direction="row" spacing={1.5} mb={1.5}>
                            <Skeleton variant="circular" width={44} height={44} sx={{ bgcolor: c }} />
                            <Box flex={1}><Skeleton variant="text" sx={{ bgcolor: c }} /><Skeleton variant="text" width="60%" sx={{ bgcolor: c }} /></Box>
                        </Stack>
                    ))}
                </Box>
                {/* Chat area */}
                <Box flex={1} p={3}>{[1,2,3].map(i => <Skeleton key={i} variant="rounded" height={60} sx={{ bgcolor: c, borderRadius: "14px", mb: 2 }} />)}</Box>
            </Stack>
        </Box>
    );
}
