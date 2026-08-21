import type { Metadata } from "next";
import { Prototype } from "../prototype";

export const metadata: Metadata = {
  title: "Travaux intérieurs à Angers — T.A.F Qualité",
  description:
    "Aménagement et rénovation d'intérieur à Angers avec T.A.F Qualité : un interlocuteur unique, un devis détaillé et une équipe coordonnée.",
};

export default function Page() { return <Prototype initialPage="interieur" />; }
