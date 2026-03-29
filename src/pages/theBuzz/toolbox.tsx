import { SectionLayout } from "../../layout/section.layout";
import { ContentPanel } from "../../components/UI";
import { SeoHead } from "../../components/seo/seoHead";
import { routeSeo } from "../../seo/config";
import {
  reactIcon,
  vueIcon,
  nextjsIcon,
  tailwindIcon,
  storybookIcon,
  viteIcon,
  tanstackIcon,
  nodeIcon,
  expressIcon,
  nestjsIcon,
  restIcon,
  graphqlIcon,
  prismaIcon,
  zodIcon,
  awsIcon,
  amplifyIcon,
  serverlessIcon,
  terraformIcon,
  cdkIcon,
  dockerIcon,
  mongoIcon,
  mysqlIcon,
  postgresIcon,
  redisIcon,
  jestIcon,
  puppeteerIcon,
  playwrightIcon,
  githubIcon,
  claudeIcon,
  codexIcon,
} from "../../assets/tech";

const skills = [
  {
    title: "Frontend",
    technologies: [
      { name: "React", icon: reactIcon },
      { name: "Vue.js", icon: vueIcon },
      { name: "Next.js", icon: nextjsIcon },
      { name: "Tailwind", icon: tailwindIcon },
      { name: "TanStack", icon: tanstackIcon },
      { name: "Storybook", icon: storybookIcon },
      { name: "Vite", icon: viteIcon },
    ],
  },
  {
    title: "Backend",
    technologies: [
      { name: "Node.js", icon: nodeIcon },
      { name: "Express", icon: expressIcon },
      { name: "NestJS", icon: nestjsIcon },
      { name: "REST APIs", icon: restIcon },
      { name: "GraphQL", icon: graphqlIcon },
      { name: "Prisma", icon: prismaIcon },
      { name: "Zod", icon: zodIcon },
    ],
  },
  {
    title: "Infra",
    technologies: [
      { name: "AWS", icon: awsIcon },
      { name: "Serverless", icon: serverlessIcon },
      { name: "Terraform", icon: terraformIcon },
      { name: "CDK", icon: cdkIcon },
      { name: "Docker", icon: dockerIcon },
    ],
  },
  {
    title: "Databases",
    technologies: [
      { name: "MongoDB", icon: mongoIcon },
      { name: "MySQL", icon: mysqlIcon },
      { name: "PostgreSQL", icon: postgresIcon },
      { name: "Redis", icon: redisIcon },
    ],
  },
  {
    title: "Tests",
    technologies: [
      { name: "Jest", icon: jestIcon },
      { name: "Puppeteer", icon: puppeteerIcon },
      { name: "Playwright", icon: playwrightIcon },
    ],
  },
  {
    title: "CI/CD",
    technologies: [
      { name: "Github", icon: githubIcon },
      { name: "Amplify", icon: amplifyIcon },
    ],
  },
  {
    title: "AI",
    technologies: [
      { name: "Claude", icon: claudeIcon },
      { name: "Codex", icon: codexIcon },
    ],
  },
];

export const Toolbox: React.FC = () => {
  return (
    <>
      <SeoHead meta={routeSeo.toolbox} />
      <SectionLayout>
        <ContentPanel className="grid grid-cols-2 lg:grid-cols-3 gap-4 content-start">
          <h1 className="col-span-full">Toolbox</h1>
          {skills.map((skill) => (
            <section
              key={skill.title}
              aria-labelledby={`toolbox-${skill.title.toLowerCase()}-heading`}
              className="border border-border bg-panel-bg rounded-xl p-3 flex flex-col gap-3"
            >
              <h2
                id={`toolbox-${skill.title.toLowerCase()}-heading`}
                className="text-xs font-bold uppercase tracking-wider text-text-muted"
              >
                {skill.title}
              </h2>
              <ul className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2">
                {skill.technologies.map((tech) => (
                  <li
                    key={tech.name}
                    className="list-none flex flex-col items-center gap-1 p-2 border border-border bg-panel-bg rounded-lg text-xs text-text font-medium transition-all hover:shadow-lg hover:saturate-175 hover:scale-105"
                  >
                    <img
                      src={tech.icon}
                      alt=""
                      aria-hidden="true"
                      role="presentation"
                      className="w-8 h-8"
                    />
                    {tech.name}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </ContentPanel>
      </SectionLayout>
    </>
  );
};
