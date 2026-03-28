import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MemoryRouter,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Navbar } from "./navbar";
import { links, sections } from "./navData";

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="path">{location.pathname}</div>;
};

const renderNavbar = (initialEntry = "/theBuzz/about") => {
  const user = userEvent.setup();

  const renderResult = render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/" element={<div>home</div>} />
        <Route
          path="/theBuzz"
          element={
            <>
              <Navbar />
              <LocationDisplay />
              <Outlet />
            </>
          }
        >
          <Route path=":section" element={<div>section-content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

  return { user, ...renderResult };
};

describe("Navbar", () => {
  test("renders section links and marks active link", async () => {
    renderNavbar();

    for (const section of sections) {
      expect(screen.getByRole("link", { name: section })).toBeInTheDocument();
    }

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "about" })).toHaveClass("active");
    });

    expect(screen.getByText("➜")).toBeInTheDocument();
  });

  test("ArrowDown navigates to next section", async () => {
    renderNavbar("/theBuzz/about");

    fireEvent.keyDown(window, { key: "ArrowDown" });

    await waitFor(() => {
      expect(screen.getByTestId("path")).toHaveTextContent(
        "/theBuzz/experience",
      );
    });
  });

  test("ArrowUp navigates to previous section and wraps", async () => {
    renderNavbar("/theBuzz/about");

    fireEvent.keyDown(window, { key: "ArrowUp" });

    await waitFor(() => {
      expect(screen.getByTestId("path")).toHaveTextContent("/theBuzz/toolbox");
    });
  });

  test("social links are present with expected href values", () => {
    const { container } = renderNavbar();
    const hrefs = Array.from(container.querySelectorAll("a"))
      .map((anchor) => anchor.getAttribute("href"))
      .filter((href): href is string => Boolean(href));

    for (const link of links) {
      expect(hrefs.includes(link.href)).toBe(true);
    }
  });

  test("avatar click navigates to home", async () => {
    const { user } = renderNavbar("/theBuzz/about");

    await user.click(screen.getByRole("link", { name: "Go to intro page" }));

    await waitFor(() => {
      expect(screen.getByText("home")).toBeInTheDocument();
    });
  });
});
