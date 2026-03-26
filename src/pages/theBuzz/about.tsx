import { SectionLayout } from "../../layout/section.layout";

export const About: React.FC = () => {
  const paragraphs = [
    "This year I built a legal-tech product from scratch: product decisions, architecture, design, implementation. Shipped it alone. That was only possible because AI-assisted development has genuinely changed what one person can do. I’ve leaned into that shift deliberately, treating it as a core skill, not a shortcut.",
    "Before that, I spent years leading full-stack teams: decomposing monoliths, integrating with healthcare and insurance systems, mentoring engineers, closing the gap between product and engineering. I’ve been writing production code for 12 years and still do. I know what a well-built system looks like, and I know what it costs when it isn’t.",
    "I’m looking for a role where the work matters and the bar is high. Open to technical leadership and senior developer positions. The best of both overlap more than people assume. What I care about is the outcome: a product that makes sense to the person using it, architecture that won’t fight you six months later, and a team that knows what it’s building and why.",
  ];

  return (
    <SectionLayout>
      <div style={{ color: "#333332" }}>
        <div className="mb-4 flex flex-col gap-5 text-sm md:text-base lg:text-lg text-justify">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          <hr className="border-zinc-400" />
          <p className="mb-12">
            <b>TL;DR:</b> Full-stack developer and team lead, 14 years in. I
            ship products, build teams, and move fast with AI.
          </p>
        </div>
      </div>
    </SectionLayout>
  );
};
