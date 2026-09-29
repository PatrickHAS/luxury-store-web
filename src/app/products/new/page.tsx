"use client";

import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { productSchema } from "@/schemas/productSchema";
import type { ProductFormData } from "@/schemas/productSchema";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { getCategories } from "@/services/CategoryService";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  createProduct,
  type CreateProductData,
} from "@/services/ProductService";

export default function NewProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();

  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    if (status === "authenticated" && !isAdmin) {
      router.replace("/products");
    }
  }, [status, isAdmin, router]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),

    defaultValues: {
      name: "",
      description: "",
      price: "",
      stock: "",
      sku: "",
      categoryId: "",
    },
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const createProductMutation = useMutation({
    mutationFn: createProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      router.push("/products");
    },
  });

  function onSubmit(data: ProductFormData) {
    const productData: CreateProductData = {
      name: data.name,
      description: data.description || undefined,
      price: Math.round(Number(data.price) * 100),
      stock: Number(data.stock),
      sku: data.sku,
      categoryId: Number(data.categoryId),
    };

    createProductMutation.mutate(productData);
  }

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="h-96 animate-pulse rounded-xl border border-stone-200 bg-white" />
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Navegação */}

        <Link
          href="/products"
          className="text-sm font-medium text-stone-500 transition hover:text-stone-900"
        >
          ← Voltar para produtos
        </Link>

        {/* Cabeçalho */}

        <div className="mb-8 mt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
            Luxury Store
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-stone-950">
            Novo produto
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            Cadastre um novo item no catálogo da loja.
          </p>
        </div>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-lg">Informações do produto</CardTitle>

            <CardDescription>
              Preencha os dados abaixo para adicionar o produto ao catálogo.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Nome */}

              <div className="space-y-2">
                <Label htmlFor="name">Nome do produto</Label>

                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="name"
                      type="text"
                      placeholder="Ex.: Anel de Ouro 18k"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  )}
                />

                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Descrição */}

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>

                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="description"
                      placeholder="Ex.: Anel em ouro amarelo 18k"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  )}
                />

                {errors.description && (
                  <p className="text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Preço + Estoque */}

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)</Label>

                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="1599.90"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  {errors.price && (
                    <p className="text-sm text-red-600">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Estoque</Label>

                  <Controller
                    name="stock"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="stock"
                        type="number"
                        min="0"
                        placeholder="10"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  {errors.stock && (
                    <p className="text-sm text-red-600">
                      {errors.stock.message}
                    </p>
                  )}
                </div>
              </div>

              {/* SKU */}

              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>

                <Controller
                  name="sku"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="sku"
                      placeholder="ANEL-OURO-003"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  )}
                />

                <p className="text-xs text-stone-400">
                  Utilize um código único para identificar o produto.
                </p>

                {errors.sku && (
                  <p className="text-sm text-red-600">{errors.sku.message}</p>
                )}
              </div>

              {/* Categoria */}

              <div className="space-y-2">
                <Label>Categoria</Label>

                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoadingCategories}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingCategories
                              ? "Carregando categorias..."
                              : "Selecione uma categoria"
                          }
                        />
                      </SelectTrigger>

                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={String(category.id)}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.categoryId && (
                  <p className="text-sm text-red-600">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              {/* Erro API */}

              {createProductMutation.isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-700">
                    {createProductMutation.error instanceof Error
                      ? createProductMutation.error.message
                      : "Erro ao cadastrar produto."}
                  </p>
                </div>
              )}

              {/* Ações */}

              <div className="flex flex-col-reverse gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  disabled={createProductMutation.isPending}
                  onClick={() => router.push("/products")}
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  disabled={createProductMutation.isPending}
                >
                  {createProductMutation.isPending
                    ? "Cadastrando..."
                    : "Cadastrar produto"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
