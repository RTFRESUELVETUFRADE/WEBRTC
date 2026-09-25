"use client";

import { useSyncExternalStore } from "react";

/**
 * Recuerda en este navegador si la persona ya envió su caso o agendó reunión en las últimas 24 horas.
 * Solo guarda la hora, nunca datos personales. El bloqueo real está en el servidor (lib/servidor/duplicados.ts);
 * esto sirve para mostrar el mensaje correcto sin esperar un envío.
 */
const VIGENCIA_MS = 24 * 60 * 60 * 1000;
const EVENTO = "rtc:registro-local";

export const CLAVE_ENVIO = "rtc-caso-enviado";
export const CLAVE_AGENDA = "rtc-reunion-agendada";

type Clave = typeof CLAVE_ENVIO | typeof CLAVE_AGENDA;

export function registrar(clave: Clave) {
  try {
    localStorage.setItem(clave, String(Date.now()));
  } catch {
    /* almacenamiento bloqueado: el servidor igual evita duplicados */
  }
  window.dispatchEvent(new Event(EVENTO));
}

function leer(clave: Clave): boolean {
  try {
    const t = Number(localStorage.getItem(clave) ?? 0);
    return t > 0 && Date.now() - t < VIGENCIA_MS;
  } catch {
    return false;
  }
}

function suscribir(cb: () => void) {
  window.addEventListener(EVENTO, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENTO, cb);
    window.removeEventListener("storage", cb);
  };
}

/** true si hay un registro vigente (menos de 24 h). En el servidor siempre es false. */
export function useRegistroReciente(clave: Clave) {
  return useSyncExternalStore(suscribir, () => leer(clave), () => false);
}
