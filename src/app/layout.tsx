import type { Metadata } from "next";

import "./globals.css";

import { QueryProvider } from "@/providers/QueryProvider";
import { AuthSessionProvider } from "@/providers/SessionProvider";

export const metadata: Metadata = {
  title: "Luxury Store",
  description: "Luxury Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthSessionProvider>
          <QueryProvider>{children}</QueryProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
