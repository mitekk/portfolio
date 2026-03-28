import { render, screen } from "@testing-library/react";
import { Avatar } from "./avatar";

describe("Avatar", () => {
  test("renders image with src", () => {
    render(<Avatar src="/avatar.webp" alt="Profile avatar" />);

    const image = screen.getByRole("img", { name: "Profile avatar" });
    expect(image).toHaveAttribute("src", "/avatar.webp");
  });

  test("has loading=lazy by default", () => {
    render(<Avatar src="/avatar.webp" alt="Profile avatar" />);

    expect(screen.getByRole("img", { name: "Profile avatar" })).toHaveAttribute(
      "loading",
      "lazy"
    );
  });

  test("has alt attribute", () => {
    render(<Avatar src="/avatar.webp" alt="Accessible avatar description" />);

    expect(
      screen.getByRole("img", { name: "Accessible avatar description" })
    ).toBeInTheDocument();
  });
});
