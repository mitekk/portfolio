import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle", () => {
  test("shows moon icon in light mode", () => {
    render(<ThemeToggle theme="light" toggle={() => {}} />);
    expect(
      screen.getByRole("button", { name: "Toggle theme" }),
    ).toHaveTextContent("🌙");
  });

  test("shows lamp icon in dark mode", () => {
    render(<ThemeToggle theme="dark" toggle={() => {}} />);
    expect(
      screen.getByRole("button", { name: "Toggle theme" }),
    ).toHaveTextContent("💡");
  });

  test("calls toggle on click", async () => {
    const user = userEvent.setup();
    const toggle = vi.fn();
    render(<ThemeToggle theme="light" toggle={toggle} />);
    await user.click(screen.getByRole("button", { name: "Toggle theme" }));
    expect(toggle).toHaveBeenCalledTimes(1);
  });
});
