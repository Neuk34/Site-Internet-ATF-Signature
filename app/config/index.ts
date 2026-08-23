import { atfSignatureConfig } from "./atf-signature.config.ts";

/**
 * Point de bascule unique : pour générer un nouveau site à partir de ce gabarit,
 * dupliquez app/config/atf-signature.config.ts (voir app/config/examples/ pour un
 * squelette) et changez les deux lignes ci-dessous pour pointer vers votre fichier.
 * Rien d'autre dans le code n'a besoin de changer.
 */
export const siteConfig = atfSignatureConfig;

/**
 * Chemin (relatif à la racine du dépôt) du fichier importé ci-dessus. seo/seo.config.mjs
 * s'en sert pour savoir où lib/update.mjs doit chercher/écrire un title ou une description
 * lors d'un META_UPDATE - une seule ligne à tenir à jour avec siteConfig, plutôt que de
 * recopier ce chemin une seconde fois dans l'outil SEO.
 */
export const activeConfigFile = "app/config/atf-signature.config.ts";

export * from "./types.ts";
