// Exécuté avec `node --experimental-strip-types` (voir package.json) : Node 22+ sait
// dépouiller les annotations de type sans transpileur, donc ce test peut importer les
// fichiers de config TypeScript directement, sans dépendance supplémentaire.
import assert from "node:assert/strict";
import test from "node:test";
import { siteConfig } from "../../app/config/index.ts";
import { atfSignatureConfig } from "../../app/config/atf-signature.config.ts";
import { exempleArtisanConfig } from "../../app/config/examples/exemple-artisan.config.ts";
import {
  buildHomeMetadata,
  buildServiceMetadata,
  buildAboutMetadata,
  buildWhatsappUrl,
  findService,
  publicPaths,
} from "../../app/config/helpers.ts";

test("le site actif reste ATF Signature", () => {
  assert.equal(siteConfig, atfSignatureConfig, "app/config/index.ts doit pointer vers atf-signature.config.ts par défaut");
  assert.notEqual(siteConfig, exempleArtisanConfig, "la config fictive ne doit jamais devenir la config active");
});

test("la config fictive change bien le nom, les couleurs et les coordonnées", () => {
  assert.notEqual(exempleArtisanConfig.business.name, atfSignatureConfig.business.name);
  assert.equal(exempleArtisanConfig.business.name, "Dupont Plomberie");

  assert.notEqual(exempleArtisanConfig.colors.navy, atfSignatureConfig.colors.navy);
  assert.notEqual(exempleArtisanConfig.colors.accent, atfSignatureConfig.colors.accent);

  assert.notEqual(exempleArtisanConfig.contact.phoneDisplay, atfSignatureConfig.contact.phoneDisplay);
  assert.notEqual(exempleArtisanConfig.contact.whatsappMessage, atfSignatureConfig.contact.whatsappMessage);
});

test("le lien WhatsApp est construit à partir de la config, numéro inclus si fourni", () => {
  const tafUrl = buildWhatsappUrl(atfSignatureConfig.contact);
  assert.equal(tafUrl, "https://wa.me/?text=" + encodeURIComponent(atfSignatureConfig.contact.whatsappMessage));

  const exempleUrl = buildWhatsappUrl(exempleArtisanConfig.contact);
  assert.equal(
    exempleUrl,
    `https://wa.me/${exempleArtisanConfig.contact.whatsappNumber}?text=${encodeURIComponent(exempleArtisanConfig.contact.whatsappMessage)}`,
  );
});

test("les catégories de services sont entièrement différentes et pilotent le formulaire", () => {
  const tafKeys = atfSignatureConfig.services.map((service) => service.key).sort();
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

  assert.throws(() => findService(exempleArtisanConfig, "interieur"), /Unknown service key/, "les clés ATF Signature ne doivent pas fuiter dans une autre config");
});

test("les textes de page (accueil, service, à propos) sont propres à chaque config", () => {
  assert.notEqual(exempleArtisanConfig.business.hero.headlineLead, atfSignatureConfig.business.hero.headlineLead);
  assert.notEqual(exempleArtisanConfig.about.title, atfSignatureConfig.about.title);
  assert.notEqual(exempleArtisanConfig.leader.name, atfSignatureConfig.leader.name);
  assert.notEqual(exempleArtisanConfig.process.steps.length && exempleArtisanConfig.process.steps[0].title, atfSignatureConfig.process.steps[0].title);
});

test("les options de formulaire sont propres à chaque config", () => {
  assert.notEqual(exempleArtisanConfig.form.projectLabel, atfSignatureConfig.form.projectLabel);
  assert.notEqual(exempleArtisanConfig.form.needsPlaceholder, atfSignatureConfig.form.needsPlaceholder);
  // Les options du <select> "type de projet" viennent des services, pas d'une liste séparée à
  // dupliquer : elles suivent donc automatiquement les 3 métiers de chaque config.
  const projectOptions = exempleArtisanConfig.services.map((service) => service.projectLabel);
  assert.deepEqual(projectOptions, ["Dépannage", "Installation", "Chaudières"]);
});

test("les mentions légales sont propres à chaque config", () => {
  assert.notEqual(exempleArtisanConfig.legal.editorLine, atfSignatureConfig.legal.editorLine);
  assert.ok(exempleArtisanConfig.legal.editorLine.includes("Dupont Plomberie"));
  assert.ok(!exempleArtisanConfig.legal.editorLine.includes("ATF Signature"), "aucune trace d'ATF Signature ne doit fuiter dans une autre config");
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
  assert.notDeepEqual(exempleArtisanConfig.cta.stickyQuoteBadge, atfSignatureConfig.cta.stickyQuoteBadge);
  assert.equal(exempleArtisanConfig.cta.stickyQuoteBadge.line1, "DEMANDER UN DEVIS");
});

test("la page à propos peut vivre à une autre adresse que /atf-signature", () => {
  assert.notEqual(exempleArtisanConfig.nav.aboutPath, atfSignatureConfig.nav.aboutPath);
  assert.equal(exempleArtisanConfig.nav.aboutPath, "/dupont-plomberie");
});
