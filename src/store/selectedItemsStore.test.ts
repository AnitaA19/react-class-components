import { beforeEach, describe, expect, it } from "vitest";
import { createProduct } from "../test-utils/fixtures";
import {
  isItemSelected,
  selectSelectedCount,
  selectSelectedItems,
  useSelectedItemsStore,
} from "./selectedItemsStore";

describe("selectedItemsStore", () => {
  beforeEach(() => {
    useSelectedItemsStore.setState({ itemsById: {} });
  });

  it("adds and removes items when toggled", () => {
    const product = createProduct({ id: 10, name: "Tablet" });

    useSelectedItemsStore.getState().toggleItem(product);
    expect(isItemSelected(useSelectedItemsStore.getState().itemsById, 10)).toBe(
      true,
    );
    expect(selectSelectedCount(useSelectedItemsStore.getState())).toBe(1);

    useSelectedItemsStore.getState().toggleItem(product);
    expect(isItemSelected(useSelectedItemsStore.getState().itemsById, 10)).toBe(
      false,
    );
    expect(selectSelectedCount(useSelectedItemsStore.getState())).toBe(0);
  });

  it("removes a single item with removeItem", () => {
    const product = createProduct({ id: 3 });
    const { toggleItem, removeItem } = useSelectedItemsStore.getState();

    toggleItem(product);
    removeItem(3);

    expect(selectSelectedItems(useSelectedItemsStore.getState())).toEqual([]);
  });

  it("clears all selected items", () => {
    const { toggleItem, clearAll } = useSelectedItemsStore.getState();

    toggleItem(createProduct({ id: 1 }));
    toggleItem(createProduct({ id: 2 }));
    clearAll();

    expect(selectSelectedCount(useSelectedItemsStore.getState())).toBe(0);
  });
});
