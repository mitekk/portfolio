import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const IntroPage = lazy(() =>
  import("./pages/intro/introPage").then((m) => ({ default: m.IntroPage })),
);
const BuzzPage = lazy(() =>
  import("./pages/theBuzz/buzzPage").then((m) => ({ default: m.BuzzPage })),
);

const About = lazy(() =>
  import("./pages/theBuzz/about").then((m) => ({ default: m.About })),
);
const Experience = lazy(() =>
  import("./pages/theBuzz/experience").then((m) => ({ default: m.Experience })),
);
const Toolbox = lazy(() =>
  import("./pages/theBuzz/toolbox").then((m) => ({ default: m.Toolbox })),
);
const NotFoundPage = lazy(() =>
  import("./pages/notFound/notfoundPage").then((m) => ({
    default: m.NotFoundPage,
  })),
);

export function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/theBuzz" element={<BuzzPage />}>
          <Route index element={<Navigate to="about" replace />} />
          <Route path="about" element={<About />} />
          <Route path="toolbox" element={<Toolbox />} />
          <Route path="experience" element={<Experience />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
