import "server-only";
import { createHash } from "node:crypto";

/**
 * Evita que la misma persona envíe más de un caso cada 24 horas.
 * Se guarda solo una huella irreversible (hash) del correo y del teléfono, nunca el dato.
 *
 * Con Upstash Redis configurado (integración gratuita de Vercel) el bloqueo es global.
 * Sin él, funciona en memoria: sirve, pero cada instancia del servidor lleva su propia cuenta.
 */
const TTL_SEGUNDOS = 24 * 60 * 60;

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

const memoria = new Map<string, number>();

const claves = (correo: string, telefono: string) =>
  [correo.trim().toLowerCase(), telefono.replace(/\D/g, "")].map(
    (v) => `rtc:lead:${createHash("sha256").update(v).digest("hex")}`
  );

async function redis(comandos: (string | number)[][]) {
  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(comandos),
    signal: AbortSignal.timeout(3000),
  });
  if (!res.ok) throw new Error(`Redis ${res.status}`);
  return (await res.json()) as { result: unknown }[];
}

export async function envioReciente(correo: string, telefono: string): Promise<boolean> {
  const ks = claves(correo, telefono);
  if (url && token) {
    try {
      const r = await redis(ks.map((k) => ["EXISTS", k]));
      return r.some((x) => x.result === 1);
    } catch (e) {
      // Si Redis falla, preferimos dejar pasar el caso antes que perder un lead.
      console.error("Duplicados (lectura):", e);
      return false;
    }
  }
  const ahora = Date.now();
  return ks.some((k) => (memoria.get(k) ?? 0) > ahora);
}

export async function marcarEnvio(correo: string, telefono: string) {
  const ks = claves(correo, telefono);
  if (url && token) {
    await redis(ks.map((k) => ["SET", k, 1, "EX", TTL_SEGUNDOS])).catch((e) =>
      console.error("Duplicados (escritura):", e)
    );
    return;
  }
  const vence = Date.now() + TTL_SEGUNDOS * 1000;
  for (const k of ks) memoria.set(k, vence);
  if (memoria.size > 5000) {
    const ahora = Date.now();
    for (const [k, v] of memoria) if (v < ahora) memoria.delete(k);
  }
}
