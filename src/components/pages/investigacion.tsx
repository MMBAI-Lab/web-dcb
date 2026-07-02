"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

type Group = { name: string; lead: string };

const accents = ["border-t-teal", "border-t-crimson", "border-t-gold"];

export function Investigacion() {
  const t = useTranslations("investigacion");
  const groups = t.raw("groups") as Group[];

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group, i) => (
          <Reveal key={group.name} delay={Math.min(i * 0.04, 0.3)}>
            <div
              className={`h-full rounded-xl border border-t-4 border-border bg-surface p-5 ${accents[i % accents.length]}`}
            >
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
  );
}
