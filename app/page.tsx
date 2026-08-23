import type { Metadata } from "next";
import { Prototype } from "./prototype";

export const metadata: Metadata = {
  title: "T.A.F Qualité — Rénovation intérieure, extérieure et bois à Angers",
  description:
    "Peinture, sols, façades, terrasses, portes et meubles : T.A.F Qualité rénove et remet en état à Angers, avec Majid Touati comme interlocuteur unique.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <a
        className="home-phone"
        href="tel:0766832030"
        aria-label="Contacter T.A.F Qualité au 07 66 83 20 30"
      >
        <i aria-hidden="true">☎</i>
        <span>
          <small>UNE QUESTION ?</small>
          <b>07 66 83 20 30</b>
        </span>
      </a>
      <Prototype initialPage="accueil" />
    </>
  );
}
