import type { Metadata } from "next";
import "./globals.css";
import { GovBrHeader } from "@/components/GovBrHeader";
import { GovBrFooter } from "@/components/GovBrFooter";

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
      <body className="antialiased min-h-screen flex flex-col">
        <GovBrHeader />
        <div className="flex-1 flex flex-col">{children}</div>
        <GovBrFooter />
      </body>
    </html>
  );
}
