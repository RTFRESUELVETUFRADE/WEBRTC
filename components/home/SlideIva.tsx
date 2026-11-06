import { CAMPANA_IVA } from "@/lib/site";
import { BotonIva, CalendarioIva, RangoMeses, Resaltado } from "../iva/Piezas";
import { contenedor } from "../ui";

/**
 * Segunda lámina del hero: versión web del creativo B1 de Meta ("Meses abril a noviembre",
 * formato escritorio 1200×628). Transitoria: se apaga con CAMPANA_IVA.activa en lib/site.ts.
 */
export function SlideIva() {
  const esquina = "text-[12px] font-semibold tracking-[0.12em] uppercase sm:text-[13px]";
  return (
    <div className="relative flex flex-1 flex-col bg-crema text-tinta">
      <div className={`${contenedor} flex flex-1 flex-col pt-16 pb-6 md:pt-10 lg:py-[4.5%]`}>
        <p className={esquina}>Ley 21.850</p>
        {/* Solo escritorio: titular del creativo S2 de la misma campaña, centrado en el espacio
            entre "Ley 21.850" y el calendario (toma todo el aire disponible y se ubica al medio). */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center">
          <p className="max-w-[24ch] font-display text-[clamp(40px,3.9vw,60px)] leading-[1.02] font-extrabold tracking-[-0.03em] [font-stretch:92%]">
            ¿Sabías que puedes <span className="text-naranja">recuperar el IVA</span> de tu propiedad?
          </p>
        </div>

        <div className="grid flex-1 content-center items-center gap-6 py-6 md:gap-10 lg:flex-none lg:grid-cols-[0.95fr_1fr] lg:gap-[6%] lg:pt-0 lg:pb-[4%]">
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
