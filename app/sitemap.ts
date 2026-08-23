import { siteConfig } from "./config";
import { publicPaths } from "./config/helpers";

// Uniquement les pages commerciales publiques - /boutons-devis et /boutons-contact
// restent noindex,nofollow (voir public/robots.txt) et hors sitemap.
export default function sitemap() {
  return publicPaths(siteConfig).map((path) => ({
    url: `${siteConfig.seo.siteUrl}${path}`,
    lastModified: new Date(),
  }));
}
