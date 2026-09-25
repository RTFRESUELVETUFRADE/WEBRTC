import type { Metadata, Viewport } from "next";
import { Archivo, Source_Sans_3 } from "next/font/google";
import { CookieConsent } from "@/components/CookieConsent";
import { OcultarEn } from "@/components/OcultarEn";
import { JsonLd } from "@/components/Preguntas";
import { PreFooter, SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE } from "@/lib/site";
import "./globals.css";

// Titulares: Archivo con eje de ancho (semi condensada, como los creativos de campaña).
const titulo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-titulo", display: "swap" });
// Cuerpo: sans humanista muy legible en móvil.
const texto = Source_Sans_3({ subsets: ["latin"], variable: "--font-texto", display: "swap" });

const DESCRIPCION =
  "Abogados especialistas en contratos de promesa de compraventa. Recuperamos el pie ante rechazo de crédito, atraso en la entrega o cambio de condiciones. Primera reunión sin costo.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Recupera el pie de tu departamento | Resuelve Tu Contrato",
    template: "%s | Resuelve Tu Contrato",
  },
  description: DESCRIPCION,
  applicationName: SITE.nombre,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: SITE.nombre,
    title: "Recuperamos el pie atrapado en tu contrato de promesa",
    description: DESCRIPCION,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
  width: "device-width",
  initialScale: 1,
};

const organizacion = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  "@id": `${SITE.url}/#estudio`,
  name: SITE.nombre,
  alternateName: SITE.sigla,
  legalName: SITE.razonSocial,
  taxID: SITE.rut,
  description: DESCRIPCION,
  url: SITE.url,
  logo: `${SITE.url}/icon.png`,
  image: `${SITE.url}/img/hero-escritorio.jpg`,
  email: SITE.correo,
  telephone: `+${SITE.whatsapp.e164}`,
  foundingDate: String(SITE.fundacion),
  areaServed: { "@type": "Country", name: "Chile" },
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.direccion.calle,
    addressLocality: SITE.direccion.comuna,
    addressRegion: SITE.direccion.region,
    addressCountry: SITE.direccion.pais,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  knowsAbout: [
    "Contrato de promesa de compraventa",
    "Resciliación de contratos",
    "Devolución del pie inmobiliario",
    "Garantía artículo 138 bis LGUC",
    "Ley 19.496 de protección al consumidor",
  ],
  sameAs: [SITE.redes.instagram, SITE.redes.facebook],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-CL" className={`${titulo.variable} ${texto.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <JsonLd data={organizacion} />
        <SiteHeader />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <OcultarEn rutas={["/formulario-campanas"]}>
          <PreFooter />
        </OcultarEn>
        <SiteFooter />
        <CookieConsent />
      </body>
    </html>
  );
}
