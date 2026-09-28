"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

import { deleteProduct, getProductById } from "@/services/ProductService";

import { Button } from "@/components/ui/button";

export default function ProductDetailsPage() {
  const params = useParams();

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

  const router = useRouter();
  const queryClient = useQueryClient();

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
    return <p>Carregando produto...</p>;
  }

  if (isError || !product) {
    return <p>Produto não encontrado.</p>;
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">{product.name}</h1>

      <p className="mt-2">{product.description || "Sem descrição"}</p>

      <div className="mt-4 space-y-2">
        <p>
          <strong>SKU:</strong> {product.sku}
        </p>

        <p>
          <strong>Estoque:</strong> {product.stock}
        </p>

        <p>
          <strong>Preço:</strong> R$ {(product.price / 100).toFixed(2)}
        </p>

        <p>
          <strong>Produto ativo:</strong> {product.active ? "Sim" : "Não"}
        </p>

        <p>
          <strong>Categoria:</strong> {product.categoryId}
        </p>
      </div>
      <div className="mt-6 flex gap-3">
        <Button onClick={() => router.push(`/products/${id}/edit`)}>
          Editar produto
        </Button>

        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? "Excluindo..." : "Excluir produto"}
        </Button>
        {deleteMutation.isError && (
          <p className="mt-3 text-sm text-red-500">
            {deleteMutation.error.message}
          </p>
        )}
      </div>
    </main>
  );
}
