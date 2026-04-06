// app/explore/loading.tsx
import React from "react";
import { Box, Skeleton, Stack, Container } from "@mui/material";

const bg = "#080F1E";
const c  = "rgba(240,237,232,0.06)";

export default function ExploreLoading() {
    return (
        <Box sx={{ background: bg, minHeight: "100vh" }}>
            <Box sx={{ px: 4, py: 2, borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Skeleton variant="rounded" width={140} height={28} sx={{ bgcolor: c }} />
                <Skeleton variant="rounded" width={200} height={36} sx={{ bgcolor: c, borderRadius: "12px" }} />
                <Skeleton variant="circular" width={32} height={32} sx={{ bgcolor: c }} />
            </Box>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Filter chips */}
                <Stack direction="row" spacing={1.5} mb={4} flexWrap="wrap">
                    {[80, 60, 90, 70, 55, 75].map((w, i) => <Skeleton key={i} variant="rounded" width={w} height={30} sx={{ bgcolor: c, borderRadius: "20px" }} />)}
                </Stack>
                {/* Cards grid */}
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 2.5 }}>
                    {[...Array(6)].map((_, i) => <Skeleton key={i} variant="rounded" height={220} sx={{ bgcolor: c, borderRadius: "18px" }} />)}
                </Box>
            </Container>
        </Box>
    );
}
