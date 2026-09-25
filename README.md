# resuelvetucontrato.com

Sitio de Resuelve Tu Contrato. Next.js 16 + Tailwind 4, pensado para desplegarse en Vercel.

## Desarrollo

```bash
npm install
npm run dev
```

## Dónde se cambia qué

| Qué | Archivo |
|---|---|
| Datos del estudio (RUT, dirección, WhatsApp, Calendly, redes) | `lib/site.ts` |
| Cifras (+1.000, +50, 80-100%) | `lib/site.ts` → `CIFRAS` |
| Causales, etapas, preguntas frecuentes, testimonios, equipo | `lib/contenido.ts` |
| Colores | `app/globals.css` |
| Política de privacidad | `app/privacidad/page.tsx` |

## Variables de entorno (Vercel → Settings → Environment Variables)

Ver `.env.example`. Obligatoria: `RTC_RESEND_API_KEY`. Los nombres llevan prefijo `RTC_` para no chocar con las variables de RTF, que están compartidas en el mismo equipo de Vercel. Recomendada: `RTC_META_CAPI_TOKEN`.

## Lanzamiento

1. Verificar el dominio en Resend (registros SPF/DKIM) para que los correos no caigan en spam.
2. Agregar `resuelvetucontrato.com` y `www.resuelvetucontrato.com` en Vercel.
3. En el DNS del dominio: cambiar solo los registros A/CNAME de la web. **No tocar los registros MX** (correo de Google Workspace).
4. Enviar un formulario de prueba y verificar el evento Lead en Meta Events Manager.
