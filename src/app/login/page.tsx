"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
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
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Entrar</h1>

          <p className="mt-2 text-muted-foreground">
            Acesse sua conta da Luxury Store.
          </p>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register("email")}
              className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs"
            />

            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>

            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs"
            />

            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {loginError && (
            <p className="text-sm text-destructive">{loginError}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </main>
  );
}
