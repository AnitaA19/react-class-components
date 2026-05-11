import type { ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";

type ExtendedRenderOptions = Omit<RenderOptions, "queries">;

export const renderWithProviders = (
  ui: ReactElement,
  options?: ExtendedRenderOptions,
) => render(ui, options);
