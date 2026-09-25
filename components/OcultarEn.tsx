"use client";

import { usePathname } from "next/navigation";

/** No renderiza su contenido en las rutas indicadas (p. ej. la franja pre-footer en la página de campañas). */
export function OcultarEn({ rutas, children }: { rutas: string[]; children: React.ReactNode }) {
  const pathname = usePathname();
  return rutas.includes(pathname) ? null : children;
}
