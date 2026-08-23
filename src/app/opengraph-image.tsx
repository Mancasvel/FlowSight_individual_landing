/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "FlowSight Individual private work intelligence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const screenshot = await readFile(path.join(process.cwd(), "public", "product", "flowsight-summary.png"));
  const screenshotUrl = `data:image/png;base64,${screenshot.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#fbfcfb",
          color: "#071316",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(7,19,22,.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(7,19,22,.055) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div style={{ display: "flex", width: "100%", padding: "58px", alignItems: "stretch", gap: "54px" }}>
          <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "24px", fontWeight: 700 }}>
              <div style={{ display: "flex", width: "30px", height: "30px", borderRadius: "15px", background: "#008f84" }} />
              FlowSight Individual
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", color: "#087b73", fontSize: "18px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Private work intelligence
              </div>
              <div style={{ display: "flex", marginTop: "22px", maxWidth: "660px", fontSize: "68px", lineHeight: 0.98, fontWeight: 750, letterSpacing: "-0.055em" }}>
                See your work. Own your focus.
              </div>
            </div>
          </div>
          <div style={{ display: "flex", width: "350px", borderRadius: "24px", background: "#071419", padding: "36px", alignItems: "center", justifyContent: "center" }}>
            <img
              src={screenshotUrl}
              alt=""
              width={230}
              height={460}
              style={{ borderRadius: "18px", border: "1px solid rgba(255,255,255,.18)", boxShadow: "0 24px 60px rgba(0,0,0,.28)" }}
            />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
