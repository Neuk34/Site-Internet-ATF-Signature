import type { Metadata } from "next";
import { Prototype } from "../prototype";

export const metadata: Metadata = {
  title: "T.A.F Qualité — L'entreprise et son dirigeant, Majid Touati",
  description:
    "Majid Touati dirige T.A.F Qualité à Angers : rénovation intérieure, extérieure et remise en état de portes et meubles, avec un interlocuteur unique.",
  alternates: { canonical: "/taf-qualite" },
};

export default function Page() { return <Prototype initialPage="taf-qualite" />; }
