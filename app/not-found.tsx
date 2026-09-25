import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { botonPrimario, botonSecundario, contenedor } from "@/components/ui";
import { CTA } from "@/lib/site";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

export default function NoEncontrada() {
  return (
    <section className="relative isolate overflow-hidden bg-negro text-blanco">
      <Image
        src="/img/gruas.png"
        alt=""
        width={2400}
        height={1122}
        sizes="100vw"
        className="pointer-events-none absolute right-[-15%] bottom-0 -z-10 w-[900px] max-w-none opacity-25 lg:w-[1200px]"
      />
      <div className={`${contenedor} flex min-h-[70dvh] flex-col justify-center py-20`}>
        <p className="text-[15px] font-semibold text-naranja">Error 404</p>
        <h1 className="mt-4 max-w-[16ch] text-[40px] leading-[1.05] font-extrabold sm:text-[60px]">
          Esta página no existe.
        </h1>
        <p className="mt-5 max-w-[40ch] text-[20px] leading-relaxed text-blanco/85">
          Pero tu contrato sí, y probablemente tiene solución.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className={botonPrimario}>
            Volver al inicio
          </Link>
          <Link href="/#formulario" className={`${botonSecundario} border-blanco text-blanco hover:bg-blanco hover:text-negro`}>
            {CTA.principal}
          </Link>
        </div>
        <nav aria-label="Páginas principales" className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[16px]">
          <Link href="/trayectoria" className="underline underline-offset-4 hover:text-naranja">Trayectoria</Link>
          <Link href="/metodologia" className="underline underline-offset-4 hover:text-naranja">Metodología</Link>
          <Link href="/privacidad" className="underline underline-offset-4 hover:text-naranja">Privacidad</Link>
        </nav>
      </div>
    </section>
  );
}
