import { SectionLayout } from "../../layout/section.layout";

export const Experience: React.FC = () => {
  const experience = [
    {
      company: "LawPDF",
      position: "Independent — Product to Production",
      duration: "2025-2026",
      technologies: ["Next.js", "Node.js", "AWS", "AI"],
      description: `Independently took a legal-tech idea from concept to a live product. Handled every layer — product decisions, architecture, design, and implementation — building a platform that helps lawyers and their clients gather relevant case information and produce a single, summarized document with downloadable referenced sources. Built entirely with AI-assisted development.`,
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
      description: `Led full-stack development of the company’s core business logic — from product and technical design to delivery — while building and mentoring a high-performing team.`,
    },
    {
      company: "Daytwo",
      position: "Fullstack Team Lead",
      duration: "2018-2023",
      technologies: ["GCP", "AWS", "CDK", "React", "Node.js", "mySQL"],
      description: `Started by leading in-house and offshore client projects, then shifted to decomposing a monolith into microservices and driving major integrations with healthcare and insurance providers in Israel and the US.`,
    },
    {
      company: "Softwave",
      position: "Fullstack Dev",
      duration: "2016-2018",
      technologies: ["Azure", "Angular", "React", ".Net Core", "SQL"],
      description: `Contributed to end-to-end solutions using Angular and React — first hands-on experience with modern client frameworks.`,
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
      description: `Built scalable web applications on Azure, gaining first hands-on experience with cloud technologies.`,
    },
    {
      company: "Qpoint",
      position: "Fullstack Dev",
      duration: "2014-2015",
      technologies: ["Javascript", "HTML", "CSS", "ASP.Net", "C#", "SQL"],
      description: `First exposure to complex, well-structured applications — deepened understanding of best practices in collaborative software development.`,
    },
    {
      company: "Bynet",
      position: "Fullstack Dev",
      duration: "2012-2014",
      technologies: ["Javascript", "HTML", "CSS", "ASP.Net", "C#"],
      description: `Entry point into software — learned the fundamentals of both server-side and client-side development.`,
    },
  ];

  return (
    <SectionLayout>
      <div style={{ color: "#333332" }} className="flex flex-col h-full gap-5">
        {experience.map((exp, index) => (
          <div key={exp.company}>
            <div className="gap-1">
              <div className="text-base md:text-xl font-bold">
                {exp.company}, tlv — {exp.position}
              </div>
              <div className="text-sm md:text-lg">{exp.duration}</div>
            </div>
            <div className="flex flex-wrap text-sm md:text-lg font-medium gap-2">
              {exp.technologies.map((tech) => (
                <div key={tech}>{tech}</div>
              ))}
            </div>
            <div
              className={`text-justify font-light mt-2 ${
                index === experience.length - 1 ? "mb-12" : ""
              }`}
            >
              {exp.description}
            </div>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
};
