import React from "react";
import { random, useCurrentFrame, useVideoConfig } from "remotion";
import { CFG, CREAM, TITLE_FONT } from "../config";

// Lines as arrays of glyphs. "  " in "ON  TAL" becomes two fixed-width gap
// spans so the justified layout mirrors the static creative.
const LINES: string[][] = [
  ["B", "O", "S", "S", "E", "S"],
  ["O", "N", " ", " ", "T", "A", "L"],
];

// Locked from frame 0 — no intro, no glitch pops. Only a barely-perceptible
// film-gate shimmer per glyph plus a slow sine sway of the whole block.
export const FidgetTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 30fps authoring clock — keeps shimmer cadence identical at any render fps
  const vf = (frame * CFG.fps) / fps;

  const tick = Math.floor(vf / CFG.jitterTick);

  const blockRot =
    CFG.titleRotDeg * Math.sin((vf / CFG.titleRotPeriod) * Math.PI * 2);

  let glyphIndex = 0;

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
        lineHeight: CFG.titleLineHeight,
        color: CREAM,
        textTransform: "uppercase",
      }}
    >
      {LINES.map((chars, lineIdx) => (
        <div
          key={lineIdx}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {chars.map((ch, i) => {
            if (ch === " ") {
              return <span key={i} style={{ width: CFG.titleWordGap }} />;
            }
            const g = glyphIndex++;
            const dx = (random(`x-${g}-${tick}`) - 0.5) * 2 * CFG.jitterX;
            const dy = (random(`y-${g}-${tick}`) - 0.5) * 2 * CFG.jitterY;
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  transform: `translate(${dx}px, ${dy}px)`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
