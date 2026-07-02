"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

export function Staff() {
  const t = useTranslations("staff");
  const board = t.raw("board") as string[];
  const support = t.raw("support") as string[];

  return (
    <section id="staff" className="scroll-mt-16 border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <Reveal>
          <h2 className="font-serif text-3xl font-medium sm:text-4xl">{t("title")}</h2>
          <p className="mt-3 max-w-2xl text-base text-foreground/70">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Reveal>
            <div className="rounded-xl border border-border bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                {t("directorLabel")}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">{t("director")}</p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-xl border border-border bg-surface p-5 md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                {t("boardTitle")}
              </p>
              <ul className="mt-3 space-y-2">
                {board.map((member) => (
                  <li key={member} className="text-sm leading-relaxed text-foreground/75">
                    {member}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="rounded-xl border border-border bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                {t("supportTitle")}
              </p>
              <ul className="mt-3 space-y-2">
                {support.map((member) => (
                  <li key={member} className="text-sm leading-relaxed text-foreground/75">
                    {member}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
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
