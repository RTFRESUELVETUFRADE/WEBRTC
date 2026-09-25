import { getImageProps } from "next/image";
import Link from "next/link";
import { CIFRAS, CTA } from "@/lib/site";
import { botonPrimario, contenedor, enlaceSubrayado } from "../ui";

export function Hero() {
  const comun = { alt: "", sizes: "100vw", quality: 75 };
  const {
    props: { srcSet: escritorio },
  } = getImageProps({ ...comun, src: "/img/hero-escritorio.jpg", width: 2400, height: 1600 });
  const {
    props: { srcSet: movil, ...resto },
  } = getImageProps({ ...comun, src: "/img/hero-movil.jpg", width: 1080, height: 1600 });

  return (
    <section className="relative isolate flex min-h-[calc(100dvh-4rem)] flex-col bg-negro text-blanco lg:min-h-[640px] lg:h-[calc(100dvh-72px)] lg:max-h-[820px]">
      <picture className="absolute inset-0 -z-10">
        <source media="(min-width: 768px)" srcSet={escritorio} />
        <img
          {...resto}
          srcSet={movil}
          alt=""
          fetchPriority="high"
          loading="eager"
          className="size-full object-cover object-[70%_center] md:object-[center_30%]"
        />
      </picture>
      {/* Overlay: parejo y denso en móvil (texto sobre la foto), degradado lateral en escritorio (la foto respira a la derecha). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(26,26,26,0.35)_0%,rgba(26,26,26,0.62)_45%,rgba(26,26,26,0.82)_100%)] md:bg-[linear-gradient(90deg,rgba(26,26,26,0.88)_0%,rgba(26,26,26,0.72)_38%,rgba(26,26,26,0.15)_68%,rgba(26,26,26,0)_100%)]"
      />

      <div className={`${contenedor} flex flex-1 flex-col justify-end pt-10 pb-8 md:justify-center md:py-16`}>
        <div className="max-w-[660px]">
          <p className="inline-flex rounded-full bg-naranja px-3.5 py-1.5 text-[12px] font-bold tracking-[0.08em] text-blanco uppercase sm:text-[13px]">
            ¿Tienes un contrato de promesa vigente?
          </p>
          <h1 className="mt-5 text-[38px] leading-[1.02] font-extrabold tracking-[-0.015em] sm:text-[52px] lg:text-[60px]">
            Recuperamos el pie atrapado en tu contrato de promesa.
          </h1>
          <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-blanco/90 sm:text-[18px]">
            Rechazo de crédito, atraso en la entrega, cesantía, enfermedad o cambio de condiciones.
            <span className="mt-1 block font-semibold text-blanco">Todas tienen salida legal.</span>
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-5 sm:flex-row sm:items-center sm:gap-8">
            <Link href="#formulario" className={`${botonPrimario} min-h-14 text-[17px] sm:px-8`}>
              {CTA.principal}
            </Link>
            <Link href="/trayectoria" className={`${enlaceSubrayado} text-center text-blanco sm:text-left`}>
              Conoce nuestra trayectoria
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-blanco/15 bg-negro/55 backdrop-blur-sm">
        <ul className={`${contenedor} grid grid-cols-3 gap-2 py-4 text-[13px] leading-snug text-blanco/85 sm:text-[15px]`}>
          <li><strong className="block text-[17px] text-blanco sm:inline sm:text-[15px]">{CIFRAS.casos}</strong> casos resueltos</li>
          <li><strong className="block text-[17px] text-blanco sm:inline sm:text-[15px]">{CIFRAS.inmobiliarias}</strong> inmobiliarias</li>
          <li><strong className="block text-[17px] text-blanco sm:inline sm:text-[15px]">Primera reunión</strong> sin costo</li>
        </ul>
      </div>
    </section>
  );
}
