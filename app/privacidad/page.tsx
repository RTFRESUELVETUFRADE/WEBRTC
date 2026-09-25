import type { Metadata } from "next";
import { BotonPreferenciasCookies } from "@/components/CookieConsent";
import { contenedor } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Cómo Resuelve Tu Contrato trata tus datos personales conforme a la Ley 19.628, modificada por la Ley 21.719.",
  alternates: { canonical: "/privacidad" },
};

const ACTUALIZACION = "25 de septiembre de 2026";

const SECCIONES: { id: string; titulo: string; cuerpo: React.ReactNode }[] = [
  {
    id: "responsable",
    titulo: "Quién es responsable de tus datos",
    cuerpo: (
      <>
        <p>El responsable del tratamiento es:</p>
        <ul>
          <li><strong>Razón social:</strong> {SITE.razonSocial}</li>
          <li><strong>Nombre de fantasía:</strong> {SITE.nombre} (RTC)</li>
          <li><strong>RUT:</strong> {SITE.rut}</li>
          <li><strong>Domicilio:</strong> {SITE.direccion.calle}, {SITE.direccion.comuna}, Santiago, Chile</li>
          <li><strong>Correo de contacto para datos personales:</strong> <a href={`mailto:${SITE.correo}`}>{SITE.correo}</a></li>
        </ul>
      </>
    ),
  },
  {
    id: "datos",
    titulo: "Qué datos recolectamos",
    cuerpo: (
      <>
        <p>A través del formulario de contacto: si mantienes o no un contrato de promesa vigente, tu nombre, apellido, teléfono, correo electrónico y el relato de tu caso que decidas escribir.</p>
        <p>Datos técnicos: la página desde la que envías el formulario y los parámetros de campaña de la dirección web (por ejemplo, <em>utm_source</em> o <em>utm_campaign</em>), que nos indican qué anuncio te trajo. Solo si aceptas las cookies de medición, el Pixel de Meta registra identificadores de tu navegador y las acciones que realizas en el sitio.</p>
        <p>Si agendas una reunión, los datos que ingreses en Calendly quedan sujetos también a la política de privacidad de ese servicio.</p>
        <p>Te pedimos no incluir en el relato datos sensibles (por ejemplo, detalles de salud) más allá de lo necesario para describir tu situación.</p>
      </>
    ),
  },
  {
    id: "finalidad",
    titulo: "Para qué los usamos",
    cuerpo: (
      <>
        <p>Usamos tus datos para una sola finalidad: contactarte y evaluar tu caso. No los usamos para enviarte publicidad por correo ni los vendemos o cedemos a terceros con fines comerciales.</p>
        <p>Si aceptas las cookies de medición, usamos además datos de navegación para medir el rendimiento de nuestras campañas en Meta.</p>
      </>
    ),
  },
  {
    id: "licitud",
    titulo: "Base de licitud",
    cuerpo: (
      <p>Tratamos tus datos sobre la base de tu consentimiento, que otorgas al enviar el formulario después de leer el aviso que aparece antes del botón de envío, y, para las cookies de medición, al presionar «Aceptar» en el aviso de cookies. Puedes retirar tu consentimiento en cualquier momento, como se explica más abajo.</p>
    ),
  },
  {
    id: "destinatarios",
    titulo: "Con quién se comparten",
    cuerpo: (
      <>
        <p>Solo con los proveedores tecnológicos que necesitamos para operar el sitio, que actúan por encargo nuestro:</p>
        <ul>
          <li><strong>Vercel Inc.</strong>: alojamiento del sitio web.</li>
          <li><strong>Resend</strong>: envío del formulario a nuestra casilla de correo.</li>
          <li><strong>Google LLC (Google Workspace)</strong>: casilla de correo donde recibimos tu caso.</li>
          <li><strong>Meta Platforms, Inc.</strong>: medición de campañas, solo si aceptas las cookies. Los datos de contacto que le informamos van cifrados con una función irreversible (hash).</li>
          <li><strong>Calendly LLC</strong>: agenda de reuniones, solo si decides agendar.</li>
          <li><strong>Upstash, Inc.</strong>: almacenamiento temporal (24 horas) de la huella cifrada que evita envíos duplicados.</li>
        </ul>
      </>
    ),
  },
  {
    id: "transferencias",
    titulo: "Transferencias internacionales",
    cuerpo: (
      <p>Los proveedores mencionados operan servidores fuera de Chile, principalmente en Estados Unidos. Por eso, tus datos pueden ser almacenados o procesados en el extranjero, bajo las condiciones contractuales y de seguridad que esos proveedores ofrecen.</p>
    ),
  },
  {
    id: "conservacion",
    titulo: "Por cuánto tiempo los conservamos",
    cuerpo: (
      <p>Los datos del formulario se eliminan en un plazo máximo de {SITE.retencionDias} días desde que los recibimos. Nuestro equipo te contacta normalmente dentro del día hábil siguiente al envío, y los datos solo se usan hasta ese contacto o hasta la reunión que agendes. Si decides contratar nuestros servicios, la información necesaria pasa a regirse por el contrato de prestación de servicios que firmemos.</p>
    ),
  },
  {
    id: "seguridad",
    titulo: "Cómo los protegemos",
    cuerpo: (
      <p>El sitio funciona solo con conexión cifrada (HTTPS). El formulario no guarda tus datos en una base de datos del sitio: se transmiten directamente a nuestra casilla de correo, cuyo acceso está restringido al equipo que revisa los casos. Contamos con protecciones contra envíos automatizados y abuso. Para evitar envíos duplicados, durante 24 horas guardamos una huella cifrada e irreversible (hash) de tu correo y teléfono, que no permite reconstruir esos datos y se borra automáticamente.</p>
    ),
  },
  {
    id: "derechos",
    titulo: "Tus derechos y cómo ejercerlos",
    cuerpo: (
      <>
        <p>Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión, oposición, portabilidad y bloqueo de tus datos personales.</p>
        <p>Escríbenos a <a href={`mailto:${SITE.correo}?subject=Derechos%20sobre%20mis%20datos%20personales`}>{SITE.correo}</a> con el asunto «Derechos sobre mis datos personales», indicando qué derecho quieres ejercer. Responderemos dentro del plazo legal de 30 días corridos. Si consideras que no hemos respondido adecuadamente, puedes recurrir a la Agencia de Protección de Datos Personales.</p>
      </>
    ),
  },
  {
    id: "revocacion",
    titulo: "Retirar tu consentimiento",
    cuerpo: (
      <p>Retirar el consentimiento es tan simple como darlo. Para los datos del formulario, escríbenos al mismo correo y eliminaremos tu información. Para las cookies de medición, abre las preferencias de cookies (enlace al pie de cada página) y presiona «Rechazar».</p>
    ),
  },
  {
    id: "cookies",
    titulo: "Cookies y tecnologías de seguimiento",
    cuerpo: (
      <>
        <ul>
          <li><strong>Preferencia de cookies</strong> (almacenamiento local de tu navegador): recuerda si aceptaste o rechazaste la medición. Es necesaria para respetar tu decisión.</li>
          <li><strong>Atribución de campaña</strong> (almacenamiento de sesión): guarda los parámetros del anuncio que te trajo mientras navegas. Se borra al cerrar el navegador.</li>
          <li><strong>Registro de envío</strong> (almacenamiento local de tu navegador): guarda solo la hora en que enviaste tu caso o agendaste una reunión, para no pedirte los datos de nuevo durante 24 horas.</li>
          <li><strong>Pixel de Meta</strong> (cookies <em>_fbp</em> y <em>_fbc</em>): solo se activan si aceptas. Miden visitas y envíos del formulario para evaluar nuestras campañas.</li>
        </ul>
        <p><BotonPreferenciasCookies className="font-semibold text-naranja-texto underline underline-offset-4" /></p>
      </>
    ),
  },
  {
    id: "automatizadas",
    titulo: "Decisiones automatizadas",
    cuerpo: <p>No tomamos decisiones sobre ti basadas únicamente en tratamientos automatizados. Cada caso lo revisa una persona de nuestro equipo.</p>,
  },
  {
    id: "cambios",
    titulo: "Cambios a esta política",
    cuerpo: <p>Si modificamos esta política, publicaremos la nueva versión en esta página con su fecha de actualización. Última actualización: {ACTUALIZACION}.</p>,
  },
];

export default function Privacidad() {
  return (
    <div className={`${contenedor} pt-14 pb-20 sm:pt-20 sm:pb-28`}>
      <h1 className="text-[36px] leading-[1.05] font-extrabold tracking-[-0.015em] sm:text-[52px]">Política de Privacidad</h1>
      <p className="mt-4 text-[16px] text-gris-medio">Última actualización: {ACTUALIZACION}</p>
      <p className="mt-6 max-w-[65ch] text-[18px] leading-relaxed text-negro/85">
        Esta política explica cómo tratamos tus datos personales conforme a la Ley 19.628 sobre protección de la vida
        privada, modificada por la Ley 21.719. Somos un estudio jurídico: cuidar tus datos es parte de nuestro trabajo.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="Contenido de la política" className="lg:sticky lg:top-28 lg:self-start">
          <ol className="grid gap-2 text-[15px]">
            {SECCIONES.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-negro/75 hover:text-naranja-texto hover:underline">
                  {i + 1}. {s.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-[70ch]">
          {SECCIONES.map((s, i) => (
            <section key={s.id} id={s.id} className="border-t border-gris-borde py-8 first:border-t-0 first:pt-0">
              <h2 className="text-[22px] leading-snug font-bold sm:text-[26px]">
                {i + 1}. {s.titulo}
              </h2>
              <div className="mt-4 space-y-4 text-[17px] leading-[1.7] text-negro/85 [&_a]:font-semibold [&_a]:text-naranja-texto [&_a]:underline [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                {s.cuerpo}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
