"use client";
// components/ui/CommandPaletteWrapper.tsx
// Listens globally for Cmd+K / Ctrl+K and renders the CommandPalette

import React, { useState, useEffect } from "react";
import CommandPalette from "@/components/ui/CommandPalette";

export default function CommandPaletteWrapper() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen(v => !v);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    return <CommandPalette open={open} onClose={() => setOpen(false)} />;
}
