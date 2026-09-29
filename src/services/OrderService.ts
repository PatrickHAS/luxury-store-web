import { apiFetch } from "@/lib/api";
import type { CreateOrderData, Order, OrdersResponse } from "@/types/Order";

export interface CancelOrderResponse {
  id: number;
  status: string;
  total: number;
}

export async function getOrders(): Promise<OrdersResponse> {
  return apiFetch<OrdersResponse>("/orders");
}

export async function getOrderById(id: number): Promise<Order> {
  return apiFetch<Order>(`/orders/${id}`);
}

export async function createOrder(data: CreateOrderData): Promise<Order> {
  return apiFetch<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function cancelOrder(id: number): Promise<CancelOrderResponse> {
  return apiFetch<CancelOrderResponse>(`/orders/${id}/cancel`, {
    method: "PATCH",
  });
}
