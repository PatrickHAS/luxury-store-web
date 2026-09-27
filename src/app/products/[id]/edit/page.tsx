"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      <main className="p-8">
        <p>Carregando produto...</p>
      </main>
    );
  }

  if (isProductError || !product) {
    return (
      <main className="p-8">
        <p>Produto não encontrado.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-bold">Editar produto</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>

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
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
          />

          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
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
                value={field.value ?? ""}
                onValueChange={field.onChange}
                disabled={isLoadingCategories}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {errors.categoryId && (
            <p className="text-sm text-red-500">{errors.categoryId.message}</p>
          )}
        </div>

        {updateMutation.isError && (
          <p className="text-sm text-red-500">{updateMutation.error.message}</p>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>

          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>
      </form>
    </main>
  );
}
