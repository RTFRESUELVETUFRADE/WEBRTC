import "server-only";
import { Resend } from "resend";

let cliente: Resend | null = null;

/**
 * Variables con prefijo RTC_: en el mismo equipo de Vercel existen las de RTF (RESEND_API_KEY, etc.)
 * y no deben mezclarse nunca con las de este sitio.
 */

/** Singleton perezoso: si falta la API key, solo falla el envío, no el build. */
export function resend(): Resend {
  if (!cliente) {
    const apiKey = process.env.RTC_RESEND_API_KEY;
    if (!apiKey) throw new Error("RTC_RESEND_API_KEY no está configurada.");
    cliente = new Resend(apiKey);
  }
  return cliente;
}

/** Casillas que reciben cada lead. En Vercel: RTC_LEADS_DESTINO separado por comas. */
export const DESTINO_LEADS = (process.env.RTC_LEADS_DESTINO ?? "contacto@resuelvetucontrato.com,marcos@resuelvetucontrato.com")
  .split(",")
  .map((c) => c.trim())
  .filter(Boolean);
export const REMITENTE =
  process.env.RTC_RESEND_FROM_EMAIL ?? "Web Resuelve Tu Contrato <web@resuelvetucontrato.com>";
