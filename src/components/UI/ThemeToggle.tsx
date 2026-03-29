interface ThemeToggleProps {
  theme: "light" | "dark";
  toggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggle }) => (
  <button
    className="theme-toggle"
    onClick={toggle}
    aria-label="Toggle theme"
    style={{
      position: "fixed",
      right: "24px",
      background: "var(--color-nav)",
      color: "var(--color-text-nav)",
      border: "none",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      cursor: "pointer",
      fontSize: "18px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {theme === "light" ? "🌙" : "💡"}
  </button>
);
