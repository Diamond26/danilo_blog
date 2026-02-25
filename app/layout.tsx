import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Assicurati di avere questo file o crealo

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dr. Danilo | Psicologo",
  description: "Sito professionale di consulenza psicologica",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className={inter.className}>{children}</body>
    </html>
  );
}