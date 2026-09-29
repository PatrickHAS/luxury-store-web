"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

import { deleteProduct, getProductById } from "@/services/ProductService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "ADMIN";

  const id = Number(params?.id);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: Number.isInteger(id) && id > 0,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProduct(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.removeQueries({
        queryKey: ["product", id],
      });

      router.push("/products");
    },
  });

  function handleDelete() {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este produto?",
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate();
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-5">
            <div className="h-5 w-32 rounded bg-stone-200" />
            <div className="h-10 w-72 rounded bg-stone-200" />
            <div className="h-64 rounded-xl bg-stone-200" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-xl font-semibold text-stone-900">
                Produto não encontrado
              </h1>

              <p className="mt-2 text-sm text-stone-500">
                Não foi possível localizar as informações deste produto.
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

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Navegação */}

        <div className="mb-6">
          <Link
            href="/products"
            className="text-sm font-medium text-stone-500 transition hover:text-stone-900"
          >
            ← Voltar para produtos
          </Link>
        </div>

        {/* Cabeçalho */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              Detalhes do produto
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-stone-950">
              {product.name}
            </h1>

            <p className="mt-2 text-sm text-stone-500">SKU: {product.sku}</p>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
              product.stock > 0
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {product.stock > 0 ? "Em estoque" : "Sem estoque"}
          </span>
        </div>

        {/* Informações */}

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-lg">Informações do produto</CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-stone-500">Preço</p>

                <p className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                  {formatCurrency(product.price)}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-stone-500">
                  Estoque disponível
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                  {product.stock}
                </p>

                <p className="mt-1 text-xs text-stone-400">
                  {product.stock === 1
                    ? "1 unidade disponível"
                    : `${product.stock} unidades disponíveis`}
                </p>
              </div>
            </div>

            <div className="my-8 border-t border-stone-200" />

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-stone-500">SKU</p>

                <p className="mt-1 font-medium text-stone-900">{product.sku}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-stone-500">Categoria</p>

                <p className="mt-1 font-medium text-stone-900">
                  #{product.categoryId}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-stone-500">Status</p>

                <p className="mt-1 font-medium text-stone-900">
                  {product.active ? "Ativo" : "Inativo"}
                </p>
              </div>
            </div>

            <div className="my-8 border-t border-stone-200" />

            <div>
              <p className="text-sm font-medium text-stone-500">Descrição</p>

              <p className="mt-2 leading-7 text-stone-700">
                {product.description || "Produto sem descrição cadastrada."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Ações */}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          {isAdmin && (
            <>
              {
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending
                    ? "Excluindo..."
                    : "Excluir produto"}
                </Button>
              }
            </>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <Link href="/products">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
              >
                Voltar
              </Button>
            </Link>

            <Link href={`/products/${id}/edit`}>
              {isAdmin && (
                <>
                  {
                    <Button type="button" className="w-full sm:w-auto">
                      Editar produto
                    </Button>
                  }
                </>
              )}
            </Link>
          </div>
        </div>

        {deleteMutation.isError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">
              {deleteMutation.error.message}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
