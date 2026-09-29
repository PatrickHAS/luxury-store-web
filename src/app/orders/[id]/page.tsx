"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

import { getOrderById } from "@/services/OrderService";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value / 100);
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING: "Pendente",
    PAID: "Pago",
    PROCESSING: "Em processamento",
    SHIPPED: "Enviado",
    DELIVERED: "Entregue",
    CANCELLED: "Cancelado",
  };

  return labels[status] ?? status;
}

function getStatusClasses(status: string) {
  const classes: Record<string, string> = {
    PENDING: "border-amber-200 bg-amber-50 text-amber-800",
    PAID: "border-emerald-200 bg-emerald-50 text-emerald-800",
    PROCESSING: "border-blue-200 bg-blue-50 text-blue-800",
    SHIPPED: "border-violet-200 bg-violet-50 text-violet-800",
    DELIVERED: "border-emerald-200 bg-emerald-50 text-emerald-800",
    CANCELLED: "border-red-200 bg-red-50 text-red-800",
  };

  return classes[status] ?? "border-stone-200 bg-stone-100 text-stone-700";
}

export default function OrderDetailsPage() {
  const params = useParams();

  const rawId = params?.id;
  const id = Number(Array.isArray(rawId) ? rawId[0] : rawId);

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrderById(id),
    enabled: Number.isInteger(id) && id > 0,
  });

  if (!Number.isInteger(id) || id <= 0) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <h1 className="font-semibold text-red-900">Pedido inválido</h1>

            <Link
              href="/orders"
              className="mt-4 inline-block text-sm font-medium text-red-800 underline"
            >
              Voltar para meus pedidos
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="h-72 animate-pulse rounded-xl border border-stone-200 bg-white" />
        </div>
      </main>
    );
  }

  if (isError || !order) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <h1 className="text-lg font-semibold text-red-900">
              Não foi possível carregar o pedido
            </h1>

            <p className="mt-2 text-sm text-red-700">
              {error instanceof Error
                ? error.message
                : "O pedido não existe ou você não possui acesso a ele."}
            </p>

            <Link
              href="/orders"
              className="mt-5 inline-block text-sm font-medium text-red-800 underline"
            >
              Voltar para meus pedidos
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const totalItems = order.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/orders"
          className="text-sm font-medium text-stone-500 transition hover:text-stone-950"
        >
          ← Voltar para meus pedidos
        </Link>

        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              Detalhes da compra
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-stone-950">
              Pedido #{order.id}
            </h1>

            <p className="mt-2 text-sm text-stone-500">
              Realizado em {dateFormatter.format(new Date(order.createdAt))}
            </p>
          </div>

          <span
            className={`w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
              order.status,
            )}`}
          >
            {getStatusLabel(order.status)}
          </span>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
          <section className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
            <div className="border-b border-stone-100 px-6 py-5">
              <h2 className="font-semibold text-stone-950">Produtos</h2>

              <p className="mt-1 text-sm text-stone-500">
                {totalItems}{" "}
                {totalItems === 1 ? "item comprado" : "itens comprados"}
              </p>
            </div>

            <div className="divide-y divide-stone-100">
              {order.items.map((item) => (
                <div key={item.id} className="p-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div>
                      <h3 className="font-semibold text-stone-950">
                        {item.product.name}
                      </h3>

                      <p className="mt-1 text-xs text-stone-500">
                        SKU: {item.product.sku}
                      </p>

                      <p className="mt-3 text-sm text-stone-500">
                        Quantidade: {item.quantity}
                      </p>

                      <p className="mt-1 text-sm text-stone-500">
                        Valor unitário: {formatCurrency(item.unitPrice)}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-xs uppercase tracking-wide text-stone-400">
                        Subtotal
                      </p>

                      <p className="mt-1 text-lg font-semibold text-stone-950">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside>
            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-stone-950">Resumo do pedido</h2>

              <div className="mt-5 space-y-4 border-b border-stone-100 pb-5">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-stone-500">Pedido</span>

                  <span className="font-medium text-stone-900">
                    #{order.id}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-stone-500">Quantidade</span>

                  <span className="font-medium text-stone-900">
                    {totalItems}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-stone-500">Status</span>

                  <span className="font-medium text-stone-900">
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>

              <div className="pt-5">
                <div className="flex items-end justify-between gap-4">
                  <span className="text-sm text-stone-500">Total</span>

                  <span className="text-2xl font-semibold text-stone-950">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>

              <Link href="/orders/new">
                <Button type="button" className="mt-6 w-full">
                  Fazer novo pedido
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
