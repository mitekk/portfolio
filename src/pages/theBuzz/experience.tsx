import { SectionLayout } from "../../layout/section.layout";
import { ContentPanel } from "../../components/UI";

export const Experience: React.FC = () => {
  const experience = [
    {
      company: "LawPDF",
      position: "Independent",
      duration: "2025-2026",
      technologies: ["Next.js", "Node.js", "AWS", "AI"],
      description: `Took a legal-tech idea from concept to a live product. Alone. Handled product decisions, architecture, design, and implementation: a platform that helps lawyers and clients gather case information and produce a single summarized document with referenced sources. Nothing delegated. Built using AI-assisted development throughout.`,
    },
    {
      company: "Clarity",
      position: "Fullstack Team Lead",
      duration: "2023-2025",
      technologies: [
        "AWS",
        "Serverless",
        "Vue.js",
        "Node.js",
        "Apollo",
        "MongoDB",
      ],
      description: `Owned full-stack development of the company’s core product, from architecture to delivery. Ran the technical design, built and mentored the team, and kept engineering and product moving in the same direction. The business-critical path ran through this work.`,
    },
    {
      company: "Daytwo",
      position: "Fullstack Team Lead",
      duration: "2018-2023",
      technologies: ["GCP", "AWS", "CDK", "React", "Node.js", "mySQL"],
      description: `Five years in two distinct phases. First: leading client projects, in-house and offshore. Then: decomposing a monolith into microservices and integrating with healthcare and insurance providers in Israel and the US. The second phase is where I learned what production scale, compliance constraints, and real systemic complexity actually feel like.`,
    },
    {
      company: "Softwave",
      position: "Fullstack Dev",
      duration: "2016-2018",
      technologies: ["Azure", "Angular", "React", ".Net Core", "SQL"],
      description: `First production experience with React and Angular. Worked across the stack on end-to-end client solutions. The point where modern frontend stopped being foreign and started becoming natural.`,
    },
    {
      company: "Eternity",
      position: "Fullstack Dev",
      duration: "2015-2016",
      technologies: [
        "Azure",
        "Javascript",
        "HTML",
        "CSS",
        "ASP.Net",
        "C#",
        "SQL",
      ],
      description: `First time owning cloud infrastructure in production. Built web applications on Azure and got comfortable with the operational side of shipping software, not just writing it.`,
    },
    {
      company: "Qpoint",
      position: "Fullstack Dev",
      duration: "2014-2015",
      technologies: ["Javascript", "HTML", "CSS", "ASP.Net", "C#", "SQL"],
      description: `First job with real engineering standards. Working inside a structured, well-maintained codebase with experienced developers changed how I thought about code quality, maintainability, and what good collaboration looks like.`,
    },
    {
      company: "Bynet",
      position: "Fullstack Dev",
      duration: "2012-2014",
      technologies: ["Javascript", "HTML", "CSS", "ASP.Net", "C#"],
      description: `Where it started. Server-side and client-side, figuring out what the job actually is before knowing how much there is to learn.`,
    },
  ];

  return (
    <SectionLayout>
      <ContentPanel className="flex flex-col gap-5">
        {experience.map((exp) => (
          <div className="flex flex-col gap-4" key={exp.company}>
            <div className="gap-1">
              <div className="text-base md:text-xl font-bold">
                {exp.company}, {exp.position}
              </div>
              <div className="text-sm md:text-lg">{exp.duration}</div>
              <div className="flex flex-wrap text-sm md:text-md font-semibold gap-x-2">
                {exp.technologies.map((tech) => (
                  <div key={tech}>{tech}</div>
                ))}
              </div>
            </div>

            <div className={`font-light`}>{exp.description}</div>
          </div>
        ))}
      </ContentPanel>
    </SectionLayout>
  );
};
