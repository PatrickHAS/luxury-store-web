"use client";

import { useQuery } from "@tanstack/react-query";

async function getMessage() {
  return "React Query está funcionando!";
}

export default function TestQueryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["test"],
    queryFn: getMessage,
  });

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Teste do React Query</h1>

      <p className="mt-4">{data}</p>
    </main>
  );
}
