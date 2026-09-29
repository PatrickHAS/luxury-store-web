import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-[0.25em]">
            LUXURY STORE
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-md border border-white/20 px-4 py-2 text-sm font-medium transition hover:bg-white hover:text-stone-950"
            >
              Entrar
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950/40" />

        <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-16 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-amber-400">
              Luxury Collection
            </p>

            <h1 className="max-w-3xl text-5xl font-light leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Elegância que
              <span className="block font-semibold text-amber-200">
                atravessa gerações.
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-7 text-stone-300 sm:text-lg">
              Uma experiência exclusiva para descobrir peças selecionadas,
              criadas para transformar momentos especiais em histórias
              inesquecíveis.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="rounded-md bg-white px-6 py-3 text-center text-sm font-semibold text-stone-950 transition hover:bg-stone-200"
              >
                Explorar coleção
              </Link>

              <Link
                href="/register"
                className="rounded-md border border-white/20 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Criar minha conta
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -left-10 -top-10 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

            <div className="relative ml-auto flex aspect-[4/5] max-w-md items-center justify-center overflow-hidden rounded-t-[12rem] border border-white/10 bg-gradient-to-b from-amber-100/10 to-stone-950">
              <div className="absolute inset-8 rounded-t-[10rem] border border-amber-200/20" />

              <div className="relative text-center">
                <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border border-amber-200/30">
                  <div className="flex h-24 w-24 rotate-45 items-center justify-center border border-amber-200/50">
                    <div className="h-12 w-12 border border-amber-200/80" />
                  </div>
                </div>

                <p className="mt-10 text-xs uppercase tracking-[0.4em] text-amber-200">
                  Timeless
                </p>

                <p className="mt-3 font-serif text-2xl text-stone-100">
                  Fine Jewelry
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone-50 text-stone-950">
        <div className="mx-auto grid max-w-7xl gap-px bg-stone-200 sm:grid-cols-3">
          <div className="bg-white px-8 py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              Curadoria
            </p>

            <h2 className="mt-3 text-lg font-semibold">Peças selecionadas</h2>

            <p className="mt-2 text-sm leading-6 text-stone-500">
              Uma coleção pensada para unir sofisticação, qualidade e
              exclusividade.
            </p>
          </div>

          <div className="bg-white px-8 py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              Experiência
            </p>

            <h2 className="mt-3 text-lg font-semibold">Compra personalizada</h2>

            <p className="mt-2 text-sm leading-6 text-stone-500">
              Navegue pela coleção, escolha suas peças e acompanhe seus pedidos
              em um único lugar.
            </p>
          </div>

          <div className="bg-white px-8 py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              Segurança
            </p>

            <h2 className="mt-3 text-lg font-semibold">Acesso protegido</h2>

            <p className="mt-2 text-sm leading-6 text-stone-500">
              Autenticação e controle de acesso para proteger as operações da
              aplicação.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-stone-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="tracking-[0.2em]">LUXURY STORE</p>

          <p>Experiência digital para joias e acessórios de luxo.</p>
        </div>
      </footer>
    </main>
  );
}
