import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";

/** Piezas comunes a todos los formularios de leads (caso de pie, consulta de IVA). */

export const ERROR_GENERICO = "No pudimos enviar tu mensaje. Inténtalo de nuevo o escríbenos directo por WhatsApp.";

const texto = (max: number) => z.string().trim().max(max).optional();
export const RE_NOMBRE = /^[\p{L}][\p{L}'’\-. ]+$/u;

export const campos = {
  telefono: z.string().regex(/^\+569\d{8}$/, "Revisa el número. Deben ser 8 dígitos después del +56 9."),
  correo: z
    .string()
    .trim()
    .toLowerCase()
    .max(160)
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Revisa el correo. Debe tener el formato nombre@dominio.cl"),
  sitio_web: z.string().max(200).optional(), // honeypot
  ms: z.number().int().nonnegative().optional(),
  pagina: texto(200),
  atribucion: z
    .object({
      utm_source: texto(200),
      utm_medium: texto(200),
      utm_campaign: texto(200),
      utm_content: texto(200),
      utm_term: texto(200),
      fbclid: texto(500),
      landing: texto(200),
    })
    .partial()
    .optional(),
  medicion: z
    .object({
      consentimiento: z.boolean(),
      eventId: z.string().uuid(),
      fbp: texto(200),
      fbc: texto(500),
    })
    .optional(),
};

/* Límite de frecuencia por IP. En memoria: suficiente como primera barrera en serverless
   (cada instancia lleva su cuenta); si el spam escala, pasar a Vercel KV / Upstash. */
const VENTANA_MS = 10 * 60 * 1000;
const MAX_POR_VENTANA = 5;
const intentos = new Map<string, number[]>();

function limitar(ip: string) {
  const ahora = Date.now();
  const recientes = (intentos.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  recientes.push(ahora);
  intentos.set(ip, recientes);
  if (intentos.size > 5000) intentos.clear();
  return recientes.length > MAX_POR_VENTANA;
}

/**
 * Controles previos a cualquier envío: origen propio, límite de frecuencia y validación.
 * Devuelve los datos limpios, o la respuesta de error que hay que entregar tal cual.
 */
export async function leerSolicitud<T extends z.ZodType>(
  request: Request,
  esquema: T
): Promise<{ ok: true; ip: string; datos: z.infer<T> } | { ok: false; respuesta: NextResponse }> {
  const origen = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origen && host && new URL(origen).host !== host) {
    return { ok: false, respuesta: NextResponse.json({ error: "Origen no permitido." }, { status: 403 }) };
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "desconocida";
  if (limitar(ip)) {
    return {
      ok: false,
      respuesta: NextResponse.json(
        { error: "Recibimos varios envíos seguidos. Espera unos minutos o escríbenos por WhatsApp." },
        { status: 429 }
      ),
    };
  }

  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return { ok: false, respuesta: NextResponse.json({ error: "Solicitud inválida." }, { status: 400 }) };
  }

  const r = esquema.safeParse(cuerpo);
  if (!r.success) {
    const issue = r.error.issues[0];
    return {
      ok: false,
      respuesta: NextResponse.json({ error: issue?.message ?? "Datos inválidos.", campo: issue?.path[0] }, { status: 400 }),
    };
  }
  return { ok: true, ip, datos: r.data };
}

/** Bots: honeypot lleno o formulario completado en menos de 3 segundos. */
export const esBot = (d: { sitio_web?: string; ms?: number }) => Boolean(d.sitio_web) || (d.ms !== undefined && d.ms < 3000);

export const telefonoVisible = (e164: string) => `+56 9 ${e164.slice(4, 8)} ${e164.slice(8)}`;

/** Bloque final del correo con la fecha, la página y la atribución de campaña. */
export function lineasTecnicas(d: { pagina?: string; atribucion?: z.infer<typeof campos.atribucion> }) {
  const fecha = new Intl.DateTimeFormat("es-CL", { dateStyle: "full", timeStyle: "short", timeZone: "America/Santiago" }).format(
    new Date()
  );
  const a = d.atribucion ?? {};
  return [
    "Consentimiento: otorgado al enviar el formulario (texto informativo visible antes del botón).",
    "",
    "---- Datos técnicos ----",
    `Fecha: ${fecha}`,
    `Página: ${d.pagina ?? "/"}`,
    `Aterrizaje: ${a.landing ?? "-"}`,
    `utm_source: ${a.utm_source ?? "-"}`,
    `utm_medium: ${a.utm_medium ?? "-"}`,
    `utm_campaign: ${a.utm_campaign ?? "-"}`,
    `utm_content: ${a.utm_content ?? "-"}`,
    `utm_term: ${a.utm_term ?? "-"}`,
    `fbclid: ${a.fbclid ? "sí" : "-"}`,
  ];
}
