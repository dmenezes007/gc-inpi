import type { Metadata } from "next";
import "./globals.css";
import { GovBrHeader } from "@/components/GovBrHeader";

export const metadata: Metadata = {
  title: 'GC Client - Dashboard',
  description: 'Painel de governança com indicadores, status e gráficos operacionais.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <GovBrHeader />
        {children}
      </body>
    </html>
  );
}
