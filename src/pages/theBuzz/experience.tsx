import { SectionLayout } from "../../layout/section.layout";
import { SeoHead } from "../../components/seo/seoHead";
import { routeSeo } from "../../seo/config";

export const Experience: React.FC = () => {
  return (
    <>
      <SeoHead meta={routeSeo.experience} />
      <SectionLayout>
        <div
          className="flex flex-col gap-5"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.55)",
            borderRadius: "0.75rem",
            padding: "1rem",
            height: "fit-content",
            color: "rgb(51, 51, 50)",
          }}
        >
          <h1>Experience</h1>
          <article className="flex flex-col gap-4">
            <header className="gap-1">
              <h2 className="text-base md:text-xl font-bold">
                LawPDF, Independent
              </h2>
              <p className="text-sm md:text-lg">2025-2026</p>
              <ul className="flex flex-wrap text-sm md:text-md font-semibold gap-x-2">
                <li className="list-none">Next.js</li>
                <li className="list-none">Node.js</li>
                <li className="list-none">AWS</li>
                <li className="list-none">AI</li>
              </ul>
            </header>
            <p className="font-light">
              Built a platform that allows legal professionals and clients to
              gather case files and automatically generate referenced, summarized
              documents. Handled all technical execution, from initial
              infrastructure setup to production deployment and data security.
            </p>
          </article>

          <article className="flex flex-col gap-4">
            <header className="gap-1">
              <h2 className="text-base md:text-xl font-bold">
                Clarity, Fullstack Team Lead
              </h2>
              <p className="text-sm md:text-lg">2023-2025</p>
              <ul className="flex flex-wrap text-sm md:text-md font-semibold gap-x-2">
                <li className="list-none">AWS</li>
                <li className="list-none">Serverless</li>
                <li className="list-none">Vue.js</li>
                <li className="list-none">Node.js</li>
                <li className="list-none">Apollo</li>
                <li className="list-none">MongoDB</li>
              </ul>
            </header>
            <p className="font-light">
              Ran technical design and delivery for the company's core product.
              Established architectural standards, managed the CI/CD pipeline,
              and ensured high availability and performance for high-traffic,
              business-critical features.
            </p>
          </article>

          <article className="flex flex-col gap-4">
            <header className="gap-1">
              <h2 className="text-base md:text-xl font-bold">
                Daytwo, Fullstack Team Lead
              </h2>
              <p className="text-sm md:text-lg">2018-2023</p>
              <ul className="flex flex-wrap text-sm md:text-md font-semibold gap-x-2">
                <li className="list-none">GCP</li>
                <li className="list-none">AWS</li>
                <li className="list-none">CDK</li>
                <li className="list-none">React</li>
                <li className="list-none">Node.js</li>
                <li className="list-none">mySQL</li>
              </ul>
            </header>
            <p className="font-light">
              Directed local and offshore engineering teams. Scaled backend
              infrastructure to support high-throughput processing, enforcing
              strict security and compliance standards for handling sensitive
              international data.
            </p>
          </article>

          <article className="flex flex-col gap-4">
            <header className="gap-1">
              <h2 className="text-base md:text-xl font-bold">
                Softwave, Fullstack Dev
              </h2>
              <p className="text-sm md:text-lg">2016-2018</p>
              <ul className="flex flex-wrap text-sm md:text-md font-semibold gap-x-2">
                <li className="list-none">Azure</li>
                <li className="list-none">Angular</li>
                <li className="list-none">React</li>
                <li className="list-none">.Net Core</li>
                <li className="list-none">SQL</li>
              </ul>
            </header>
            <p className="font-light">
              Shipped end-to-end features for enterprise clients. Transitioned
              legacy systems to modern frontend frameworks and built out the
              supporting backend architecture and database schemas.
            </p>
          </article>

          <article className="flex flex-col gap-4">
            <header className="gap-1">
              <h2 className="text-base md:text-xl font-bold">
                Eternity, Fullstack Dev
              </h2>
              <p className="text-sm md:text-lg">2015-2016</p>
              <ul className="flex flex-wrap text-sm md:text-md font-semibold gap-x-2">
                <li className="list-none">Azure</li>
                <li className="list-none">Javascript</li>
                <li className="list-none">HTML</li>
                <li className="list-none">CSS</li>
                <li className="list-none">ASP.Net</li>
                <li className="list-none">C#</li>
                <li className="list-none">SQL</li>
              </ul>
            </header>
            <p className="font-light">
              Provisioned and maintained production cloud environments on Azure.
              Handled deployment pipelines, server configurations, and
              operational monitoring for web applications.
            </p>
          </article>

          <article className="flex flex-col gap-4">
            <header className="gap-1">
              <h2 className="text-base md:text-xl font-bold">
                Qpoint, Fullstack Dev
              </h2>
              <p className="text-sm md:text-lg">2014-2015</p>
              <ul className="flex flex-wrap text-sm md:text-md font-semibold gap-x-2">
                <li className="list-none">Javascript</li>
                <li className="list-none">HTML</li>
                <li className="list-none">CSS</li>
                <li className="list-none">ASP.Net</li>
                <li className="list-none">C#</li>
                <li className="list-none">SQL</li>
              </ul>
            </header>
            <p className="font-light">
              Contributed to a highly structured enterprise codebase. Focused on
              writing testable code, conducting rigorous reviews, and maintaining
              strict engineering and version control standards.
            </p>
          </article>

          <article className="flex flex-col gap-4">
            <header className="gap-1">
              <h2 className="text-base md:text-xl font-bold">
                Bynet, Fullstack Dev
              </h2>
              <p className="text-sm md:text-lg">2012-2014</p>
              <ul className="flex flex-wrap text-sm md:text-md font-semibold gap-x-2">
                <li className="list-none">Javascript</li>
                <li className="list-none">HTML</li>
                <li className="list-none">CSS</li>
                <li className="list-none">ASP.Net</li>
                <li className="list-none">C#</li>
              </ul>
            </header>
            <p className="font-light">
              Developed foundational server-side and client-side logic for core
              applications. Handled database design, API creation, and frontend
              integration.
            </p>
          </article>
        </div>
      </SectionLayout>
    </>
  );
};
