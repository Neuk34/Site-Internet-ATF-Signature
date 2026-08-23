// Domaine de production réel inconnu à ce stade (prototype non encore mis en ligne).
// SITE_URL sera défini en variable d'environnement une fois le vrai domaine choisi ;
// "https://example.com" est le domaine réservé aux exemples/placeholders (RFC 2606),
// jamais une affirmation sur T.A.F Qualité.
export const siteUrl = process.env.SITE_URL ?? "https://example.com";
