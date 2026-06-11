import { Link } from "react-router-dom";
import { SeoHead } from "../../components/seo/seoHead";
import {
  cvStructuredData,
  personStructuredData,
  routeSeo,
} from "../../seo/config";

const CV_PDF = "/Mitya_Kurs.pdf";

export const CvPage: React.FC = () => {
  return (
    <>
      <SeoHead
        meta={routeSeo.cv}
        jsonLd={[personStructuredData, cvStructuredData]}
      />
      <div className="h-full overflow-y-auto bg-surface text-text">
        <div className="mx-auto flex min-h-full max-w-4xl flex-col items-center justify-center gap-8 px-4 py-10 md:py-16">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-12">
            <a
              href={CV_PDF}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
              aria-label="Open Mitya Kurs's CV (PDF) in a new tab"
            >
              <img
                src="/cv-thumb.png"
                alt="First page of Mitya Kurs's CV"
                width={565}
                height={800}
                loading="eager"
                className="w-48 rounded-lg border border-border shadow-lg transition-transform hover:scale-[1.02] sm:w-56 md:w-64"
              />
            </a>

            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-link">
                Curriculum Vitae
              </p>
              <h1 className="mt-2 text-3xl md:text-4xl">Mitya Kurs</h1>
              <p className="mt-2 text-lg font-light text-text md:text-xl">
                Senior Engineering Leader &amp; Hands-On Builder
              </p>
              <p className="mt-3 max-w-md font-light text-text-muted">
                14 years shipping production systems across legal-tech,
                healthcare, and SaaS — React · Node.js · AWS · AI.
              </p>

              <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <a
                  href={CV_PDF}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--color-text-nav)" }}
                  className="flex min-h-12 items-center justify-center rounded-lg border border-transparent bg-surround px-6 py-2 font-semibold shadow transition-[border-color] hover:border-link"
                >
                  View PDF
                </a>
                <a
                  href={CV_PDF}
                  download="Mitya_Kurs.pdf"
                  style={{ color: "var(--color-text)" }}
                  className="flex min-h-12 items-center justify-center rounded-lg border border-border px-6 py-2 font-semibold shadow-sm transition-[border-color] hover:border-link"
                >
                  Download
                </a>
              </div>

              <Link
                to="/"
                className="mt-6 text-sm font-medium text-link hover:underline"
              >
                ← Back to portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
