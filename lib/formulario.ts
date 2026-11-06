/** Reglas compartidas por los formularios del sitio (caso de pie y consulta de IVA). */

export const RE_NOMBRE = /^[\p{L}][\p{L}'’\-. ]+$/u;
export const RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const MENSAJES = {
  opcion: "Elige una opción para continuar.",
  soloLetras: "Usa solo letras, sin números.",
  telefono: "Revisa el número. Deben ser 8 dígitos después del +56 9.",
  correo: "Revisa el correo. Debe tener el formato nombre@dominio.cl",
} as const;

export const telefonoValido = (d: string) => /^\d{8}$/.test(d);
export const correoValido = (v: string) => RE_CORREO.test(v.trim());

/** Deja solo los 8 dígitos locales aunque peguen "+56 9 1234 5678", "9 1234-5678", etc. */
export function normalizarTelefono(entrada: string) {
  let d = entrada.replace(/\D/g, "");
  if (d.startsWith("569") && d.length > 8) d = d.slice(3);
  else if (d.startsWith("56") && d.length > 9) d = d.slice(2);
  if (d.startsWith("9") && d.length > 8) d = d.slice(1);
  return d.slice(0, 8);
}

export const formatoTelefono = (d: string) => (d.length > 4 ? `${d.slice(0, 4)} ${d.slice(4)}` : d);

/** "María José Pérez Soto" → nombre "María", apellido "José Pérez Soto" (para la coincidencia de Meta). */
export function separarNombre(completo: string) {
  const partes = completo.trim().split(/\s+/);
  return { nombre: partes[0] ?? "", apellido: partes.slice(1).join(" ") };
}
