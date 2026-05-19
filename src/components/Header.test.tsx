import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Header from "./Header";

describe("Header", () => {
  it("renders app title and subtitle", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        name: "Product Search",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Search products and browse results page by page."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
  });
});
