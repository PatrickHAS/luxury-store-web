"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { getOrders } from "@/services/OrderService";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING: "Pendente",
    PAID: "Pago",
    PROCESSING: "Em processamento",
    SHIPPED: "Enviado",
    COMPLETED: "Concluído",
    CANCELLED: "Cancelado",
  };

  return labels[status] ?? status;
}

export default function OrdersPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const orders = data?.data ?? [];

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              Minha conta
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-stone-950">
              Meus pedidos
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
              Acompanhe os pedidos realizados e consulte os produtos,
              quantidades e valores registrados em cada compra.
            </p>
          </div>

          <Link href="/orders/new">
            <Button type="button">+ Novo pedido</Button>
          </Link>
        </div>

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-xl border border-stone-200 bg-white"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="font-medium text-red-800">
              Não foi possível carregar seus pedidos.
            </p>

            <p className="mt-1 text-sm text-red-700">
              {error instanceof Error
                ? error.message
                : "Ocorreu um erro inesperado."}
            </p>
          </div>
        )}

        {!isLoading && !isError && orders.length === 0 && (
          <div className="rounded-xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
            <p className="text-lg font-semibold text-stone-900">
              Nenhum pedido encontrado
            </p>

            <p className="mt-2 text-sm text-stone-500">
              Você ainda não realizou nenhum pedido.
            </p>

            <div className="mt-6">
              <Link href="/orders/new">
                <Button type="button">Fazer primeiro pedido</Button>
              </Link>
            </div>
          </div>
        )}

        {!isLoading && !isError && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const totalItems = order.items.reduce(
                (total, item) => total + item.quantity,
                0,
              );

              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-4 border-b border-stone-100 px-5 py-4 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-semibold text-stone-950">
                          Pedido #{order.id}
                        </h2>

                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                          {getStatusLabel(order.status)}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-stone-500">
                        Realizado em {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-xs uppercase tracking-wider text-stone-400">
                        Total
                      </p>

                      <p className="text-lg font-semibold text-stone-950">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 py-4">
                    <div className="mb-4 flex flex-wrap gap-6 text-sm text-stone-600">
                      <span>
                        <strong className="text-stone-900">{totalItems}</strong>{" "}
                        {totalItems === 1 ? "item" : "itens"}
                      </span>

                      <span>
                        <strong className="text-stone-900">
                          {order.items.length}
                        </strong>{" "}
                        {order.items.length === 1 ? "produto" : "produtos"}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col justify-between gap-2 rounded-lg bg-stone-50 px-4 py-3 sm:flex-row sm:items-center"
                        >
                          <div>
                            <p className="font-medium text-stone-900">
                              {item.product.name}
                            </p>

                            <p className="mt-1 text-xs text-stone-500">
                              SKU: {item.product.sku}
                            </p>
                          </div>

                          <div className="text-sm sm:text-right">
                            <p className="text-stone-600">
                              {item.quantity} × {formatCurrency(item.unitPrice)}
                            </p>

                            <p className="font-medium text-stone-900">
                              {formatCurrency(item.quantity * item.unitPrice)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex justify-end">
                      <Link href={`/orders/${order.id}`}>
                        <Button type="button" variant="outline">
                          Ver detalhes
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
