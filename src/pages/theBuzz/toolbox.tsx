import { SectionLayout } from "../../layout/section.layout";
import {
  reactIcon,
  vueIcon,
  nodeIcon,
  restIcon,
  graphqlIcon,
  mysqlIcon,
  awsIcon,
  mongoIcon,
  terraformIcon,
  serverlessIcon,
  cdkIcon,
  jestIcon,
  githubIcon,
} from "../../assets/tech";

const skills = [
  {
    title: "Frontend",
    technologies: [
      { name: "React", icon: reactIcon },
      { name: "Vue.js", icon: vueIcon },
    ],
  },
  {
    title: "Backend",
    technologies: [
      { name: "Node.js", icon: nodeIcon },
      { name: "REST APIs", icon: restIcon },
      { name: "GraphQL", icon: graphqlIcon },
    ],
  },
  {
    title: "Infra",
    technologies: [
      { name: "AWS", icon: awsIcon },
      { name: "Serverless", icon: serverlessIcon },
      { name: "Terraform", icon: terraformIcon },
      { name: "CDK", icon: cdkIcon },
    ],
  },
  {
    title: "Databases",
    technologies: [
      { name: "MongoDB", icon: mongoIcon },
      { name: "MySQL", icon: mysqlIcon },
    ],
  },
  {
    title: "Tests",
    technologies: [{ name: "Jest", icon: jestIcon }],
  },
  {
    title: "CICD",
    technologies: [{ name: "Github", icon: githubIcon }],
  },
];

export const Toolbox: React.FC = () => {
  return (
    <SectionLayout>
      <div
        style={{ color: "#333332" }}
        className="flex flex-row flex-wrap basis-4xl gap-4 h-full"
      >
        {skills.map((skill) => (
          <div
            key={skill.title}
            className="flex flex-col items-center mb-4 gap-5"
          >
            <div className="text-xl font-bold">{skill.title}</div>
            <div className="flex flex-col items-center gap-4">
              {skill.technologies.map((tech) => (
                <div
                  key={tech.name}
                  className={`w-25 flex flex-col items-center gap-1 border border-zinc-300 bg-white/40 rounded-lg p-3 transition-shadow hover:shadow-lg hover:saturate-175 hover:scale-105`}
                >
                  <img
                    src={tech.icon}
                    alt={tech.name}
                    className="inline-block w-10 h-10"
                  />
                  {tech.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
};
