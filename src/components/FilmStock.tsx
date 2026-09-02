import React, { useId } from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { CFG, CREAM } from "../config";

// Wraps the whole piece: gate weave moves the frame contents; grain,
// vignette, cue mark and flashes sit on top of everything.
export const FilmStock: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 30fps authoring clock; grain below intentionally stays on the REAL frame
  // so higher-fps renders get fresh grain every frame
  const vf = (frame * CFG.fps) / fps;
  const filterId = useId();

  // Gate weave — seeded random, refreshed every few frames
  const wTick = Math.floor(vf / CFG.weaveTick);
  const wx = (random(`wx-${wTick}`) - 0.5) * 2 * CFG.weaveX;
  const wy = (random(`wy-${wTick}`) - 0.5) * 2 * CFG.weaveY;
  const wRot =
    CFG.weaveRotDeg * Math.sin((vf / CFG.weaveRotPeriod) * Math.PI * 2);

  // Cue mark — 2 frames every ~150
  const cueVisible =
    vf > CFG.cueMarkEvery / 2 && vf % CFG.cueMarkEvery < CFG.cueMarkFrames;

  const midFlash = (CFG.midFlashFrames as readonly number[]).includes(
    Math.floor(vf)
  );

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{ transform: `translate(${wx}px, ${wy}px) rotate(${wRot}deg)` }}
      >
        {children}
      </AbsoluteFill>

      {/* Grain — cycling 5 turbulence seeds keeps it cheap and deterministic */}
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          inset: 0,
          mixBlendMode: "overlay",
          opacity: CFG.grainOpacity,
          pointerEvents: "none",
        }}
      >
        <filter id={filterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency={CFG.grainBaseFrequency}
            numOctaves={CFG.grainOctaves}
            seed={frame % CFG.grainSeeds}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} />
      </svg>

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 68%, rgba(0,0,0,${CFG.vignetteStrength}) 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* Cue mark */}
      {cueVisible && (
        <div
          style={{
            position: "absolute",
            top: CFG.cueMarkInset,
            right: CFG.cueMarkInset,
            width: CFG.cueMarkSize,
            height: CFG.cueMarkSize,
            borderRadius: "50%",
            backgroundColor: CREAM,
          }}
        />
      )}

      {/* 1-frame mid-roll flashes */}
      {midFlash && (
        <AbsoluteFill
          style={{ backgroundColor: CREAM, opacity: CFG.midFlashOpacity }}
        />
      )}
    </AbsoluteFill>
  );
};
