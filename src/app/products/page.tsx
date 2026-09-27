"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

export default function ProductsPage() {
  const [page, setPage] = useState(1);

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
      <main className="p-8">
        <p>Carregando produtos...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="p-8">
        <p>Erro ao carregar produtos: {error.message}</p>
      </main>
    );
  }

  const totalPages = data?.pagination.totalPages ?? 1;

  return (
    <main className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Produtos</h1>

        <p className="mt-2 text-gray-600">
          {data?.pagination.total ?? 0} produtos encontrados
        </p>
      </div>

      {/* Filtros */}

      <form
        onSubmit={handleSubmit(handleFilter)}
        className="mb-8 rounded-lg border p-6"
      >
        <h2 className="mb-4 text-xl font-semibold">Filtros</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="minPrice">Preço mínimo</Label>

            <Controller
              name="minPrice"
              control={control}
              render={({ field }) => (
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="Preço mínimo"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />

            {errors.minPrice && (
              <p className="text-sm text-destructive">
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
                  placeholder="Preço máximo"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />

            {errors.maxPrice && (
              <p className="text-sm text-destructive">
                {errors.maxPrice.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <Button type="submit">Filtrar</Button>

          <Button type="button" variant="outline" onClick={handleClearFilters}>
            Limpar
          </Button>
        </div>
      </form>

      {isFetching && (
        <p className="mb-4 text-sm text-gray-500">Atualizando produtos...</p>
      )}

      {/* Produtos */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.data.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>

              {product.description && (
                <CardDescription>{product.description}</CardDescription>
              )}
            </CardHeader>

            <CardContent>
              <p className="font-medium">
                R$ {(product.price / 100).toFixed(2)}
              </p>

              <p className="mt-1 text-sm">Estoque: {product.stock}</p>

              <p className="text-sm text-muted-foreground">
                SKU: {product.sku}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginação */}

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => setPage((current) => current - 1)}
          className="rounded border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Anterior
        </button>

        <span>
          Página {page} de {totalPages}
        </span>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => setPage((current) => current + 1)}
          className="rounded border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    </main>
  );
}
