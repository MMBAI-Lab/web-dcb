import type { ComponentType, CSSProperties, SVGProps } from "react";

type Placement = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  top: string;
  left: string;
  size: number;
  rotate: number;
  color: "teal" | "crimson" | "gold" | "gray";
  opacity?: number;
  duration?: number;
  delay?: number;
  driftX?: number;
  driftY?: number;
};

const colorClass: Record<Placement["color"], string> = {
  teal: "text-teal",
  crimson: "text-crimson",
  gold: "text-gold",
  // "Gray" isn't a new hue — it's the page's own foreground (black in
  // light mode, white in dark) at partial opacity, per the strict
  // teal/crimson/gold + black/white palette.
  gray: "text-foreground",
};

// Fixed (not random) layouts — static export bakes these into the HTML,
// so randomizing at render time would mismatch on hydration. Items are
// free to overlap as they drift; that's intentional, like notes floating
// behind sheet music.
export function MotifField({ placements }: { placements: Placement[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {placements.map(
        (
          {
            Icon,
            top,
            left,
            size,
            rotate,
            color,
            opacity = 0.16,
            duration = 14,
            delay = 0,
            driftX = 10,
            driftY = -16,
          },
          i,
        ) => (
          <Icon
            key={i}
            className={`motif-floating ${colorClass[color]}`}
            style={
              {
                position: "absolute",
                top,
                left,
                width: size,
                height: size,
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
