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
      backgroundColor: "rgba(255,255,255,0.55)",
      borderRadius: "0.75rem",
      padding: "1rem",
      height: "fit-content",
      color: "#333332",
    }}
    className={className}
  >
    {children}
  </div>
);
