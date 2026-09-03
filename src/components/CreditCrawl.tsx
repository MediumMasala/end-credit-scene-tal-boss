import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CFG,
  COMPANY_FONT,
  ROLE_FONT,
  WHITE,
  contentHeight,
  crawlFrames,
  crawlStopY,
} from "../config";
import { CREDITS } from "../data/credits";
import { EndCard } from "./EndCard";

export const CreditCrawl: React.FC = () => {
  const frame = useCurrentFrame();
  const { height, fps } = useVideoConfig();
  // frame on the 30fps authoring clock — 60fps comps sample the same motion
  const vf = (frame * CFG.fps) / fps;

  const rows = CREDITS.length;
  const duration = crawlFrames(height, rows);

  // Linear crawl that STOPS with the CTA parked in frame (the clamp holds it)
  const rawY = interpolate(
    vf,
    [CFG.crawlStart, CFG.crawlStart + duration],
    [height, crawlStopY(height, rows)],
    { easing: Easing.linear, extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  // Low-fps GIF comps: whole-pixel steps, or the antialiasing lands differently
  // every frame and the crawl shimmers. High-fps comps keep subpixel motion.
  const y = fps <= 30 ? Math.round(rawY) : rawY;

  const mask = `linear-gradient(to bottom,
    rgba(0,0,0,0) 0px,
    rgba(0,0,0,0) ${CFG.topMaskStart}px,
    rgba(0,0,0,1) ${CFG.topMaskEnd}px,
    rgba(0,0,0,1) calc(100% - ${CFG.bottomMaskPx}px),
    rgba(0,0,0,0) 100%)`;

  return (
    <>
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    >
      <div style={{ transform: `translateY(${y}px)` }}>
        {CREDITS.map((row, i) => {
          // Per-row breathing so the crawl doesn't feel like a rigid CSS scroll
          const jx = CFG.rowJitter * Math.sin(vf * 0.31 + i * 1.7);
          const jy = CFG.rowJitter * Math.sin(vf * 0.27 + i * 2.3);
          return (
            <div
              key={i}
              style={{
                height: CFG.rowSpacing,
                display: "flex",
                alignItems: "baseline",
                transform: `translate(${jx}px, ${jy}px)`,
                textTransform: "uppercase",
              }}
            >
              <div
                style={{
                  width: CFG.companyColWidth,
                  flexShrink: 0,
                  textAlign: "right",
                  fontFamily: COMPANY_FONT,
                  fontSize: CFG.companySize,
                  color: WHITE,
                  lineHeight: `${CFG.rowSpacing}px`,
                  whiteSpace: "nowrap",
                  // long names overflow to the LEFT so the centre axis never shifts
                  minWidth: 0,
                  direction: "rtl",
                }}
              >
                {row.company}
              </div>
              <div style={{ width: CFG.columnGutter, flexShrink: 0 }} />
              <div
                style={{
                  flex: 1,
                  textAlign: "left",
                  fontFamily: ROLE_FONT,
                  fontSize: CFG.roleSize,
                  color: WHITE,
                  whiteSpace: "nowrap",
                  minWidth: 0,
                }}
              >
                {row.role}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    {/* CTA rides the same crawl but outside the mask so it never dissolves */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: contentHeight(rows) + CFG.endCardGap,
          transform: `translateY(${y}px)`,
        }}
      >
        <EndCard />
      </div>
    </div>
    </>
  );
};
