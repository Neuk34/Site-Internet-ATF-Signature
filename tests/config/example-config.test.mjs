// Exécuté avec `node --experimental-strip-types` (voir package.json) : Node 22+ sait
// dépouiller les annotations de type sans transpileur, donc ce test peut importer les
// fichiers de config TypeScript directement, sans dépendance supplémentaire.
import assert from "node:assert/strict";
import test from "node:test";
import { siteConfig } from "../../app/config/index.ts";
import { tafQualiteConfig } from "../../app/config/taf-qualite.config.ts";
import { exempleArtisanConfig } from "../../app/config/examples/exemple-artisan.config.ts";
import {
  buildHomeMetadata,
  buildServiceMetadata,
  buildAboutMetadata,
  buildWhatsappUrl,
  findService,
  publicPaths,
} from "../../app/config/helpers.ts";

test("le site actif reste T.A.F Qualité", () => {
  assert.equal(siteConfig, tafQualiteConfig, "app/config/index.ts doit pointer vers taf-qualite.config.ts par défaut");
  assert.notEqual(siteConfig, exempleArtisanConfig, "la config fictive ne doit jamais devenir la config active");
});

test("la config fictive change bien le nom, les couleurs et les coordonnées", () => {
  assert.notEqual(exempleArtisanConfig.business.name, tafQualiteConfig.business.name);
  assert.equal(exempleArtisanConfig.business.name, "Dupont Plomberie");

  assert.notEqual(exempleArtisanConfig.colors.navy, tafQualiteConfig.colors.navy);
  assert.notEqual(exempleArtisanConfig.colors.accent, tafQualiteConfig.colors.accent);

  assert.notEqual(exempleArtisanConfig.contact.phoneDisplay, tafQualiteConfig.contact.phoneDisplay);
  assert.notEqual(exempleArtisanConfig.contact.whatsappMessage, tafQualiteConfig.contact.whatsappMessage);
});

test("le lien WhatsApp est construit à partir de la config, numéro inclus si fourni", () => {
  const tafUrl = buildWhatsappUrl(tafQualiteConfig.contact);
  assert.equal(tafUrl, "https://wa.me/?text=" + encodeURIComponent(tafQualiteConfig.contact.whatsappMessage));

  const exempleUrl = buildWhatsappUrl(exempleArtisanConfig.contact);
  assert.equal(
    exempleUrl,
    `https://wa.me/${exempleArtisanConfig.contact.whatsappNumber}?text=${encodeURIComponent(exempleArtisanConfig.contact.whatsappMessage)}`,
  );
});

test("les catégories de services sont entièrement différentes et pilotent le formulaire", () => {
  const tafKeys = tafQualiteConfig.services.map((service) => service.key).sort();
  const exempleKeys = exempleArtisanConfig.services.map((service) => service.key).sort();
  assert.notDeepEqual(exempleKeys, tafKeys);
  assert.deepEqual(exempleKeys, ["chaudieres", "depannage", "installation"]);

  // Le nombre de services change lui aussi (3 pour les deux ici, mais rien dans le type
  // ne l'impose - ajouter/retirer une entrée n'exige aucune modification de composant).
  assert.equal(exempleArtisanConfig.services.length, 3);

  for (const key of exempleKeys) {
    const service = findService(exempleArtisanConfig, key);
    assert.equal(service.key, key);
    assert.ok(service.meta.title.includes("Dupont Plomberie"), `meta.title de "${key}" doit mentionner l'entreprise`);
  }

  assert.throws(() => findService(exempleArtisanConfig, "interieur"), /Unknown service key/, "les clés T.A.F Qualité ne doivent pas fuiter dans une autre config");
});

test("les textes de page (accueil, service, à propos) sont propres à chaque config", () => {
  assert.notEqual(exempleArtisanConfig.business.hero.headlineLead, tafQualiteConfig.business.hero.headlineLead);
  assert.notEqual(exempleArtisanConfig.about.title, tafQualiteConfig.about.title);
  assert.notEqual(exempleArtisanConfig.leader.name, tafQualiteConfig.leader.name);
  assert.notEqual(exempleArtisanConfig.process.steps.length && exempleArtisanConfig.process.steps[0].title, tafQualiteConfig.process.steps[0].title);
});

test("les options de formulaire sont propres à chaque config", () => {
  assert.notEqual(exempleArtisanConfig.form.projectLabel, tafQualiteConfig.form.projectLabel);
  assert.notEqual(exempleArtisanConfig.form.needsPlaceholder, tafQualiteConfig.form.needsPlaceholder);
  // Les options du <select> "type de projet" viennent des services, pas d'une liste séparée à
  // dupliquer : elles suivent donc automatiquement les 3 métiers de chaque config.
  const projectOptions = exempleArtisanConfig.services.map((service) => service.projectLabel);
  assert.deepEqual(projectOptions, ["Dépannage", "Installation", "Chaudières"]);
});

test("les mentions légales sont propres à chaque config", () => {
  assert.notEqual(exempleArtisanConfig.legal.editorLine, tafQualiteConfig.legal.editorLine);
  assert.ok(exempleArtisanConfig.legal.editorLine.includes("Dupont Plomberie"));
  assert.ok(!exempleArtisanConfig.legal.editorLine.includes("T.A.F Qualité"), "aucune trace de T.A.F Qualité ne doit fuiter dans une autre config");
});

test("les métadonnées (title/description/canonical/sitemap) suivent la config fictive", () => {
  const home = buildHomeMetadata(exempleArtisanConfig);
  assert.equal(home.title, exempleArtisanConfig.business.homeMeta.title);
  assert.equal(home.alternates.canonical, "/");

  const service = buildServiceMetadata(exempleArtisanConfig, "chaudieres");
  assert.equal(service.title, "Entretien et remplacement de chaudière à Lyon — Dupont Plomberie");
  assert.equal(service.alternates.canonical, "/chaudieres");

  const about = buildAboutMetadata(exempleArtisanConfig);
  assert.equal(about.alternates.canonical, "/dupont-plomberie");

  const paths = publicPaths(exempleArtisanConfig);
  assert.deepEqual(paths, ["", "/depannage", "/installation", "/chaudieres", "/dupont-plomberie"]);
});

test("le micro-texte du badge de devis flottant est propre à chaque config", () => {
  assert.notDeepEqual(exempleArtisanConfig.cta.stickyQuoteBadge, tafQualiteConfig.cta.stickyQuoteBadge);
  assert.equal(exempleArtisanConfig.cta.stickyQuoteBadge.line1, "DEMANDER UN DEVIS");
});

test("la page à propos peut vivre à une autre adresse que /taf-qualite", () => {
  assert.notEqual(exempleArtisanConfig.nav.aboutPath, tafQualiteConfig.nav.aboutPath);
  assert.equal(exempleArtisanConfig.nav.aboutPath, "/dupont-plomberie");
});
