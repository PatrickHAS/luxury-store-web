export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  sku: string;
  active: boolean;
  imageUrl?: string | null;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}
