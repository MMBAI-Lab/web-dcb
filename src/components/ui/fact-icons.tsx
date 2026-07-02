import type { SVGProps } from "react";

function Base(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
}

// Founding year
export function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <rect x="3.5" y="4.5" width="17" height="16" rx="2" />
      <path d="M3.5 9.5h17M8 3v3M16 3v3" />
    </Base>
  );
}

// Research groups
export function FlaskIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M9.5 3.5h5M10 3.5V9l-5.2 9a1.8 1.8 0 0 0 1.55 2.7h11.3A1.8 1.8 0 0 0 19.2 18L14 9V3.5" />
      <path d="M7.2 15h9.6" />
    </Base>
  );
}

// Members
export function UsersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="7.5" r="2.4" />
      <path d="M15.5 14.2c2.6.5 4.5 2.7 4.5 5.3" />
    </Base>
  );
}

// P3 biosafety lab
export function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M12 3.5 5 6v6c0 4.4 3 7.7 7 8.5 4-.8 7-4.1 7-8.5V6l-7-2.5Z" />
      <circle cx="12" cy="11" r="2.4" />
      <path d="M12 8.6V6.4M12 13.4v2.2M9.9 9.7 8 8.6M15.9 13.4l-1.9-1.1M9.9 12.3 8 13.4M15.9 8.6l-1.9 1.1" />
    </Base>
  );
}
