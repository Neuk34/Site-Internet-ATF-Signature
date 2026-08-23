import { Prototype } from "./prototype";
import { siteConfig } from "./config";
import { buildHomeMetadata } from "./config/helpers";

export const metadata = buildHomeMetadata(siteConfig);

export default function Home() {
  return <Prototype initialPage="accueil" />;
}
