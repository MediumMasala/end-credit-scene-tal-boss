import React from "react";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { BossesOnTal } from "./BossesOnTal";

// GIF-only variant: bakes sub-frame motion blur into each frame so the crawl
// smears slightly instead of stepping — the classic low-fps smoothness trick.
// Static pixels (title, end card at park) blend to themselves and stay crisp;
// only the moving crawl picks up the blur. Render cost is ~samples× per frame.
export const BossesOnTalBlur: React.FC = () => {
  return (
    <CameraMotionBlur shutterAngle={200} samples={8}>
      <BossesOnTal />
    </CameraMotionBlur>
  );
};
