import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

/**
 * Piezas visuales de la campaña "Recupera tu IVA", tomadas del creativo B1 de Meta
 * (calendario abril a noviembre, banda de selección naranja y botón píldora), para que
 * quien llega desde el anuncio reconozca lo mismo que vio.
 */

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const ACTIVOS = new Set(["Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov"]);

export function CalendarioIva({ className = "" }: { className?: string }) {
  return (
    <ul
      aria-label="Meses de 2026 que cubre el beneficio: abril a noviembre"
      className={`grid grid-cols-6 gap-[clamp(6px,1vw,10px)] ${className}`}
    >
      {MESES.map((m) => {
        const on = ACTIVOS.has(m);
        return (
          <li
            key={m}
            aria-hidden="true"
            className={`flex aspect-[1.45] items-center justify-center rounded-[8px] border-2 border-naranja font-display text-[clamp(12px,1.35vw,20px)] font-extrabold tracking-[0.06em] uppercase ${
              on ? "bg-naranja text-blanco" : "text-naranja"
            }`}
          >
            {m}
          </li>
        );
      })}
    </ul>
  );
}

/** "Abril → noviembre" en el naranja de marca, condensado como en el creativo. */
export function RangoMeses({ className = "" }: { className?: string }) {
  return (
    <p
      className={`font-display leading-[0.95] font-extrabold tracking-[-0.035em] whitespace-nowrap text-naranja [font-stretch:78%] ${className}`}
    >
      Abril{" "}
      <ArrowRight weight="light" aria-hidden="true" className="inline-block size-[0.72em] align-[0.04em]" />
      <span className="sr-only">a</span> noviembre
    </p>
  );
}

/** Texto con la banda de selección y los dos "tiradores" del creativo. */
export function Resaltado({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block bg-banda px-[0.14em] pb-[0.06em] ${className}`}>
      <span aria-hidden="true" className="absolute top-[-0.2em] bottom-0 left-0 w-[3px] bg-naranja">
        <span className="absolute top-[-6px] left-1/2 size-3 -translate-x-1/2 rounded-full bg-naranja" />
      </span>
      <span aria-hidden="true" className="absolute top-0 right-0 bottom-[-0.2em] w-[3px] bg-naranja">
        <span className="absolute bottom-[-6px] left-1/2 size-3 -translate-x-1/2 rounded-full bg-naranja" />
      </span>
      {children}
    </span>
  );
}

/** Botón píldora del creativo: texto blanco sobre naranja con círculo blanco y flecha. */
export function BotonIva({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`group inline-flex min-h-14 items-center justify-between gap-4 rounded-full bg-naranja py-2 pr-2 pl-7 text-[17px] font-bold text-blanco transition-colors hover:bg-accion-hover sm:text-[18px] ${className}`}
    >
      {children}
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blanco text-naranja transition-transform duration-200 group-hover:translate-x-0.5">
        <ArrowRight size={20} weight="bold" aria-hidden="true" />
      </span>
    </Link>
  );
}
