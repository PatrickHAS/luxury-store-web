import { apiFetch } from "@/lib/api";
import type { Product } from "@/types/Product";

export interface ProductFilters {
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  stock: number;
  sku: string;
  categoryId: number;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  sku?: string;
  active?: boolean;
  categoryId?: number;
}

export async function createProduct(data: CreateProductData): Promise<Product> {
  return apiFetch<Product>("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getProducts(
  filters: ProductFilters = {},
): Promise<ProductResponse> {
  const params = new URLSearchParams();

  if (filters.page !== undefined) {
    params.set("page", String(filters.page));
  }

  if (filters.limit !== undefined) {
    params.set("limit", String(filters.limit));
  }

  if (filters.minPrice !== undefined) {
    params.set("minPrice", String(filters.minPrice));
  }

  if (filters.maxPrice !== undefined) {
    params.set("maxPrice", String(filters.maxPrice));
  }

  const queryString = params.toString();

  const endpoint = queryString ? `/products?${queryString}` : "/products";

  return apiFetch<ProductResponse>(endpoint);
}

export async function getProductById(id: number): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`);
}

export async function updateProduct(
  id: number,
  data: UpdateProductData,
): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: number): Promise<void> {
  await apiFetch<void>(`/products/${id}`, {
    method: "DELETE",
  });
}
