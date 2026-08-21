import type { Metadata } from "next";
import { Prototype } from "../prototype";

export const metadata: Metadata = {
  title: "Travaux extérieurs à Angers — T.A.F Qualité",
  description:
    "Valorisation et transformation de vos espaces extérieurs à Angers avec T.A.F Qualité, du diagnostic au résultat.",
};

export default function Page() { return <Prototype initialPage="exterieur" />; }
