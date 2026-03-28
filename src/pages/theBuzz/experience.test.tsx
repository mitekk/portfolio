import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { Experience } from "./experience";

describe("Experience", () => {
  test("renders seven reverse-chronological job entries with required parts", () => {
    const { container } = render(
      <HelmetProvider>
        <Experience />
      </HelmetProvider>,
    );

    const entries = Array.from(container.querySelectorAll("article"));

    expect(entries).toHaveLength(7);

    entries.forEach((entry) => {
      expect(
        entry.querySelector("h2")?.textContent?.trim().length,
      ).toBeGreaterThan(0);
      expect(
        entry.querySelector("p")?.textContent?.trim().length,
      ).toBeGreaterThan(0);
      expect(entry.querySelector("ul")).toBeTruthy();
    });

    const headingTexts = screen
      .getAllByRole("heading", { level: 2 })
      .map((el) => el.textContent);
    expect(headingTexts[0]).toContain("LawPDF");
    expect(headingTexts[headingTexts.length - 1]).toContain("Bynet");

    const section = container.querySelector("section");
    const panel = container.querySelector("section > div");

    expect(section).toHaveClass("w-full", "min-w-0");
    expect(panel).toHaveClass("w-full", "max-w-full");
  });
});
