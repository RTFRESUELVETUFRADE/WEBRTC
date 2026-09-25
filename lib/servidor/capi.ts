import "server-only";
import { createHash } from "node:crypto";

const sha256 = (v: string) => createHash("sha256").update(v.trim().toLowerCase()).digest("hex");

type LeadCapi = {
  eventId: string;
  url: string;
  ip?: string;
  userAgent?: string;
  correo: string;
  telefonoE164: string; // +569XXXXXXXX
  nombre: string;
  apellido: string;
  fbp?: string;
  fbc?: string;
};

/**
 * API de Conversiones de Meta: envía el mismo "Lead" que el Pixel, desde el servidor.
 * Comparte event_id con el Pixel para que Meta lo cuente una sola vez.
 * Solo se activa si existe RTC_META_CAPI_TOKEN y la persona aceptó la medición.
 */
export async function enviarLeadCapi(d: LeadCapi) {
  const token = process.env.RTC_META_CAPI_TOKEN;
  const pixel = process.env.NEXT_PUBLIC_RTC_META_PIXEL_ID || "763916406253405";
  if (!token) return;

  const cuerpo = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: d.eventId,
        action_source: "website",
        event_source_url: d.url,
        user_data: {
          em: [sha256(d.correo)],
          ph: [sha256(d.telefonoE164.replace(/\D/g, ""))],
          fn: [sha256(d.nombre)],
          ln: [sha256(d.apellido)],
          country: [sha256("cl")],
          client_ip_address: d.ip,
          client_user_agent: d.userAgent,
          fbp: d.fbp,
          fbc: d.fbc,
        },
      },
    ],
    ...(process.env.RTC_META_TEST_EVENT_CODE ? { test_event_code: process.env.RTC_META_TEST_EVENT_CODE } : {}),
  };

  const version = process.env.RTC_META_GRAPH_VERSION || "v23.0";
  const res = await fetch(`https://graph.facebook.com/${version}/${pixel}/events?access_token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cuerpo),
    signal: AbortSignal.timeout(4000),
  });
  if (!res.ok) console.error("CAPI respondió", res.status, await res.text().catch(() => ""));
}
