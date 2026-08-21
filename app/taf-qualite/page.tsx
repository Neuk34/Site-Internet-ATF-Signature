import type { Metadata } from "next";
import { Prototype } from "../prototype";

export const metadata: Metadata = {
  title: "T.A.F Qualité — L'entreprise et son dirigeant, Majid Touati",
  description:
    "Découvrez T.A.F Qualité, entreprise de rénovation à Angers dirigée par Majid Touati, et les engagements qui cadrent chaque projet.",
};

export default function Page() { return <Prototype initialPage="taf-qualite" />; }
