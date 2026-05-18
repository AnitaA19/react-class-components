import type { ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  route?: string;
}

export const renderWithProviders = (
  ui: ReactElement,
  { route = "/?page=1", ...options }: ExtendedRenderOptions = {},
) =>
  render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>, options);
