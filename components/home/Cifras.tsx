import Image from "next/image";
import { CIFRAS } from "@/lib/site";
import { Asterisco } from "../Brand";
import { contenedor } from "../ui";

const DATOS = [
  { valor: CIFRAS.casos, etiqueta: "casos resueltos desde 2022" },
  { valor: CIFRAS.inmobiliarias, etiqueta: "inmobiliarias con las que negociamos directamente" },
  { valor: CIFRAS.rangoCorto, etiqueta: "del pie devuelto en los casos que resolvemos", nota: true },
  { valor: "$0", etiqueta: "cuesta la primera reunión, y no te compromete a nada" },
];

export function Cifras() {
  return (
    <section className="relative isolate overflow-hidden bg-negro py-16 text-blanco sm:py-24" aria-labelledby="titulo-cifras">
      <Image
        src="/img/gruas.png"
        alt=""
        width={2400}
        height={1122}
        sizes="(min-width: 1024px) 1100px, 100vw"
        className="pointer-events-none absolute right-[-10%] bottom-0 -z-10 w-[900px] max-w-none opacity-[0.16] lg:w-[1100px]"
      />
      <div className={contenedor}>
        <h2 id="titulo-cifras" className="max-w-[24ch] text-[28px] leading-[1.1] font-bold sm:text-[40px]">
          Resultados que puedes verificar, no promesas.
        </h2>

        <dl className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {DATOS.map((d) => (
            <div key={d.etiqueta} className="border-t border-blanco/20 pt-5">
              <dt className="sr-only">{d.etiqueta}</dt>
              <dd>
                <span className="font-display block text-[44px] leading-none font-extrabold tracking-[-0.02em] text-naranja [font-stretch:82%] sm:text-[52px]">
                  {d.valor}
                  {d.nota && <span className="align-super text-[24px]">*</span>}
                </span>
                <span className="mt-3 block max-w-[24ch] text-[16px] leading-snug text-blanco/80">{d.etiqueta}</span>
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-12 flex max-w-[70ch] gap-3 text-[14px] leading-relaxed text-blanco/65">
          <Asterisco className="mt-0.5 size-4 shrink-0 text-naranja" />
          Rango observado en casos resueltos por RTC; en la mayoría la devolución fue total. Es información histórica:
          no garantiza el resultado de un caso nuevo, que siempre se evalúa en forma individual.
        </p>
      </div>
    </section>
  );
}
