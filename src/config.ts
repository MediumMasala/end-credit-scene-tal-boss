import { continueRender, delayRender, cancelRender, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

// ---------------------------------------------------------------------------
// Brand tokens
// ---------------------------------------------------------------------------
export const BG = "#000000";
export const CREAM = "#F9F5E3";
export const CREAM_DIM = "rgba(249,245,227,0.82)";

// ---------------------------------------------------------------------------
// Fonts — two slots, both local files. No Google Fonts, no system fallback.
// ---------------------------------------------------------------------------
export const TITLE_FONT = "ObviouslyWideBold";
export const CREDIT_FONT = "ObviouslyNarrowBold";

const TITLE_FONT_FILE = "fonts/ObviouslyDemo-WideBold.otf";
const CREDIT_FONT_FILE = "fonts/ObviouslyDemo-NarrowBold.otf";

const fontsReady = delayRender("loading Obviously fonts");
Promise.all([
  loadFont({ family: TITLE_FONT, url: staticFile(TITLE_FONT_FILE) }),
  loadFont({ family: CREDIT_FONT, url: staticFile(CREDIT_FONT_FILE) }),
])
  .then(() => continueRender(fontsReady))
  .catch((err) => {
    cancelRender(
      new Error(`Font failed to load — check public/${TITLE_FONT_FILE} and public/${CREDIT_FONT_FILE}: ${err}`)
    );
  });

// ---------------------------------------------------------------------------
// Every magic number lives here.
// ---------------------------------------------------------------------------
export const CFG = {
  fps: 30,

  // -- scene timing (frames) --
  crawlStart: 12, // credits enter from below (title is locked from frame 0)
  endHoldFrames: 75, // hold on the CTA after the crawl stops (2.5s)

  // -- title --
  titleSize: 144,
  titleLineHeight: 1.0,
  titleTopPadding: 36,
  titleSidePadding: 44,
  titleWordGap: 46, // width of EACH of the two spaces in "ON  TAL"

  // -- title jitter — OFF (read as jittery against the smooth 60fps crawl) --
  jitterTick: 4, // refresh every N frames
  jitterX: 0, // ±px
  jitterY: 0, // ±px
  titleRotDeg: 0, // ± block rotation
  titleRotPeriod: 120, // frames per full sine cycle

  // -- credit crawl --
  companySize: 86,
  roleSize: 40,
  columnGutter: 56,
  rowSpacing: 120, // vertical rhythm between rows
  crawlPxPerFrame: 10, // constant velocity — never scales with row count
  rowJitter: 0, // ±px per row — off, rows ride the crawl dead-steady
  // Rows are fully invisible above topMaskStart (below the title block) and
  // fully visible from topMaskEnd — they never overlap the headline glyphs.
  topMaskStart: 370,
  topMaskEnd: 560,
  bottomMaskPx: 120, // rows materialise at the bottom edge

  // -- film stock --
  grainBaseFrequency: 0.9,
  grainOctaves: 3,
  grainSeeds: 5, // seed = frame % N
  grainOpacity: 0, // dead-still mandate (2026-09-02) — no flicker of any kind
  vignetteStrength: 0.4,
  weaveX: 0, // ±px — gate weave off, frame stays planted
  weaveY: 0, // ±px
  weaveTick: 5, // refresh every N frames
  weaveRotDeg: 0,
  weaveRotPeriod: 120,
  cueMarkEvery: 150, // frames
  cueMarkFrames: 0, // visible duration — 0 = cue mark off (dead-still mandate)
  cueMarkSize: 26,
  cueMarkInset: 40,
  midFlashFrames: [] as number[], // 1-frame cream flashes — disabled
  midFlashOpacity: 0.12,

  // -- end card (scrolls up with the credits and parks below the title) --
  wordmarkWidth: 380,
  endCardGap: 200, // space between the last credit row and the CTA block
  endCardLift: 200, // px the parked CTA sits above the default midpoint
  moreLineText: "& 1,400 MORE ENGINEERING\nAND PRODUCT LEADERS ON",
  moreLineSize: 54,
  moreLineGap: 70, // space between the lead-in line and the wordmark
  badgeHeight: 104,
  badgeIconSize: 52,
  badgeGap: 28,
  badgeTopGap: 72,
} as const;

// ---------------------------------------------------------------------------
// Derived timing — crawl speed stays constant no matter how many rows exist;
// the composition length stretches instead (see calculateMetadata in Root).
// The end card is the crawl's last block: the crawl stops (rather than exiting
// the top) when the CTA reaches its rest position in the lower half of frame.
// ---------------------------------------------------------------------------
export const contentHeight = (rows: number): number => rows * CFG.rowSpacing;

// lead-in line + wordmark (PNG aspect 876x813) + gap + badge row
export const endCardHeight = (): number =>
  Math.round(CFG.moreLineSize * 1.2) +
  CFG.moreLineGap +
  Math.round((CFG.wordmarkWidth * 813) / 876) +
  CFG.badgeTopGap +
  CFG.badgeHeight;

// Final translateY of the crawl container: CTA centre parks at the midpoint
// between the title zone and the bottom edge.
export const crawlStopY = (canvasHeight: number, rows: number): number => {
  const targetCenter = (CFG.topMaskEnd + canvasHeight) / 2 - CFG.endCardLift;
  const ctaCenterInContent =
    contentHeight(rows) + CFG.endCardGap + endCardHeight() / 2;
  return targetCenter - ctaCenterInContent;
};

export const crawlFrames = (canvasHeight: number, rows: number): number =>
  Math.ceil((canvasHeight - crawlStopY(canvasHeight, rows)) / CFG.crawlPxPerFrame);

// All CFG frame values are authored on the 30fps clock; comps at other rates
// stretch the frame count so real-time pacing is unchanged.
export const totalFrames = (
  canvasHeight: number,
  rows: number,
  fps: number = CFG.fps
): number =>
  Math.round(
    (CFG.crawlStart + crawlFrames(canvasHeight, rows) + CFG.endHoldFrames) *
      (fps / CFG.fps)
  );
