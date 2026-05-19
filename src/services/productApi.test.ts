import { afterEach, describe, expect, it, vi } from "vitest";
import { PAGE_SIZE, fetchProductById, fetchProducts } from "./productApi";

describe("fetchProducts", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requests products endpoint without term and maps response", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        products: [{ id: 1, title: "Phone", description: "Phone description" }],
        total: 1,
      }),
    } as Response);

    const result = await fetchProducts("", 1);

    expect(fetchSpy).toHaveBeenCalledWith(
      `https://dummyjson.com/products?limit=${PAGE_SIZE}&skip=0`,
    );
    expect(result).toEqual({
      items: [{ id: 1, name: "Phone", description: "Phone description" }],
      total: 1,
    });
  });

  it("requests search endpoint when term is provided", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        products: [],
        total: 0,
      }),
    } as Response);

    await fetchProducts("smart phone", 2);

    expect(fetchSpy).toHaveBeenCalledWith(
      `https://dummyjson.com/products/search?q=smart%20phone&limit=${PAGE_SIZE}&skip=12`,
    );
  });

  it("fetches a single product by id", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 7,
        title: "Perfume",
        description: "Nice scent",
      }),
    } as Response);

    const result = await fetchProductById(7);

    expect(fetchSpy).toHaveBeenCalledWith("https://dummyjson.com/products/7");
    expect(result).toEqual({
      id: 7,
      name: "Perfume",
      description: "Nice scent",
    });
  });

  it("throws a readable error on non-ok response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    await expect(fetchProducts("phone", 1)).rejects.toThrow(
      "Request failed with status 500. Please try again.",
    );
  });
});
