import Link from "next/link";
import { Causales } from "@/components/home/Causales";
import { Cifras } from "@/components/home/Cifras";
import { Formulario } from "@/components/home/Formulario";
import { Hero } from "@/components/home/Hero";
import { MetodoResumen } from "@/components/home/MetodoResumen";
import { Testimonios } from "@/components/home/Testimonios";
import { Preguntas } from "@/components/Preguntas";
import { contenedor, tituloSeccion } from "@/components/ui";
import { PREGUNTAS_HOME } from "@/lib/contenido";

export default function Inicio() {
  return (
    <>
      <Hero />
      <Causales />
      <Cifras />
      <MetodoResumen />
      <Testimonios />

      <section className="py-16 sm:py-24" aria-labelledby="titulo-dudas">
        <div className={`${contenedor} grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16`}>
          <div>
            <h2 id="titulo-dudas" className={tituloSeccion}>
              Antes de escribirnos
            </h2>
            <p className="mt-4 max-w-[40ch] text-[17px] leading-relaxed text-gris-medio">
              Las dudas que más frenan a quienes nos consultan.{" "}
              <Link href="/metodologia#preguntas" className="font-semibold text-naranja-texto underline underline-offset-4">
                Ver todas las preguntas
              </Link>
            </p>
          </div>
          <Preguntas items={PREGUNTAS_HOME} />
        </div>
      </section>

      <Formulario />
    </>
  );
}
