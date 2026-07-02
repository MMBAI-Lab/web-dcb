import type { ReactNode } from "react";

export function PageBanner({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-crimson">
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
