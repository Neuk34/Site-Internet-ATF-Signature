const options = [
  { id: "01", style: "check", icon: "✓", name: "Coche dynamique", sub: "Gratuit · Sans engagement" },
  { id: "02", style: "document", icon: "▤", name: "Document premium", sub: "Réponse personnalisée" },
  { id: "03", style: "house", icon: "⌂", name: "Maison artisanale", sub: "Étude gratuite du projet" },
  { id: "04", style: "stamp", icon: "✓", name: "Tampon de confiance", sub: "Devis clair et détaillé" },
  { id: "05", style: "ribbon", icon: "★", name: "Ruban commercial", sub: "Sans engagement" },
  { id: "06", style: "minimal", icon: "→", name: "Premium minimal", sub: "Présentez votre projet" },
];

export default function QuoteButtonsPage() {
  return <main className="button-lab">
    <header className="lab-head"><a href="/">← Retour au site</a><p>Comparatif graphique</p><h1>Boutons « Devis gratuit »</h1><span>Choisissez simplement un numéro. Aucun de ces modèles n’est encore définitif.</span></header>
    <section className="lab-grid">{options.map(option => <article className="lab-card" key={option.id}>
      <div className={`quote-badge ${option.style}`}><i>{option.icon}</i><span><b>OBTENIR MON DEVIS GRATUIT</b><small>{option.sub}</small></span></div>
      <footer><b>Option {option.id}</b><span>{option.name}</span></footer>
    </article>)}</section>
  </main>;
}
