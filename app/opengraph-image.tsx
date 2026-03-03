import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

export const alt = "Orientia — Sistema de Informes Psicopedagógicos con IA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(
    path.join(process.cwd(), "public/icons/logo-250.png"),
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0b1320",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          width={110}
          height={110}
          alt=""
          style={{ marginBottom: "36px" }}
        />

        {/* Brand name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#00bf63",
            letterSpacing: "-1px",
            marginBottom: "20px",
          }}
        >
          Orientia
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 34,
            color: "#cbd5e1",
            textAlign: "center",
            lineHeight: 1.35,
            maxWidth: 800,
          }}
        >
          Sistema de Informes Psicopedagógicos con IA
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 52,
            fontSize: 22,
            color: "#475569",
            letterSpacing: "0.5px",
          }}
        >
          orientia.es
        </div>
      </div>
    ),
    { ...size },
  );
}
