"use client";

import { List, X } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CTA } from "@/lib/site";
import { LogoRTC } from "./Brand";
import { contenedor } from "./ui";

const RUTAS = [
  { href: "/trayectoria", label: "Trayectoria" },
  { href: "/metodologia", label: "Metodología" },
];

export function SiteHeader() {
  const pathname = usePathname();
  // El menú queda asociado a la ruta en que se abrió: al navegar se cierra solo.
  const [abiertoEn, setAbiertoEn] = useState<string | null>(null);
  const abierto = abiertoEn === pathname;
  const setAbierto = (v: boolean | ((a: boolean) => boolean)) =>
    setAbiertoEn((typeof v === "function" ? v(abierto) : v) ? pathname : null);

  useEffect(() => {
    if (!abierto) return;
    const alEscape = (e: KeyboardEvent) => e.key === "Escape" && setAbiertoEn(null);
    window.addEventListener("keydown", alEscape);
    return () => window.removeEventListener("keydown", alEscape);
  }, [abierto]);

  return (
    <header className="sticky top-0 z-30 border-b border-gris-borde bg-blanco/95 backdrop-blur supports-[backdrop-filter]:bg-blanco/85">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-[6px] focus:bg-negro focus:px-4 focus:py-2 focus:text-blanco"
      >
        Saltar al contenido
      </a>
      <div className={`${contenedor} flex h-16 items-center justify-between gap-4 lg:h-[72px]`}>
        <Link href="/" className="flex items-center gap-3 text-negro" aria-label="Resuelve Tu Contrato, inicio">
          <LogoRTC className="h-7 w-auto text-naranja lg:h-8" title="" />
          <span className="hidden border-l border-gris-borde pl-3 text-[13px] leading-tight font-semibold sm:block">
            Resuelve Tu Contrato
            <span className="block font-normal text-gris-medio">Abogados inmobiliarios</span>
          </span>
        </Link>

        <nav aria-label="Principal" className="flex items-center gap-2 lg:gap-8">
          <ul className="hidden items-center gap-8 md:flex">
            {RUTAS.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  aria-current={pathname === r.href ? "page" : undefined}
                  className="text-[15px] font-medium text-negro underline-offset-8 decoration-2 decoration-naranja hover:underline aria-[current=page]:underline"
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={pathname === "/formulario-campanas" ? "#formulario" : "/#formulario"}
            className="inline-flex min-h-11 items-center rounded-[6px] bg-accion px-4 text-[15px] font-bold whitespace-nowrap text-blanco transition-colors hover:bg-accion-hover sm:px-5"
          >
            {CTA.nav}
          </Link>
          <button
            type="button"
            className="-mr-2 inline-flex size-11 items-center justify-center md:hidden"
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setAbierto((v) => !v)}
          >
            {abierto ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
          </button>
        </nav>
      </div>

      <div id="menu-movil" hidden={!abierto} className="border-t border-gris-borde bg-blanco md:hidden">
        <ul className={`${contenedor} py-2`}>
          {[{ href: "/", label: "Inicio" }, ...RUTAS].map((r) => (
            <li key={r.href}>
              <Link href={r.href} className="flex min-h-12 items-center text-[17px] font-medium">
                {r.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
