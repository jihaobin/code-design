/**
 * TypeScript mirror of the Tailwind v4 theme exported by ./theme.css.
 */
export const tokens = {
  colors: {
    background: "var(--codesign-color-background)",
    "background-secondary": "var(--codesign-color-background-secondary)",
    surface: "var(--codesign-color-surface)",
    "surface-hover": "var(--codesign-color-surface-hover)",
    "surface-active": "var(--codesign-color-surface-active)",
    "surface-muted": "var(--codesign-color-surface-muted)",
    border: "var(--codesign-color-border)",
    "border-muted": "var(--codesign-color-border-muted)",
    "border-subtle": "var(--codesign-color-border-subtle)",
    accent: "var(--codesign-color-accent)",
    "accent-hover": "var(--codesign-color-accent-hover)",
    "accent-muted": "var(--codesign-color-accent-muted)",
    "text-primary": "var(--codesign-color-text-primary)",
    "text-secondary": "var(--codesign-color-text-secondary)",
    "text-muted": "var(--codesign-color-text-muted)",
    success: "var(--codesign-color-success)",
    warning: "var(--codesign-color-warning)",
    error: "var(--codesign-color-error)",
    mcp: "var(--codesign-color-mcp)",
  },
  shadows: {
    soft: "var(--codesign-shadow-soft)",
    card: "var(--codesign-shadow-card)",
    elevated: "var(--codesign-shadow-elevated)",
  },
  fonts: {
    sans: "var(--codesign-font-sans)",
    mono: "var(--codesign-font-mono)",
  },
  radii: {
    sm: "var(--codesign-radius-sm)",
    md: "var(--codesign-radius-md)",
    lg: "var(--codesign-radius-lg)",
    xl: "var(--codesign-radius-xl)",
    "2xl": "var(--codesign-radius-2xl)",
  },
} as const;
