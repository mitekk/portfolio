import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { Toolbox } from "./toolbox";

describe("Toolbox", () => {
  test("renders all category headings without duplicates and each has icons", () => {
    render(
      <HelmetProvider>
        <Toolbox />
      </HelmetProvider>
    );

    const headings = screen.getAllByRole("heading", { level: 2 });
    const headingText = headings.map((heading) => heading.textContent?.trim() ?? "");

    expect(headingText).toHaveLength(7);
    expect(new Set(headingText).size).toBe(7);

    const sections = Array.from(document.querySelectorAll("section[aria-labelledby]"));
    sections.forEach((section) => {
      expect(section.querySelectorAll("img").length).toBeGreaterThan(0);
    });
  });
});
