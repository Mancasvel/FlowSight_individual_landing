/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "FlowSight Solo. Understand your work with private local AI.";
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
          color: "#0f172a",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "1px solid #e2e8f0",
          }}
        />
        {Array.from({ length: 22 }, (_, i) => <div key={`x-${i}`} style={{ position: "absolute", left: i * 56, top: 0, bottom: 0, width: 1, background: "rgba(15,23,42,.045)" }} />)}
        {Array.from({ length: 12 }, (_, i) => <div key={`y-${i}`} style={{ position: "absolute", top: i * 56, left: 0, right: 0, height: 1, background: "rgba(15,23,42,.045)" }} />)}
        <div style={{ display: "flex", width: "100%", padding: "58px", alignItems: "stretch", gap: "54px" }}>
          <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "24px", fontWeight: 700 }}>
              FlowSight / Solo
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", maxWidth: "660px", fontSize: "84px", lineHeight: 1.05, fontWeight: 700, letterSpacing: "-0.04em" }}>
                Understand your work.
              </div>
              <div style={{ display: "flex", color: "#007f78", fontSize: "23px", marginTop: "30px" }}>Plan. Focus. Review. With local AI.</div>
            </div>
          </div>
          <div style={{ display: "flex", width: "350px", borderRadius: "12px", background: "#e9f5f5", padding: "36px", alignItems: "center", justifyContent: "center" }}>
            <img
              src={screenshotUrl}
              alt=""
              width={230}
              height={460}
              style={{ borderRadius: "6px", boxShadow: "0 16px 35px rgba(22,44,31,.12)" }}
            />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
