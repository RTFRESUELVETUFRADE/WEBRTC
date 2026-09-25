import { ArrowUpRight, InstagramLogo, Quotes } from "@phosphor-icons/react/dist/ssr";
import { TESTIMONIOS } from "@/lib/contenido";
import { SITE } from "@/lib/site";
import { contenedor, tituloSeccion } from "../ui";

type T = (typeof TESTIMONIOS)[number];

function EnlaceReel({ t }: { t: T }) {
  return (
    <a
      href={t.reel}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-6 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-negro underline decoration-negro/25 underline-offset-4 hover:decoration-negro"
    >
      <InstagramLogo size={20} aria-hidden="true" />
      Ver su testimonio en video
      <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
      <span className="sr-only">(abre Instagram en una pestaña nueva)</span>
    </a>
  );
}

function Firma({ t }: { t: T }) {
  return (
    <figcaption className="mt-6 text-[15px] leading-snug">
      <span className="block font-bold">
        {t.nombre}
        {"lugar" in t && <span className="font-normal text-gris-medio">, {t.lugar}</span>}
      </span>
      <span className="text-gris-medio">{t.caso}</span>
    </figcaption>
  );
}

export function Testimonios() {
  const [destacado, ...resto] = TESTIMONIOS;
  return (
    <section className="bg-gris-claro py-16 sm:py-24" aria-labelledby="titulo-testimonios">
      <div className={contenedor}>
        <h2 id="titulo-testimonios" className={`${tituloSeccion} max-w-[30ch]`}>
          Lo cuentan nuestros clientes, en sus propias palabras.
        </h2>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1.25fr_1fr] lg:gap-6">
          <figure className="revelar flex flex-col rounded-[6px] bg-negro p-7 text-blanco sm:p-10">
            <Quotes size={40} weight="fill" className="text-naranja" aria-hidden="true" />
            <blockquote className="mt-6 text-[21px] leading-[1.45] font-medium sm:text-[25px]">
              “{destacado.cita}”
            </blockquote>
            <div className="mt-auto [&_.text-gris-medio]:text-blanco/65 [&_a]:text-blanco [&_a]:decoration-blanco/30">
              <Firma t={destacado} />
              <EnlaceReel t={destacado} />
            </div>
          </figure>

          <div className="grid gap-4 lg:gap-6">
            {resto.map((t) => (
              <figure key={t.nombre} className="revelar flex flex-col rounded-[6px] border border-gris-borde bg-blanco p-7">
                <blockquote className="text-[17px] leading-relaxed">“{t.cita}”</blockquote>
                <Firma t={t} />
                <EnlaceReel t={t} />
              </figure>
            ))}
          </div>
        </div>

        <p className="mt-8 text-[15px] text-gris-medio">
          Testimonios publicados con autorización en{" "}
          <a href={SITE.redes.instagram} target="_blank" rel="noopener noreferrer" className="font-semibold text-negro underline underline-offset-2">
            @resuelvetucontrato
          </a>
          .
        </p>
      </div>
    </section>
  );
}
