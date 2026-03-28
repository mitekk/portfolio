import { act, render, screen } from "@testing-library/react";
import { Prompter } from "./prompter";

describe("Prompter", () => {
  const flushTyping = async () => {
    for (let step = 0; step < 30; step++) {
      await act(async () => {
        vi.advanceTimersByTime(100);
      });
    }
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("starts empty and progressively reveals text", () => {
    const { container } = render(
      <Prompter prompt={{ lines: [{ text: "Hello" }] }} />,
    );

    expect(container.textContent).not.toContain("Hello");

    act(() => {
      vi.advanceTimersByTime(90);
    });

    expect(container.textContent).toContain("H");
    expect(container.textContent).not.toContain("Hello");
  });

  test("calls onAnimationFinish when typing completes", async () => {
    const onComplete = vi.fn();

    render(
      <Prompter
        prompt={{ lines: [{ text: "Hello" }] }}
        onAnimationFinish={onComplete}
      />,
    );

    await flushTyping();

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  test("full text is present after all timers complete", async () => {
    render(<Prompter prompt={{ lines: [{ text: "Hello" }] }} />);

    await flushTyping();

    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
