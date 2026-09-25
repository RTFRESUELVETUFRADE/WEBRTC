import { LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Asterisco } from "@/components/Brand";
import { botonSecundario, contenedor, tituloSeccion } from "@/components/ui";
import { EQUIPO, SOCIOS } from "@/lib/contenido";
import { CIFRAS, CTA, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Trayectoria y equipo",
  description: `Estudio especializado en recuperar el pie de contratos de promesa. ${CIFRAS.casos} casos resueltos y relación con ${CIFRAS.inmobiliarias} inmobiliarias en Chile. Conoce al equipo.`,
  alternates: { canonical: "/trayectoria" },
};

const ESPECIALIDADES = [
  {
    titulo: "Resciliación de contratos de promesa",
    texto: "Acuerdos con la inmobiliaria para dejar sin efecto la promesa y recuperar lo pagado. Es la vía más rápida y la más frecuente en nuestra práctica.",
  },
  {
    titulo: "Cobro de garantías en venta en verde",
    texto: "Ejecución de la póliza o boleta que exige el artículo 138 bis de la Ley General de Urbanismo y Construcciones.",
  },
  {
    titulo: "Impugnación de cláusulas abusivas",
    texto: "Multas y retenciones desproporcionadas en contratos de adhesión, conforme a la Ley 19.496 de protección al consumidor.",
  },
  {
    titulo: "Representación ante SERNAC y tribunales",
    texto: "Cuando la negociación no basta, llevamos el caso por la vía que corresponda, con el mismo equipo que lo conoce desde el inicio.",
  },
];

export default function Trayectoria() {
  return (
    <>
      <header className="border-b border-gris-borde pt-14 pb-12 sm:pt-20 sm:pb-16">
        <div className={contenedor}>
          <h1 className="max-w-[20ch] text-[36px] leading-[1.05] font-extrabold tracking-[-0.015em] sm:text-[52px] lg:text-[60px]">
            Especialistas en recuperar el pie de contratos de promesa.
          </h1>
          <p className="mt-6 max-w-[58ch] text-[18px] leading-relaxed text-negro/80 sm:text-[20px]">
            Desde {SITE.fundacion} nos dedicamos a una sola materia: que quien firmó una promesa de compraventa y no
            pudo concretarla recupere lo que pagó.
          </p>
        </div>
      </header>

      <section className="py-16 sm:py-24" aria-labelledby="titulo-historia">
        <div className={`${contenedor} grid gap-12 lg:grid-cols-[1fr_minmax(0,640px)] lg:gap-20`}>
          <h2 id="titulo-historia" className={`${tituloSeccion} lg:sticky lg:top-28 lg:self-start`}>
            Cómo empezó
          </h2>
          <div className="space-y-6 text-[18px] leading-[1.7] text-negro/85">
            <p>
              RTC nació de un patrón que se repetía. Marcos Gundelach llevaba años trabajando y asesorando en el sector
              inmobiliario cuando vio el mismo síntoma una y otra vez: contratos de promesa que no llegaban a la
              escritura por razones ajenas al comprador (un crédito rechazado, una obra atrasada, un proyecto que
              cambió) y personas que, además, perdían el pie.
            </p>
            <p>
              En muchos de esos casos no se trataba solo de mala suerte. Había cláusulas redactadas para retener la
              totalidad del anticipo, garantías legales que no se constituyeron o que nadie explicó al comprador, y una
              asimetría evidente: la inmobiliaria redacta el contrato y el comprador lo firma sin poder negociarlo.
            </p>
            <p>
              En {SITE.fundacion} fundamos Resuelve Tu Contrato para hacernos cargo de ese problema de forma específica.
              Fuimos pioneros en tratar la recuperación del pie como una especialidad propia, y no como un caso más
              dentro de un estudio generalista. Hoy atendemos clientes en todo Chile.
            </p>
            <figure className="my-10 border-l-4 border-naranja py-1 pl-6">
              <blockquote className="font-display text-[26px] leading-[1.25] font-bold text-negro [font-stretch:82%] sm:text-[30px]">
                No vendemos la promesa de un resultado. Te damos certeza: saber exactamente en qué posición estás y qué
                puedes hacer.
              </blockquote>
            </figure>
            <p>
              Trabajamos como un estudio boutique. Cada caso tiene un equipo que lo conoce de principio a fin, te
              explica cada paso en lenguaje claro y te mantiene informado sin que tengas que perseguir respuestas. Es
              justo lo contrario de lo que muchos de nuestros clientes vivieron con su inmobiliaria.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gris-claro py-16 sm:py-24" aria-labelledby="titulo-equipo">
        <div className={contenedor}>
          <h2 id="titulo-equipo" className={tituloSeccion}>
            Quiénes llevan tu caso
          </h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:gap-12">
            {SOCIOS.map((s) => (
              <article key={s.nombre} className="revelar">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-gris-borde">
                  <Image
                    src={s.foto}
                    alt={`${s.nombre}, ${s.cargo} de Resuelve Tu Contrato`}
                    fill
                    sizes="(min-width: 1200px) 570px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[24px] leading-tight font-bold">{s.nombre}</h3>
                    <p className="mt-1 text-[16px] font-semibold text-naranja-texto">{s.cargo}</p>
                  </div>
                  <a
                    href={s.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Perfil de LinkedIn de ${s.nombre}`}
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-[6px] border border-gris-borde bg-blanco text-negro transition-colors hover:border-negro"
                  >
                    <LinkedinLogo size={22} aria-hidden="true" />
                  </a>
                </div>
                <p className="mt-3 max-w-[46ch] text-[17px] leading-relaxed text-negro/80">{s.bio}</p>
              </article>
            ))}
          </div>

          <ul className="mt-14 grid gap-6 border-t border-gris-borde pt-8 sm:grid-cols-3">
            {EQUIPO.map((p) => (
              <li key={p.nombre}>
                <p className="text-[19px] font-bold">{p.nombre}</p>
                <p className="text-[16px] text-gris-medio">{p.cargo}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 sm:py-24" aria-labelledby="titulo-contexto">
        <div className={contenedor}>
          <h2 id="titulo-contexto" className={`${tituloSeccion} max-w-[22ch]`}>
            Lo que hay detrás de las cifras
          </h2>
          <div className="mt-12 grid gap-x-16 gap-y-12 md:grid-cols-2">
            <div className="revelar">
              <p className="font-display text-[56px] leading-none font-extrabold text-accion [font-stretch:82%]">{CIFRAS.casos}</p>
              <p className="mt-2 text-[19px] font-bold">casos resueltos</p>
              <p className="mt-3 max-w-[48ch] text-[17px] leading-relaxed text-negro/80">
                Casos cerrados con un acuerdo o una resolución, no consultas. Ese volumen nos permite reconocer rápido
                qué causal aplica y qué vía funciona para cada tipo de contrato y de inmobiliaria.
              </p>
            </div>
            <div className="revelar">
              <p className="font-display text-[56px] leading-none font-extrabold text-accion [font-stretch:82%]">{CIFRAS.inmobiliarias}</p>
              <p className="mt-2 text-[19px] font-bold">inmobiliarias con las que negociamos</p>
              <p className="mt-3 max-w-[48ch] text-[17px] leading-relaxed text-negro/80">
                Conocemos a sus equipos y sus criterios. Por eso una solicitud bien fundada llega por el canal correcto
                y, en la mayoría de los casos, se resuelve sin juicio.
              </p>
            </div>
            <div className="revelar">
              <p className="font-display text-[56px] leading-none font-extrabold text-accion [font-stretch:82%]">
                {CIFRAS.rangoDevolucion}
              </p>
              <p className="mt-2 text-[19px] font-bold">del pie devuelto en los casos resueltos</p>
              <p className="mt-3 max-w-[48ch] text-[17px] leading-relaxed text-negro/80">
                En la mayoría, la devolución fue total. Es un dato histórico que no garantiza el resultado de un caso
                nuevo: cada contrato se evalúa por separado.
              </p>
            </div>
            <div className="revelar">
              <p className="font-display text-[56px] leading-none font-extrabold text-accion [font-stretch:82%]">2024</p>
              <p className="mt-2 text-[19px] font-bold">reconocimiento de Meta</p>
              <p className="mt-3 max-w-[48ch] text-[17px] leading-relaxed text-negro/80">
                Meta distinguió a RTC por innovación empresarial, como empresa que abrió una especialidad nueva en el mercado legal chileno.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gris-borde py-16 sm:py-24" aria-labelledby="titulo-especialidad">
        <div className={contenedor}>
          <h2 id="titulo-especialidad" className={tituloSeccion}>
            En qué trabajamos
          </h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {ESPECIALIDADES.map((e) => (
              <li key={e.titulo} className="revelar flex gap-4 rounded-[6px] border border-gris-borde p-6 sm:p-7">
                <Asterisco className="mt-1 size-5 shrink-0 text-naranja" />
                <div>
                  <h3 className="text-[19px] leading-snug font-bold sm:text-[21px]">{e.titulo}</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-negro/80">{e.texto}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link href="/#formulario" className={botonSecundario}>
              {CTA.principal}
            </Link>
            <p className="text-[16px] text-gris-medio">La primera reunión es gratuita y sin compromiso.</p>
          </div>
        </div>
      </section>
    </>
  );
}
