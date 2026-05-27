import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ThemeProvider } from "../context/ThemeContext";
import Header from "./Header";

const renderHeader = () =>
  render(
    <MemoryRouter>
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    </MemoryRouter>,
  );

describe("Header", () => {
  it("renders app title and subtitle", () => {
    renderHeader();

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

  it("switches theme from the header controls", async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByRole("button", { name: "Dark" }));

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
