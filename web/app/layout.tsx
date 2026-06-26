import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
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

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
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
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="grain relative min-h-full flex flex-col">
        <SiteNav />
        <main className="relative z-[2] flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
