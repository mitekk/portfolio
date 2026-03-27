import { Button } from "../components/UI";
import { SeoHead } from "../components/seo/seoHead";
import { routeSeo } from "../seo/config";

export const NotSupportedPage: React.FC = () => {
  return (
    <>
      <SeoHead meta={routeSeo.notSupported} />
      <div className="min-h-screen flex flex-col justify-center items-center bg-neutral-800 p-16 text-center gap-8">
        <div>
          <h1 className="text-4xl">Tiny Screens Ahead</h1>
          <p className="text-2xl mt-3">This page is not supported yet.</p>
        </div>

        <p className="text-xl">
          This site is not yet available on mobile or small screen devices.
        </p>

        <div className="text-lg flex flex-col gap-3 items-center">
          <p>
            <b>Just here for my CV?</b>
          </p>
          <p>No worries! You can still download it here:</p>
          <Button
            style={{ minHeight: "4rem", fontSize: "1rem" }}
            onClick={() => window.open("/Mitya_Kurs.pdf", "_blank")}
          >
            <div className="flex items-center gap-5">
              <div className="text-lg">📄</div>
              <div className="text-lg">My CV</div>
            </div>
          </Button>
        </div>
      </div>
    </>
  );
};
