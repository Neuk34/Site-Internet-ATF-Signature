import type { Metadata } from "next";
import { Prototype } from "../prototype";

export const metadata: Metadata = {
  title: "Rénovation de portes et de meubles à Angers — T.A.F Qualité",
  description:
    "Décapage, ponçage, peinture, vernis : T.A.F Qualité remet en état vos portes, meubles et boiseries à Angers, sans passer par un chantier complet.",
  alternates: { canonical: "/bois" },
};

export default function Page() { return <Prototype initialPage="bois" />; }
