import { Prototype } from "./prototype";

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
