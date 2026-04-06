// app/dashboard/loading.tsx
import React from "react";
import { Box, Skeleton, Stack, Container } from "@mui/material";

const bg = "#080F1E";
const c  = "rgba(240,237,232,0.06)";

export default function DashboardLoading() {
    return (
        <Box sx={{ background: bg, minHeight: "100vh" }}>
            {/* Navbar skeleton */}
            <Box sx={{ px: 4, py: 2, borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Skeleton variant="rounded" width={140} height={28} sx={{ bgcolor: c }} />
                <Stack direction="row" spacing={3}>{[1,2,3,4].map(i => <Skeleton key={i} variant="text" width={64} height={18} sx={{ bgcolor: c }} />)}</Stack>
                <Skeleton variant="circular" width={32} height={32} sx={{ bgcolor: c }} />
            </Box>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Stats row */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4}>
                    {[1,2,3,4].map(i => <Skeleton key={i} variant="rounded" height={100} sx={{ bgcolor: c, flex: 1, borderRadius: "16px" }} />)}
                </Stack>
                {/* Main content */}
                <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                    <Box flex={1}><Skeleton variant="rounded" height={320} sx={{ bgcolor: c, borderRadius: "18px" }} /></Box>
                    <Box width={{ xs: "100%", md: 300 }}><Skeleton variant="rounded" height={320} sx={{ bgcolor: c, borderRadius: "18px" }} /></Box>
                </Stack>
            </Container>
        </Box>
    );
}
