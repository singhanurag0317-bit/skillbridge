// app/impact/loading.tsx
import React from "react";
import { Box, Skeleton, Stack, Container } from "@mui/material";

const bg = "#080F1E";
const c  = "rgba(240,237,232,0.06)";

export default function ImpactLoading() {
    return (
        <Box sx={{ background: bg, minHeight: "100vh" }}>
            <Box sx={{ px: 4, py: 2, borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Skeleton variant="rounded" width={140} height={28} sx={{ bgcolor: c }} />
                <Skeleton variant="circular" width={32} height={32} sx={{ bgcolor: c }} />
            </Box>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Skeleton variant="rounded" height={180} sx={{ bgcolor: c, borderRadius: "20px", mb: 3 }} />
                <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                    <Box flex={1}><Skeleton variant="rounded" height={300} sx={{ bgcolor: c, borderRadius: "18px" }} /></Box>
                    <Box flex={1}><Skeleton variant="rounded" height={300} sx={{ bgcolor: c, borderRadius: "18px" }} /></Box>
                </Stack>
            </Container>
        </Box>
    );
}
