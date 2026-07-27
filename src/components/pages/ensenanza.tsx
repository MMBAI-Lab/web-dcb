"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/reveal";
import { pick } from "@/lib/i18n-content";
import { researchGroups, type TeachingLevel } from "@/content/groups";
import { formacionLevels, getFormacion, type FormacionLevel } from "@/lib/formacion";

const teachingLevels: TeachingLevel[] = ["grado", "posgrado", "otras"];

const levelAccent: Record<TeachingLevel, { text: string; dot: string; border: string }> = {
  grado: { text: "text-teal", dot: "bg-teal", border: "border-l-teal" },
  posgrado: { text: "text-gold", dot: "bg-gold", border: "border-l-gold" },
  otras: { text: "text-crimson", dot: "bg-crimson", border: "border-l-crimson" },
};

const formacionAccent: Record<FormacionLevel, string> = {
  grado: "text-teal",
  maestria: "text-gold",
  doctorado: "text-crimson",
  posdoctorado: "text-teal",
};

// Courses, flattened out of the group JSONs so this page stays in sync with
// whatever each group's page says — the groups are the source of truth.
const coursesByLevel = teachingLevels.reduce(
  (acc, level) => {
    acc[level] = researchGroups.flatMap((group) =>
      (group.teaching ?? [])
        .filter((entry) => entry.levels.includes(level))
        .map((entry) => ({ entry, group }))
    );
    return acc;
  },
  {} as Record<
    TeachingLevel,
    { entry: { es: string; en: string }; group: (typeof researchGroups)[number] }[]
  >
);

const formacion = getFormacion();
const thesisCount = formacionLevels.reduce((n, level) => n + formacion[level].length, 0);

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

function SectionHeading({ title, intro }: { title: string; intro: string }) {
  return (
    <Reveal>
      <div className="mt-16 first:mt-0">
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

export function Ensenanza() {
  const t = useTranslations("ensenanza");
  const locale = useLocale() as "es" | "en";
  const areas = t.raw("areas") as string[];
  const semester1 = t.raw("semester1") as string[];
  const semester2 = t.raw("semester2") as string[];
  const coord = t.raw("coord") as string[];

  const stats = [
    { value: coursesByLevel.grado.length, label: t("statCoursesGrado"), accent: "text-teal" },
    { value: coursesByLevel.posgrado.length, label: t("statCoursesPosgrado"), accent: "text-gold" },
    { value: coursesByLevel.otras.length, label: t("statCoursesOtras"), accent: "text-crimson" },
    { value: thesisCount, label: t("statTheses"), accent: "text-teal" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      {/* Stats strip */}
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

      <SectionHeading title={t("docenciaTitle")} intro={t("docenciaIntro")} />

      {/* Featured programs the DCB itself coordinates */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <div className="h-full rounded-2xl border-2 border-teal/40 bg-surface p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal">
              {t("featuredLabel")}
            </p>
            <h3 className="mt-2 font-serif text-2xl font-medium">{t("cbbTitle")}</h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/75">{t("cbbDescription")}</p>

            <h4 className="mt-6 text-sm font-semibold uppercase tracking-wide text-teal">
              {t("areasTitle")}
            </h4>
            <List items={areas} />

            <h4 className="mt-6 text-sm font-semibold uppercase tracking-wide text-teal">
              {t("curriculumTitle")}
            </h4>
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

            <h4 className="mt-6 text-sm font-semibold uppercase tracking-wide text-teal">
              {t("coordTitle")}
            </h4>
            <List items={coord} />

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
          <div className="rounded-2xl border-2 border-gold/40 bg-surface p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">
              {t("featuredLabel")}
            </p>
            <h3 className="mt-2 font-serif text-xl font-medium">{t("biotecTitle")}</h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/75">{t("biotec")}</p>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-serif text-xl font-medium">{t("lbhTitle")}</h3>
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

          <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-serif text-xl font-medium">{t("cioctTitle")}</h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/75">{t("cioct")}</p>
          </div>
        </Reveal>
      </div>

      {/* All courses, by level */}
      <div className="mt-10 space-y-8">
        {teachingLevels.map((level, i) => {
          const courses = coursesByLevel[level];
          if (courses.length === 0) return null;
          const accent = levelAccent[level];
          return (
            <Reveal key={level} delay={i * 0.05}>
              <div>
                <div className="flex items-baseline gap-3">
                  <h3 className={`font-serif text-xl font-medium ${accent.text}`}>
                    {t(`level_${level}`)}
                  </h3>
                  <span className="text-xs uppercase tracking-wide text-foreground/45">
                    {courses.length}
                  </span>
                </div>
                <ul className="mt-4 grid gap-3 md:grid-cols-2">
                  {courses.map(({ entry, group }, j) => (
                    <li
                      key={`${group.slug}-${j}`}
                      className={`rounded-xl border border-border ${accent.border} border-l-4 bg-surface p-3`}
                    >
                      <p className="text-sm leading-relaxed text-foreground/80">{pick(entry, locale)}</p>
                      <Link
                        href={`/investigacion/${group.slug}`}
                        className={`mt-2 inline-block text-xs font-medium ${accent.text} hover:underline`}
                      >
                        {pick(group.name, locale)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>

      <SectionHeading title={t("formacionTitle")} intro={t("formacionIntro")} />

      <div className="mt-8 space-y-8">
        {formacionLevels.map((level, i) => {
          const people = formacion[level];
          if (people.length === 0) return null;
          return (
            <Reveal key={level} delay={i * 0.05}>
              <div>
                <div className="flex items-baseline gap-3">
                  <h3 className={`font-serif text-xl font-medium ${formacionAccent[level]}`}>
                    {t(`level_${level}`)}
                  </h3>
                  <span className="text-xs uppercase tracking-wide text-foreground/45">
                    {people.length}
                  </span>
                </div>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {people.map((person) => (
                    <li
                      key={`${person.groupSlug}-${person.name}`}
                      className="rounded-xl border border-border bg-surface p-4"
                    >
                      <p className="text-sm font-medium leading-snug">{person.name}</p>
                      <p className="mt-1 text-xs leading-relaxed text-foreground/60">
                        {person.title}
                      </p>
                      <Link
                        href={`/investigacion/${person.groupSlug}`}
                        className={`mt-3 inline-block text-xs font-medium ${formacionAccent[level]} hover:underline`}
                      >
                        {pick(person.groupName, locale)}
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
