"use client";

import { ArrowRight, Bank, Briefcase, FirstAidKit, HourglassMedium, Ruler, Scales } from "@phosphor-icons/react";
import { CAUSALES, type Causal } from "@/lib/contenido";
import { contenedor, tituloSeccion } from "../ui";

const ICONOS = { Bank, Briefcase, FirstAidKit, HourglassMedium, Ruler, Scales } satisfies Record<Causal["icono"], unknown>;

export const EVENTO_CAUSAL = "rtc:causal";

/** Lleva al formulario con la causal ya escrita en "Cuéntanos tu caso". */
function elegir(causal: Causal) {
  window.dispatchEvent(new CustomEvent(EVENTO_CAUSAL, { detail: causal.prellenado }));
  const destino = document.getElementById("formulario");
  destino?.scrollIntoView({ block: "start" });
  history.replaceState(null, "", "#formulario");
}

export function Causales() {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="titulo-causales">
      <div className={contenedor}>
        <h2 id="titulo-causales" className={`${tituloSeccion} max-w-[22ch]`}>
          ¿Cuál de estas situaciones es la tuya?
        </h2>
        <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed text-gris-medio">
          Son las causales más frecuentes en nuestros casos. Elige la tuya y te llevamos directo al formulario.
        </p>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {CAUSALES.map((c) => {
            const Icono = ICONOS[c.icono];
            return (
              <li key={c.id} className="revelar">
                <button
                  type="button"
                  onClick={() => elegir(c)}
                  className="group flex h-full w-full flex-col items-start rounded-[6px] border border-gris-borde bg-blanco p-4 text-left transition-[border-color,box-shadow] duration-200 hover:border-negro hover:shadow-[0_6px_24px_rgba(26,26,26,0.08)] sm:p-6"
                >
                  <Icono size={32} weight="light" className="text-accion" aria-hidden="true" />
                  <span className="mt-4 text-[16px] leading-snug font-bold sm:text-[19px]">{c.titulo}</span>
                  <span className="mt-2 text-[14px] leading-relaxed text-gris-medio sm:text-[16px]">{c.apoyo}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[14px] font-semibold text-naranja-texto">
                    Es mi caso
                    <ArrowRight size={16} weight="bold" className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
