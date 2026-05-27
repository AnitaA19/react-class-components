import { create } from "zustand";
import type { ProductItem } from "../types";

interface SelectedItemsState {
  itemsById: Record<number, ProductItem>;
  toggleItem: (item: ProductItem) => void;
  removeItem: (id: number) => void;
  clearAll: () => void;
}

export const useSelectedItemsStore = create<SelectedItemsState>((set) => ({
  itemsById: {},

  toggleItem: (item) => {
    set((state) => {
      const next = { ...state.itemsById };
      if (next[item.id]) {
        delete next[item.id];
      } else {
        next[item.id] = item;
      }
      return { itemsById: next };
    });
  },

  removeItem: (id) => {
    set((state) => {
      if (!state.itemsById[id]) {
        return state;
      }
      const next = { ...state.itemsById };
      delete next[id];
      return { itemsById: next };
    });
  },

  clearAll: () => {
    set({ itemsById: {} });
  },
}));

export const isItemSelected = (
  itemsById: Record<number, ProductItem>,
  id: number,
): boolean => Boolean(itemsById[id]);

export const selectSelectedItems = (state: SelectedItemsState): ProductItem[] =>
  Object.values(state.itemsById);

export const selectSelectedCount = (state: SelectedItemsState): number =>
  Object.keys(state.itemsById).length;
