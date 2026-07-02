"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { asset } from "@/lib/asset";
import { researchGroups } from "@/content/groups";

const accents = ["border-t-teal", "border-t-crimson", "border-t-gold"];

export function Investigacion() {
  const t = useTranslations("investigacion");
  const locale = useLocale() as "es" | "en";

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {researchGroups.map((group, i) => {
          const photo = group.lead.photo ?? group.image ?? null;
          const memberCount =
            group.members.length + (group.coLead ? 1 : 0) + 1; /* +1 for lead */

          return (
            <Reveal key={group.slug} delay={Math.min(i * 0.04, 0.3)}>
              <div
                className={`flex h-full flex-col gap-3 rounded-xl border border-t-4 border-border bg-surface p-5 ${accents[i % accents.length]}`}
              >
                <div className="flex items-start gap-4">
                  {photo && (
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-background">
                      <Image
                        src={asset(photo)}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </span>
                  )}
                  <div>
                    <h3 className="font-serif text-base font-medium leading-snug">
                      {group.name[locale]}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/65">
                      {group.lead.name}
                      {group.coLead ? ` · ${group.coLead.name}` : ""}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-foreground/70">
                  {group.summary[locale]}
                </p>
                <p className="mt-auto pt-2 text-xs uppercase tracking-wide text-foreground/45">
                  {group.campus} · {memberCount}{" "}
                  {locale === "es" ? "integrantes" : "members"}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal>
        <p className="mt-8 max-w-2xl rounded-xl border border-dashed border-border p-4 text-sm text-foreground/55">
          {t("note")}
        </p>
      </Reveal>
    </div>
  );
}
