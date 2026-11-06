"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Children, useRef, useState } from "react";

/**
 * Carrusel del hero. Sin avance automático (el contenido debe estar quieto para leerse):
 * cambia con las flechas, los puntos, el teclado o deslizando el dedo.
 * Las láminas se apilan en la misma celda de grilla, así el alto es el de la más alta y nada salta.
 */
export function HeroCarrusel({ nombres, className, children }: { nombres: string[]; className: string; children: React.ReactNode }) {
  const laminas = Children.toArray(children);
  const n = laminas.length;
  const [actual, setActual] = useState(0);
  const inicioX = useRef<number | null>(null);

  const ir = (k: number) => setActual(((k % n) + n) % n);

  const flecha =
    "absolute top-1/2 z-20 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-blanco/40 bg-negro/30 text-blanco backdrop-blur-sm transition-colors hover:bg-negro/55 md:flex";

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Destacados"
      className={`relative grid overflow-x-clip ${className}`}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") ir(actual + 1);
        if (e.key === "ArrowLeft") ir(actual - 1);
      }}
      onTouchStart={(e) => (inicioX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (inicioX.current === null) return;
        const dx = e.changedTouches[0].clientX - inicioX.current;
        inicioX.current = null;
        if (Math.abs(dx) > 50) ir(actual + (dx < 0 ? 1 : -1));
      }}
    >
      {laminas.map((lamina, k) => {
        const activa = k === actual;
        return (
          <div
            key={k}
            role="group"
            aria-roledescription="lámina"
            aria-label={`${k + 1} de ${n}: ${nombres[k]}`}
            aria-hidden={!activa}
            inert={!activa}
            className={`flex flex-col [grid-area:1/1] transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              activa ? "z-10 translate-x-0 opacity-100" : `pointer-events-none opacity-0 ${k < actual ? "-translate-x-6" : "translate-x-6"}`
            }`}
          >
            {lamina}
          </div>
        );
      })}

      <button type="button" aria-label="Lámina anterior" onClick={() => ir(actual - 1)} className={`${flecha} left-4 lg:left-6`}>
        <CaretLeft size={22} weight="bold" aria-hidden="true" />
      </button>
      <button type="button" aria-label="Lámina siguiente" onClick={() => ir(actual + 1)} className={`${flecha} right-4 lg:right-6`}>
        <CaretRight size={22} weight="bold" aria-hidden="true" />
      </button>

      {/* Puntos: arriba al centro en móvil (sobre la foto, lejos del texto), abajo en escritorio. */}
      <div className="absolute top-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full bg-negro/35 p-1 backdrop-blur-sm md:top-auto md:bottom-[84px]">
        {laminas.map((_, k) => (
          <button
            key={k}
            type="button"
            aria-label={`Ver lámina ${k + 1}: ${nombres[k]}`}
            aria-current={k === actual ? "true" : undefined}
            onClick={() => ir(k)}
            className="flex size-7 items-center justify-center"
          >
            <span
              className={`block h-2 rounded-full transition-[width,background-color] duration-300 ${
                k === actual ? "w-6 bg-blanco" : "w-2 bg-blanco/55"
              }`}
            />
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Lámina {actual + 1} de {n}: {nombres[actual]}
      </p>
    </section>
  );
}
