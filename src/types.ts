export interface ProductItem {
  id: number;
  name: string;
  description: string;
}

export interface ProductResponse {
  items: ProductItem[];
  total: number;
}
