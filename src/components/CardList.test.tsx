import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSelectedItemsStore } from "../store/selectedItemsStore";
import { createProduct } from "../test-utils/fixtures";
import CardList from "./CardList";

describe("CardList", () => {
  beforeEach(() => {
    useSelectedItemsStore.setState({ itemsById: {} });
  });

  it("shows empty state when no items", () => {
    render(
      <CardList
        items={[]}
        detailsItemId={null}
        onCheckboxChange={vi.fn()}
        onOpenDetails={vi.fn()}
      />,
    );

    expect(screen.getByText("No products found")).toBeInTheDocument();
  });

  it("renders all items and reflects checked state from the store", () => {
    useSelectedItemsStore.setState({
      itemsById: { 2: createProduct({ id: 2, name: "Laptop" }) },
    });

    render(
      <CardList
        items={[
          createProduct({ id: 1, name: "Phone" }),
          createProduct({ id: 2, name: "Laptop" }),
        ]}
        detailsItemId={1}
        onCheckboxChange={vi.fn()}
        onOpenDetails={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: "Phone" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Laptop" })).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Select Phone" }),
    ).not.toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Select Laptop" }),
    ).toBeChecked();
  });
});
