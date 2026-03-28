import { render } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { About } from "./about";

describe("About", () => {
  test("renders four non-empty paragraphs", () => {
    const { container } = render(
      <HelmetProvider>
        <About />
      </HelmetProvider>,
    );

    const paragraphs = Array.from(container.querySelectorAll("p"));

    expect(paragraphs).toHaveLength(4);
    paragraphs.forEach((paragraph) => {
      expect(paragraph.textContent?.trim().length).toBeGreaterThan(0);
    });

    const section = container.querySelector("section");
    const panel = container.querySelector("section > div");

    expect(section).toHaveClass("w-full", "min-w-0");
    expect(panel).toHaveClass("w-full", "max-w-full");
  });
});
