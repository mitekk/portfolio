import type { ReactNode } from "react";

interface ContentPanelProps {
  children: ReactNode;
  className?: string;
}

export const ContentPanel: React.FC<ContentPanelProps> = ({
  children,
  className,
}) => (
  <div
    style={{
      backgroundColor: "var(--color-panel-bg)",
      borderRadius: "0.75rem",
      padding: "1rem",
      height: "fit-content",
      color: "var(--color-text)",
    }}
    className={`w-full max-w-full ${className ?? ""}`.trim()}
  >
    {children}
  </div>
);
