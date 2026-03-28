import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { Toolbox } from "./toolbox";

describe("Toolbox", () => {
  test("renders all category headings and decorative technology icons", () => {
    const { container } = render(
      <HelmetProvider>
        <Toolbox />
      </HelmetProvider>,
    );

    const headings = screen.getAllByRole("heading", { level: 2 });
    const headingText = headings.map(
      (heading) => heading.textContent?.trim() ?? "",
    );

    expect(headingText).toHaveLength(7);
    expect(new Set(headingText).size).toBe(7);

    const sections = Array.from(
      document.querySelectorAll("section[aria-labelledby]"),
    );

    sections.forEach((section) => {
      const items = Array.from(section.querySelectorAll("ul li"));
      expect(items.length).toBeGreaterThan(0);

      items.forEach((item) => {
        expect(item.textContent?.trim().length).toBeGreaterThan(0);

        const icon = item.querySelector("img");
        expect(icon).not.toBeNull();
        expect(icon).toHaveAttribute("alt", "");
        expect(icon).toHaveAttribute("aria-hidden", "true");
        expect(icon).toHaveAttribute("role", "presentation");
      });
    });

    const pageSection = container.querySelector("section");
    const panel = container.querySelector("section > div");

    expect(pageSection).toHaveClass("w-full", "min-w-0");
    expect(panel).toHaveClass("w-full", "max-w-full");
  });
});
