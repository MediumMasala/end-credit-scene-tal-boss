import React from "react";
import { staticFile } from "remotion";
import { CFG, CREAM, CREDIT_FONT, TITLE_FONT } from "../config";

// FontAwesome brand glyphs (CC BY 4.0) — drawn in cream to keep the palette
const APPLE_PATH =
  "M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.7-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z";
const PLAY_PATH =
  "M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z";

const StoreBadge: React.FC<{
  icon: string;
  viewBox: string;
  topLine: string;
  bottomLine: string;
}> = ({ icon, viewBox, topLine, bottomLine }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 22,
      border: `3px solid ${CREAM}`,
      borderRadius: 18,
      padding: "18px 30px",
      height: CFG.badgeHeight,
      boxSizing: "border-box",
    }}
  >
    <svg viewBox={viewBox} width={CFG.badgeIconSize} height={CFG.badgeIconSize}>
      <path d={icon} fill={CREAM} />
    </svg>
    <div style={{ fontFamily: CREDIT_FONT, color: CREAM, textAlign: "left" }}>
      <div style={{ fontSize: 20, letterSpacing: "0.12em", opacity: 0.82 }}>
        {topLine}
      </div>
      <div style={{ fontSize: 42, lineHeight: 1.1 }}>{bottomLine}</div>
    </div>
  </div>
);

// Plain block — lives at the tail of the credit crawl and parks in place.
export const EndCard: React.FC = () => {
  const maskUrl = `url(${staticFile("tal-boss-wordmark.png")})`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: TITLE_FONT,
          fontSize: CFG.moreLineSize,
          lineHeight: 1.25,
          color: CREAM,
          letterSpacing: "0.06em",
          marginBottom: CFG.moreLineGap,
          whiteSpace: "pre-line",
          textAlign: "center",
        }}
      >
        {CFG.moreLineText}
      </div>
      {/* tal BOSS wordmark, masked to exact CREAM */}
      <div
        style={{
          width: CFG.wordmarkWidth,
          aspectRatio: "876 / 813",
          backgroundColor: CREAM,
          WebkitMaskImage: maskUrl,
          maskImage: maskUrl,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
      <div style={{ display: "flex", gap: CFG.badgeGap, marginTop: CFG.badgeTopGap }}>
        <StoreBadge
          icon={APPLE_PATH}
          viewBox="0 0 384 512"
          topLine="DOWNLOAD ON THE"
          bottomLine="APP STORE"
        />
        <StoreBadge
          icon={PLAY_PATH}
          viewBox="0 0 512 512"
          topLine="GET IT ON"
          bottomLine="GOOGLE PLAY"
        />
      </div>
    </div>
  );
};
