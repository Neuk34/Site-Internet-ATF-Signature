import type { Metadata } from "next";
import { Prototype } from "../prototype";

export const metadata: Metadata = {
  title: "Rénovation globale coordonnée à Angers — T.A.F Qualité",
  description:
    "Un projet, plusieurs savoir-faire, une équipe coordonnée par Majid : rénovation globale à Angers et alentours.",
};

export default function Page() { return <Prototype initialPage="renovation" />; }
