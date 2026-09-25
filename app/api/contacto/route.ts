import { NextResponse } from "next/server";
import { z } from "zod";
import { enviarLeadCapi } from "@/lib/servidor/capi";
import { DESTINO_LEADS, REMITENTE, resend } from "@/lib/servidor/correo";
import { envioReciente, marcarEnvio } from "@/lib/servidor/duplicados";

const texto = (max: number) => z.string().trim().max(max).optional();

const esquema = z.object({
  calificador: z.enum(["vigente", "asesoria"], { error: "Elige una opción para continuar." }),
  nombre: z.string().trim().min(2, "Escribe tu nombre.").max(80).regex(/^[\p{L}][\p{L}'’\-. ]+$/u, "Usa solo letras, sin números."),
  apellido: z.string().trim().min(2, "Escribe tu apellido.").max(80).regex(/^[\p{L}][\p{L}'’\-. ]+$/u, "Usa solo letras, sin números."),
  telefono: z.string().regex(/^\+569\d{8}$/, "Revisa el número. Deben ser 8 dígitos después del +56 9."),
  correo: z.string().trim().toLowerCase().max(160).regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Revisa el correo. Debe tener el formato nombre@dominio.cl"),
  caso: z.string().trim().min(20, "Cuéntanos un poco más (al menos 20 caracteres).").max(5000),
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
});

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

const ERROR_GENERICO = "No pudimos enviar tu mensaje. Inténtalo de nuevo o escríbenos directo por WhatsApp.";

export async function POST(request: Request) {
  // Solo se aceptan envíos desde el propio sitio.
  const origen = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origen && host && new URL(origen).host !== host) {
    return NextResponse.json({ error: "Origen no permitido." }, { status: 403 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "desconocida";
  if (limitar(ip)) {
    return NextResponse.json({ error: "Recibimos varios envíos seguidos. Espera unos minutos o escríbenos por WhatsApp." }, { status: 429 });
  }

  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const r = esquema.safeParse(cuerpo);
  if (!r.success) {
    const issue = r.error.issues[0];
    return NextResponse.json({ error: issue?.message ?? "Datos inválidos.", campo: issue?.path[0] }, { status: 400 });
  }
  const d = r.data;

  // Bots: honeypot lleno o formulario completado en menos de 3 segundos. Se responde OK sin enviar.
  if (d.sitio_web || (d.ms !== undefined && d.ms < 3000)) {
    return NextResponse.json({ ok: true });
  }

  // Un caso por persona cada 24 horas (mismo correo o mismo teléfono).
  if (await envioReciente(d.correo, d.telefono)) {
    return NextResponse.json({ duplicado: true }, { status: 409 });
  }

  const tipo = d.calificador === "vigente" ? "Vigente" : "Asesoría";
  const fecha = new Intl.DateTimeFormat("es-CL", { dateStyle: "full", timeStyle: "short", timeZone: "America/Santiago" }).format(new Date());
  const a = d.atribucion ?? {};
  const telefonoVisible = `+56 9 ${d.telefono.slice(4, 8)} ${d.telefono.slice(8)}`;

  const lineas = [
    `CONTRATO DE PROMESA: ${d.calificador === "vigente" ? "SÍ, VIGENTE" : "NECESITA ASESORÍA"}`,
    "",
    `Nombre: ${d.nombre}`,
    `Apellido: ${d.apellido}`,
    `Teléfono: ${telefonoVisible}`,
    `Correo: ${d.correo}`,
    "",
    "Caso:",
    d.caso,
    "",
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

  try {
    const { error } = await resend().emails.send({
      from: REMITENTE,
      to: DESTINO_LEADS,
      replyTo: d.correo,
      subject: `[LEAD WEB] ${d.nombre} ${d.apellido} — ${tipo}`,
      text: lineas.join("\n"),
    });
    if (error) {
      console.error("Resend:", error);
      return NextResponse.json({ error: ERROR_GENERICO }, { status: 502 });
    }
  } catch (err) {
    console.error("Envío de lead:", err);
    return NextResponse.json({ error: ERROR_GENERICO }, { status: 500 });
  }

  await marcarEnvio(d.correo, d.telefono);

  // La conversión server-side nunca debe bloquear ni romper la respuesta al usuario.
  if (d.medicion?.consentimiento) {
    await enviarLeadCapi({
      eventId: d.medicion.eventId,
      url: new URL(d.pagina ?? "/", request.url).toString(),
      ip: ip === "desconocida" ? undefined : ip,
      userAgent: request.headers.get("user-agent") ?? undefined,
      correo: d.correo,
      telefonoE164: d.telefono,
      nombre: d.nombre,
      apellido: d.apellido,
      fbp: d.medicion.fbp,
      fbc: d.medicion.fbc,
    }).catch((e) => console.error("CAPI:", e));
  }

  return NextResponse.json({ ok: true });
}
