import { render, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { LayoutContext } from "./context/layout";
import { AppRoutes } from "./routes";

const layoutValue = {
  dims: { rows: 8, cols: 8 },
  tileSize: 50,
  gridSize: { width: 500, height: 400 },
};

const renderRoutes = (path: string) =>
  render(
    <HelmetProvider>
      <LayoutContext.Provider value={layoutValue}>
        <MemoryRouter initialEntries={[path]}>
          <AppRoutes />
        </MemoryRouter>
      </LayoutContext.Provider>
    </HelmetProvider>,
  );

describe("AppRoutes", () => {
  test("/ renders IntroPage", async () => {
    renderRoutes("/");

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: "Mitya Kurs - Senior Full-Stack Developer and Team Lead",
        }),
      ).toBeInTheDocument();
    });
  });

  test("/theBuzz redirects to /theBuzz/about", async () => {
    renderRoutes("/theBuzz");

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "About" }),
      ).toBeInTheDocument();
    });
  });

  test("/theBuzz/about renders About content", async () => {
    renderRoutes("/theBuzz/about");

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "About" }),
      ).toBeInTheDocument();
    });
  });

  test("unknown path renders NotFoundPage", async () => {
    renderRoutes("/does-not-exist");

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "404 - Not Found" }),
      ).toBeInTheDocument();
    });
  });
});
