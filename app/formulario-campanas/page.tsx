import type { Metadata } from "next";
import { Formulario } from "@/components/home/Formulario";

/**
 * Página de aterrizaje para anuncios: solo el formulario (y Calendly tras el envío).
 * No aparece en el menú, el footer ni el sitemap, y los buscadores no la indexan.
 */
export const metadata: Metadata = {
  title: "Cuéntanos tu caso",
  description: "Formulario de evaluación de contratos de promesa. Primera reunión gratuita y sin compromiso.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/formulario-campanas" },
};

export default function FormularioCampanas() {
  return <Formulario variante="campana" />;
}
