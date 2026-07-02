"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

type Group = { name: string; lead: string };

export function Research() {
  const t = useTranslations("research");
  const groups = t.raw("groups") as Group[];

  return (
    <section id="research" className="scroll-mt-16 border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <Reveal>
          <h2 className="font-serif text-3xl font-medium sm:text-4xl">{t("title")}</h2>
          <p className="mt-3 max-w-2xl text-base text-foreground/70">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, i) => (
            <Reveal key={group.name} delay={Math.min(i * 0.04, 0.3)}>
              <div className="h-full rounded-xl border border-border bg-surface p-5">
                <h3 className="font-serif text-base font-medium leading-snug">{group.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/65">{group.lead}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-8 max-w-2xl rounded-xl border border-dashed border-border p-4 text-sm text-foreground/55">
            {t("note")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
