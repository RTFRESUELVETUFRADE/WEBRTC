import { ASTERISCO_PATHS, LOGO_PATHS } from "./brand-paths";

/** Logo RTC vectorial. Hereda el color del texto (currentColor). */
export function LogoRTC({ className, title = "Resuelve Tu Contrato" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="225 530 1085 450" className={className} role="img" aria-label={title} fill="currentColor">
      <g transform="translate(0,1500) scale(0.1,-0.1)">
        {LOGO_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}

/** Asterisco de marca: marcador de contenido explicativo. Decorativo. */
export function Asterisco({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 918 810" className={className} aria-hidden="true" fill="currentColor">
      <g transform="translate(0,810) scale(0.1,-0.1)">
        {ASTERISCO_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}
