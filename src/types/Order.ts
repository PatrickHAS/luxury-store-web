import type { Product } from "@/types/Product";

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

export interface Order {
  id: number;
  userId: number;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrdersResponse {
  data: Order[];
}

export interface CreateOrderItem {
  productId: number;
  quantity: number;
}

export interface CreateOrderData {
  items: CreateOrderItem[];
}
