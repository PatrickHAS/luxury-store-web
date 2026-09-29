"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  productFilterSchema,
  type ProductFilterFormData,
} from "@/schemas/ProductFilterSchema";

import { getProducts } from "@/services/ProductService";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
}

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "ADMIN";

  const [filters, setFilters] = useState<{
    minPrice?: number;
    maxPrice?: number;
  }>({});

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProductFilterFormData>({
    resolver: zodResolver(productFilterSchema),
    defaultValues: {
      minPrice: "",
      maxPrice: "",
    },
  });

  const limit = 10;

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["products", page, limit, filters.minPrice, filters.maxPrice],

    queryFn: () =>
      getProducts({
        page,
        limit,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
      }),
  });

  function handleFilter(data: ProductFilterFormData) {
    const minPrice =
      data.minPrice !== undefined && data.minPrice !== ""
        ? Number(data.minPrice)
        : undefined;

    const maxPrice =
      data.maxPrice !== undefined && data.maxPrice !== ""
        ? Number(data.maxPrice)
        : undefined;

    setPage(1);

    setFilters({
      minPrice,
      maxPrice,
    });
  }

  function handleClearFilters() {
    reset();
    setFilters({});
    setPage(1);
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-64 rounded bg-stone-200" />
            <div className="h-5 w-80 rounded bg-stone-200" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-28 rounded-xl bg-stone-200" />
              <div className="h-28 rounded-xl bg-stone-200" />
            </div>

            <div className="h-40 rounded-xl bg-stone-200" />
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <h1 className="font-semibold text-red-900">
              Não foi possível carregar os produtos
            </h1>

            <p className="mt-2 text-sm text-red-700">{error.message}</p>
          </div>
        </div>
      </main>
    );
  }

  const totalPages = data?.pagination.totalPages ?? 1;
  const totalProducts = data?.pagination.total ?? 0;

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Cabeçalho */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              Luxury Store
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-stone-950">
              Produtos
            </h1>

            <p className="mt-2 text-sm text-stone-500">
              Gerencie o catálogo, preços e estoque da loja.
            </p>
          </div>

          {isAdmin && (
            <Link href="/products/new">
              <Button type="button">+ Novo produto</Button>
            </Link>
          )}
        </div>

        {/* Resumo */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-stone-500">
                Produtos encontrados
              </p>

              <p className="mt-2 text-3xl font-semibold text-stone-950">
                {totalProducts}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-stone-500">Página atual</p>

              <p className="mt-2 text-3xl font-semibold text-stone-950">
                {page}
                <span className="ml-1 text-lg font-normal text-stone-400">
                  / {totalPages}
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Filtrar produtos</CardTitle>

            <CardDescription>
              Refine o catálogo utilizando uma faixa de preço.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(handleFilter)}>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="minPrice">Preço mínimo</Label>

                  <Controller
                    name="minPrice"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="minPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Ex.: 500"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  {errors.minPrice && (
                    <p className="text-sm text-red-600">
                      {errors.minPrice.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxPrice">Preço máximo</Label>

                  <Controller
                    name="maxPrice"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="maxPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Ex.: 5000"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  {errors.maxPrice && (
                    <p className="text-sm text-red-600">
                      {errors.maxPrice.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button type="submit">Filtrar</Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearFilters}
                >
                  Limpar filtros
                </Button>

                {isFetching && (
                  <span className="flex items-center text-sm text-stone-500">
                    Atualizando...
                  </span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Produtos */}

        {data?.data.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center px-6 py-16 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-xl">
                ◇
              </div>

              <h2 className="text-lg font-semibold text-stone-900">
                Nenhum produto encontrado
              </h2>

              <p className="mt-2 max-w-md text-sm text-stone-500">
                Não encontramos produtos para os filtros selecionados.
              </p>

              <Button
                type="button"
                variant="outline"
                className="mt-5"
                onClick={handleClearFilters}
              >
                Limpar filtros
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data?.data.map((product) => (
              <Card
                key={product.id}
                className="flex flex-col transition-shadow hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
                      {product.sku}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        product.stock > 0
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {product.stock > 0 ? "Em estoque" : "Sem estoque"}
                    </span>
                  </div>

                  <CardTitle className="text-xl">{product.name}</CardTitle>

                  <CardDescription className="line-clamp-2 min-h-10">
                    {product.description || "Produto sem descrição."}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col">
                  <div className="mb-6">
                    <p className="text-2xl font-semibold tracking-tight text-stone-950">
                      {formatCurrency(product.price)}
                    </p>

                    <p className="mt-1 text-sm text-stone-500">
                      {product.stock} unidade
                      {product.stock === 1 ? "" : "s"} disponível
                      {product.stock === 1 ? "" : "is"}
                    </p>
                  </div>

                  <div className="mt-auto border-t pt-4">
                    <Link href={`/products/${product.id}`} className="block">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                      >
                        Ver detalhes
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Paginação */}

        {totalPages > 1 && (
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-stone-200 pt-6 sm:flex-row">
            <p className="text-sm text-stone-500">
              Página <span className="font-medium text-stone-900">{page}</span>{" "}
              de{" "}
              <span className="font-medium text-stone-900">{totalPages}</span>
            </p>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={page === 1 || isFetching}
                onClick={() => setPage((current) => current - 1)}
              >
                Anterior
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={page >= totalPages || isFetching}
                onClick={() => setPage((current) => current + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
