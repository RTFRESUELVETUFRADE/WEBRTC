import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { PASOS } from "@/lib/contenido";
import { contenedor, tituloSeccion } from "../ui";

export function MetodoResumen() {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="titulo-metodo">
      <div className={contenedor}>
        <h2 id="titulo-metodo" className={`${tituloSeccion} max-w-[20ch]`}>
          La mayoría de los casos no llega a tribunales.
        </h2>
        <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed text-gris-medio">
          Trabajamos en tres etapas. El juicio existe como respaldo, no como punto de partida.
        </p>

        <div className="relative mt-12">
          {/* Línea que conecta las etapas en escritorio */}
          <span aria-hidden="true" className="absolute top-[30px] right-[8%] left-[8%] hidden h-px bg-gris-borde lg:block" />
          <ol className="grid gap-10 lg:grid-cols-3 lg:gap-12">
          {PASOS.map((p, i) => (
            <li key={p.titulo} className="revelar relative grid grid-cols-[auto_1fr] gap-x-5 lg:block">
              <span className="font-display relative flex size-[60px] items-center justify-center rounded-full border border-gris-borde bg-blanco text-[28px] font-extrabold text-accion [font-stretch:82%]">
                {i + 1}
              </span>
              <div className="lg:mt-6">
                <h3 className="text-[21px] leading-snug font-bold sm:text-[24px]">{p.titulo}</h3>
                <p className="mt-2 max-w-[38ch] text-[16px] leading-relaxed text-gris-medio sm:text-[17px]">{p.corto}</p>
              </div>
            </li>
          ))}
          </ol>
        </div>

        <Link
          href="/metodologia"
          className="mt-12 inline-flex items-center gap-2 text-[16px] font-semibold text-naranja-texto underline decoration-2 underline-offset-4 decoration-naranja-texto/30 hover:decoration-naranja-texto"
        >
          Ver la metodología completa
          <ArrowRight size={18} weight="bold" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
