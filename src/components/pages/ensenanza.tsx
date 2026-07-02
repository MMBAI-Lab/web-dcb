"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

function List({ items, dot = "bg-gold" }: { items: string[]; dot?: string }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground/75">
          <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Ensenanza() {
  const t = useTranslations("ensenanza");
  const areas = t.raw("areas") as string[];
  const semester1 = t.raw("semester1") as string[];
  const semester2 = t.raw("semester2") as string[];
  const coord = t.raw("coord") as string[];

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="font-serif text-2xl font-medium">{t("cbbTitle")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/75">
              {t("cbbDescription")}
            </p>

            <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-teal">
              {t("areasTitle")}
            </h3>
            <List items={areas} />

            <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-teal">
              {t("curriculumTitle")}
            </h3>
            <div className="mt-3 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-foreground/60">{t("semester1Title")}</p>
                <List items={semester1} dot="bg-crimson" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground/60">{t("semester2Title")}</p>
                <List items={semester2} dot="bg-crimson" />
              </div>
            </div>

            <p className="mt-6 text-xs uppercase tracking-wide text-foreground/50">
              {t("cbbContactLabel")}
            </p>
            <a
              href={`mailto:${t("cbbContact")}`}
              className="text-sm font-medium text-teal hover:underline"
            >
              {t("cbbContact")}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-serif text-lg font-medium">{t("coordTitle")}</h3>
            <List items={coord} />
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-serif text-lg font-medium">{t("lbhTitle")}</h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/75">{t("lbh")}</p>
            <p className="mt-4 text-xs uppercase tracking-wide text-foreground/50">
              {t("lbhContactLabel")}
            </p>
            <a
              href={`mailto:${t("lbhContact")}`}
              className="text-sm font-medium text-teal hover:underline"
            >
              {t("lbhContact")}
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
