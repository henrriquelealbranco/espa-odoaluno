import type { Metadata } from "next";
import { StoreProvider } from "@/lib/store";
import "./globals.css";
export const metadata: Metadata = {
  title: "Espaço do Aluno",
  description: "Atividades, conteúdos e seu espaço na escola.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
