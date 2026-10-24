/* eslint-disable react-refresh/only-export-components --
   preloadRoute/prefetchSections map a path to the chunks it needs, so they belong
   with the route table they are derived from; splitting them out to satisfy fast
   refresh would put the same mapping in two files. */
import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { lazyRoute } from "./lazyRoute";

const IntroPage = lazyRoute(() =>
  import("./pages/intro/introPage").then((m) => m.IntroPage),
);
const BuzzPage = lazyRoute(() =>
  import("./pages/theBuzz/buzzPage").then((m) => m.BuzzPage),
);

const About = lazyRoute(() =>
  import("./pages/theBuzz/about").then((m) => m.About),
);
const Experience = lazyRoute(() =>
  import("./pages/theBuzz/experience").then((m) => m.Experience),
);
const Toolbox = lazyRoute(() =>
  import("./pages/theBuzz/toolbox").then((m) => m.Toolbox),
);
const CvPage = lazyRoute(() =>
  import("./pages/cv/cvPage").then((m) => m.CvPage),
);
const NotFoundPage = lazyRoute(() =>
  import("./pages/notFound/notfoundPage").then((m) => m.NotFoundPage),
);

const section = (pathname: string) =>
  pathname.includes("experience")
    ? Experience
    : pathname.includes("toolbox")
      ? Toolbox
      : About;

/**
 * Load the chunks a path needs before rendering it. Awaiting this before the first
 * render is what keeps the prerendered markup on screen — see src/lazyRoute.tsx.
 */
export function preloadRoute(pathname: string): Promise<unknown> {
  if (pathname === "/") return IntroPage.preload();
  if (pathname.startsWith("/cv")) return CvPage.preload();
  if (pathname.startsWith("/theBuzz")) {
    return Promise.all([BuzzPage.preload(), section(pathname).preload()]);
  }
  return NotFoundPage.preload();
}

/**
 * The sections the visitor can reach from wherever they are now, fetched while the
 * main thread is idle so that arriving at one never has to suspend.
 *
 * Skipped under react-snap: Vite's dynamic import injects a `<link rel=modulepreload>`
 * for every chunk it fetches, and react-snap serialises the DOM it captures — so
 * prefetching during prerender would bake a high-priority preload of every section
 * into every page, including the intro, which is exactly the eager loading this is
 * meant to keep off the critical path.
 */
export function prefetchSections(): void {
  if (navigator.userAgent === "ReactSnap") return;

  const whenIdle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 1000));
  whenIdle(() => {
    void BuzzPage.preload();
    void About.preload();
    void Experience.preload();
    void Toolbox.preload();
  });
}

// Keep in step with the `include` list in scripts/prerender.cjs: nginx answers a strict
// 404 for anything it has no file for, so a route added here and not prerendered is a 404
// in production. `/theBuzz` is the exception — nginx 301s it to /theBuzz/about.
export function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/cv" element={<CvPage />} />
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
