"use client";
// context/ToastContext.tsx — Global toast/notification system
// Usage: const { success, error, info } = useToast();

import React, { createContext, useContext, useState, useCallback } from "react";
import { Alert, Snackbar, Stack } from "@mui/material";

type Severity = "success" | "error" | "info" | "warning";

interface ToastItem { id: number; message: string; severity: Severity; }

interface ToastContextType {
    toast: (message: string, severity?: Severity) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
    warn: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const EMERALD = "#10B981";
const CORAL   = "#F4623A";

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const dismiss = useCallback((id: number) =>
        setToasts(prev => prev.filter(t => t.id !== id)), []);

    const toast = useCallback((message: string, severity: Severity = "info") => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev.slice(-3), { id, message, severity }]);
        setTimeout(() => dismiss(id), 4000);
    }, [dismiss]);

    const success = useCallback((msg: string) => toast(msg, "success"), [toast]);
    const error   = useCallback((msg: string) => toast(msg, "error"),   [toast]);
    const info    = useCallback((msg: string) => toast(msg, "info"),    [toast]);
    const warn    = useCallback((msg: string) => toast(msg, "warning"), [toast]);

    return (
        <ToastContext.Provider value={{ toast, success, error, info, warn }}>
            {children}
            {/* Toast stack */}
            <Stack
                spacing={1}
                sx={{
                    position: "fixed", bottom: 24, right: 24,
                    zIndex: 9999, pointerEvents: "none",
                }}
            >
                {toasts.map(t => (
                    <Snackbar
                        key={t.id}
                        open
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        sx={{ position: "static", transform: "none" }}
                    >
                        <Alert
                            severity={t.severity}
                            variant="filled"
                            onClose={() => dismiss(t.id)}
                            sx={{
                                pointerEvents: "auto",
                                borderRadius: "12px",
                                fontSize: 13,
                                fontWeight: 500,
                                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                                "& .MuiAlert-icon": { fontSize: 18 },
                                ...(t.severity === "success" && { background: EMERALD }),
                                ...(t.severity === "error"   && { background: CORAL }),
                            }}
                        >
                            {t.message}
                        </Alert>
                    </Snackbar>
                ))}
            </Stack>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be inside <ToastProvider>");
    return ctx;
}
