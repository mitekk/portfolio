import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { LayoutContext } from "./context/layout";
import { AppRoutes, preloadRoute } from "./routes";

const layoutValue = {
  dims: { rows: 8, cols: 8 },
  tileSize: 50,
  gridSize: { width: 500, height: 400 },
};

/**
 * Lives in its own file: `Loaded` is module state, so a sibling test that rendered
 * NotFoundPage would set it and make the assertion below pass without preloading.
 */
test("an unknown /theBuzz sub-path preloads the page it will actually render", async () => {
  // nginx answers /theBuzz/contact with 404.html, whose pathname still starts with
  // /theBuzz — so matching on the prefix preloaded About and left the 404 page to
  // suspend, blanking a page that was already painted.
  await preloadRoute("/theBuzz/contact");

  render(
    <HelmetProvider>
      <LayoutContext.Provider value={layoutValue}>
        <MemoryRouter initialEntries={["/theBuzz/contact"]}>
          <AppRoutes />
        </MemoryRouter>
      </LayoutContext.Provider>
    </HelmetProvider>,
  );

  // Synchronously, with no waitFor: suspending at all is the defect.
  expect(
    screen.getByRole("heading", { name: "404 - Not Found" }),
  ).toBeInTheDocument();
});
