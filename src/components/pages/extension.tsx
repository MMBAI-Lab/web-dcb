"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

export function Extension() {
  const t = useTranslations("extension");

  const blocks = [
    { title: t("covidTitle"), body: t("covid"), accent: "border-t-teal" },
    { title: t("scienceWeekTitle"), body: t("scienceWeek"), accent: "border-t-crimson" },
    { title: t("seminarsTitle"), body: t("seminars"), accent: "border-t-gold" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <Reveal>
        <p className="max-w-3xl text-base leading-relaxed text-foreground/70">{t("subtitle")}</p>
      </Reveal>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {blocks.map((block, i) => (
          <Reveal key={block.title} delay={i * 0.08}>
            <div className={`h-full rounded-xl border border-t-4 border-border bg-surface p-6 ${block.accent}`}>
              <h3 className="font-serif text-lg font-medium">{block.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/75">{block.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
