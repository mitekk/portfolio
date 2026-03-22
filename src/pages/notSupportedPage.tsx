import { Button } from "../components/UI";

export const NotSupportedPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-neutral-800 p-16 text-center gap-8">
      <div>
        <p className="text-4xl">🚧 Oops!</p>
        <p className="text-3xl">Tiny Screens Ahead</p>
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
  );
};
