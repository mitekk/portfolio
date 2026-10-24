import { SectionLayout } from "../../layout/section.layout";
import { ContentPanel } from "../../components/UI";
import { SeoHead } from "../../components/seo/seoHead";
import {
  breadcrumbStructuredData,
  profilePageStructuredData,
  routeSeo,
} from "../../seo/config";

interface Role {
  company: string;
  title: string;
  from: string;
  to: string;
  tech: string[];
  summary: string;
}

const roles: Role[] = [
  {
    company: "LawPDF",
    title: "Independent",
    from: "2025",
    to: "2026",
    tech: ["Next.js", "Node.js", "AWS", "AI"],
    summary:
      "Built a platform that allows legal professionals and clients to gather case files and automatically generate referenced, summarized documents. Handled all technical execution, from initial infrastructure setup to production deployment and data security.",
  },
  {
    company: "Clarity",
    title: "Fullstack Team Lead",
    from: "2023",
    to: "2025",
    tech: ["AWS", "Serverless", "Vue.js", "Node.js", "Apollo", "MongoDB"],
    summary:
      "Ran technical design and delivery for the company's core product. Established architectural standards, managed the CI/CD pipeline, and ensured high availability and performance for high-traffic, business-critical features.",
  },
  {
    company: "Daytwo",
    title: "Fullstack Team Lead",
    from: "2018",
    to: "2023",
    tech: ["GCP", "AWS", "CDK", "React", "Node.js", "mySQL"],
    summary:
      "Directed local and offshore engineering teams. Scaled backend infrastructure to support high-throughput processing, enforcing strict security and compliance standards for handling sensitive international data.",
  },
  {
    company: "Softwave",
    title: "Fullstack Dev",
    from: "2016",
    to: "2018",
    tech: ["Azure", "Angular", "React", ".Net Core", "SQL"],
    summary:
      "Shipped end-to-end features for enterprise clients. Transitioned legacy systems to modern frontend frameworks and built out the supporting backend architecture and database schemas.",
  },
  {
    company: "Eternity",
    title: "Fullstack Dev",
    from: "2015",
    to: "2016",
    tech: ["Azure", "Javascript", "HTML", "CSS", "ASP.Net", "C#", "SQL"],
    summary:
      "Provisioned and maintained production cloud environments on Azure. Handled deployment pipelines, server configurations, and operational monitoring for web applications.",
  },
  {
    company: "Qpoint",
    title: "Fullstack Dev",
    from: "2014",
    to: "2015",
    tech: ["Javascript", "HTML", "CSS", "ASP.Net", "C#", "SQL"],
    summary:
      "Contributed to a highly structured enterprise codebase. Focused on writing testable code, conducting rigorous reviews, and maintaining strict engineering and version control standards.",
  },
  {
    company: "Bynet",
    title: "Fullstack Dev",
    from: "2012",
    to: "2014",
    tech: ["Javascript", "HTML", "CSS", "ASP.Net", "C#"],
    summary:
      "Developed foundational server-side and client-side logic for core applications. Handled database design, API creation, and frontend integration.",
  },
];

/**
 * schema.org's documented Role pattern: the Role sits where the value of the
 * property would go and repeats that property name inside itself, which is how
 * an employment relationship carries dates.
 */
const experienceOccupations = roles.map((role) => ({
  "@type": "OrganizationRole",
  roleName: role.title,
  startDate: role.from,
  endDate: role.to,
  worksFor: { "@type": "Organization", name: role.company },
}));

export const Experience: React.FC = () => {
  return (
    <>
      <SeoHead
        meta={routeSeo.experience}
        jsonLd={[
          profilePageStructuredData(routeSeo.experience, {
            worksFor: experienceOccupations,
          }),
          breadcrumbStructuredData(routeSeo.experience),
        ]}
      />
      <SectionLayout>
        <ContentPanel>
          <div className="flex flex-col gap-5 max-w-150 justify-self-center">
            <h1>Experience</h1>
            {roles.map((role) => (
              <article key={role.company} className="flex flex-col gap-4">
                <header className="gap-1">
                  <h2 className="text-base md:text-xl font-bold">
                    {role.company}, {role.title}
                  </h2>
                  <p className="text-sm md:text-lg">
                    {role.from}-{role.to}
                  </p>
                  <ul className="flex flex-wrap text-sm md:text-md font-semibold gap-x-2">
                    {role.tech.map((tech) => (
                      <li key={tech} className="list-none">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </header>
                <p className="font-light">{role.summary}</p>
              </article>
            ))}
          </div>
        </ContentPanel>
      </SectionLayout>
    </>
  );
};
