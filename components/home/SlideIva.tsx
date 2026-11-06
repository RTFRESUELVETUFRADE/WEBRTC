import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { CAMPANA_IVA } from "@/lib/site";
import { BotonIva, CalendarioIva, RangoMeses, Resaltado } from "../iva/Piezas";
import { contenedor } from "../ui";

/** Lo que se revisa en la reunión gratuita: da contexto sin repetir el texto de la lámina. */
const REQUISITOS = [
  "Vivienda nueva, en su primera venta",
  "Escritura firmada en 2026",
  "Proyecto con recepción municipal",
  "Promesa y escritura revisadas sin costo",
];

/**
 * Segunda lámina del hero: versión web del creativo B1 de Meta ("Meses abril a noviembre",
 * formato escritorio 1200×628). Transitoria: se apaga con CAMPANA_IVA.activa en lib/site.ts.
 *
 * Escritorio: dos filas repartidas en el alto disponible. Arriba, el titular del creativo S2
 * (sobre el calendario) y los requisitos con checks (sobre el texto). Abajo, calendario y texto.
 * Móvil: solo calendario y texto, como el creativo de feed.
 */
export function SlideIva() {
  const esquina = "text-[12px] font-semibold tracking-[0.12em] uppercase sm:text-[13px]";
  return (
    <div className="relative flex flex-1 flex-col bg-crema text-tinta">
      <div className={`${contenedor} flex flex-1 flex-col pt-16 pb-6 md:pt-10 lg:py-[4.5%]`}>
        <p className={esquina}>Ley 21.850</p>

        <div className="grid flex-1 content-center items-center gap-6 py-6 md:gap-10 lg:grid-cols-[0.95fr_1fr] lg:content-evenly lg:gap-x-[6%] lg:gap-y-0 lg:py-0">
          <p className="hidden max-w-[22ch] font-display text-[clamp(40px,3.6vw,60px)] leading-[1.02] font-extrabold tracking-[-0.03em] [font-stretch:92%] lg:block">
            ¿Sabías que puedes <span className="text-naranja">recuperar el IVA</span> de tu propiedad?
          </p>

          <div className="hidden lg:block">
            <p className="text-[13px] font-semibold tracking-[0.12em] text-tinta/70 uppercase">En tu reunión revisamos</p>
            <ul className="mt-5 grid gap-[clamp(10px,1vw,16px)]">
              {REQUISITOS.map((r) => (
                <li
                  key={r}
                  className="flex items-center gap-3 font-display text-[clamp(18px,1.6vw,28px)] leading-snug font-semibold tracking-[-0.01em] [font-stretch:92%]"
                >
                  <CheckCircle size={34} weight="fill" className="shrink-0 text-naranja" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <CalendarioIva />
            <RangoMeses className="mt-5 text-[clamp(42px,5.8vw,84px)] lg:mt-8" />
          </div>

          <div>
            <h2 className="font-display text-[clamp(20px,2.7vw,40px)] leading-[1.12] font-normal tracking-[-0.02em] [font-stretch:92%]">
              Si escrituraste tu vivienda nueva en esos meses de 2026,{" "}
              <strong className="font-extrabold">el IVA de tu propiedad puede devolverse.</strong>
            </h2>
            <p className="mt-6 font-display text-[clamp(36px,4.3vw,64px)] leading-[1.05] font-extrabold whitespace-nowrap tracking-[-0.03em] [font-stretch:92%] lg:mt-8">
              <Resaltado>Recupera tu IVA.</Resaltado>
            </p>
            <BotonIva href={CAMPANA_IVA.ruta} className="mt-7 w-full sm:w-auto lg:mt-9">
              Agenda tu reunión gratuita
            </BotonIva>
          </div>
        </div>

        <div className={`flex items-end justify-between gap-4 ${esquina} text-[11px] leading-snug sm:text-[12px]`}>
          <p>
            ¿Escrituraste en 2026?
            <br />
            @resuelvetucontrato
          </p>
          <p className="text-right">
            Reunión con abogado
            <br />
            gratuita
          </p>
        </div>
      </div>
    </div>
  );
}
