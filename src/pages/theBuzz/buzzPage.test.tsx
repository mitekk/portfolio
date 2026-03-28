import { render, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { LayoutContext } from "../../context/layout";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { BuzzPage } from "./buzzPage";

vi.mock("../../components/grid", () => ({
  WavesGrid: ({ onAnimationFinish }: { onAnimationFinish?: () => void }) => {
    onAnimationFinish?.();
    return null;
  },
}));

const layoutValue = {
  dims: { rows: 8, cols: 8 },
  tileSize: 50,
  gridSize: { width: 500, height: 400 },
};

const renderBuzzPage = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: width,
  });

  window.dispatchEvent(new Event("resize"));

  render(
    <HelmetProvider>
      <LayoutContext.Provider value={layoutValue}>
        <MemoryRouter initialEntries={["/theBuzz/about"]}>
          <Routes>
            <Route path="/theBuzz" element={<BuzzPage />}>
              <Route path="about" element={<div>outlet-content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </LayoutContext.Provider>
    </HelmetProvider>,
  );
};

describe("BuzzPage", () => {
  test("renders Outlet content", async () => {
    renderBuzzPage(1280);

    await waitFor(() => {
      expect(screen.getByText("outlet-content")).toBeInTheDocument();
    });
  });

  test.each([
    { label: "desktop", width: 1280 },
    { label: "mobile", width: 375 },
  ])("applies responsive class contracts for $label", async ({ width }) => {
    renderBuzzPage(width);

    await waitFor(() => {
      expect(screen.getByText("outlet-content")).toBeInTheDocument();
    });

    const sidebarNav = screen.getByRole("navigation");
    const sidebarWrapper = sidebarNav.closest("div");
    const mobileHeader = screen.getByRole("banner");
    const mobileFooter = screen.getByRole("contentinfo");

    expect(sidebarWrapper).toHaveClass("hidden");
    expect(sidebarWrapper).toHaveClass("md:flex");

    expect(mobileHeader).toHaveClass("md:hidden");
    expect(mobileFooter).toHaveClass("md:hidden");
  });
});
