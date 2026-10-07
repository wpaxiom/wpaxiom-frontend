import { ImageResponse } from "next/og";

export const alt = "wpaxiom — WordPress plugins, refined";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 78px",
          color: "#f5f3ef",
          background:
            "radial-gradient(circle at 82% 18%, rgba(244, 112, 88, 0.28), transparent 32%), linear-gradient(135deg, #101112 0%, #191b1d 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: "58px",
              height: "58px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "15px",
              color: "#ffffff",
              background: "#f47058",
              fontSize: "31px",
              fontWeight: 700,
            }}
          >
            w
          </div>
          <div style={{ display: "flex", fontSize: "34px", fontWeight: 600, letterSpacing: "-1px" }}>
            wpaxiom
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: "900px" }}>
          <div style={{ display: "flex", color: "#f47058", fontSize: "21px", letterSpacing: "3px" }}>
            WORDPRESS PLUGINS
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "22px",
              fontSize: "70px",
              fontWeight: 700,
              letterSpacing: "-3px",
              lineHeight: 1.02,
            }}
          >
            Built with precision.
          </div>
          <div style={{ display: "flex", marginTop: "24px", color: "#a9aaad", fontSize: "27px" }}>
            Focused tools for WordPress developers.
          </div>
        </div>

        <div style={{ display: "flex", color: "#777a7e", fontSize: "18px" }}>
          wpaxiom.com
        </div>
      </div>
    ),
    size,
  );
}

