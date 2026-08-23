import { Prototype } from "../prototype";
import { siteConfig } from "../config";
import { buildAboutMetadata } from "../config/helpers";

export const metadata = buildAboutMetadata(siteConfig);

export default function Page() {
  return <Prototype initialPage="atf-signature" />;
}
