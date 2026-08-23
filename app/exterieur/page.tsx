import type { Metadata } from "next";
import { Prototype } from "../prototype";

export const metadata: Metadata = {
  title: "Rénovation extérieure à Angers — Façade, terrasse, portail — T.A.F Qualité",
  description:
    "Façades, terrasses, clôtures, portails, volets : T.A.F Qualité remet en état vos extérieurs à Angers avec un interlocuteur unique.",
  alternates: { canonical: "/exterieur" },
};

export default function Page() { return <Prototype initialPage="exterieur" />; }
