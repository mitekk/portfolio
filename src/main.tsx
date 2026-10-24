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

preloadRoute(pathname).then(() => {
  createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </HelmetProvider>,
  );
});
