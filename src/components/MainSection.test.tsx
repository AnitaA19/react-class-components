import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MainSection from "./MainSection";

describe("MainSection", () => {
  const baseProps = {
    items: [{ id: 1, name: "Phone", description: "Phone description" }],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 2,
    onPageChange: vi.fn(),
  };

  it("shows loading indicator while loading", () => {
    render(<MainSection {...baseProps} isLoading />);

    expect(screen.getByLabelText("Loading")).toBeInTheDocument();
  });

  it("shows error and hides cards when there is an error", () => {
    render(<MainSection {...baseProps} error="Request failed" />);

    expect(screen.getByText("Request failed")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: "Phone",
      }),
    ).not.toBeInTheDocument();
  });

  it("renders card list and pagination in success state", () => {
    render(<MainSection {...baseProps} />);

    expect(screen.getByRole("heading", { name: "Phone" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
    expect(screen.getByText("1 items")).toBeInTheDocument();
  });
});
