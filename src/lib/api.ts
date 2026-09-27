const API_URL = "/api/backend";

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const headers = new Headers(options?.headers);

  headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Erro na requisição",
    }));

    throw new Error(error.message || "Erro na requisição");
  }

  return response.json();
}
