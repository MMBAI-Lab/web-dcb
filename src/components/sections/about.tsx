"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

export function About() {
  const t = useTranslations("about");
  const values = t.raw("values") as string[];

  return (
    <section id="about" className="scroll-mt-16 border-b border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 md:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <h2 className="font-serif text-3xl font-medium sm:text-4xl">{t("title")}</h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/70">
            {t("intro")}
          </p>

          <h3 className="mt-8 font-serif text-xl font-medium">{t("missionTitle")}</h3>
          <p className="mt-2 max-w-xl text-base leading-relaxed text-foreground/70">
            {t("mission")}
          </p>

          <h3 className="mt-8 font-serif text-xl font-medium">{t("infrastructureTitle")}</h3>
          <p className="mt-2 max-w-xl text-base leading-relaxed text-foreground/70">
            {t("infrastructure")}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-serif text-lg font-medium">{t("valuesTitle")}</h3>
            <ul className="mt-4 space-y-3">
              {values.map((value) => (
                <li key={value} className="flex gap-3 text-sm leading-relaxed text-foreground/75">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
