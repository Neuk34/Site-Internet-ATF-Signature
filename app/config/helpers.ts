import type { Metadata } from "next";
import type { BeforeAfterMedia, ContactInfo, ServiceDefinition, SiteConfig } from "./types.ts";

export function findService(config: SiteConfig, key: string): ServiceDefinition {
  const service = config.services.find((entry) => entry.key === key);
  if (!service) throw new Error(`Unknown service key "${key}" - check app/config/*.config.ts`);
  return service;
}

export function getBeforeAfterMedia(config: SiteConfig, mediaKey: string): BeforeAfterMedia {
  const media = config.media.beforeAfter[mediaKey];
  if (!media) throw new Error(`No media.beforeAfter["${mediaKey}"] configured - check app/config/*.config.ts`);
  return media;
}

/** "3" -> "03" - numérotation à deux chiffres utilisée dans les listes du site. */
export function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function buildWhatsappUrl(contact: ContactInfo): string {
  const base = contact.whatsappNumber ? `https://wa.me/${contact.whatsappNumber}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(contact.whatsappMessage)}`;
}

function absoluteUrl(config: SiteConfig, path: string): string {
  return `${config.seo.siteUrl}${path}`;
}

/** Metadata Next.js pour l'accueil ("/"). */
export function buildHomeMetadata(config: SiteConfig): Metadata {
  return {
    title: config.business.homeMeta.title,
    description: config.business.homeMeta.description,
    alternates: { canonical: "/" },
  };
}

/** Metadata Next.js pour une page de service (ex. /interieur). */
export function buildServiceMetadata(config: SiteConfig, key: string): Metadata {
  const service = findService(config, key);
  return {
    title: service.meta.title,
    description: service.meta.description,
    alternates: { canonical: `/${service.key}` },
  };
}

/** Metadata Next.js pour la page "à propos" (dirigeant / entreprise). */
export function buildAboutMetadata(config: SiteConfig): Metadata {
  return {
    title: config.about.meta.title,
    description: config.about.meta.description,
    alternates: { canonical: config.nav.aboutPath },
  };
}

/** Toutes les URLs des pages commerciales publiques, pour le sitemap. */
export function publicPaths(config: SiteConfig): string[] {
  return ["", ...config.services.map((service) => `/${service.key}`), config.nav.aboutPath];
}

export function siteMetadataBase(config: SiteConfig): Metadata {
  return {
    title: config.business.homeMeta.title,
    description: config.business.homeMeta.description,
    metadataBase: new URL(config.seo.siteUrl),
    openGraph: {
      siteName: config.business.name,
      locale: config.seo.ogLocale,
      type: "website",
      images: [
        {
          url: config.media.socialShareImage.src,
          width: 1536,
          height: 1024,
          alt: config.media.socialShareImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [config.media.socialShareImage.src],
    },
  };
}

export { absoluteUrl };
