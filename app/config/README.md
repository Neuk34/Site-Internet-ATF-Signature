# Configuration du site

Tout le contenu propre à une entreprise (nom, couleurs, coordonnées, prestations,
équipe, mentions légales, SEO...) vit dans ce dossier, jamais dans les composants
(`app/prototype.tsx`, `app/layout.tsx`, `app/*/page.tsx`). Le type strict `SiteConfig`
(dans `types.ts`) décrit exactement ce qui est configurable.

## Fichiers

- `types.ts` — la forme (TypeScript) de la configuration. À lire en premier : chaque
  champ est commenté.
- `taf-qualite.config.ts` — la configuration réelle, actuellement servie.
- `helpers.ts` — petites fonctions utilisées par les pages (`app/*/page.tsx`) pour
  construire les `Metadata` Next.js et le lien WhatsApp à partir de la config.
- `index.ts` — **le seul point de bascule** : `siteConfig` pointe vers
  `taf-qualite.config.ts`. Rien d'autre dans le code n'importe une config
  directement.
- `examples/exemple-artisan.config.ts` — un artisan fictif (plombier) utilisé
  uniquement par `tests/config/example-config.test.mjs` pour vérifier que le
  gabarit fonctionne bien avec une entreprise différente. Ne jamais brancher ce
  fichier dans `index.ts` : il ne doit pas être publié.

## Créer un nouveau site artisan à partir de ce gabarit

1. **Dupliquer la config.** Copier `taf-qualite.config.ts` sous un nouveau nom
   (ex. `mon-artisan.config.ts`) et remplir chaque champ avec le contenu réel de
   l'entreprise. `examples/exemple-artisan.config.ts` montre à quoi ressemble une
   config pour un métier complètement différent.
2. **Brancher la config.** Dans `index.ts`, changer l'import pour pointer vers le
   nouveau fichier :
   ```ts
   import { monArtisanConfig } from "./mon-artisan.config";
   export const siteConfig = monArtisanConfig;
   ```
3. **Renommer les dossiers de route si les clés de service changent.** Chaque
   entrée de `services` a une `key` qui doit correspondre à un dossier
   `app/<key>/page.tsx` (voir les 3 dossiers existants `interieur/`, `exterieur/`,
   `bois/` comme modèle - chacun ne fait que 6 lignes). Si la page "à propos" doit
   vivre à une autre adresse, renommer aussi son dossier pour qu'il corresponde à
   `nav.aboutPath`.
4. **Remplacer les médias.** Déposer les fichiers dans `public/media/` et mettre à
   jour les chemins `src` dans la config (`media.logo`, `media.heroImage`,
   `media.beforeAfter.<clé>.avant/apres`, `media.leaderPortrait`,
   `media.socialShareImage`). Tant qu'un média n'est pas définitif, laisser
   `isPlaceholder: true` : le site affichera un badge explicite plutôt que de
   faire passer une photo de stock pour une réalisation réelle. Le logo a besoin
   de deux valeurs supplémentaires (`aspectRatio`, `objectPosition`) pour le
   recadrage du mot-symbole dans le header - voir le commentaire sur `LogoMedia`
   dans `types.ts`.
5. **Définir `SITE_URL`** en variable d'environnement de production (sinon les
   URLs canoniques, Open Graph et le sitemap pointent vers `https://example.com`,
   le domaine réservé aux exemples).
6. **Vérifier et lancer les tests.**
   ```bash
   npm run build
   npm test
   ```

## Ce qui reste volontairement hors de cette config

- Les libellés de mentions légales eux-mêmes ("Éditeur :", "Hébergement :"...) sont
  du vocabulaire juridique français générique, pas du contenu d'entreprise : ils
  restent dans `app/prototype.tsx`. Seules les *valeurs* sont configurables.
- La forme du bouton de devis flottant (badge rond, couleurs, icône ✓) reste un choix
  visuel déjà validé dans `app/globals.css`. Son texte, lui, vient de
  `cta.stickyQuoteBadge` dans la config, posé en variables CSS
  (`--quote-badge-line1/2`) sur le bouton - changer le texte n'exige aucune
  modification de CSS ni de composant.
- `seo/seo.config.mjs` (utilisé par `npm run seo:audit`) est une configuration
  séparée pour l'outil de maintenance SEO interne, pas pour le site lui-même.
  Elle reste propre à T.A.F Qualité et n'a pas été reliée à ce dossier.
