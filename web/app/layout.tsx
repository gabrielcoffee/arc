import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ARC — Seu comitê de analistas de AI",
    template: "%s · ARC",
  },
  description:
    "Quatro agentes de AI especializados pesquisam, debatem e entregam uma carta de mercado e uma carteira recomendada — toda semana. Conteúdo educacional, não recomendação de investimento.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="grain relative min-h-full flex flex-col">
        <SiteNav />
        <main className="relative z-[2] flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
