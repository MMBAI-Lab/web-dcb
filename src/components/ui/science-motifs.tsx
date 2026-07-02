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
      strokeWidth={1.4}
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
      <path d="M63 4c5 4 7 8 3 12" />
      <path d="M48 12h24M52 12v28L28 92a8 8 0 0 0 7 12h50a8 8 0 0 0 7-12L68 40V12" />
      <path d="M38 76c8 6 36 6 44 0" />
      <circle cx="58" cy="60" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="66" cy="68" r="2" fill="currentColor" stroke="none" />
      <circle cx="50" cy="68" r="1.8" fill="currentColor" stroke="none" />
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
      <path d="M46 12h28" />
      <path d="M50 12v70a10 10 0 0 0 20 0V12" />
      <path d="M50 62a10 10 0 0 0 20 0" />
      <circle cx="60" cy="45" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="65" cy="52" r="1.8" fill="currentColor" stroke="none" />
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
      <path d="M25 100C10 60 40 15 95 12c4 55-30 88-70 88Z" />
      <path d="M30 95C55 70 70 50 92 18" />
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
];
