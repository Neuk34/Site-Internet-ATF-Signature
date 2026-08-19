import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "T.A.F Qualité — Prototype", description: "Prototype mobile-first de T.A.F Qualité, travaux et rénovation à Angers." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr"><body>{children}</body></html>; }
