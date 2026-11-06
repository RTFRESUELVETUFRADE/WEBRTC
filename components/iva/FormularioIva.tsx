"use client";

import { ArrowClockwise, CheckCircle, CircleNotch, LockSimple, WarningCircle, WhatsappLogo } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { MENSAJES, RE_NOMBRE, correoValido, formatoTelefono, normalizarTelefono, separarNombre, telefonoValido } from "@/lib/formulario";
import { CLAVE_AGENDA, CLAVE_ENVIO_IVA, registrar, useRegistroReciente } from "@/lib/registro-local";
import { SITE, whatsappUrl } from "@/lib/site";
import { coincidenciaAvanzada, cookiesMeta, evento, leerAtribucion, leerConsentimiento } from "@/lib/tracking";
import { AgendaCalendly } from "../home/AgendaCalendly";
import { botonPrimario } from "../ui";

/**
 * Formulario corto de "Recupera tu IVA": las mismas preguntas del formulario instantáneo de Meta
 * (¿escrituraste entre abril y noviembre?, nombre, correo, teléfono). Llega a los mismos correos.
 */

type Campos = { escrituro: "si" | "aun-no" | ""; nombreCompleto: string; correo: string; telefono: string };
type Errores = Partial<Record<keyof Campos, string>>;
type Estado = "editando" | "enviando" | "exito" | "error" | "duplicado";

const VACIO: Campos = { escrituro: "", nombreCompleto: "", correo: "", telefono: "" };
const ORDEN: (keyof Campos)[] = ["escrituro", "nombreCompleto", "correo", "telefono"];

function validar(campo: keyof Campos, v: string): string | undefined {
  switch (campo) {
    case "escrituro":
      return v ? undefined : MENSAJES.opcion;
    case "nombreCompleto":
      if (v.trim().length < 3) return "Escribe tu nombre y apellido.";
      return RE_NOMBRE.test(v.trim()) ? undefined : MENSAJES.soloLetras;
    case "correo":
      return correoValido(v) ? undefined : MENSAJES.correo;
    case "telefono":
      return telefonoValido(v) ? undefined : MENSAJES.telefono;
  }
}

export function FormularioIva() {
  const [campos, setCampos] = useState<Campos>(VACIO);
  const [errores, setErrores] = useState<Errores>({});
  const [estado, setEstado] = useState<Estado>("editando");
  const [mensajeError, setMensajeError] = useState("");
  const enviadoReciente = useRegistroReciente(CLAVE_ENVIO_IVA);
  const agendadoReciente = useRegistroReciente(CLAVE_AGENDA);
  const inicio = useRef(0);
  const confirmacion = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    inicio.current = Date.now();
  }, []);

  useEffect(() => {
    if (estado === "exito" || estado === "duplicado") confirmacion.current?.focus();
  }, [estado]);

  const actualizar = (campo: keyof Campos, valor: string) => {
    setCampos((c) => ({ ...c, [campo]: valor }));
    if (errores[campo] && !validar(campo, valor)) setErrores((er) => ({ ...er, [campo]: undefined }));
  };
  const alSalir = (campo: keyof Campos) => {
    if (!campos[campo]) return;
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
      const res = await fetch("/api/iva", {
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
        registrar(CLAVE_ENVIO_IVA);
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
      const { nombre, apellido } = separarNombre(campos.nombreCompleto);
      await coincidenciaAvanzada({ correo: campos.correo, telefonoE164: `+569${campos.telefono}`, nombre, apellido }).catch(
        () => undefined
      );
      evento("Lead", { content_name: campos.escrituro === "si" ? "iva_escrituro" : "iva_aun_no", content_category: "iva" }, eventId);
      setEstado("exito");
      registrar(CLAVE_ENVIO_IVA);
    } catch {
      setMensajeError("No pudimos enviar tus datos. Inténtalo de nuevo o escríbenos directo por WhatsApp.");
      setEstado("error");
    }
  }

  const input =
    "mt-2 block min-h-12 w-full rounded-[6px] border border-gris-borde bg-blanco px-4 text-[17px] text-negro transition-colors placeholder:text-gris-medio focus:border-accion focus:ring-2 focus:ring-accion/20 focus:outline-none aria-[invalid=true]:border-error";
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

  const agenda = agendadoReciente ? (
    <p className="mt-6 rounded-[6px] bg-gris-claro p-4 text-[16px] leading-relaxed">
      <strong>Tu reunión ya está agendada.</strong> Revisa tu correo: ahí está la confirmación con el día y la hora.
    </p>
  ) : (
    <>
      <hr className="my-8 border-gris-borde" />
      <h3 className="text-[21px] font-bold">¿Prefieres adelantar tu reunión?</h3>
      <p className="mt-2 text-[16px] leading-relaxed text-negro/80">
        Reserva un horario con nuestros abogados. La reunión es gratuita y sin compromiso.
      </p>
      <AgendaCalendly nombre={campos.nombreCompleto.trim()} correo={campos.correo} />
    </>
  );

  if (estado === "exito" || estado === "duplicado" || (enviadoReciente && estado === "editando")) {
    const nuevo = estado === "exito";
    return (
      <div ref={confirmacion} tabIndex={-1} className="focus:outline-none" aria-live="polite">
        <CheckCircle size={52} weight="fill" className="text-accion" aria-hidden="true" />
        <h3 className="mt-4 text-[26px] leading-tight font-bold sm:text-[30px]">
          {nuevo ? "Recibimos tus datos." : "¡Ya tenemos tu consulta!"}
        </h3>
        <p className="mt-3 text-[17px] leading-relaxed text-negro/80">
          {nuevo
            ? "Te contactaremos por WhatsApp y correo, dentro del próximo día hábil, para conocer los detalles de tu caso y revisar si la devolución del IVA aplica a tu propiedad."
            : "Recibimos tu formulario hace poco y nuestro equipo ya lo tiene. Te contactaremos dentro del próximo día hábil, así que no necesitas enviarlo de nuevo."}
        </p>
        {agenda}
      </div>
    );
  }

  return (
    <form noValidate onSubmit={enviar} aria-describedby={`${id}-consentimiento`}>
      <fieldset>
        <legend className={`${etiqueta} text-[17px] leading-snug`}>
          ¿Escrituraste tu casa o departamento nuevo entre abril y noviembre de 2026?
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {(
            [
              ["si", "Sí, escrituré"],
              ["aun-no", "Aún no escrituro"],
            ] as const
          ).map(([valor, texto], i) => (
            <label
              key={valor}
              className="flex min-h-14 cursor-pointer items-center gap-3 rounded-[6px] border-2 border-gris-borde px-4 text-[16px] font-semibold transition-colors has-[:checked]:border-accion has-[:checked]:bg-naranja-suave has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accion has-[:focus-visible]:ring-offset-2"
            >
              <input
                type="radio"
                name="escrituro"
                value={valor}
                id={i === 0 ? `${id}-escrituro` : undefined}
                checked={campos.escrituro === valor}
                onChange={() => actualizar("escrituro", valor)}
                className="size-5 shrink-0 accent-[var(--naranja-texto)]"
              />
              {texto}
            </label>
          ))}
        </div>
        {ayudaError("escrituro")}
      </fieldset>

      <div className="mt-6">
        <label htmlFor={`${id}-nombreCompleto`} className={etiqueta}>Nombre y apellido</label>
        <input {...aria("nombreCompleto")} name="nombreCompleto" autoComplete="name" className={input} value={campos.nombreCompleto} onChange={(e) => actualizar("nombreCompleto", e.target.value)} onBlur={() => alSalir("nombreCompleto")} />
        {ayudaError("nombreCompleto")}
      </div>

      <div className="mt-5">
        <label htmlFor={`${id}-correo`} className={etiqueta}>Correo</label>
        <input {...aria("correo")} name="correo" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} className={input} value={campos.correo} onChange={(e) => actualizar("correo", e.target.value)} onBlur={() => alSalir("correo")} />
        {ayudaError("correo")}
      </div>

      <div className="mt-5">
        <label htmlFor={`${id}-telefono`} className={etiqueta}>Teléfono (WhatsApp)</label>
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
            className={`${input} mt-0 pl-[84px] tracking-[0.04em]`}
            value={formatoTelefono(campos.telefono)}
            onChange={(e) => actualizar("telefono", normalizarTelefono(e.target.value))}
            onBlur={() => alSalir("telefono")}
          />
        </div>
        {ayudaError("telefono")}
      </div>

      {/* Honeypot: invisible para personas, tentador para bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Sitio web
          <input type="text" name="sitio_web" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <p id={`${id}-consentimiento`} className="mt-7 flex gap-2 rounded-[6px] bg-gris-claro p-4 text-[14px] leading-relaxed text-negro/80">
        <LockSimple size={18} weight="bold" className="mt-0.5 shrink-0 text-negro" aria-hidden="true" />
        <span>
          Al presionar <strong>Enviar</strong> autorizo a Resuelve Tu Contrato a tratar mis datos con la única finalidad de
          contactarme y evaluar la devolución del IVA de mi propiedad, conforme a la{" "}
          <Link href="/privacidad" className="font-semibold text-negro underline underline-offset-2">
            Política de Privacidad
          </Link>
          . Mis datos se eliminan dentro de {SITE.retencionDias} días.
        </span>
      </p>

      {estado === "error" ? (
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
              href={whatsappUrl(`Hola, soy ${campos.nombreCompleto}. Quiero consultar por la devolución del IVA de mi vivienda nueva.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[6px] border-2 border-negro px-6 text-[16px] font-semibold hover:bg-negro hover:text-blanco"
            >
              <WhatsappLogo size={22} aria-hidden="true" />
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      ) : (
        <button type="submit" disabled={estado === "enviando"} className={`${botonPrimario} mt-5 min-h-14 w-full text-[17px]`}>
          {estado === "enviando" ? (
            <>
              <CircleNotch size={22} weight="bold" className="animate-spin" aria-hidden="true" />
              Enviando...
            </>
          ) : (
            "Enviar"
          )}
        </button>
      )}
      <p className="sr-only" aria-live="polite">{estado === "enviando" ? "Enviando tus datos" : ""}</p>
    </form>
  );
}
