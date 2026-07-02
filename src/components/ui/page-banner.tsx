import type { ComponentType, ReactNode, SVGProps } from "react";

export function PageBanner({
  eyebrow,
  title,
  subtitle,
  motif: Motif,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  motif?: ComponentType<SVGProps<SVGSVGElement>>;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      {Motif && (
        <Motif
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 text-teal opacity-[0.07] sm:h-80 sm:w-80"
        />
      )}
      <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8">
        {eyebrow && (
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-crimson">
            <span className="h-1.5 w-1.5 rounded-full bg-crimson" />
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 font-serif text-3xl font-medium sm:text-4xl">{title}</h1>
        {subtitle && (
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/70">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex h-1">
        <span className="flex-1 bg-teal" />
        <span className="flex-1 bg-crimson" />
        <span className="flex-1 bg-gold" />
      </div>
    </section>
  );
}
