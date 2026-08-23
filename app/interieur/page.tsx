import { Prototype } from "../prototype";
import { siteConfig } from "../config";
import { buildServiceMetadata } from "../config/helpers";

export const metadata = buildServiceMetadata(siteConfig, "interieur");

export default function Page() {
  return <Prototype initialPage="interieur" />;
}
