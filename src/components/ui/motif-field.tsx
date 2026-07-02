import type { ComponentType, SVGProps } from "react";

type Placement = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  top: string;
  left: string;
  size: number;
  rotate: number;
  color: "teal" | "crimson" | "gold";
  opacity?: number;
};

const colorClass: Record<Placement["color"], string> = {
  teal: "text-teal",
  crimson: "text-crimson",
  gold: "text-gold",
};

// Fixed (not random) layouts — static export bakes these into the HTML,
// so randomizing at render time would mismatch on hydration.
export function MotifField({ placements }: { placements: Placement[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {placements.map(({ Icon, top, left, size, rotate, color, opacity = 0.09 }, i) => (
        <Icon
          key={i}
          className={colorClass[color]}
          style={{
            position: "absolute",
            top,
            left,
            width: size,
            height: size,
            opacity,
            transform: `rotate(${rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
