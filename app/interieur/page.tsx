import type { Metadata } from "next";
import { Prototype } from "../prototype";

export const metadata: Metadata = {
  title: "Rénovation intérieure à Angers — Peinture, sols, cuisine — T.A.F Qualité",
  description:
    "Peinture, enduits, sols, cuisine, salle de bains : T.A.F Qualité rénove l'intérieur de votre maison à Angers avec un devis détaillé.",
};

export default function Page() { return <Prototype initialPage="interieur" />; }
