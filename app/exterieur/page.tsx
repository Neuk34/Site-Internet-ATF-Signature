import { Prototype } from "../prototype";
import { siteConfig } from "../config";
import { buildServiceMetadata } from "../config/helpers";

export const metadata = buildServiceMetadata(siteConfig, "exterieur");

export default function Page() {
  return <Prototype initialPage="exterieur" />;
}
