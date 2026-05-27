import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createProduct } from "../test-utils/fixtures";
import { useSelectedItemsStore } from "../store/selectedItemsStore";
import * as downloadCsv from "../utils/downloadCsv";
import SelectionFlyout from "./SelectionFlyout";

describe("SelectionFlyout", () => {
  beforeEach(() => {
    useSelectedItemsStore.setState({ itemsById: {} });
  });

  it("is hidden when no items are selected", () => {
    render(<SelectionFlyout />);

    expect(
      screen.queryByLabelText("Selected items summary"),
    ).not.toBeInTheDocument();
  });

  it("shows selected count and handles actions", async () => {
    const user = userEvent.setup();
    const downloadSpy = vi
      .spyOn(downloadCsv, "downloadSelectedItemsCsv")
      .mockImplementation(() => {});

    useSelectedItemsStore.setState({
      itemsById: {
        1: createProduct({ id: 1 }),
        2: createProduct({ id: 2, name: "Laptop" }),
      },
    });

    render(<SelectionFlyout />);

    expect(screen.getByText("2 items selected")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Download" }));
    expect(downloadSpy).toHaveBeenCalledWith([
      createProduct({ id: 1 }),
      createProduct({ id: 2, name: "Laptop" }),
    ]);

    await user.click(screen.getByRole("button", { name: "Unselect all" }));
    expect(useSelectedItemsStore.getState().itemsById).toEqual({});

    downloadSpy.mockRestore();
  });
});
