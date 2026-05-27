import type { ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "../context/ThemeContext";
import { useSelectedItemsStore } from "../store/selectedItemsStore";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  route?: string;
}

export const resetSelectedItemsStore = () => {
  useSelectedItemsStore.setState({ itemsById: {} });
};

export const renderWithProviders = (
  ui: ReactElement,
  { route = "/?page=1", ...options }: ExtendedRenderOptions = {},
) => {
  resetSelectedItemsStore();

  return render(
    <MemoryRouter initialEntries={[route]}>
      <ThemeProvider>{ui}</ThemeProvider>
    </MemoryRouter>,
    options,
  );
};
