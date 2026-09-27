"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { getProductById } from "@/services/ProductService";

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
    </main>
  );
}
