import "server-only";
import { Resend } from "resend";

let cliente: Resend | null = null;

/** Singleton perezoso: si falta la API key, solo falla el envío, no el build. */
export function resend(): Resend {
  if (!cliente) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error("RESEND_API_KEY no está configurada.");
    cliente = new Resend(apiKey);
  }
  return cliente;
}

/** Casillas que reciben cada lead. En Vercel: LEADS_DESTINO separado por comas. */
export const DESTINO_LEADS = (process.env.LEADS_DESTINO ?? "contacto@resuelvetucontrato.com,marcos@resuelvetucontrato.com")
  .split(",")
  .map((c) => c.trim())
  .filter(Boolean);
export const REMITENTE =
  process.env.RESEND_FROM_EMAIL ?? "Web Resuelve Tu Contrato <web@resuelvetucontrato.com>";
