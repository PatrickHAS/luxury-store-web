"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { productSchema } from "@/schemas/productSchema";
import type { ProductFormData } from "@/schemas/productSchema";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
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

  return (
    <main className="container mx-auto p-6">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Cadastrar produto</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>

              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nome do produto"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                )}
              />

              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    id="description"
                    placeholder="Descrição do produto"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                )}
              />

              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço</Label>

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
                <p className="text-sm text-red-500">{errors.price.message}</p>
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
                <p className="text-sm text-red-500">{errors.stock.message}</p>
              )}
            </div>

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
                <p className="text-sm text-red-500">{errors.sku.message}</p>
              )}
            </div>

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
                <p className="text-sm text-red-500">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            {createProductMutation.isError && (
              <p className="text-sm text-red-500">
                {createProductMutation.error instanceof Error
                  ? createProductMutation.error.message
                  : "Erro ao cadastrar produto."}
              </p>
            )}

            <Button type="submit" disabled={createProductMutation.isPending}>
              {createProductMutation.isPending
                ? "Cadastrando..."
                : "Cadastrar produto"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
