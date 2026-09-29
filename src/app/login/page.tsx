"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LoginFormData, loginSchema } from "@/schemas/LoginSchema";

export default function LoginPage() {
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleLogin(data: LoginFormData) {
    setLoginError("");

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setLoginError("Email ou senha inválidos.");
      return;
    }

    window.location.href = "/products";
  }

  return (
    <main className="min-h-screen bg-stone-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Apresentação */}

        <section className="relative hidden overflow-hidden border-r border-white/10 lg:flex lg:flex-col lg:justify-between lg:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950/40" />

          <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-amber-600/10 blur-3xl" />

          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-500">
              Luxury
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-[0.15em] text-white">
              STORE
            </h1>
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="mb-8 h-px w-16 bg-amber-500" />

            <h2 className="text-4xl font-light leading-tight tracking-tight text-white xl:text-5xl">
              Gestão de produtos
              <br />
              com simplicidade.
            </h2>

            <p className="mt-6 max-w-md leading-7 text-stone-400">
              Plataforma administrativa para gerenciamento do catálogo, estoque
              e produtos da Luxury Store.
            </p>
          </div>

          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-600">
              Painel administrativo
            </p>
          </div>
        </section>

        {/* Login */}

        <section className="flex min-h-screen items-center justify-center bg-stone-50 px-6 py-12 sm:px-10">
          <div className="w-full max-w-md">
            {/* Logo mobile */}

            <div className="mb-12 lg:hidden">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-700">
                Luxury
              </p>

              <p className="mt-1 text-xl font-semibold tracking-[0.15em] text-stone-950">
                STORE
              </p>
            </div>

            {/* Cabeçalho */}

            <div className="mb-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                Área administrativa
              </p>

              <h2 className="text-3xl font-semibold tracking-tight text-stone-950">
                Bem-vindo
              </h2>

              <p className="mt-3 text-sm leading-6 text-stone-500">
                Entre com suas credenciais para acessar o painel da Luxury
                Store.
              </p>
            </div>

            {/* Formulário */}

            <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-stone-700">
                  Email
                </Label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  {...register("email")}
                  className="flex h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm text-stone-950 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-2 focus:ring-amber-700/10"
                />

                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-stone-700">
                  Senha
                </Label>

                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="flex h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm text-stone-950 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-2 focus:ring-amber-700/10"
                />

                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {loginError && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-700">{loginError}</p>
                </div>
              )}

              <Button
                type="submit"
                className="h-11 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Entrando..." : "Entrar no painel"}
              </Button>
            </form>

            <div className="mt-8 border-t border-stone-200 pt-6">
              <p className="text-center text-xs text-stone-400">
                Luxury Store · Sistema de gerenciamento
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
