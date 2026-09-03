// Render:
//   npx remotion render BossesOnTal out/bosses-on-tal.mp4 --codec=h264
//   npx remotion render BossesOnTal-Story out/bosses-on-tal-story.mp4 --codec=h264
//   npx remotion render BossesOnTal-60 out/bosses-on-tal-60fps.mp4 --codec=h264
import React from "react";
import { Composition } from "remotion";
import { BossesOnTal } from "./BossesOnTal";
import { BossesOnTalBlur } from "./BossesOnTalBlur";
import { CFG, totalFrames } from "./config";
import { CREDITS } from "./data/credits";

// Duration derives from row count + canvas height so the crawl velocity
// stays constant when rows are added — the piece gets longer, never faster.
const metadataFor = (height: number, fps: number) => () => ({
  durationInFrames: totalFrames(height, CREDITS.length, fps),
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BossesOnTal"
        component={BossesOnTal}
        width={1080}
        height={1350}
        fps={CFG.fps}
        durationInFrames={totalFrames(1350, CREDITS.length)}
        calculateMetadata={metadataFor(1350, CFG.fps)}
      />
      <Composition
        id="BossesOnTal-Story"
        component={BossesOnTal}
        width={1080}
        height={1920}
        fps={CFG.fps}
        durationInFrames={totalFrames(1920, CREDITS.length)}
        calculateMetadata={metadataFor(1920, CFG.fps)}
      />
      <Composition
        id="BossesOnTal-60"
        component={BossesOnTal}
        width={1080}
        height={1350}
        fps={60}
        durationInFrames={totalFrames(1350, CREDITS.length, 60)}
        calculateMetadata={metadataFor(1350, 60)}
      />
      {/* 25fps = exact 40ms GIF delay — even cadence in EVERY browser incl.
          old Safari. The -Blur twin bakes sub-frame motion blur into each
          frame (GIF smoothness trick). GIF-export comps only. */}
      <Composition
        id="BossesOnTal-25"
        component={BossesOnTal}
        width={1080}
        height={1350}
        fps={25}
        durationInFrames={totalFrames(1350, CREDITS.length, 25)}
        calculateMetadata={metadataFor(1350, 25)}
      />
      <Composition
        id="BossesOnTal-30-Blur"
        component={BossesOnTalBlur}
        width={1080}
        height={1350}
        fps={30}
        durationInFrames={totalFrames(1350, CREDITS.length, 30)}
        calculateMetadata={metadataFor(1350, 30)}
      />
      <Composition
        id="BossesOnTal-25-Blur"
        component={BossesOnTalBlur}
        width={1080}
        height={1350}
        fps={25}
        durationInFrames={totalFrames(1350, CREDITS.length, 25)}
        calculateMetadata={metadataFor(1350, 25)}
      />
      {/* 50fps exists ONLY for GIF export — 50fps = exact 20ms GIF frame
          delay, the browser minimum, so the GIF plays evenly with no
          timing quantization. Do not use for MP4 (60 is smoother). */}
      <Composition
        id="BossesOnTal-45"
        component={BossesOnTal}
        width={1080}
        height={1350}
        fps={45}
        durationInFrames={totalFrames(1350, CREDITS.length, 45)}
        calculateMetadata={metadataFor(1350, 45)}
      />
      <Composition
        id="BossesOnTal-50"
        component={BossesOnTal}
        width={1080}
        height={1350}
        fps={50}
        durationInFrames={totalFrames(1350, CREDITS.length, 50)}
        calculateMetadata={metadataFor(1350, 50)}
      />
      <Composition
        id="BossesOnTal-Story-60"
        component={BossesOnTal}
        width={1080}
        height={1920}
        fps={60}
        durationInFrames={totalFrames(1920, CREDITS.length, 60)}
        calculateMetadata={metadataFor(1920, 60)}
      />
    </>
  );
};
