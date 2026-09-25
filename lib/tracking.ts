"use client";

/**
 * Consentimiento, Pixel de Meta y atribución (UTM). Todo el tracking publicitario
 * pasa por aquí y nada se dispara sin consentimiento explícito.
 */

export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "763916406253405";

const CLAVE_CONSENTIMIENTO = "rtc-consentimiento-v1";
const CLAVE_ATRIBUCION = "rtc-atribucion";
export const EVENTO_CONSENTIMIENTO = "rtc:consentimiento";

export type Consentimiento = "aceptado" | "rechazado" | null;

type Fbq = ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };
declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

export function leerConsentimiento(): Consentimiento {
  try {
    const v = localStorage.getItem(CLAVE_CONSENTIMIENTO);
    return v === "aceptado" || v === "rechazado" ? v : null;
  } catch {
    return null;
  }
}

export function guardarConsentimiento(valor: Exclude<Consentimiento, null>) {
  try {
    localStorage.setItem(CLAVE_CONSENTIMIENTO, valor);
  } catch {
    /* almacenamiento bloqueado: el consentimiento dura solo esta visita */
  }
  // Si el Pixel ya estaba cargado y la persona revoca, se le ordena dejar de enviar.
  if (window.fbq) window.fbq("consent", valor === "aceptado" ? "grant" : "revoke");
  window.dispatchEvent(new CustomEvent(EVENTO_CONSENTIMIENTO, { detail: valor }));
}

/** Carga el Pixel una sola vez. Solo se llama con consentimiento aceptado. */
export function cargarPixel() {
  if (window.fbq || !PIXEL_ID) return;
  const fbq: Fbq = function (...args: unknown[]) {
    if (fbq.callMethod) (fbq.callMethod as (...a: unknown[]) => void)(...args);
    else fbq.queue!.push(args);
  };
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;
  (fbq as unknown as Record<string, unknown>).push = fbq;
  (fbq as unknown as Record<string, unknown>).loaded = true;
  (fbq as unknown as Record<string, unknown>).version = "2.0";
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  fbq("init", PIXEL_ID);
  fbq("track", "PageView");
}

export function evento(nombre: "PageView" | "ViewContent" | "Lead" | "Schedule", params?: Record<string, unknown>, eventID?: string) {
  if (leerConsentimiento() !== "aceptado" || !window.fbq) return;
  window.fbq("track", nombre, params ?? {}, eventID ? { eventID } : undefined);
}

export function eventoPersonalizado(nombre: string, params?: Record<string, unknown>) {
  if (leerConsentimiento() !== "aceptado" || !window.fbq) return;
  window.fbq("trackCustom", nombre, params ?? {});
}

/* ---------- Atribución ---------- */

export type Atribucion = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  landing?: string;
};

const CAMPOS_UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"] as const;

/** Guarda la primera atribución de la sesión (el anuncio que trajo a la persona). */
export function capturarAtribucion() {
  try {
    if (sessionStorage.getItem(CLAVE_ATRIBUCION)) return;
    const params = new URLSearchParams(window.location.search);
    const datos: Atribucion = { landing: window.location.pathname };
    for (const c of CAMPOS_UTM) {
      const v = params.get(c);
      if (v) datos[c] = v.slice(0, 200);
    }
    sessionStorage.setItem(CLAVE_ATRIBUCION, JSON.stringify(datos));
  } catch {
    /* sin almacenamiento de sesión: se envía sin atribución */
  }
}

export function leerAtribucion(): Atribucion {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE_ATRIBUCION) ?? "{}") as Atribucion;
  } catch {
    return {};
  }
}

/** Cookies propias del Pixel, útiles para la API de Conversiones (deduplicación y match). */
export function cookiesMeta() {
  const leer = (n: string) => document.cookie.match(new RegExp(`(?:^|; )${n}=([^;]*)`))?.[1];
  return { fbp: leer("_fbp"), fbc: leer("_fbc") };
}
