/**
 * TypeScript mirror of the Tailwind v4 theme exported by ./theme.css.
 */
export const tokens = {
  colors: {
    background: "var(--open-design-color-background)",
    "background-secondary": "var(--open-design-color-background-secondary)",
    surface: "var(--open-design-color-surface)",
    "surface-hover": "var(--open-design-color-surface-hover)",
    "surface-active": "var(--open-design-color-surface-active)",
    "surface-muted": "var(--open-design-color-surface-muted)",
    border: "var(--open-design-color-border)",
    "border-muted": "var(--open-design-color-border-muted)",
    "border-subtle": "var(--open-design-color-border-subtle)",
    accent: "var(--open-design-color-accent)",
    "accent-hover": "var(--open-design-color-accent-hover)",
    "accent-muted": "var(--open-design-color-accent-muted)",
    "text-primary": "var(--open-design-color-text-primary)",
    "text-secondary": "var(--open-design-color-text-secondary)",
    "text-muted": "var(--open-design-color-text-muted)",
    success: "var(--open-design-color-success)",
    warning: "var(--open-design-color-warning)",
    error: "var(--open-design-color-error)",
    mcp: "var(--open-design-color-mcp)",
  },
  shadows: {
    soft: "var(--open-design-shadow-soft)",
    card: "var(--open-design-shadow-card)",
    elevated: "var(--open-design-shadow-elevated)",
  },
  fonts: {
    sans: "var(--open-design-font-sans)",
    mono: "var(--open-design-font-mono)",
  },
  radii: {
    sm: "var(--open-design-radius-sm)",
    md: "var(--open-design-radius-md)",
    lg: "var(--open-design-radius-lg)",
    xl: "var(--open-design-radius-xl)",
    "2xl": "var(--open-design-radius-2xl)",
  },
} as const;
