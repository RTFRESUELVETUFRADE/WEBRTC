import { FacebookLogo, InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { CTA, SITE, mapsUrl, whatsappUrl } from "@/lib/site";
import { LogoRTC } from "./Brand";
import { BotonPreferenciasCookies } from "./CookieConsent";
import { botonBlanco, contenedor } from "./ui";

/** Última captura antes del footer. */
export function PreFooter() {
  return (
    <section className="relative isolate overflow-hidden bg-accion text-blanco">
      {/* Grúas de marca de lado a lado, en transparencia (SVG original como máscara, así toma el color que queramos). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-full bg-blanco/30 [mask:url(/img/gruas.png)_center_bottom/cover_no-repeat] [-webkit-mask:url(/img/gruas.png)_center_bottom/cover_no-repeat]"
      />
      <div className={`${contenedor} flex flex-col items-start gap-6 py-16 sm:py-24 lg:flex-row lg:items-center lg:justify-between`}>
        <h2 className="max-w-[20ch] text-[28px] leading-[1.1] font-bold sm:text-[36px]">
          ¿Todavía tienes dudas sobre tu contrato?
        </h2>
        <Link href="/#formulario" className={botonBlanco}>
          {CTA.principal}
        </Link>
      </div>
    </section>
  );
}

export function SiteFooter() {
  const titulo = "mb-4 text-[13px] font-semibold tracking-[0.08em] text-blanco/60 uppercase";
  const enlace = "text-blanco/85 hover:text-naranja transition-colors";
  return (
    <footer className="bg-negro text-[15px] text-blanco">
      <div className={`${contenedor} grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.3fr_1fr] lg:py-16`}>
        <div>
          <LogoRTC className="h-9 w-auto text-blanco" />
          <p className="mt-4 font-semibold">{SITE.descriptor}</p>
          <p className="mt-2 max-w-[32ch] leading-relaxed text-blanco/75">
            Recuperamos el pie de tu inversión inmobiliaria en todo Chile.
          </p>
        </div>

        <nav aria-label="Pie de página">
          <p className={titulo}>Navegación</p>
          <ul className="space-y-3">
            <li><Link className={enlace} href="/">Inicio</Link></li>
            <li><Link className={enlace} href="/trayectoria">Trayectoria</Link></li>
            <li><Link className={enlace} href="/metodologia">Metodología</Link></li>
            <li><Link className={enlace} href="/#formulario">{CTA.principal}</Link></li>
            <li><a className={enlace} href={SITE.calendly} target="_blank" rel="noopener noreferrer">Agendar reunión</a></li>
          </ul>
        </nav>

        <address className="not-italic">
          <p className={titulo}>Contacto</p>
          <ul className="space-y-3 text-blanco/85">
            <li><a className={enlace} href={`mailto:${SITE.correo}`}>{SITE.correo}</a></li>
            <li>
              <a className={enlace} href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                WhatsApp {SITE.whatsapp.visible}
              </a>
            </li>
            <li>
              <a className={enlace} href={mapsUrl} target="_blank" rel="noopener noreferrer">
                {SITE.direccion.calle}, {SITE.direccion.comuna}
                <span className="mt-1 block text-[13px] text-blanco/60 underline underline-offset-2">Cómo llegar</span>
              </a>
            </li>
            <li>{SITE.horario}</li>
          </ul>
        </address>

        <div>
          <p className={titulo}>Legal</p>
          <ul className="space-y-3">
            <li><Link className={enlace} href="/privacidad">Política de Privacidad</Link></li>
            <li><BotonPreferenciasCookies className={`${enlace} text-left`} /></li>
          </ul>
          <ul className="mt-6 flex gap-2" aria-label="Redes sociales">
            <li>
              <a href={SITE.redes.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram de RTC" className="inline-flex size-11 items-center justify-center text-blanco transition-colors hover:text-naranja">
                <InstagramLogo size={26} />
              </a>
            </li>
            <li>
              <a href={SITE.redes.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook de RTC" className="inline-flex size-11 items-center justify-center text-blanco transition-colors hover:text-naranja">
                <FacebookLogo size={26} />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-blanco/10">
        <p className={`${contenedor} py-5 text-center text-[13px] leading-relaxed text-blanco/60`}>
          © {new Date().getFullYear()} {SITE.nombre}. {SITE.razonSocial}, RUT {SITE.rut}. Santiago, Chile.
        </p>
      </div>
    </footer>
  );
}
