import { apiFetch } from "@/lib/api";
import type { CreateOrderData, Order, OrdersResponse } from "@/types/Order";

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
