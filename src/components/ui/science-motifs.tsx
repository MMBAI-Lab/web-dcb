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

export const scienceMotifs = [
  DnaMotif,
  MoleculeMotif,
  PhyloTreeMotif,
  CellMotif,
  ChromosomeMotif,
  NetworkMotif,
];
