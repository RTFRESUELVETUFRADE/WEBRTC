import { Plus } from "@phosphor-icons/react/dist/ssr";
import type { Pregunta } from "@/lib/contenido";

/** Acordeón nativo (<details>): accesible, funciona sin JS y el contenido es indexable. */
export function Preguntas({ items, abrirPrimera = true }: { items: Pregunta[]; abrirPrimera?: boolean }) {
  return (
    <div className="border-t border-gris-borde">
      {items.map((p, i) => (
        <details key={p.id} id={p.id} open={abrirPrimera && i === 0} className="group border-b border-gris-borde">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-[18px] leading-snug font-semibold marker:hidden sm:text-[20px] [&::-webkit-details-marker]:hidden">
            {p.pregunta}
            <Plus
              size={22}
              weight="bold"
              aria-hidden="true"
              className="shrink-0 text-accion transition-transform duration-200 group-open:rotate-45"
            />
          </summary>
          <div className="max-w-[68ch] space-y-4 pb-7 text-[16px] leading-relaxed text-negro/80 sm:text-[17px]">
            {p.respuesta.map((parrafo) => (
              <p key={parrafo.slice(0, 32)}>{parrafo}</p>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

export function faqJsonLd(items: Pregunta[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((p) => ({
      "@type": "Question",
      name: p.pregunta,
      acceptedAnswer: { "@type": "Answer", text: p.respuesta.join(" ") },
    })),
  };
}

/** Inserta JSON-LD escapando "<" para evitar inyección (guía oficial de Next.js). */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
