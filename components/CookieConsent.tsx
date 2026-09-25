"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  EVENTO_CONSENTIMIENTO,
  capturarAtribucion,
  cargarPixel,
  guardarConsentimiento,
  leerConsentimiento,
} from "@/lib/tracking";

/**
 * Banner de cookies. El Pixel de Meta queda bloqueado hasta que la persona acepta.
 * Rechazar es tan fácil como aceptar (mismo tamaño, mismo peso visual).
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    capturarAtribucion();
    const actual = leerConsentimiento();
    if (actual === "aceptado") cargarPixel();
    // Aparece un instante después de la carga para no competir con el hero (LCP) ni tapar la primera lectura.
    const t = actual === null ? setTimeout(() => setVisible(true), 800) : undefined;

    const reabrir = () => setVisible(true);
    window.addEventListener("rtc:preferencias-cookies", reabrir);
    return () => {
      clearTimeout(t);
      window.removeEventListener("rtc:preferencias-cookies", reabrir);
    };
  }, []);

  useEffect(() => {
    const alCambiar = (e: Event) => {
      if ((e as CustomEvent).detail === "aceptado") cargarPixel();
    };
    window.addEventListener(EVENTO_CONSENTIMIENTO, alCambiar);
    return () => window.removeEventListener(EVENTO_CONSENTIMIENTO, alCambiar);
  }, []);

  if (!visible) return null;

  const decidir = (valor: "aceptado" | "rechazado") => {
    guardarConsentimiento(valor);
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Preferencias de cookies"
      className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-[680px] rounded-[6px] border border-gris-borde bg-blanco p-5 shadow-[0_12px_40px_rgba(26,26,26,0.16)] sm:inset-x-6 sm:bottom-6"
    >
      <p className="text-[15px] leading-relaxed text-negro">
        Usamos cookies de medición de Meta para saber qué anuncios te trajeron hasta aquí. Solo se activan si las
        aceptas. Más detalle en la{" "}
        <Link href="/privacidad#cookies" className="font-semibold underline underline-offset-2">
          Política de Privacidad
        </Link>
        .
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => decidir("rechazado")}
          className="min-h-11 rounded-[6px] border-2 border-negro px-4 text-[15px] font-semibold hover:bg-negro hover:text-blanco"
        >
          Rechazar
        </button>
        <button
          type="button"
          onClick={() => decidir("aceptado")}
          className="min-h-11 rounded-[6px] border-2 border-negro bg-negro px-4 text-[15px] font-semibold text-blanco hover:bg-blanco hover:text-negro"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}

/** Enlace de footer para volver a abrir el banner (revocar con la misma facilidad). */
export function BotonPreferenciasCookies({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event("rtc:preferencias-cookies"))}
    >
      Preferencias de cookies
    </button>
  );
}
