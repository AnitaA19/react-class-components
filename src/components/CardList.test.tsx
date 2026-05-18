import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CardList from "./CardList";

describe("CardList", () => {
  it("shows empty state when no items", () => {
    render(
      <CardList items={[]} selectedItemId={null} onItemSelect={vi.fn()} />,
    );

    expect(screen.getByText("No products found")).toBeInTheDocument();
  });

  it("renders all items passed to the list", () => {
    render(
      <CardList
        items={[
          { id: 1, name: "Phone", description: "Phone description" },
          { id: 2, name: "Laptop", description: "Laptop description" },
        ]}
        selectedItemId={null}
        onItemSelect={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: "Phone" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Laptop" })).toBeInTheDocument();
  });
});
