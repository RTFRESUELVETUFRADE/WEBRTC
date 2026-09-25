/** Datos institucionales. Un solo lugar para cambiarlos en todo el sitio. */
export const SITE = {
  url: "https://www.resuelvetucontrato.com",
  nombre: "Resuelve Tu Contrato",
  sigla: "RTC",
  descriptor: "Abogados inmobiliarios",
  razonSocial: "Servicios de Asesoramiento y Representación",
  rut: "77.741.686-3",
  direccion: {
    calle: "Mariano Sánchez Fontecilla 310, of. 02-135",
    comuna: "Las Condes",
    region: "Región Metropolitana",
    pais: "CL",
  },
  horario: "Lunes a viernes, 9:00 a 18:00",
  correo: "contacto@resuelvetucontrato.com",
  whatsapp: {
    visible: "+56 9 2795 7560",
    e164: "56927957560",
  },
  calendly: "https://calendly.com/marcos-resuelvetucontrato/asesoria",
  redes: {
    instagram: "https://www.instagram.com/resuelvetucontrato",
    facebook: "https://www.facebook.com/resuelvetucontrato/",
  },
  fundacion: 2022,
  /** Retención máxima de datos de leads, en días (política de privacidad). */
  retencionDias: 30,
} as const;

/** Google Maps "cómo llegar": sin origen, Maps usa la ubicación actual de quien hace clic. */
export const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${SITE.direccion.calle.replace(", of. 02-135", "")}, ${SITE.direccion.comuna}, Chile`
)}`;

export const whatsappUrl = (texto = "Hola, quiero consultar por mi contrato de promesa.") =>
  `https://wa.me/${SITE.whatsapp.e164}?text=${encodeURIComponent(texto)}`;

/** Cifras públicas. Todas provienen del estudio; cambiarlas aquí las cambia en todo el sitio. */
export const CIFRAS = {
  casos: "+1.000",
  inmobiliarias: "+50",
  rangoDevolucion: "80% a 100%",
  rangoCorto: "80-100%",
} as const;

export const CTA = {
  principal: "Cuéntanos tu caso",
  nav: "Recupera tu pie",
  agenda: "Agendar mi reunión",
} as const;
