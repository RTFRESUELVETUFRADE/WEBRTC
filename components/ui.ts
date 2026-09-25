/** Clases compartidas. Radio único de 6px en botones, inputs y tarjetas. */
export const contenedor = "mx-auto w-full max-w-[1200px] px-5 sm:px-8";

const botonBase =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[6px] px-6 text-[16px] font-bold whitespace-nowrap transition-[background-color,color,transform] duration-200 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70";

export const botonPrimario = `${botonBase} bg-accion text-blanco hover:bg-accion-hover`;
export const botonSecundario = `${botonBase} border-2 border-negro text-negro hover:bg-negro hover:text-blanco`;
export const botonBlanco = `${botonBase} bg-blanco text-negro hover:bg-negro hover:text-blanco`;

export const enlaceSubrayado =
  "font-semibold underline decoration-2 underline-offset-4 decoration-current/40 hover:decoration-current transition-[text-decoration-color]";

export const tituloSeccion = "text-[28px] leading-[1.1] font-bold tracking-[-0.01em] sm:text-[40px] lg:text-[46px]";
