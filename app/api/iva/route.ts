import { NextResponse } from "next/server";
import { z } from "zod";
import { separarNombre } from "@/lib/formulario";
import { enviarLeadCapi } from "@/lib/servidor/capi";
import { DESTINO_LEADS, REMITENTE, resend } from "@/lib/servidor/correo";
import { envioReciente, marcarEnvio } from "@/lib/servidor/duplicados";
import { ERROR_GENERICO, RE_NOMBRE, campos, esBot, leerSolicitud, lineasTecnicas, telefonoVisible } from "@/lib/servidor/lead";

/** Formulario corto de la campaña transitoria "Recupera tu IVA" (Ley 21.850). Llega a los mismos correos. */
const esquema = z.object({
  escrituro: z.enum(["si", "aun-no"], { error: "Elige una opción para continuar." }),
  nombreCompleto: z
    .string()
    .trim()
    .min(3, "Escribe tu nombre y apellido.")
    .max(120)
    .regex(RE_NOMBRE, "Usa solo letras, sin números."),
  ...campos,
});

export async function POST(request: Request) {
  const s = await leerSolicitud(request, esquema);
  if (!s.ok) return s.respuesta;
  const { ip, datos: d } = s;

  if (esBot(d)) return NextResponse.json({ ok: true });

  if (await envioReciente(d.correo, d.telefono, "iva")) {
    return NextResponse.json({ duplicado: true }, { status: 409 });
  }

  const escrituro = d.escrituro === "si";
  const lineas = [
    `RECUPERA TU IVA (Ley 21.850)`,
    `¿Escrituró su vivienda nueva entre abril y noviembre de 2026?: ${escrituro ? "SÍ" : "AÚN NO ESCRITURA"}`,
    "",
    `Nombre: ${d.nombreCompleto}`,
    `Teléfono: ${telefonoVisible(d.telefono)}`,
    `Correo: ${d.correo}`,
    "",
    ...lineasTecnicas(d),
  ];

  try {
    const { error } = await resend().emails.send({
      from: REMITENTE,
      to: DESTINO_LEADS,
      replyTo: d.correo,
      subject: `[LEAD WEB IVA] ${d.nombreCompleto} — ${escrituro ? "Escrituró" : "Aún no escritura"}`,
      text: lineas.join("\n"),
    });
    if (error) {
      console.error("Resend:", error);
      return NextResponse.json({ error: ERROR_GENERICO }, { status: 502 });
    }
  } catch (err) {
    console.error("Envío de lead IVA:", err);
    return NextResponse.json({ error: ERROR_GENERICO }, { status: 500 });
  }

  await marcarEnvio(d.correo, d.telefono, "iva");

  if (d.medicion?.consentimiento) {
    const { nombre, apellido } = separarNombre(d.nombreCompleto);
    await enviarLeadCapi({
      eventId: d.medicion.eventId,
      url: new URL(d.pagina ?? "/recupera-iva", request.url).toString(),
      ip: ip === "desconocida" ? undefined : ip,
      userAgent: request.headers.get("user-agent") ?? undefined,
      correo: d.correo,
      telefonoE164: d.telefono,
      nombre,
      apellido,
      fbp: d.medicion.fbp,
      fbc: d.medicion.fbc,
    }).catch((e) => console.error("CAPI:", e));
  }

  return NextResponse.json({ ok: true });
}
