import { siteUrl } from "./site";

// Uniquement les 5 pages commerciales publiques — /boutons-devis et /boutons-contact
// restent noindex,nofollow (voir public/robots.txt) et hors sitemap.
export default function sitemap() {
  return ["", "/interieur", "/exterieur", "/bois", "/taf-qualite"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));
}
