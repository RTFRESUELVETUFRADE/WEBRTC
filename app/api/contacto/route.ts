import { NextResponse } from "next/server";
import { z } from "zod";
import { enviarLeadCapi } from "@/lib/servidor/capi";
import { DESTINO_LEADS, REMITENTE, resend } from "@/lib/servidor/correo";
import { envioReciente, marcarEnvio } from "@/lib/servidor/duplicados";
import { ERROR_GENERICO, RE_NOMBRE, campos, esBot, leerSolicitud, lineasTecnicas, telefonoVisible } from "@/lib/servidor/lead";

const esquema = z.object({
  calificador: z.enum(["vigente", "asesoria"], { error: "Elige una opción para continuar." }),
  nombre: z.string().trim().min(2, "Escribe tu nombre.").max(80).regex(RE_NOMBRE, "Usa solo letras, sin números."),
  apellido: z.string().trim().min(2, "Escribe tu apellido.").max(80).regex(RE_NOMBRE, "Usa solo letras, sin números."),
  caso: z.string().trim().min(20, "Cuéntanos un poco más (al menos 20 caracteres).").max(5000),
  ...campos,
});

export async function POST(request: Request) {
  const s = await leerSolicitud(request, esquema);
  if (!s.ok) return s.respuesta;
  const { ip, datos: d } = s;

  // Bots: se responde OK para no delatar el filtro, pero no se envía nada.
  if (esBot(d)) return NextResponse.json({ ok: true });

  // Un caso por persona cada 24 horas (mismo correo o mismo teléfono).
  if (await envioReciente(d.correo, d.telefono)) {
    return NextResponse.json({ duplicado: true }, { status: 409 });
  }

  const tipo = d.calificador === "vigente" ? "Vigente" : "Asesoría";
  const lineas = [
    `CONTRATO DE PROMESA: ${d.calificador === "vigente" ? "SÍ, VIGENTE" : "NECESITA ASESORÍA"}`,
    "",
    `Nombre: ${d.nombre}`,
    `Apellido: ${d.apellido}`,
    `Teléfono: ${telefonoVisible(d.telefono)}`,
    `Correo: ${d.correo}`,
    "",
    "Caso:",
    d.caso,
    "",
    ...lineasTecnicas(d),
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
