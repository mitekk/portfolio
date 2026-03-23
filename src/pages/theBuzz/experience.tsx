import { SectionLayout } from "../../layout/section.layout";

export const Experience: React.FC = () => {
  const experience = [
    {
      company: "Clarity",
      position: "Fullstack Team Lead",
      duration: "2023-2025",
      technologies: [
        "AWS",
        "Serverless",
        "Terraform",
        "Vue.js",
        "Node.js",
        "Apollo",
        "MongoDB",
      ],
      description: `At Clarity, I led the development and maintenance of the company’s core business logic, working hands-on across the full stack—from product and technical design to implementation and timeline assessments. Over two years, I helped build a strong, versatile team through technical interviews and onboarding, fostering open communication and a positive team spirit. My work focused on delivering new product features, while also improving data structures, enhancing server-client efficiency, and strengthening our monitoring capabilities.`,
    },
    {
      company: "Daytwo",
      position: "Fullstack Team Lead",
      duration: "2018-2023",
      technologies: ["GCP", "AWS", "CDK", "React", "Node.js", "mySQL"],
      description: `At Daytwo, I started by leading both in-house and offshore developers with a focus on client-side projects, delivering tailored solutions and maintaining close collaboration with clients to meet their needs. As the company evolved, my role shifted to breaking down a monolith into microservices and strengthening backend capabilities, including major integrations with leading healthcare and insurance providers in Israel and the US.`,
    },
    {
      company: "Softwave",
      position: "Fullstack Dev",
      duration: "2016-2018",
      technologies: ["Azure", "Angular", "React", ".Net Core", "SQL"],
      description: `This was my first experience working with client frameworks like Angular and React, where I contributed to building and maintaining end-to-end solutions.`,
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
      description: `At Eternity, I was introduced to cloud technologies, gaining my first hands-on experience with Azure and developing scalable web applications.`,
    },
    {
      company: "Qpoint",
      position: "Fullstack Dev",
      duration: "2014-2015",
      technologies: ["Javascript", "HTML", "CSS", "ASP.Net", "C#", "SQL"],
      description: `Qpoint gave me my first exposure to complex yet well-structured applications, deepening my understanding of best practices in collaborative software development.`,
    },
    {
      company: "Bynet",
      position: "Fullstack Dev",
      duration: "2012-2014",
      technologies: ["Javascript", "HTML", "CSS", "ASP.Net", "C#"],
      description: `Bynet was my entry point into the world of software, where I learned the fundamentals of both server and client-side development.`,
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
