"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { createOrder } from "@/services/OrderService";
import { getProducts } from "@/services/ProductService";
import type { Product } from "@/types/Product";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value / 100);
}

export default function NewOrderPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [quantity, setQuantity] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", "order"],
    queryFn: () =>
      getProducts({
        page: 1,
        limit: 100,
      }),
  });

  const products = data?.data ?? [];

  const selectedProduct: Product | undefined = products.find(
    (product) => product.id === selectedProductId,
  );

  const mutation = useMutation({
    mutationFn: createOrder,

    onSuccess: async (order) => {
      await queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      router.push(`/orders/${order.id}`);
    },
  });

  function handleSelectProduct(product: Product) {
    if (selectedProductId === product.id) {
      setSelectedProductId(null);
      setQuantity(1);
      return;
    }

    setSelectedProductId(product.id);
    setQuantity(1);
  }

  function handleSubmit() {
    if (!selectedProduct) {
      return;
    }

    mutation.mutate({
      items: [
        {
          productId: selectedProduct.id,
          quantity,
        },
      ],
    });
  }

  const estimatedTotal = selectedProduct ? selectedProduct.price * quantity : 0;

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/orders"
            className="text-sm font-medium text-stone-500 transition hover:text-stone-950"
          >
            ← Voltar para meus pedidos
          </Link>

          <p className="mb-2 mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
            Nova compra
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-stone-950">
            Fazer pedido
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
            Escolha um produto disponível e informe a quantidade desejada.
          </p>
        </div>

        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-xl border border-stone-200 bg-white"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="font-medium text-red-800">
              Não foi possível carregar os produtos.
            </p>
          </div>
        )}

        {!isLoading && !isError && products.length === 0 && (
          <div className="rounded-xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
            <p className="font-semibold text-stone-900">
              Nenhum produto disponível
            </p>

            <p className="mt-2 text-sm text-stone-500">
              Não existem produtos disponíveis para compra neste momento.
            </p>
          </div>
        )}

        {!isLoading && !isError && products.length > 0 && (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <section>
              <h2 className="mb-4 text-lg font-semibold text-stone-950">
                Produtos disponíveis
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                {products.map((product) => {
                  const selected = selectedProductId === product.id;
                  const unavailable = product.stock <= 0;

                  return (
                    <button
                      key={product.id}
                      type="button"
                      disabled={unavailable}
                      onClick={() => handleSelectProduct(product)}
                      className={`rounded-xl border p-5 text-left transition ${
                        selected
                          ? "border-amber-600 bg-amber-50 shadow-sm"
                          : "border-stone-200 bg-white hover:border-stone-300"
                      } ${
                        unavailable
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-stone-950">
                            {product.name}
                          </h3>

                          <p className="mt-1 text-xs text-stone-500">
                            SKU: {product.sku}
                          </p>
                        </div>

                        {selected && (
                          <span className="rounded-full bg-amber-700 px-2.5 py-1 text-xs font-semibold text-white">
                            Selecionado
                          </span>
                        )}
                      </div>

                      {product.description && (
                        <p className="mt-4 line-clamp-2 text-sm leading-6 text-stone-500">
                          {product.description}
                        </p>
                      )}

                      <div className="mt-5 flex items-end justify-between gap-4">
                        <p className="text-lg font-semibold text-stone-950">
                          {formatCurrency(product.price)}
                        </p>

                        <p className="text-xs text-stone-500">
                          {product.stock > 0
                            ? `${product.stock} em estoque`
                            : "Sem estoque"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <aside>
              <div className="sticky top-24 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                  Resumo
                </p>

                {!selectedProduct ? (
                  <p className="mt-5 text-sm leading-6 text-stone-500">
                    Selecione um produto para continuar.
                  </p>
                ) : (
                  <>
                    <div className="mt-5 border-b border-stone-100 pb-5">
                      <p className="font-semibold text-stone-950">
                        {selectedProduct.name}
                      </p>

                      <p className="mt-1 text-sm text-stone-500">
                        {formatCurrency(selectedProduct.price)} por unidade
                      </p>
                    </div>

                    <div className="py-5">
                      <label
                        htmlFor="quantity"
                        className="text-sm font-medium text-stone-700"
                      >
                        Quantidade
                      </label>

                      <input
                        id="quantity"
                        type="number"
                        min={1}
                        max={selectedProduct.stock}
                        value={quantity}
                        onChange={(event) => {
                          const value = Number(event.target.value);

                          if (
                            Number.isInteger(value) &&
                            value >= 1 &&
                            value <= selectedProduct.stock
                          ) {
                            setQuantity(value);
                          }
                        }}
                        className="mt-2 h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm text-stone-950 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                      />

                      <p className="mt-2 text-xs text-stone-500">
                        Estoque disponível: {selectedProduct.stock}
                      </p>
                    </div>

                    <div className="border-t border-stone-100 pt-5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-stone-500">
                          Total estimado
                        </span>

                        <span className="text-xl font-semibold text-stone-950">
                          {formatCurrency(estimatedTotal)}
                        </span>
                      </div>

                      <p className="mt-2 text-xs leading-5 text-stone-400">
                        O valor final é validado e calculado pelo servidor.
                      </p>
                    </div>

                    {mutation.isError && (
                      <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3">
                        <p className="text-sm text-red-700">
                          {mutation.error instanceof Error
                            ? mutation.error.message
                            : "Não foi possível realizar o pedido."}
                        </p>
                      </div>
                    )}

                    <Button
                      type="button"
                      className="mt-6 w-full"
                      disabled={mutation.isPending}
                      onClick={handleSubmit}
                    >
                      {mutation.isPending
                        ? "Finalizando..."
                        : "Finalizar pedido"}
                    </Button>
                  </>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
