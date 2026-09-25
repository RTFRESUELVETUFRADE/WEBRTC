import { Check } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, Preguntas, faqJsonLd } from "@/components/Preguntas";
import { botonPrimario, contenedor, tituloSeccion } from "@/components/ui";
import { GRUPOS_FAQ, PASOS, PREGUNTAS } from "@/lib/contenido";
import { CTA } from "@/lib/site";

export const metadata: Metadata = {
  title: "Metodología: cómo recuperamos el pie",
  description:
    "Revisión gratuita, negociación directa con la inmobiliaria y representación legal solo si hace falta. Preguntas frecuentes sobre plazos, costos y documentos para recuperar el pie.",
  alternates: { canonical: "/metodologia" },
};

const CLAVES = [
  "La primera etapa no cuesta nada y no te obliga a nada.",
  "La mayoría de los casos no llega a tribunales.",
  "Si llega, el mismo equipo te representa.",
];

export default function Metodologia() {
  return (
    <>
      <header className="border-b border-gris-borde pt-14 pb-12 sm:pt-20 sm:pb-16">
        <div className={contenedor}>
          <h1 className="max-w-[18ch] text-[36px] leading-[1.05] font-extrabold tracking-[-0.015em] sm:text-[52px] lg:text-[60px]">
            Recuperar el pie no tiene por qué ser un juicio de años.
          </h1>
          <p className="mt-6 max-w-[58ch] text-[18px] leading-relaxed text-negro/80 sm:text-[20px]">
            Trabajamos en tres etapas, y el litigio es la última, no la primera. Así funciona.
          </p>
        </div>
      </header>

      <section className="py-16 sm:py-24" aria-label="Etapas del proceso">
        <ol className={`${contenedor} grid gap-0`}>
          {PASOS.map((p, i) => (
            <li
              key={p.titulo}
              className="revelar grid gap-4 border-b border-gris-borde py-10 first:pt-0 last:border-b-0 md:grid-cols-[120px_minmax(0,1fr)_minmax(0,1fr)] md:gap-10"
            >
              <span className="font-display text-[64px] leading-none font-extrabold text-accion [font-stretch:82%] md:text-[80px]">
                {i + 1}
              </span>
              <h2 className="text-[26px] leading-tight font-bold sm:text-[32px]">{p.titulo}</h2>
              <p className="max-w-[56ch] text-[17px] leading-[1.7] text-negro/80 sm:text-[18px]">{p.largo}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-negro py-14 text-blanco sm:py-16" aria-label="Lo esencial">
        <ul className={`${contenedor} grid gap-6 md:grid-cols-3`}>
          {CLAVES.map((c) => (
            <li key={c} className="flex items-start gap-3 text-[19px] leading-snug font-semibold sm:text-[21px]">
              <Check size={26} weight="bold" className="mt-0.5 shrink-0 text-naranja" aria-hidden="true" />
              {c}
            </li>
          ))}
        </ul>
      </section>

      <section id="preguntas" className="py-16 sm:py-24" aria-labelledby="titulo-preguntas">
        <div className={contenedor}>
          <h2 id="titulo-preguntas" className={tituloSeccion}>
            Preguntas frecuentes
          </h2>
          <div className="mt-12 grid gap-14">
            {GRUPOS_FAQ.map((g, i) => (
              <div key={g} className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-12">
                <h3 className="text-[21px] font-bold lg:pt-5">{g}</h3>
                <Preguntas items={PREGUNTAS.filter((p) => p.grupo === g)} abrirPrimera={i === 0} />
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-[6px] bg-gris-claro p-7 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-10">
            <p className="text-[21px] leading-snug font-bold sm:text-[24px]">¿Tu pregunta no está aquí? Háznosla directamente.</p>
            <Link href="/#formulario" className={`${botonPrimario} mt-5 w-full sm:mt-0 sm:w-auto`}>
              {CTA.principal}
            </Link>
          </div>
        </div>
        <JsonLd data={faqJsonLd(PREGUNTAS)} />
      </section>
    </>
  );
}
