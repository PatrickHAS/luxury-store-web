"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

export function AppHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();

  function handleLogout() {
    signOut({
      callbackUrl: "/login",
    });
  }

  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Marca */}

        <Link href="/products" className="flex items-center gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-700">
              Luxury
            </p>

            <p className="text-sm font-semibold tracking-[0.15em] text-stone-950">
              STORE
            </p>
          </div>
        </Link>

        <Link
          href="/orders"
          className={`rounded-md px-3 py-2 text-sm font-medium transition ${
            pathname?.startsWith("/orders")
              ? "bg-stone-100 text-stone-950"
              : "text-stone-500 hover:bg-stone-50 hover:text-stone-950"
          }`}
        >
          Pedidos
        </Link>

        {/* Navegação */}

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/products"
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
              pathname?.startsWith("/products")
                ? "bg-stone-100 text-stone-950"
                : "text-stone-500 hover:bg-stone-50 hover:text-stone-950"
            }`}
          >
            Produtos
          </Link>

          {/* Usuário */}

          {session?.user?.email && (
            <span className="hidden text-sm text-stone-500 md:block">
              {session.user.email}
            </span>
          )}

          <Button type="button" variant="outline" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
