"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  getProductById,
  updateProduct,
  type UpdateProductData,
} from "@/services/ProductService";

import { getCategories } from "@/services/CategoryService";

import {
  updateProductSchema,
  type UpdateProductFormData,
} from "@/schemas/updateProductSchema";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();

  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    if (status === "authenticated" && !isAdmin) {
      router.replace("/products");
    }
  }, [status, isAdmin, router]);

  const id = Number(params?.id);

  const {
    data: product,
    isLoading: isLoadingProduct,
    isError: isProductError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: Number.isInteger(id) && id > 0,
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProductFormData>({
    resolver: zodResolver(updateProductSchema),
  });

  useEffect(() => {
    if (!product) return;

    reset({
      name: product.name,
      description: product.description ?? "",
      price: String(product.price / 100),
      stock: String(product.stock),
      sku: product.sku,
      categoryId: String(product.categoryId),
    });
  }, [product, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProductData) => updateProduct(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["product", id],
      });

      router.push(`/products/${id}`);
    },
  });

  function onSubmit(data: UpdateProductFormData) {
    const productData: UpdateProductData = {
      name: data.name,
      description: data.description || undefined,
      price: Math.round(Number(data.price) * 100),
      stock: Number(data.stock),
      sku: data.sku,
      categoryId: Number(data.categoryId),
    };

    updateMutation.mutate(productData);
  }

  if (isLoadingProduct) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-5 w-32 rounded bg-stone-200" />
            <div className="h-10 w-64 rounded bg-stone-200" />
            <div className="h-96 rounded-xl bg-stone-200" />
          </div>
        </div>
      </main>
    );
  }

  if (isProductError || !product) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-xl font-semibold text-stone-900">
                Produto não encontrado
              </h1>

              <p className="mt-2 text-sm text-stone-500">
                Não foi possível carregar o produto que você deseja editar.
              </p>

              <Link href="/products" className="mt-6 inline-block">
                <Button type="button" variant="outline">
                  Voltar para produtos
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
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
          href={`/products/${id}`}
          className="text-sm font-medium text-stone-500 transition hover:text-stone-900"
        >
          ← Voltar para o produto
        </Link>

        {/* Cabeçalho */}

        <div className="mb-8 mt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
            Luxury Store
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-stone-950">
            Editar produto
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            Atualize as informações de{" "}
            <span className="font-medium text-stone-700">{product.name}</span>.
          </p>
        </div>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-lg">Informações do produto</CardTitle>

            <CardDescription>
              Altere somente os campos necessários e salve as alterações.
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
                      value={field.value ?? ""}
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

              {/* Erro da API */}

              {updateMutation.isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-700">
                    {updateMutation.error.message}
                  </p>
                </div>
              )}

              {/* Ações */}

              <div className="flex flex-col-reverse gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  disabled={updateMutation.isPending}
                  onClick={() => router.push(`/products/${id}`)}
                >
                  Cancelar
                </Button>

                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending
                    ? "Salvando..."
                    : "Salvar alterações"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
