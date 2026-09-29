"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof RegisterForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!form.email.trim()) {
      setError("Informe seu email.");
      return;
    }

    if (form.password.length < 6) {
      setError("A senha deve possuir pelo menos 6 caracteres.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/backend/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          ...(form.name.trim()
            ? {
                name: form.name.trim(),
              }
            : {}),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message ?? "Não foi possível criar sua conta.");
      }

      router.push("/login?registered=true");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível criar sua conta.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden border-r border-white/10 bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950/40 lg:flex lg:flex-col lg:justify-between lg:p-12">
          <Link
            href="/"
            className="text-lg font-semibold tracking-[0.25em] text-white"
          >
            LUXURY STORE
          </Link>

          <div className="max-w-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400">
              Sua experiência começa aqui
            </p>

            <h1 className="mt-6 text-5xl font-light leading-tight tracking-tight text-white">
              Crie sua conta e descubra uma experiência
              <span className="font-semibold text-amber-200"> exclusiva.</span>
            </h1>

            <p className="mt-6 leading-7 text-stone-400">
              Escolha suas peças favoritas, realize seus pedidos e acompanhe
              suas compras em um único lugar.
            </p>
          </div>

          <p className="text-xs tracking-[0.2em] text-stone-600">
            LUXURY STORE
          </p>
        </section>

        <section className="flex items-center justify-center bg-stone-50 px-4 py-12 sm:px-6">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-10 inline-block text-sm font-medium text-stone-500 transition hover:text-stone-950 lg:hidden"
            >
              ← Luxury Store
            </Link>

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              Nova conta
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
              Crie sua conta
            </h2>

            <p className="mt-2 text-sm leading-6 text-stone-500">
              Preencha seus dados para começar.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-stone-700"
                >
                  Nome
                </label>

                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Seu nome"
                  className="mt-2 h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                />

                <p className="mt-1.5 text-xs text-stone-400">Opcional</p>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-stone-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="voce@email.com"
                  className="mt-2 h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-stone-700"
                >
                  Senha
                </label>

                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(event) =>
                    updateField("password", event.target.value)
                  }
                  placeholder="Mínimo de 6 caracteres"
                  className="mt-2 h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-stone-700"
                >
                  Confirmar senha
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={form.confirmPassword}
                  onChange={(event) =>
                    updateField("confirmPassword", event.target.value)
                  }
                  placeholder="Digite a senha novamente"
                  className="mt-2 h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
                />
              </div>

              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Criando conta..." : "Criar conta"}
              </button>
            </form>

            <div className="mt-8 border-t border-stone-200 pt-6 text-center">
              <p className="text-sm text-stone-500">
                Já possui uma conta?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-stone-950 hover:underline"
                >
                  Entrar
                </Link>
              </p>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-xs font-medium text-stone-400 transition hover:text-stone-700"
              >
                ← Voltar para a loja
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
