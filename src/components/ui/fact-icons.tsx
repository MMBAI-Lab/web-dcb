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

// --- Enseñanza -----------------------------------------------------------

// Undergraduate courses
export function BookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M12 6.6C10.4 5 8.1 4.3 4.5 4.5v13c3.6-.2 5.9.5 7.5 2 1.6-1.5 3.9-2.2 7.5-2v-13c-3.6-.2-5.9.5-7.5 2Z" />
      <path d="M12 6.6v12.9" />
    </Base>
  );
}

// Graduate courses
export function GraduationCapIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M12 4 2.5 8.3 12 12.6l9.5-4.3L12 4Z" />
      <path d="M6.6 10.4v5c0 1.4 2.4 2.6 5.4 2.6s5.4-1.2 5.4-2.6v-5" />
      <path d="M21.5 8.3v5.2" />
    </Base>
  );
}

// Internships and continuing education
export function BriefcaseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <rect x="3" y="7.5" width="18" height="12" rx="2" />
      <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" />
      <path d="M3 12.6h18" />
    </Base>
  );
}

// Theses under way
export function ThesisIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M6 3.5h7.6L19 8.9v11.6H6Z" />
      <path d="M13.6 3.5v5.4H19" />
      <path d="M9.4 13h6.2M9.4 16.4h4.2" />
    </Base>
  );
}

// --- Extensión -----------------------------------------------------------

// Outreach actions
export function MegaphoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M4 11.6a2 2 0 0 1 2-2h2.3L15 5.4v13.2l-6.7-4.2H6a2 2 0 0 1-2-2Z" />
      <path d="M18.2 9.7a3.6 3.6 0 0 1 0 4.6" />
      <path d="M8.3 14.4v3.3a1.8 1.8 0 0 0 3.6 0v-1.2" />
    </Base>
  );
}

// Recurring department programmes
export function CycleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M3.8 12a8.2 8.2 0 0 1 14-5.8" />
      <path d="M20.2 12a8.2 8.2 0 0 1-14 5.8" />
      <path d="M17.8 2.6v3.6h-3.6" />
      <path d="M6.2 21.4v-3.6h3.6" />
    </Base>
  );
}

// Documented editions
export function CalendarCheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <rect x="3.5" y="4.5" width="17" height="16" rx="2" />
      <path d="M3.5 9.5h17M8 3v3M16 3v3" />
      <path d="m8.8 14.4 2.3 2.3 4.1-4.3" />
    </Base>
  );
}
