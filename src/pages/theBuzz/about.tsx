import { SectionLayout } from "../../layout/section.layout";

export const About: React.FC = () => {
  const paragraphs = [
    "There’s something happening right now that I keep thinking about: the gap between an idea and a working product has never been smaller. What used to need a funded team and months of runway can now move at the pace of clear thinking. I find that genuinely exciting — and I try to stay at that edge, learning the tools, testing the limits, understanding what’s actually possible.",
    "That curiosity didn’t start with AI. I’ve always been drawn to making things — software, electronics, woodwork, a garden. It’s the same satisfaction regardless of the medium: you start with nothing and end up with something that works. I’ve carried that into my work as a developer and team leader: understand the goal deeply, break it into pieces, build toward it deliberately.",
    "What I care about in any role is the outcome — that the product makes sense to the person using it, that the architecture won’t fight you later, that the team knows what it’s working toward and why. I’m open to both developer and leadership positions, and I think the best of both have more in common than people usually assume.",
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
            <b>TL;DR:</b> Maker by nature, pragmatist by practice — product
            and people on top of mind always.
          </p>
        </div>
      </div>
    </SectionLayout>
  );
};
