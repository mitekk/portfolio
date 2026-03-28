import type { ReactNode } from "react";

interface SectionLayoutProps {
  children: ReactNode;
}
export const SectionLayout: React.FC<SectionLayoutProps> = ({ children }) => {
  return (
    <section className="flex w-full min-w-0 h-full p-4 md:p-8 lg:p-12 overflow-auto">
      {children}
    </section>
  );
};
