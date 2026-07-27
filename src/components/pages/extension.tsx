"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/reveal";
import { asset } from "@/lib/asset";
import { researchGroups, type OutreachKind } from "@/content/groups";
import { extensionPrograms } from "@/content/extension-programs";

const outreachKinds: OutreachKind[] = ["medios", "educativo", "comunidad", "eventos", "arte"];

const kindAccent: Record<OutreachKind, { text: string; border: string }> = {
  medios: { text: "text-teal", border: "border-l-teal" },
  educativo: { text: "text-gold", border: "border-l-gold" },
  comunidad: { text: "text-crimson", border: "border-l-crimson" },
  eventos: { text: "text-teal", border: "border-l-teal" },
  arte: { text: "text-gold", border: "border-l-gold" },
};

const programAccent = {
  teal: { text: "text-teal", border: "border-teal/40", dot: "bg-teal" },
  gold: { text: "text-gold", border: "border-gold/40", dot: "bg-gold" },
  crimson: { text: "text-crimson", border: "border-crimson/40", dot: "bg-crimson" },
} as const;

// Actions flattened out of the group JSONs, so this page stays in sync with
// whatever each group's page says — the groups are the source of truth.
const actionsByKind = outreachKinds.reduce(
  (acc, kind) => {
    acc[kind] = researchGroups.flatMap((group) =>
      (group.outreach ?? [])
        .filter((entry) => entry.kinds.includes(kind))
        .map((entry) => ({ entry, group }))
    );
    return acc;
  },
  {} as Record<
    OutreachKind,
    { entry: { es: string; en: string }; group: (typeof researchGroups)[number] }[]
  >
);

const totalActions = researchGroups.reduce((n, g) => n + (g.outreach?.length ?? 0), 0);
const groupsWithOutreach = researchGroups.filter((g) => (g.outreach?.length ?? 0) > 0).length;
const totalEditions = extensionPrograms.reduce((n, p) => n + p.editions.length, 0);

function SectionHeading({ title, intro }: { title: string; intro: string }) {
  return (
    <Reveal>
      <div className="mt-16">
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <h2 className="font-serif text-2xl font-medium sm:text-3xl">{title}</h2>
          <span className="h-px flex-1 bg-border" />
        </div>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-foreground/60">
          {intro}
        </p>
      </div>
    </Reveal>
  );
}

export function Extension() {
  const t = useTranslations("extension");
  const locale = useLocale() as "es" | "en";

  const stats = [
    { value: totalActions, label: t("statActions"), accent: "text-crimson" },
    { value: groupsWithOutreach, label: t("statGroups"), accent: "text-teal" },
    { value: extensionPrograms.length, label: t("statPrograms"), accent: "text-gold" },
    { value: totalEditions, label: t("statEditions"), accent: "text-crimson" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <Reveal>
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className={`font-serif text-4xl font-medium ${stat.accent}`}>{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-foreground/55">{stat.label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <SectionHeading title={t("programsTitle")} intro={t("programsIntro")} />

      <div className="mt-8 space-y-8">
        {extensionPrograms.map((program, i) => {
          const accent = programAccent[program.accent];
          return (
            <Reveal key={program.slug} delay={i * 0.05}>
              <div className={`rounded-2xl border-2 ${accent.border} bg-surface p-6`}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-serif text-xl font-medium">{program.name[locale]}</h3>
                  <span className={`text-xs font-semibold uppercase tracking-wide ${accent.text}`}>
                    {program.span}
                  </span>
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/75">
                  {program.description[locale]}
                </p>

                {/* Bitácora: one entry per edition */}
                <ol className="mt-6 space-y-5 border-l border-border pl-5">
                  {program.editions.map((edition, j) => (
                    <li key={`${edition.year}-${j}`} className="relative">
                      <span
                        className={`absolute -left-[1.6rem] top-1.5 h-2.5 w-2.5 rounded-full ${accent.dot}`}
                      />
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className={`font-serif text-lg font-medium ${accent.text}`}>
                          {edition.year}
                        </span>
                        <span className="text-sm text-foreground/60">{edition.date[locale]}</span>
                        <span className="text-sm font-medium">· {edition.place}</span>
                      </div>
                      {edition.venue && (
                        <p className="text-xs text-foreground/55">{edition.venue}</p>
                      )}
                      {edition.note && (
                        <p className="mt-1 text-xs leading-relaxed text-foreground/60">
                          {edition.note[locale]}
                        </p>
                      )}

                      <div className="mt-3 flex flex-col gap-4 sm:flex-row">
                        {edition.poster && (
                          <a
                            href={asset(edition.poster)}
                            target="_blank"
                            rel="noreferrer"
                            className="relative block h-40 w-28 shrink-0 overflow-hidden rounded-lg border border-border"
                          >
                            <Image
                              src={asset(edition.poster)}
                              alt=""
                              fill
                              sizes="112px"
                              className="object-cover object-top"
                            />
                          </a>
                        )}
                        {edition.speakers && edition.speakers.length > 0 && (
                          <ul className="space-y-1.5 text-sm text-foreground/75">
                            {edition.speakers.map((speaker) => (
                              <li key={speaker.name}>
                                <span className="font-medium">{speaker.name}</span>
                                <span className="text-foreground/50"> · {speaker.group}</span>
                                {speaker.talk && (
                                  <span className="block text-xs italic text-foreground/60">
                                    «{speaker.talk}»
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          );
        })}
      </div>

      <SectionHeading title={t("actionsTitle")} intro={t("actionsIntro")} />

      <div className="mt-8 space-y-8">
        {outreachKinds.map((kind, i) => {
          const actions = actionsByKind[kind];
          if (actions.length === 0) return null;
          const accent = kindAccent[kind];
          return (
            <Reveal key={kind} delay={i * 0.05}>
              <div>
                <div className="flex items-baseline gap-3">
                  <h3 className={`font-serif text-xl font-medium ${accent.text}`}>
                    {t(`kind_${kind}`)}
                  </h3>
                  <span className="text-xs uppercase tracking-wide text-foreground/45">
                    {actions.length}
                  </span>
                </div>
                <ul className="mt-4 grid gap-3 md:grid-cols-2">
                  {actions.map(({ entry, group }, j) => (
                    <li
                      key={`${group.slug}-${j}`}
                      className={`rounded-xl border border-border ${accent.border} border-l-4 bg-surface p-3`}
                    >
                      <p className="text-sm leading-relaxed text-foreground/80">{entry[locale]}</p>
                      <Link
                        href={`/investigacion/${group.slug}`}
                        className={`mt-2 inline-block text-xs font-medium ${accent.text} hover:underline`}
                      >
                        {group.name[locale]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
