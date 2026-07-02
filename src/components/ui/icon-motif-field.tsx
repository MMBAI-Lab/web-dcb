import type { CSSProperties } from "react";
import { asset } from "@/lib/asset";

export type IconName =
  | "microscopio"
  | "celula-vegetal"
  | "neurona"
  | "moleculas"
  | "monitor"
  | "pez"
  | "vaca"
  | "pastillas"
  | "hojas"
  | "jeringa";

type Placement = {
  icon: IconName;
  top: string;
  left: string;
  size: number;
  rotate: number;
  opacity?: number;
  duration?: number;
  delay?: number;
  driftX?: number;
  driftY?: number;
};

// The user's own hand-picked icon set (data/old/images/IconosDCB_fondo.svg),
// extracted to individual transparent PNGs — full color, used as a
// background texture. Fixed (not random) layout so static export stays
// hydration-safe.
export function IconMotifField({ placements }: { placements: Placement[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {placements.map(
        (
          { icon, top, left, size, rotate, opacity = 0.55, duration = 14, delay = 0, driftX = 10, driftY = -16 },
          i,
        ) => (
          <img
            key={i}
            src={asset(`/images/motifs/${icon}.png`)}
            alt=""
            className="motif-floating"
            style={
              {
                position: "absolute",
                top,
                left,
                width: size,
                height: "auto",
                opacity,
                "--motif-rotate": `${rotate}deg`,
                "--motif-duration": `${duration}s`,
                "--motif-delay": `${delay}s`,
                "--motif-drift-x": `${driftX}px`,
                "--motif-drift-y": `${driftY}px`,
              } as CSSProperties
            }
          />
        ),
      )}
    </div>
  );
}
