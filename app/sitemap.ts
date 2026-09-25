import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const rutas: [string, number][] = [
    ["", 1],
    ["/metodologia", 0.8],
    ["/trayectoria", 0.8],
    ["/privacidad", 0.3],
  ];
  return rutas.map(([ruta, priority]) => ({
    url: `${SITE.url}${ruta}`,
    lastModified: new Date("2026-09-25"),
    changeFrequency: "monthly",
    priority,
  }));
}
