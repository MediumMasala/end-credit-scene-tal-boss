import React from "react";
import { AbsoluteFill } from "remotion";
import { BG } from "./config";
import { FidgetTitle } from "./components/FidgetTitle";
import { CreditCrawl } from "./components/CreditCrawl";
import { FilmStock } from "./components/FilmStock";

export const BossesOnTal: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <FilmStock>
        {/* End card rides at the tail of the crawl and parks in place */}
        <CreditCrawl />
        <FidgetTitle />
      </FilmStock>
    </AbsoluteFill>
  );
};
