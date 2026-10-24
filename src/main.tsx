import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import { initAnalytics } from "./services/analytics/initAnalytics.ts";
import { preloadRoute } from "./routes.tsx";
import "./index.css";

initAnalytics();

// Mount only once this route's chunk is in hand. The prerendered markup is already
// on screen, and rendering before the route resolves would replace it with an empty
// Suspense fallback that React then refuses to fill for ~300ms.
const pathname = window.location.pathname;

const RELOADED_KEY = "chunk-reloaded";

const mount = () => {
  try {
    // The flag means "a recovery reload is already in flight for this failure", so
    // a session that outlives one deploy still gets a reload at the next.
    sessionStorage.removeItem(RELOADED_KEY);
  } catch {
    // Blocked storage: nothing was ever written.
  }

  createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </HelmetProvider>,
  );
};

/**
 * A chunk that will not load almost always means this document is older than the
 * deploy whose hashed files it names — `location /` serves HTML with max-age=3600,
 * so a returning visitor can be an hour stale. Reloading fetches HTML pointing at
 * the files currently on disk, which is the entire repair.
 *
 * Once only, and only if sessionStorage works: a second failure is not staleness,
 * and a reload we cannot record is a reload loop. Failing that, leave the
 * prerendered markup alone. It is not interactive, but it is the real page and it
 * reads — mounting over it would swap it for the empty Suspense fallback, which is
 * strictly worse.
 */
const recoverOrKeepServerMarkup = (error: unknown) => {
  try {
    if (!sessionStorage.getItem(RELOADED_KEY)) {
      sessionStorage.setItem(RELOADED_KEY, "1");
      window.location.reload();
      return;
    }
  } catch {
    // Blocked storage: fall through without reloading.
  }
  console.error("Route chunk failed to load; keeping prerendered page.", error);
};

preloadRoute(pathname).then(mount, recoverOrKeepServerMarkup);
