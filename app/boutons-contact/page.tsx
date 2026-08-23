import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparatif interne — bouton contact",
  robots: { index: false, follow: false },
};

const contacts = [
  { id: "01", style: "phone-premium", eyebrow: "CONTACTEZ-NOUS", label: "07 66 83 20 30", name: "Premium noir et beige" },
  { id: "02", style: "phone-green", eyebrow: "UNE QUESTION ?", label: "07 66 83 20 30", name: "Vert relationnel" },
  { id: "03", style: "phone-coral", eyebrow: "CONTACTEZ-NOUS AU", label: "07 66 83 20 30", name: "Corail commercial" },
  { id: "04", style: "phone-minimal", eyebrow: "Contactez-nous au", label: "07 66 83 20 30", name: "Sobre et minimal" },
];

export default function ContactButtonsPage() {
  return <main className="contact-lab">
    <div className="contact-lab-title"><a href="/">← Retour au site</a><p>Comparatif graphique</p><h1>Bouton de contact</h1><span>Prévisualisation uniquement — aucune proposition n’est ajoutée à l’accueil.</span></div>
    <section className="contact-options">{contacts.map(option => <article className="contact-option" key={option.id}>
      <div className="fake-header"><div className="fake-brand">ATF <b>SIGNATURE</b><small>RÉNOVATION · ANGERS</small></div><a className={`phone-option ${option.style}`} href="tel:0766832030"><i>☎</i><span><small>{option.eyebrow}</small><b>{option.label}</b></span></a></div>
      <div className="contact-caption"><b>Option {option.id}</b><span>{option.name}</span></div>
    </article>)}</section>
  </main>;
}
