// theme/theme.ts
import { createTheme } from "@mui/material/styles";

// ─── Emerald + Coral Palette ──────────────────────────────────────────────────
// Primary   → Emerald  #10B981  (actions, CTAs, active states)
// Secondary → Coral    #F4623A  (highlights, badges, accents)
// Surface   → Deep ink #080F1E  (page background)
// Card      → #0E1829  (card / paper background)

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#10B981",   // emerald
      light: "#34D399",
      dark: "#059669",
    },
    secondary: {
      main: "#F4623A",   // coral
      light: "#F87B58",
      dark: "#D4431E",
    },
    error: { main: "#F43A3A" },
    warning: { main: "#F4B83A" },
    success: { main: "#10B981" },
    background: {
      default: "#080F1E",   // deep ink
      paper: "#0E1829",
    },
    text: {
      primary: "#F0EDE8",
      secondary: "rgba(240,237,232,0.52)",
      disabled: "rgba(240,237,232,0.22)",
    },
    divider: "rgba(240,237,232,0.07)",
  },

  typography: {
    fontFamily: '"DM Sans", "Roboto", sans-serif',
    h1: { fontFamily: '"Playfair Display", serif', fontWeight: 800 },
    h2: { fontFamily: '"Playfair Display", serif', fontWeight: 800 },
    h3: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },

  shape: { borderRadius: 12 },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #10B981, #F4623A)",
          color: "#fff",
          "&:hover": {
            background: "linear-gradient(135deg, #34D399, #F4623A)",
            boxShadow: "0 6px 24px rgba(16,185,129,0.35)",
          },
        },
        outlinedPrimary: {
          borderColor: "rgba(16,185,129,0.4)",
          color: "#10B981",
          "&:hover": {
            borderColor: "#10B981",
            background: "rgba(16,185,129,0.08)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(240,237,232,0.03)",
          border: "1px solid rgba(240,237,232,0.07)",
          borderRadius: 16,
          boxShadow: "none",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            background: "rgba(240,237,232,0.04)",
            "& fieldset": { borderColor: "rgba(240,237,232,0.1)" },
            "&:hover fieldset": { borderColor: "rgba(16,185,129,0.4)" },
            "&.Mui-focused fieldset": { borderColor: "#10B981" },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, background: "rgba(240,237,232,0.08)" },
        bar: { background: "linear-gradient(90deg, #10B981, #F4623A)", borderRadius: 4 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(8,15,30,0.88)",
          backdropFilter: "blur(16px)",
          boxShadow: "none",
          borderBottom: "1px solid rgba(240,237,232,0.06)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: "rgba(240,237,232,0.06)" },
      },
    },
  },
});
