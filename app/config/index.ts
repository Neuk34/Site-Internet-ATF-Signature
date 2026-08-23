import { tafQualiteConfig } from "./taf-qualite.config.ts";

/**
 * Point de bascule unique : pour générer un nouveau site à partir de ce gabarit,
 * dupliquez app/config/taf-qualite.config.ts (voir app/config/examples/ pour un
 * squelette) et changez uniquement la ligne ci-dessous pour pointer vers votre
 * fichier. Rien d'autre dans le code n'a besoin de changer.
 */
export const siteConfig = tafQualiteConfig;

export * from "./types.ts";
