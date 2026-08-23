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
        href={`https://wa.me/?text=${encodeURIComponent(
          "Bonjour Majid, je viens de visiter le site T.A.F Qualité et j’aimerais échanger avec vous au sujet de mon projet.",
        )}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Échanger avec nous sur WhatsApp"
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
