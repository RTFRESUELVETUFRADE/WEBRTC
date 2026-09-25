import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { LOGO_PATHS } from "@/components/brand-paths";

export const alt = "Resuelve Tu Contrato: recuperamos el pie atrapado en tu contrato de promesa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagen que se ve al compartir el sitio por WhatsApp, Facebook o LinkedIn. */
export default async function Image() {
  const foto = await readFile(join(process.cwd(), "assets/og-base.jpg"), "base64");
  const fuente = await readFile(join(process.cwd(), "assets/SourceSans3-Bold.ttf"));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#1a1a1a", fontFamily: "Source Sans 3" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/jpeg;base64,${foto}`} width={1200} height={630} style={{ position: "absolute", top: 0, left: 0 }} alt="" />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            background: "linear-gradient(90deg, rgba(26,26,26,0.94) 0%, rgba(26,26,26,0.8) 45%, rgba(26,26,26,0.1) 80%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", width: 720 }}>
          <svg viewBox="225 530 1085 450" width={170} height={70} fill="#fc6135">
            <g transform="translate(0,1500) scale(0.1,-0.1)">
              {LOGO_PATHS.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </g>
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 64, fontWeight: 700, color: "#ffffff", lineHeight: 1.05, letterSpacing: -1 }}>
              Recuperamos el pie atrapado en tu contrato de promesa.
            </div>
            <div style={{ marginTop: 24, fontSize: 26, color: "rgba(255,255,255,0.85)" }}>
              Abogados inmobiliarios. Primera reunión sin costo.
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Source Sans 3", data: fuente, weight: 700, style: "normal" }] }
  );
}
