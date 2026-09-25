"use client";

import { CalendarBlank } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { CTA, SITE } from "@/lib/site";
import { CLAVE_AGENDA, registrar } from "@/lib/registro-local";
import { evento, eventoPersonalizado } from "@/lib/tracking";
import { botonPrimario } from "../ui";

const SCRIPT = "https://assets.calendly.com/assets/external/widget.js";

declare global {
  interface Window {
    Calendly?: { initInlineWidget: (o: { url: string; parentElement: HTMLElement; prefill?: object }) => void };
  }
}

/**
 * Calendly embebido, cargado solo al hacer clic (no pesa en la carga del home).
 * Mide la intención (clic) y, cuando Calendly lo informa, la reserva real.
 */
export function AgendaCalendly({ nombre, correo }: { nombre: string; correo: string }) {
  const [abierto, setAbierto] = useState(false);
  const [fallo, setFallo] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const alMensaje = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com") return;
      if ((e.data as { event?: string })?.event !== "calendly.event_scheduled") return;
      evento("Schedule");
      // Pequeña pausa para que la persona alcance a ver la confirmación de Calendly.
      setTimeout(() => registrar(CLAVE_AGENDA), 4000);
    };
    window.addEventListener("message", alMensaje);
    return () => window.removeEventListener("message", alMensaje);
  }, []);

  useEffect(() => {
    if (!abierto || !contenedor.current) return;
    const url = `${SITE.calendly}?hide_gdpr_banner=1&primary_color=c84a12&text_color=1a1a1a`;
    const iniciar = () => {
      if (!window.Calendly || !contenedor.current) return setFallo(true);
      window.Calendly.initInlineWidget({ url, parentElement: contenedor.current, prefill: { name: nombre, email: correo } });
    };
    if (window.Calendly) return iniciar();
    const s = document.createElement("script");
    s.src = SCRIPT;
    s.async = true;
    s.onload = iniciar;
    s.onerror = () => setFallo(true);
    document.body.appendChild(s);
  }, [abierto, nombre, correo]);

  if (fallo) {
    return (
      <a href={SITE.calendly} target="_blank" rel="noopener noreferrer" className={`${botonPrimario} mt-6 w-full`}>
        <CalendarBlank size={22} aria-hidden="true" />
        {CTA.agenda}
      </a>
    );
  }

  if (!abierto) {
    return (
      <>
        <button
          type="button"
          className={`${botonPrimario} mt-6 w-full`}
          onClick={() => {
            eventoPersonalizado("AgendarClic");
            setAbierto(true);
          }}
        >
          <CalendarBlank size={22} aria-hidden="true" />
          {CTA.agenda}
        </button>
        <p className="mt-3 text-center text-[14px] text-gris-medio">O espera nuestro contacto, también está bien.</p>
      </>
    );
  }

  return (
    <div
      ref={contenedor}
      className="-mx-5 mt-6 h-[700px] overflow-hidden border-y border-gris-borde sm:mx-0 sm:rounded-[6px] sm:border"
      aria-label="Agenda de reuniones"
    />
  );
}
