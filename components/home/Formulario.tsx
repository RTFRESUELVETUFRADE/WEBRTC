"use client";

import {
  ArrowClockwise,
  CheckCircle,
  CircleNotch,
  LockSimple,
  WarningCircle,
  WhatsappLogo,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { CIFRAS, SITE, whatsappUrl } from "@/lib/site";
import { CLAVE_AGENDA, CLAVE_ENVIO, registrar, useRegistroReciente } from "@/lib/registro-local";
import { cookiesMeta, evento, leerAtribucion, leerConsentimiento } from "@/lib/tracking";
import { botonPrimario, contenedor, tituloSeccion } from "../ui";
import { AgendaCalendly } from "./AgendaCalendly";
import { EVENTO_CAUSAL } from "./Causales";

type Calificador = "vigente" | "asesoria";
type Campos = {
  calificador: Calificador | "";
  nombre: string;
  apellido: string;
  telefono: string; // 8 dígitos, sin prefijo
  correo: string;
  caso: string;
};
type Errores = Partial<Record<keyof Campos, string>>;
type Estado = "editando" | "enviando" | "exito" | "error" | "duplicado";

const VACIO: Campos = { calificador: "", nombre: "", apellido: "", telefono: "", correo: "", caso: "" };
const RE_NOMBRE = /^[\p{L}][\p{L}'’\-. ]+$/u;
const RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validar(campo: keyof Campos, v: string): string | undefined {
  switch (campo) {
    case "calificador":
      return v ? undefined : "Elige una opción para continuar.";
    case "nombre":
    case "apellido":
      if (v.trim().length < 2) return campo === "nombre" ? "Escribe tu nombre." : "Escribe tu apellido.";
      return RE_NOMBRE.test(v.trim()) ? undefined : "Usa solo letras, sin números.";
    case "telefono":
      return /^\d{8}$/.test(v) ? undefined : "Revisa el número. Deben ser 8 dígitos después del +56 9.";
    case "correo":
      return RE_CORREO.test(v.trim()) ? undefined : "Revisa el correo. Debe tener el formato nombre@dominio.cl";
    case "caso":
      return v.trim().length >= 20 ? undefined : "Cuéntanos un poco más (al menos 20 caracteres).";
  }
}

/** Deja solo los 8 dígitos locales aunque peguen "+56 9 1234 5678", "9 1234-5678", etc. */
function normalizarTelefono(entrada: string) {
  let d = entrada.replace(/\D/g, "");
  if (d.startsWith("569") && d.length > 8) d = d.slice(3);
  else if (d.startsWith("56") && d.length > 9) d = d.slice(2);
  if (d.startsWith("9") && d.length > 8) d = d.slice(1);
  return d.slice(0, 8);
}

const formatoTelefono = (d: string) => (d.length > 4 ? `${d.slice(0, 4)} ${d.slice(4)}` : d);

const ORDEN: (keyof Campos)[] = ["calificador", "nombre", "apellido", "telefono", "correo", "caso"];

type Variante = "home" | "campana";

export function Formulario({ variante = "home" }: { variante?: Variante }) {
  const [campos, setCampos] = useState<Campos>(VACIO);
  const enviadoReciente = useRegistroReciente(CLAVE_ENVIO);
  const agendadoReciente = useRegistroReciente(CLAVE_AGENDA);
  const [errores, setErrores] = useState<Errores>({});
  const [estado, setEstado] = useState<Estado>("editando");
  const [mensajeError, setMensajeError] = useState("");
  const inicio = useRef(0);
  const seccion = useRef<HTMLElement>(null);
  const confirmacion = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    inicio.current = Date.now();
  }, []);

  // ViewContent: mide cuántas visitas llegan a ver el formulario.
  useEffect(() => {
    const el = seccion.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          evento("ViewContent", { content_name: "formulario" });
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Prellenado desde las tarjetas de causales.
  useEffect(() => {
    const alElegir = (e: Event) => {
      const texto = (e as CustomEvent<string>).detail;
      setCampos((c) => ({ ...c, caso: c.caso.trim() ? c.caso : texto }));
      setErrores((er) => ({ ...er, caso: undefined }));
    };
    window.addEventListener(EVENTO_CAUSAL, alElegir);
    return () => window.removeEventListener(EVENTO_CAUSAL, alElegir);
  }, []);

  useEffect(() => {
    if (estado === "exito" || estado === "duplicado") confirmacion.current?.focus();
  }, [estado]);

  const actualizar = (campo: keyof Campos, valor: string) => {
    setCampos((c) => ({ ...c, [campo]: valor }));
    // Si ya había error, se limpia apenas el valor es válido (nunca se marca error mientras se escribe).
    if (errores[campo] && !validar(campo, valor)) setErrores((er) => ({ ...er, [campo]: undefined }));
  };

  const alSalir = (campo: keyof Campos) => {
    if (!campos[campo]) return; // campo vacío al pasar: no regañar todavía
    setErrores((er) => ({ ...er, [campo]: validar(campo, campos[campo]) }));
  };

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (estado === "enviando") return;

    const nuevos: Errores = {};
    for (const c of ORDEN) nuevos[c] = validar(c, campos[c]);
    setErrores(nuevos);
    const primero = ORDEN.find((c) => nuevos[c]);
    if (primero) {
      document.getElementById(`${id}-${primero}`)?.focus();
      return;
    }

    if (!navigator.onLine) {
      setMensajeError("Parece que no tienes conexión. Revisa tu señal e inténtalo de nuevo; tus datos siguen aquí.");
      setEstado("error");
      return;
    }

    setEstado("enviando");
    const eventId = crypto.randomUUID();
    const honeypot = (e.currentTarget.elements.namedItem("sitio_web") as HTMLInputElement | null)?.value ?? "";

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...campos,
          telefono: `+569${campos.telefono}`,
          sitio_web: honeypot,
          ms: Date.now() - inicio.current,
          pagina: window.location.pathname,
          atribucion: leerAtribucion(),
          medicion: { consentimiento: leerConsentimiento() === "aceptado", eventId, ...cookiesMeta() },
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; campo?: keyof Campos };
      if (res.status === 409) {
        registrar(CLAVE_ENVIO);
        setEstado("duplicado");
        return;
      }
      if (!res.ok) {
        if (res.status === 400 && data.campo) {
          setErrores((er) => ({ ...er, [data.campo!]: data.error }));
          setEstado("editando");
          document.getElementById(`${id}-${data.campo}`)?.focus();
          return;
        }
        throw new Error(data.error ?? "Error de envío");
      }
      evento(
        "Lead",
        { content_name: campos.calificador === "vigente" ? "promesa_vigente" : "asesoria", content_category: variante },
        eventId
      );
      setEstado("exito");
      registrar(CLAVE_ENVIO);
    } catch {
      setMensajeError("No pudimos enviar tu mensaje. Inténtalo de nuevo o escríbenos directo por WhatsApp.");
      setEstado("error");
    }
  }

  const input =
    "mt-2 block min-h-12 w-full rounded-[6px] border bg-blanco px-4 text-[17px] text-negro transition-colors placeholder:text-gris-medio focus:border-accion focus:ring-2 focus:ring-accion/20 focus:outline-none aria-[invalid=true]:border-error";
  const etiqueta = "block text-[15px] font-semibold";
  const ayudaError = (campo: keyof Campos) =>
    errores[campo] ? (
      <p id={`${id}-${campo}-error`} className="mt-2 flex items-start gap-1.5 text-[14px] font-medium text-error">
        <WarningCircle size={18} weight="fill" className="mt-px shrink-0" aria-hidden="true" />
        {errores[campo]}
      </p>
    ) : null;
  const aria = (campo: keyof Campos) => ({
    id: `${id}-${campo}`,
    "aria-invalid": errores[campo] ? true : undefined,
    "aria-describedby": errores[campo] ? `${id}-${campo}-error` : undefined,
  });

  return (
    <section
      ref={seccion}
      id="formulario"
      aria-labelledby="titulo-formulario"
      className="border-t border-gris-borde bg-gris-claro py-10 sm:py-20"
    >
      <div className={`${contenedor} grid gap-8 lg:grid-cols-[0.8fr_1fr] lg:gap-16`}>
        <div className="lg:sticky lg:top-28 lg:self-start">
          {variante === "campana" ? (
            <>
              <h1 id="titulo-formulario" className={tituloSeccion}>
                Cuéntanos tu caso
              </h1>
              <p className="mt-3 max-w-[50ch] text-[16px] leading-relaxed text-negro/80 sm:mt-4 sm:text-[17px]">
                Este formulario es el primer paso para evaluar tu contrato de promesa. Lo revisa una persona de nuestro
                equipo jurídico, que te contactará dentro del próximo día hábil para una primera reunión gratuita y sin
                compromiso.
              </p>
              <p className="mt-3 max-w-[50ch] text-[16px] leading-relaxed text-negro/80 sm:text-[17px]">
                Al enviarlo podrás, si quieres, agendar de inmediato tu reunión con nuestros abogados.
              </p>
            </>
          ) : (
            <>
              <h2 id="titulo-formulario" className={tituloSeccion}>
                Cuéntanos tu caso
              </h2>
              <p className="mt-3 max-w-[48ch] text-[16px] leading-relaxed text-negro/80 sm:mt-4 sm:text-[17px]">
                Una persona de nuestro equipo jurídico revisará tu situación. La primera reunión es gratuita y sin
                compromiso.
              </p>
            </>
          )}
          <p className="mt-4 flex items-start gap-2 text-[14px] leading-snug text-gris-medio">
            <LockSimple size={18} weight="bold" className="mt-px shrink-0 text-negro" aria-hidden="true" />
            Tus datos se usan únicamente para contactarte. No los compartimos con terceros.
          </p>
          <ul className="mt-6 hidden gap-3 border-t border-gris-borde pt-6 text-[15px] lg:grid">
            <li><strong>{CIFRAS.casos}</strong> casos resueltos desde {SITE.fundacion}</li>
            <li><strong>{CIFRAS.inmobiliarias}</strong> inmobiliarias con las que negociamos</li>
            <li>Atendemos en todo Chile, también a distancia</li>
          </ul>
          <p className="mt-3 text-[14px] text-gris-medio lg:hidden">
            <strong className="text-negro">{CIFRAS.casos}</strong> casos resueltos ·{" "}
            <strong className="text-negro">{CIFRAS.inmobiliarias}</strong> inmobiliarias
          </p>
        </div>

        <div className="rounded-[6px] border border-gris-borde bg-blanco p-5 shadow-[0_2px_12px_rgba(26,26,26,0.04)] sm:p-8">
          {estado === "duplicado" || (enviadoReciente && estado === "editando") ? (
            <div ref={confirmacion} tabIndex={-1} className="focus:outline-none" aria-live="polite">
              <CheckCircle size={52} weight="fill" className="text-accion" aria-hidden="true" />
              <h3 className="mt-4 text-[26px] leading-tight font-bold sm:text-[30px]">¡Tu caso ya está siendo revisado!</h3>
              <p className="mt-3 text-[17px] leading-relaxed text-negro/80">
                Recibimos tu formulario hace poco y nuestro equipo jurídico ya lo tiene. Te contactaremos dentro del
                próximo día hábil, así que no necesitas enviarlo de nuevo.
              </p>
              {agendadoReciente ? (
                <p className="mt-6 rounded-[6px] bg-gris-claro p-4 text-[16px] leading-relaxed">
                  <strong>Tu reunión ya está agendada.</strong> Revisa tu correo: ahí está la confirmación con el día y
                  la hora.
                </p>
              ) : (
                <>
                  <hr className="my-8 border-gris-borde" />
                  <h3 className="text-[21px] font-bold">¿Quieres adelantar tu reunión?</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-negro/80">
                    Puedes reservar un horario con nuestros abogados. Es gratuita y sin compromiso.
                  </p>
                  <AgendaCalendly nombre={`${campos.nombre} ${campos.apellido}`.trim()} correo={campos.correo} />
                </>
              )}
              <p className="mt-6 text-[15px] text-gris-medio">
                ¿Quieres agregar algo a tu caso?{" "}
                <a href={whatsappUrl("Hola, ya envié mi caso por la web y quiero agregar información.")} target="_blank" rel="noopener noreferrer" className="font-semibold text-negro underline underline-offset-2">
                  Escríbenos por WhatsApp
                </a>
                .
              </p>
            </div>
          ) : estado === "exito" ? (
            <div ref={confirmacion} tabIndex={-1} className="focus:outline-none" aria-live="polite">
              <CheckCircle size={52} weight="fill" className="text-accion" aria-hidden="true" />
              <h3 className="mt-4 text-[26px] leading-tight font-bold sm:text-[30px]">Recibimos tu caso.</h3>
              <p className="mt-3 text-[17px] leading-relaxed text-negro/80">
                Una persona de nuestro equipo jurídico revisará tu situación y te contactará a la brevedad, dentro del
                próximo día hábil.
              </p>
              <hr className="my-8 border-gris-borde" />
              <h3 className="text-[21px] font-bold">¿Prefieres adelantar tu reunión?</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-negro/80">
                Puedes reservar directamente un horario con nuestros abogados. La reunión preliminar es gratuita y sin
                compromiso.
              </p>
              {agendadoReciente ? (
                <p className="mt-6 rounded-[6px] bg-gris-claro p-4 text-[16px] leading-relaxed">
                  <strong>Tu reunión ya está agendada.</strong> Revisa tu correo para ver la confirmación.
                </p>
              ) : (
                <AgendaCalendly nombre={`${campos.nombre} ${campos.apellido}`.trim()} correo={campos.correo} />
              )}
            </div>
          ) : (
            <form noValidate onSubmit={enviar} aria-describedby={`${id}-consentimiento`}>
              <fieldset>
                <legend className={`${etiqueta} text-[17px]`}>¿Mantienes un contrato de promesa vigente?</legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-describedby={errores.calificador ? `${id}-calificador-error` : undefined}>
                  {(
                    [
                      ["vigente", "Sí, tengo un contrato vigente"],
                      ["asesoria", "Necesito asesoría"],
                    ] as const
                  ).map(([valor, texto], i) => (
                    <label
                      key={valor}
                      className="flex min-h-14 cursor-pointer items-center gap-3 rounded-[6px] border-2 border-gris-borde px-4 text-[16px] font-semibold transition-colors has-[:checked]:border-accion has-[:checked]:bg-naranja-suave has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accion has-[:focus-visible]:ring-offset-2"
                    >
                      <input
                        type="radio"
                        name="calificador"
                        value={valor}
                        id={i === 0 ? `${id}-calificador` : undefined}
                        checked={campos.calificador === valor}
                        onChange={() => actualizar("calificador", valor)}
                        className="size-5 shrink-0 accent-[var(--naranja-accion)]"
                      />
                      {texto}
                    </label>
                  ))}
                </div>
                {ayudaError("calificador")}
              </fieldset>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${id}-nombre`} className={etiqueta}>Nombre</label>
                  <input {...aria("nombre")} name="nombre" autoComplete="given-name" className={`${input} border-gris-borde`} value={campos.nombre} onChange={(e) => actualizar("nombre", e.target.value)} onBlur={() => alSalir("nombre")} />
                  {ayudaError("nombre")}
                </div>
                <div>
                  <label htmlFor={`${id}-apellido`} className={etiqueta}>Apellido</label>
                  <input {...aria("apellido")} name="apellido" autoComplete="family-name" className={`${input} border-gris-borde`} value={campos.apellido} onChange={(e) => actualizar("apellido", e.target.value)} onBlur={() => alSalir("apellido")} />
                  {ayudaError("apellido")}
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor={`${id}-telefono`} className={etiqueta}>Teléfono</label>
                <div className="relative mt-2">
                  <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 flex items-center border-r border-gris-borde px-4 text-[17px] text-gris-medio">
                    +56 9
                  </span>
                  <input
                    {...aria("telefono")}
                    name="telefono"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder="1234 5678"
                    aria-label="Teléfono, 8 dígitos después de +56 9"
                    className={`${input} mt-0 border-gris-borde pl-[84px] tracking-[0.04em]`}
                    value={formatoTelefono(campos.telefono)}
                    onChange={(e) => actualizar("telefono", normalizarTelefono(e.target.value))}
                    onBlur={() => alSalir("telefono")}
                  />
                </div>
                {ayudaError("telefono")}
              </div>

              <div className="mt-5">
                <label htmlFor={`${id}-correo`} className={etiqueta}>Correo</label>
                <input {...aria("correo")} name="correo" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} className={`${input} border-gris-borde`} value={campos.correo} onChange={(e) => actualizar("correo", e.target.value)} onBlur={() => alSalir("correo")} />
                {ayudaError("correo")}
              </div>

              <div className="mt-5">
                <label htmlFor={`${id}-caso`} className={etiqueta}>Cuéntanos tu caso</label>
                <textarea
                  {...aria("caso")}
                  name="caso"
                  rows={5}
                  placeholder="Describe brevemente qué pasó con tu contrato: rechazo de crédito, atraso en la entrega, cambio de condiciones u otra situación."
                  className={`${input} min-h-36 resize-y border-gris-borde py-3 leading-relaxed [field-sizing:content]`}
                  value={campos.caso}
                  onChange={(e) => actualizar("caso", e.target.value)}
                  onBlur={() => alSalir("caso")}
                />
                {ayudaError("caso")}
              </div>

              {/* Honeypot: invisible para personas, tentador para bots. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label>
                  Sitio web
                  <input type="text" name="sitio_web" tabIndex={-1} autoComplete="off" defaultValue="" />
                </label>
              </div>

              <p id={`${id}-consentimiento`} className="mt-7 rounded-[6px] bg-gris-claro p-4 text-[14px] leading-relaxed text-negro/80">
                Al presionar <strong>Enviar mi caso</strong> autorizo a Resuelve Tu Contrato a tratar mis datos
                personales con la única finalidad de contactarme y evaluar mi caso de recuperación del pie, conforme a
                la{" "}
                <Link href="/privacidad" className="font-semibold text-negro underline underline-offset-2">
                  Política de Privacidad
                </Link>
                . Mis datos se eliminan dentro de {SITE.retencionDias} días y puedo retirar este consentimiento en
                cualquier momento escribiendo a {SITE.correo}.
              </p>

              {estado === "error" && (
                <div role="alert" className="mt-5 rounded-[6px] border border-error/40 bg-error/5 p-4">
                  <p className="flex items-start gap-2 text-[15px] font-semibold text-error">
                    <WarningCircle size={20} weight="fill" className="mt-px shrink-0" aria-hidden="true" />
                    {mensajeError}
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <button type="submit" className={`${botonPrimario} w-full`}>
                      <ArrowClockwise size={20} weight="bold" aria-hidden="true" />
                      Reintentar
                    </button>
                    <a
                      href={whatsappUrl(`Hola, soy ${campos.nombre} ${campos.apellido}. Quise enviar el formulario de la web: ${campos.caso.slice(0, 300)}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[6px] border-2 border-negro px-6 text-[16px] font-semibold hover:bg-negro hover:text-blanco"
                    >
                      <WhatsappLogo size={22} aria-hidden="true" />
                      Escribir por WhatsApp
                    </a>
                  </div>
                </div>
              )}

              {estado !== "error" && (
                <button type="submit" disabled={estado === "enviando"} className={`${botonPrimario} mt-5 min-h-14 w-full text-[17px]`}>
                  {estado === "enviando" ? (
                    <>
                      <CircleNotch size={22} weight="bold" className="animate-spin" aria-hidden="true" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar mi caso"
                  )}
                </button>
              )}
              <p className="sr-only" aria-live="polite">{estado === "enviando" ? "Enviando tu caso" : ""}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
