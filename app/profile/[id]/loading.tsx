// app/profile/[id]/loading.tsx
import React from "react";
import { Box, Skeleton, Stack, Container } from "@mui/material";

const bg = "#080F1E";
const c  = "rgba(240,237,232,0.06)";

export default function ProfileLoading() {
    return (
        <Box sx={{ background: bg, minHeight: "100vh" }}>
            <Box sx={{ px: 4, py: 2, borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Skeleton variant="rounded" width={140} height={28} sx={{ bgcolor: c }} />
                <Skeleton variant="circular" width={32} height={32} sx={{ bgcolor: c }} />
            </Box>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
                    {/* Left panel */}
                    <Box width={{ xs: "100%", md: 300 }}>
                        <Skeleton variant="circular" width={96} height={96} sx={{ bgcolor: c, mb: 2 }} />
                        <Skeleton variant="text" width="70%" sx={{ bgcolor: c }} />
                        <Skeleton variant="text" width="50%" sx={{ bgcolor: c, mb: 2 }} />
                        <Skeleton variant="rounded" height={100} sx={{ bgcolor: c, borderRadius: "16px" }} />
                    </Box>
                    {/* Right panel */}
                    <Box flex={1}>
                        <Skeleton variant="rounded" height={48} sx={{ bgcolor: c, borderRadius: "12px", mb: 3 }} />
                        {[1,2,3].map(i => <Skeleton key={i} variant="rounded" height={120} sx={{ bgcolor: c, borderRadius: "16px", mb: 2 }} />)}
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
}
