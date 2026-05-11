import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SearchSection from "./SearchSection";

describe("SearchSection", () => {
  it("renders input and submit button", () => {
    render(
      <SearchSection
        value=""
        isLoading={false}
        onSearchInputChange={vi.fn()}
        onSearchClick={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Search term")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Search",
      }),
    ).toBeInTheDocument();
  });

  it("calls callbacks on typing and submit", async () => {
    const user = userEvent.setup();
    const onSearchInputChange = vi.fn();
    const onSearchClick = vi.fn();

    render(
      <SearchSection
        value=""
        isLoading={false}
        onSearchInputChange={onSearchInputChange}
        onSearchClick={onSearchClick}
      />,
    );

    await user.type(screen.getByLabelText("Search term"), "phone");
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(onSearchInputChange).toHaveBeenCalledTimes(5);
    expect(onSearchInputChange).toHaveBeenCalledWith("p");
    expect(onSearchClick).toHaveBeenCalledTimes(1);
  });

  it("shows loading label and disables submit button", () => {
    render(
      <SearchSection
        value="phone"
        isLoading
        onSearchInputChange={vi.fn()}
        onSearchClick={vi.fn()}
      />,
    );

    const submit = screen.getByRole("button", { name: "Searching..." });
    expect(submit).toBeDisabled();
  });
});
