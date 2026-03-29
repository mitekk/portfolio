import { SectionLayout } from "../../layout/section.layout";
import { ContentPanel } from "../../components/UI";
import { SeoHead } from "../../components/seo/seoHead";
import { routeSeo } from "../../seo/config";

export const About: React.FC = () => {
  const paragraphs = [
    "I am a full-stack developer and team lead with 14 years of experience. I ship products, build resilient teams, and leverage AI to move incredibly fast.",
    "This year, I built and shipped a legal-tech product from scratch, handling the product decisions, architecture, design, and implementation entirely solo. That level of output was only possible because I've deliberately leaned into AI-assisted development, treating it as a core engineering skill rather than a shortcut. It has fundamentally changed what one person can deliver.",
    "Before that, I spent years leading full-stack teams: decomposing monoliths, integrating with complex healthcare and insurance systems, mentoring engineers, and closing the gap between product and engineering. I know what a well-built system looks like, and I know exactly what it costs when it isn't.",
    "I'm looking for a role where the work matters and the bar is high. I am open to technical leadership and senior developer positions, as the best of both overlap more than people assume. What I care about is the outcome: a product that makes sense to the user, architecture that won't fight you six months later, and a team that knows exactly what it's building and why.",
  ];

  return (
    <>
      <SeoHead meta={routeSeo.about} />
      <SectionLayout>
        <ContentPanel>
          <div className="flex flex-col gap-5 font-light max-w-150 justify-self-center">
            <h1>About</h1>
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </ContentPanel>
      </SectionLayout>
    </>
  );
};
