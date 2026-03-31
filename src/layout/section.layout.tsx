import type { ReactNode } from "react";

interface SectionLayoutProps {
  children: ReactNode;
}
export const SectionLayout: React.FC<SectionLayoutProps> = ({ children }) => {
  return (
    <section className="flex w-full min-w-0 min-h-full items-stretch p-4 md:p-8">
      {children}
    </section>
  );
};
