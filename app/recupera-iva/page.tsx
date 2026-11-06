import { Check } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import { Asterisco } from "@/components/Brand";
import { FormularioIva } from "@/components/iva/FormularioIva";
import { BotonIva, CalendarioIva, RangoMeses, Resaltado } from "@/components/iva/Piezas";
import { JsonLd, Preguntas, faqJsonLd } from "@/components/Preguntas";
import { contenedor, tituloSeccion } from "@/components/ui";
import type { Pregunta } from "@/lib/contenido";
import { CIFRAS } from "@/lib/site";

/*
 * Campaña transitoria "Recupera tu IVA" (Ley 21.850). Los enunciados legales de esta página
 * deben ser validados por el equipo jurídico de RTC antes de cada cambio de campaña.
 */

export const metadata: Metadata = {
  title: "Recupera el IVA de tu vivienda nueva (Ley 21.850)",
  description:
    "Si escrituraste tu casa o departamento nuevo entre el 22 de abril y el 30 de noviembre de 2026, el IVA puede devolverse. Revisamos tu caso en una reunión gratuita.",
  alternates: { canonical: "/recupera-iva" },
};

const BENEFICIO = [
  {
    titulo: "Qué establece la ley",
    texto:
      "La Ley 21.850 contempla la devolución del IVA en la primera venta de viviendas nuevas escrituradas entre el 22 de abril y el 30 de noviembre de 2026.",
  },
  {
    titulo: "Cómo llega a ti",
    texto:
      "La devolución pasa por la inmobiliaria: es ella quien debe restituirte el IVA de la operación y luego solicitar su reembolso al SII. No ocurre sola; hay que pedirla y, muchas veces, negociarla.",
  },
  {
    titulo: "Por qué revisar tu contrato",
    texto:
      "Muchas promesas dicen que el precio es final aunque cambie el IVA, o no mencionan esta devolución. Lo que digan tu promesa y tu escritura define cómo se negocia.",
  },
];

const REQUISITOS = [
  "Es una vivienda nueva y fue su primera venta.",
  "La escritura se firmó entre el 22 de abril y el 30 de noviembre de 2026.",
  "El proyecto cuenta con recepción municipal.",
  "Tienes a mano tu promesa y tu escritura, o podemos ayudarte a conseguirlas.",
];

const PASOS = [
  {
    titulo: "Reunión previa gratuita",
    texto: "Revisamos tu escritura y tu promesa contigo. Sin costo y sin compromiso: terminas sabiendo si la devolución aplica a tu caso.",
  },
  {
    titulo: "Calificación",
    texto: "Confirmamos los requisitos y qué monto está en juego. Si tu caso califica, te explicamos nuestros honorarios antes de avanzar.",
  },
  {
    titulo: "Negociación y representación",
    texto: `Gestionamos la solicitud ante la inmobiliaria y te representamos hasta que la devolución se concrete. Negociamos habitualmente con ${CIFRAS.inmobiliarias} inmobiliarias.`,
  },
];

const PREGUNTAS_IVA: Pregunta[] = [
  {
    id: "aun-no-escrituro",
    grupo: "IVA",
    pregunta: "¿Y si todavía no escrituro?",
    respuesta: [
      "Desde el 1 de diciembre de 2026 rige por un año una exención transitoria del IVA para viviendas nuevas, pero es opcional para la inmobiliaria: no es automática.",
      "Si estás por firmar, conviene revisar antes qué dice tu promesa sobre el IVA. Esa conversación también es gratuita.",
    ],
  },
  {
    id: "costo-iva",
    grupo: "IVA",
    pregunta: "¿Cuánto cuesta el servicio?",
    respuesta: [
      "La primera reunión es gratuita y no te compromete a nada. Si tu caso califica y decides avanzar, te explicamos los honorarios antes de que firmes cualquier cosa.",
    ],
  },
  {
    id: "distancia-iva",
    grupo: "IVA",
    pregunta: "¿Tengo que ir a la oficina?",
    respuesta: [
      "No. La reunión es por videollamada y los documentos se envían en forma digital. Atendemos casos en todo Chile.",
    ],
  },
  {
    id: "pie-iva",
    grupo: "IVA",
    pregunta: "¿Esto tiene relación con recuperar el pie?",
    respuesta: [
      "Es el mismo trabajo de fondo: revisar tu contrato inmobiliario y hacer valer lo que te corresponde frente a la inmobiliaria. Si además tienes problemas con una promesa, también lo vemos en la reunión.",
    ],
  },
];

export default function RecuperaIva() {
  return (
    <>
      <section className="bg-crema text-tinta">
        <div className={`${contenedor} grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16`}>
          <div>
            <p className="text-[13px] font-semibold tracking-[0.12em] uppercase">Ley 21.850 · Vivienda nueva</p>
            <h1 className="mt-5 text-[38px] leading-[1.04] font-extrabold tracking-[-0.02em] sm:text-[54px] lg:text-[62px]">
              Recupera el IVA de tu <Resaltado>vivienda nueva.</Resaltado>
            </h1>
            <p className="mt-6 max-w-[54ch] text-[18px] leading-relaxed text-tinta/85 sm:text-[19px]">
              Si escrituraste tu casa o departamento nuevo entre el 22 de abril y el 30 de noviembre de 2026, el IVA de la
              compra puede devolverse. Revisamos tu caso en una reunión gratuita.
            </p>
            <BotonIva href="#formulario-iva" className="mt-8 w-full sm:w-auto">
              Agenda tu reunión gratuita
            </BotonIva>
          </div>
          <div className="lg:pl-4">
            <CalendarioIva />
            <RangoMeses className="mt-6 text-[clamp(44px,6vw,84px)]" />
            <p className="mt-3 text-[15px] text-tinta/70">Escrituras firmadas en 2026, de abril a noviembre.</p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24" aria-labelledby="titulo-beneficio">
        <div className={contenedor}>
          <h2 id="titulo-beneficio" className={`${tituloSeccion} max-w-[24ch]`}>
            De qué se trata el beneficio
          </h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {BENEFICIO.map((b) => (
              <li key={b.titulo} className="revelar flex gap-4 rounded-[6px] border border-gris-borde p-6 sm:p-7 md:flex-col md:gap-5">
                <Asterisco className="mt-1 size-5 shrink-0 text-naranja md:mt-0" />
                <div>
                  <h3 className="text-[20px] leading-snug font-bold sm:text-[22px]">{b.titulo}</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-negro/80">{b.texto}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-14 rounded-[6px] bg-gris-claro p-7 sm:p-10">
            <h3 className="text-[22px] font-bold sm:text-[26px]">Lo que revisamos para saber si tu caso califica</h3>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {REQUISITOS.map((r) => (
                <li key={r} className="flex items-start gap-3 text-[17px] leading-snug">
                  <Check size={22} weight="bold" className="mt-0.5 shrink-0 text-naranja-texto" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[14px] leading-relaxed text-gris-medio">
              Cada caso se evalúa por separado. El resultado depende de tu contrato, del proyecto y de la inmobiliaria.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-negro py-16 text-blanco sm:py-24" aria-labelledby="titulo-servicio">
        <div className={contenedor}>
          <h2 id="titulo-servicio" className="max-w-[22ch] text-[28px] leading-[1.1] font-bold sm:text-[40px]">
            Cómo trabajamos tu devolución
          </h2>
          <ol className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-12">
            {PASOS.map((p, i) => (
              <li key={p.titulo} className="revelar border-t border-blanco/20 pt-6">
                <span className="font-display text-[56px] leading-none font-extrabold text-naranja [font-stretch:82%]">{i + 1}</span>
                <h3 className="mt-4 text-[22px] leading-snug font-bold sm:text-[24px]">{p.titulo}</h3>
                <p className="mt-2 max-w-[40ch] text-[16px] leading-relaxed text-blanco/80 sm:text-[17px]">{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="formulario-iva" className="border-b border-gris-borde bg-gris-claro py-12 sm:py-20" aria-labelledby="titulo-form-iva">
        <div className={`${contenedor} grid gap-8 lg:grid-cols-[0.8fr_1fr] lg:gap-16`}>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 id="titulo-form-iva" className={tituloSeccion}>
              Agenda tu reunión gratuita
            </h2>
            <p className="mt-4 max-w-[46ch] text-[17px] leading-relaxed text-negro/80">
              Completa el formulario y nuestro equipo legal se contactará contigo a la brevedad para revisar, sin costo, si
              la devolución del IVA aplica a tu propiedad.
            </p>
            <ul className="mt-6 grid gap-3 border-t border-gris-borde pt-6 text-[15px]">
              <li><strong>{CIFRAS.casos}</strong> casos inmobiliarios resueltos</li>
              <li><strong>{CIFRAS.inmobiliarias}</strong> inmobiliarias con las que negociamos</li>
              <li>Reunión por videollamada, en todo Chile</li>
            </ul>
          </div>
          <div className="rounded-[6px] border border-gris-borde bg-blanco p-5 shadow-[0_2px_12px_rgba(26,26,26,0.04)] sm:p-8">
            <FormularioIva />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24" aria-labelledby="titulo-dudas-iva">
        <div className={`${contenedor} grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16`}>
          <h2 id="titulo-dudas-iva" className={tituloSeccion}>
            Preguntas frecuentes
          </h2>
          <Preguntas items={PREGUNTAS_IVA} />
        </div>
        <JsonLd data={faqJsonLd(PREGUNTAS_IVA)} />
      </section>
    </>
  );
}
