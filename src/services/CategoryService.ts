import { apiFetch } from "@/lib/api";
import type { Category } from "@/types/Category";

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/categories");
}
