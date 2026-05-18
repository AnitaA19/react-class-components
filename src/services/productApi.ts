import type { ProductItem, ProductResponse } from "../types";

const API_BASE_URL = "https://dummyjson.com";
const PAGE_SIZE = 12;

interface DummyJsonProduct {
  id: number;
  title: string;
  description: string;
}

interface DummyJsonResponse {
  products: DummyJsonProduct[];
  total: number;
}

const mapProducts = (products: DummyJsonProduct[]): ProductItem[] =>
  products.map((product) => ({
    id: product.id,
    name: product.title,
    description: product.description,
  }));

export const fetchProducts = async (
  term: string,
  page: number,
): Promise<ProductResponse> => {
  const skip = (page - 1) * PAGE_SIZE;
  const endpoint = term
    ? `${API_BASE_URL}/products/search?q=${encodeURIComponent(term)}&limit=${PAGE_SIZE}&skip=${skip}`
    : `${API_BASE_URL}/products?limit=${PAGE_SIZE}&skip=${skip}`;

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(
      `Request failed with status ${response.status}. Please try again.`,
    );
  }

  const data = (await response.json()) as DummyJsonResponse;

  return {
    items: mapProducts(data.products),
    total: data.total,
  };
};

export const fetchProductById = async (id: number): Promise<ProductItem> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error(
      `Request failed with status ${response.status}. Please try again.`,
    );
  }

  const product = (await response.json()) as DummyJsonProduct;

  return {
    id: product.id,
    name: product.title,
    description: product.description,
  };
};

export { PAGE_SIZE };
