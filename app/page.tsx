import type { Metadata } from "next";
import { Prototype } from "./prototype";

export const metadata: Metadata = {
  title: "T.A.F Qualité — Rénovation intérieure, extérieure et globale à Angers",
  description:
    "Travaux d'intérieur, d'extérieur et rénovation coordonnée à Angers et alentours, avec Majid comme interlocuteur unique. Devis détaillé, étude de projet gratuite.",
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
