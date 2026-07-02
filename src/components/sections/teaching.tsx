"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

export function Teaching() {
  const t = useTranslations("teaching");
  const areas = t.raw("cbbAreas") as string[];

  return (
    <section id="teaching" className="scroll-mt-16 border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <Reveal>
          <h2 className="font-serif text-3xl font-medium sm:text-4xl">{t("title")}</h2>
          <p className="mt-3 max-w-2xl text-base text-foreground/70">{t("subtitle")}</p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/70">
            {t("intro")}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 max-w-2xl rounded-2xl border border-border bg-background p-6">
            <h3 className="font-serif text-xl font-medium">{t("cbbTitle")}</h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/70">
              {t("cbbDescription")}
            </p>
            <ul className="mt-4 space-y-2">
              {areas.map((area) => (
                <li key={area} className="flex gap-3 text-sm leading-relaxed text-foreground/75">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {area}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs uppercase tracking-wide text-foreground/50">
              {t("cbbContactLabel")}
            </p>
            <a
              href={`mailto:${t("cbbContact")}`}
              className="text-sm font-medium text-brand hover:underline"
            >
              {t("cbbContact")}
            </a>
          </div>
        </Reveal>

        <Reveal>
          <p className="mt-8 max-w-2xl rounded-xl border border-dashed border-border p-4 text-sm text-foreground/55">
            {t("note")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
