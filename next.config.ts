import type { NextConfig } from "next";

const dev = process.env.NODE_ENV !== "production";

/**
 * Política de seguridad de contenido: el sitio solo puede cargar código propio,
 * el Pixel de Meta y Calendly. Cualquier otro script inyectado queda bloqueado.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""} https://connect.facebook.net https://assets.calendly.com`,
  "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
  "img-src 'self' data: blob: https://www.facebook.com https://*.calendly.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.facebook.com https://connect.facebook.net https://*.calendly.com",
  "frame-src https://calendly.com https://*.calendly.com",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  ...(dev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
        ],
      },
    ];
  },
  async redirects() {
    // URLs del sitio WordPress anterior, para no perder visitas ni anuncios que aún apunten a ellas.
    return [
      { source: "/formulario", destination: "/#formulario", permanent: true },
      // Por si alguien escribe la dirección con ñ.
      { source: "/formulario-campa%C3%B1as", destination: "/formulario-campanas", permanent: true },
      { source: "/formulario/", destination: "/#formulario", permanent: true },
      { source: "/politica-de-privacidad-y-proteccion-de-datos-personales/:rest*", destination: "/privacidad", permanent: true },
      { source: "/politica-de-privacidad/:rest*", destination: "/privacidad", permanent: true },
      { source: "/contacto/:rest*", destination: "/#formulario", permanent: true },
    ];
  },
};

export default nextConfig;
