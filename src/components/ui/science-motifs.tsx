import type { SVGProps } from "react";

// Loose line-art scientific doodles used as background texture — never
// meant to be read as icons, just faint motifs (like sheet-music notes
// scattered behind a page) that hint at the department's research areas.

function Base(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
}

export function DnaMotif(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M35 5c0 20 50 20 50 40s-50 20-50 40 50 20 50 30" />
      <path d="M85 5c0 20-50 20-50 40s50 20 50 40-50 20-50 30" />
      <path d="M38 20h44M36 40h48M38 60h44M36 80h48M40 100h40" />
    </Base>
  );
}

export function MoleculeMotif(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M60 10 100 32v46L60 100 20 78V32Z" />
      <path d="M60 10V45M100 32 60 45 20 32M60 45v55" />
      <circle cx="60" cy="10" r="5" />
      <circle cx="100" cy="32" r="5" />
      <circle cx="100" cy="78" r="5" />
      <circle cx="60" cy="100" r="5" />
      <circle cx="20" cy="78" r="5" />
      <circle cx="20" cy="32" r="5" />
      <circle cx="60" cy="45" r="5" />
    </Base>
  );
}

export function PhyloTreeMotif(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M10 60h20M30 60 55 20M30 60 55 100M55 20h35M55 100h20M75 20 95 8M75 20 95 34M75 100 95 88M75 100 95 112M95 8h20M95 34h20M95 88h20M95 112h20" />
    </Base>
  );
}

export function CellMotif(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M60 8c28 0 47 15 50 38 2 18-6 30-4 45 2 17-12 27-30 25-10-1-14 8-26 6C31 118 15 104 12 84 9 62 18 46 20 32 23 15 40 8 60 8Z" />
      <circle cx="66" cy="55" r="16" />
      <circle cx="66" cy="55" r="4" fill="currentColor" stroke="none" />
      <circle cx="34" cy="80" r="4" fill="currentColor" stroke="none" />
      <circle cx="88" cy="82" r="3" fill="currentColor" stroke="none" />
      <circle cx="40" cy="40" r="3" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function ChromosomeMotif(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M60 10c-16 14-16 32 0 50 16 18 16 36 0 50" />
      <path d="M60 10c16 14 16 32 0 50-16 18-16 36 0 50" />
      <path d="M60 10c-16 14-16 32 0 50" transform="translate(0 0) rotate(180 60 60)" />
      <path d="M60 10c16 14 16 32 0 50 16 18 16 36 0 50" transform="rotate(180 60 60)" />
    </Base>
  );
}

export function NetworkMotif(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M18 30 55 15 95 25 105 65 70 105 30 90 15 55Z" />
      <path d="M55 15 60 55M95 25 60 55M105 65 60 55M70 105 60 55M30 90 60 55M15 55 60 55" />
      <circle cx="18" cy="30" r="4" />
      <circle cx="55" cy="15" r="4" />
      <circle cx="95" cy="25" r="4" />
      <circle cx="105" cy="65" r="4" />
      <circle cx="70" cy="105" r="4" />
      <circle cx="30" cy="90" r="4" />
      <circle cx="15" cy="55" r="4" />
      <circle cx="60" cy="55" r="5" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function MicroscopeMotif(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M40 108h40M60 108V94" />
      <rect x="30" y="94" width="60" height="10" rx="3" />
      <path d="M62 94V50a10 10 0 0 1 10-10h6" />
      <circle cx="62" cy="38" r="12" />
      <path d="M53 30 44 21M46 46l-11 4" />
      <path d="M44 60h-8a6 6 0 0 0-6 6v6a6 6 0 0 0 6 6h8" />
    </Base>
  );
}

export function FlaskMotif(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M48 8h24M52 8v30L28 90a8 8 0 0 0 7 12h50a8 8 0 0 0 7-12L68 38V8" />
      <path d="M38 74c8 6 36 6 44 0" />
      <circle cx="58" cy="58" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="66" cy="66" r="2" fill="currentColor" stroke="none" />
      <circle cx="50" cy="66" r="1.8" fill="currentColor" stroke="none" />
      <path d="M20 116h80M28 116l6-14h52l6 14" />
    </Base>
  );
}

export function GogglesMotif(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <circle cx="38" cy="60" r="24" />
      <circle cx="82" cy="60" r="24" />
      <path d="M60 54h0" />
      <path d="M58 58h4" />
      <path d="M14 44 4 30M106 44l10-14" />
    </Base>
  );
}

export function DotClusterMotif(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 120" fill="currentColor" stroke="none" {...props}>
      <circle cx="20" cy="30" r="5" />
      <circle cx="55" cy="12" r="3.5" />
      <circle cx="90" cy="26" r="6" />
      <circle cx="30" cy="70" r="4" />
      <circle cx="70" cy="60" r="5.5" />
      <circle cx="100" cy="82" r="4" />
      <circle cx="18" cy="100" r="3.5" />
      <circle cx="60" cy="100" r="5" />
    </svg>
  );
}

export function TestTubeMotif(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M46 10h28" />
      <path d="M50 10v58a10 10 0 0 0 20 0V10" />
      <path d="M50 50a10 10 0 0 0 20 0" />
      <circle cx="60" cy="34" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="65" cy="40" r="1.8" fill="currentColor" stroke="none" />
      <path d="M20 100h30M35 76v24" />
      <path d="M55 108c0-8 6-8 6-14s-6-6-6-12" />
    </Base>
  );
}

export function AtomMotif(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <ellipse cx="60" cy="60" rx="46" ry="18" />
      <ellipse cx="60" cy="60" rx="46" ry="18" transform="rotate(60 60 60)" />
      <ellipse cx="60" cy="60" rx="46" ry="18" transform="rotate(120 60 60)" />
      <circle cx="60" cy="60" r="7" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function MagnifyingGlassMotif(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <circle cx="50" cy="48" r="30" />
      <path d="M72 70 98 96" />
    </Base>
  );
}

export function LeafMotif(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M22 100C8 58 38 12 96 10c6 56-32 90-74 90Z" />
      <path d="M26 96C52 68 68 46 92 16M40 74l-10 6M56 54l-10 4M70 36l-9 4" />
    </Base>
  );
}

export function FlowerMotif(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <circle cx="60" cy="34" r="10" />
      <path d="M60 24c-4-8-2-16 4-18 6 4 6 12 0 18M70 30c8-4 16-2 18 4-4 6-12 6-18 0M70 40c8 4 12 12 8 18-6-2-10-10-10-16M50 40c-8 4-12 12-8 18 6-2 10-10 10-16M50 30c-8-4-16-2-18 4 4 6 12 6 18 0" />
      <path d="M60 44v50" />
      <path d="M60 70c-10-4-16 2-20 10 10 4 18-2 20-10ZM60 82c10-4 16 2 20 10-10 4-18-2-20-10Z" />
    </Base>
  );
}

export function NeuronMotif(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <circle cx="60" cy="60" r="10" />
      <path d="M52 54 30 36M30 36 16 40M30 36l-6-14M50 52 24 28M50 66 20 74M20 74 8 68M20 74l-6 14M68 54l24-16M92 38l14 2M92 38l4-14M70 66l30 10M100 76l14-4M100 76l6 14M56 70 44 96M44 96l-14 4M44 96l4 14M66 70l10 28M76 98l14 2M76 98l-2 14" />
    </Base>
  );
}

export function VirusMotif(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <circle cx="60" cy="60" r="26" />
      <circle cx="46" cy="52" r="3" fill="currentColor" stroke="none" />
      <circle cx="70" cy="48" r="3" fill="currentColor" stroke="none" />
      <circle cx="60" cy="66" r="3" fill="currentColor" stroke="none" />
      <circle cx="72" cy="70" r="3" fill="currentColor" stroke="none" />
      <path d="M60 34V16M76 40 88 26M84 60h18M76 80l12 14M60 86v18M44 80 32 94M36 60H18M44 40 32 26" />
      <circle cx="60" cy="14" r="4" />
      <circle cx="90" cy="24" r="4" />
      <circle cx="104" cy="60" r="4" />
      <circle cx="90" cy="96" r="4" />
      <circle cx="60" cy="106" r="4" />
      <circle cx="30" cy="96" r="4" />
      <circle cx="16" cy="60" r="4" />
      <circle cx="30" cy="24" r="4" />
    </Base>
  );
}

export function WaterDropMotif(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M60 10c16 22 30 40 30 58a30 30 0 0 1-60 0c0-18 14-36 30-58Z" />
      <path d="M46 76a14 14 0 0 0 10 12" />
    </Base>
  );
}

export function SproutPotMotif(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M60 70V44" />
      <path d="M60 60c0-14-16-16-20-8 8 10 20 8 20 8ZM60 50c0-14 16-16 20-8-8 10-20 8-20 8Z" />
      <path d="M34 72h52l-6 34a6 6 0 0 1-6 5H46a6 6 0 0 1-6-5Z" />
      <path d="M34 72h52" />
    </Base>
  );
}

export function MonitorChartMotif(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <rect x="12" y="18" width="80" height="56" rx="4" />
      <path d="M44 74v14M60 74v18M76 74v10M36 96h56" />
      <path d="M24 62 38 44l12 10 20-24" />
      <path d="M100 30h10M100 42h10M100 54h6" />
    </Base>
  );
}

export function PillMotif(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <rect x="14" y="42" width="92" height="36" rx="18" transform="rotate(-30 60 60)" />
      <path d="M55 33 40 58" transform="rotate(-30 60 60)" />
    </Base>
  );
}

export function BacteriaMotif(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M60 10c18 0 20 14 14 22-8 10 10 12 14 26 4 16-8 28-24 26-8-1-10 10-22 8-18-3-28-18-24-34 3-12-10-16-8-30C12 16 40 10 60 10Z" />
      <circle cx="52" cy="46" r="3" fill="currentColor" stroke="none" />
      <circle cx="70" cy="60" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="48" cy="72" r="2.6" fill="currentColor" stroke="none" />
    </Base>
  );
}

export const scienceMotifs = [
  DnaMotif,
  MoleculeMotif,
  PhyloTreeMotif,
  CellMotif,
  ChromosomeMotif,
  NetworkMotif,
  MicroscopeMotif,
  FlaskMotif,
  TestTubeMotif,
  AtomMotif,
  MagnifyingGlassMotif,
  LeafMotif,
  PillMotif,
  BacteriaMotif,
  GogglesMotif,
  DotClusterMotif,
  FlowerMotif,
  NeuronMotif,
  VirusMotif,
  WaterDropMotif,
  SproutPotMotif,
  MonitorChartMotif,
];
