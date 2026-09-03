import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { CFG, CREAM, TITLE_FONT } from "../config";

// Locked from frame 0 — no intro, no glitch pops. Mixed-case centered
// headline per Figma 3383:31578 ("Bosses hiring / on Tal!").
export const FidgetTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 30fps authoring clock — keeps cadence identical at any render fps
  const vf = (frame * CFG.fps) / fps;

  const blockRot =
    CFG.titleRotDeg * Math.sin((vf / CFG.titleRotPeriod) * Math.PI * 2);

  return (
    <div
      style={{
        position: "absolute",
        top: CFG.titleTopPadding,
        left: CFG.titleSidePadding,
        right: CFG.titleSidePadding,
        transform: `rotate(${blockRot}deg)`,
        fontFamily: TITLE_FONT,
        fontSize: CFG.titleSize,
        lineHeight: `${CFG.titleLineHeightPx}px`,
        color: CREAM,
        textAlign: "center",
      }}
    >
      {CFG.titleLines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
};
