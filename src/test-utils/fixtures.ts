import type { ProductItem } from "../types";

export const createProduct = (
  overrides?: Partial<ProductItem>,
): ProductItem => ({
  id: 1,
  name: "Phone",
  description: "Phone description",
  ...overrides,
});
