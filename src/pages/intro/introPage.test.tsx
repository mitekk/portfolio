import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { LayoutContext } from "../../context/layout";
import { MemoryRouter, Navigate, Route, Routes } from "react-router-dom";
import { IntroPage } from "./introPage";

vi.mock("../../components/prompter/prompter", () => ({
  Prompter: ({
    onAnimationFinish,
  }: {
    onAnimationStart?: () => void;
    onAnimationFinish?: () => void;
  }) => {
    useEffect(() => {
      const timeout = setTimeout(() => onAnimationFinish?.(), 100);
      return () => clearTimeout(timeout);
    }, [onAnimationFinish]);

    return <div>mock-prompter</div>;
  },
}));

vi.mock("../../components/grid", () => ({
  TetrominoesGrid: ({
    onAnimationFinish,
  }: {
    onAnimationFinish?: () => void;
  }) => {
    useEffect(() => {
      onAnimationFinish?.();
    }, [onAnimationFinish]);
    return <div data-testid="tetris-grid">tetris-grid</div>;
  },
  RoadTripGrid: ({ onAnimationFinish }: { onAnimationFinish?: () => void }) => {
    useEffect(() => {
      onAnimationFinish?.();
    }, [onAnimationFinish]);
    return <div data-testid="trip-grid">trip-grid</div>;
  },
}));

const layoutValue = {
  dims: { rows: 8, cols: 10 },
  tileSize: 50,
  gridSize: { width: 500, height: 400 },
};

const renderIntroPage = (user = userEvent.setup()) => {
  render(
    <HelmetProvider>
      <LayoutContext.Provider value={layoutValue}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route
              path="/theBuzz"
              element={<Navigate to="/theBuzz/about" replace />}
            />
            <Route
              path="/theBuzz/about"
              element={<div>about-destination</div>}
            />
          </Routes>
        </MemoryRouter>
      </LayoutContext.Provider>
    </HelmetProvider>,
  );

  return { user };
};

describe("IntroPage", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test("renders game mode toggle and updates grid on mode switch", async () => {
    const { user } = renderIntroPage();

    expect(screen.getByRole("button", { name: "Tetris" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Trip" })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("tetris-grid")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Trip" }));

    await waitFor(() => {
      expect(screen.getByTestId("trip-grid")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Tetris" }));

    await waitFor(() => {
      expect(screen.getByTestId("tetris-grid")).toBeInTheDocument();
    });
  });

  test("CTA appears after prompter animation completes", async () => {
    vi.useFakeTimers();
    renderIntroPage(userEvent.setup({ advanceTimers: vi.advanceTimersByTime }));

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(
      screen.getByRole("button", { name: "Get to know me" }),
    ).toBeInTheDocument();

    const introOverlay = document.querySelector(".intro-overlay");
    expect(introOverlay).toHaveClass("absolute", "inset-0", "w-full", "h-full");
    expect(introOverlay).not.toHaveClass("fixed");
  });

  test("CTA click navigates to /theBuzz/about after delayed navigate", async () => {
    vi.useFakeTimers();
    renderIntroPage(userEvent.setup({ advanceTimers: vi.advanceTimersByTime }));

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    fireEvent.click(screen.getByRole("button", { name: "Get to know me" }));

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText("about-destination")).toBeInTheDocument();
  });
});
