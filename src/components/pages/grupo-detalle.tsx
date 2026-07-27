"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/reveal";
import { asset } from "@/lib/asset";
import { pick } from "@/lib/i18n-content";
import type { OutreachKind, ResearchGroup, TeachingLevel } from "@/content/groups";

const teachingLevels: TeachingLevel[] = ["grado", "posgrado", "otras"];
const outreachKinds: OutreachKind[] = ["medios", "educativo", "comunidad", "eventos", "arte"];
const levelAccent: Record<TeachingLevel, string> = {
  grado: "text-teal",
  posgrado: "text-gold",
  otras: "text-crimson",
};
const levelDot: Record<TeachingLevel, string> = {
  grado: "bg-teal",
  posgrado: "bg-gold",
  otras: "bg-crimson",
};

function PersonCard({
  name,
  title,
  photo,
}: {
  name: string;
  title: string;
  photo?: string | null;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-border/40">
        {photo ? (
          <Image src={asset(photo)} alt="" fill sizes="56px" className="object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-serif text-lg text-foreground/40">
            {name
              .replace(/^(Dr\.|Dra\.|Prof\.|Lic\.|MSc\.|Q\.F\.|Bach\.)\s*/g, "")
              .trim()
              .charAt(0)}
          </span>
        )}
      </span>
      <div>
        <p className="text-sm font-medium leading-snug">{name}</p>
        <p className="text-xs text-foreground/60">{title}</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <section className="mt-10">
        <h2 className="font-serif text-xl font-medium">{title}</h2>
        <div className="mt-4">{children}</div>
      </section>
    </Reveal>
  );
}

export function GrupoDetalle({ group }: { group: ResearchGroup }) {
  const t = useTranslations("grupoDetalle");
  const locale = useLocale() as "es" | "en";

  return (
    <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
      <Reveal>
        <Link
          href="/investigacion"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:underline"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {t("back")}
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {group.logo && (
            <span className="relative h-10 w-10 shrink-0">
              <Image src={asset(group.logo)} alt="" fill sizes="40px" className="object-contain" />
            </span>
          )}
          <p className="text-sm font-semibold uppercase tracking-wide text-crimson">
            {group.campus}
            {group.email && (
              <>
                {" · "}
                <a href={`mailto:${group.email}`} className="normal-case tracking-normal hover:underline">
                  {group.email}
                </a>
              </>
            )}
          </p>
          {group.website && (
            <a
              href={group.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-teal hover:underline"
            >
              {t("website")}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9M17 7v8" />
              </svg>
            </a>
          )}
        </div>
      </Reveal>

      {group.image && (
        <Reveal>
          <div className="relative mt-6 aspect-video w-full max-w-2xl overflow-hidden rounded-xl">
            <Image
              src={asset(group.image)}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              className="object-cover"
            />
          </div>
        </Reveal>
      )}

      <Section title={t("lead")}>
        <div className="grid gap-3 sm:grid-cols-2">
          <PersonCard name={group.lead.name} title={group.lead.title} photo={group.lead.photo} />
          {group.coLead && (
            <PersonCard name={group.coLead.name} title={group.coLead.title} photo={group.coLead.photo} />
          )}
        </div>
      </Section>

      {group.researchLines && (
        <Section title={t("researchLines")}>
          <div className="max-w-2xl space-y-5">
            {pick(group.researchLines.intro, locale) && (
              <p className="text-sm leading-relaxed text-foreground/75">
                {pick(group.researchLines.intro, locale)}
              </p>
            )}
            {group.researchLines.lines.length > 0 && (
              <ol className="space-y-4 border-l border-border pl-5">
                {group.researchLines.lines.map((line, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[1.6rem] top-1.5 h-2.5 w-2.5 rounded-full bg-teal" />
                    <h3 className="text-sm font-semibold">{pick(line.title, locale)}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/75">
                      {pick(line.body, locale)}
                    </p>
                    {line.institutions && line.institutions.length > 0 && (
                      <p className="mt-1 text-xs text-foreground/55">
                        {line.institutions.join(" · ")}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </Section>
      )}

      {group.currentProjects && group.currentProjects.length > 0 && (
        <Section title={t("projects")}>
          <ul className="max-w-2xl space-y-3 text-sm leading-relaxed text-foreground/75">
            {group.currentProjects.map((project, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>
                  {project.title}
                  {(project.funder || project.period || project.role) && (
                    <span className="mt-0.5 block text-xs text-foreground/55">
                      {[project.funder, project.period, project.role].filter(Boolean).join(" · ")}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title={t("members")}>
        <div className="grid gap-3 sm:grid-cols-2">
          {group.members.map((member) => (
            <PersonCard key={member.name} name={member.name} title={member.title} photo={member.photo} />
          ))}
        </div>
      </Section>

      {group.collaborators && group.collaborators.length > 0 && (
        <Section title={t("collaborators")}>
          <ul className="max-w-2xl space-y-2 text-sm text-foreground/75">
            {group.collaborators.map((collaborator, i) => (
              <li key={i}>
                <span className="font-medium">{collaborator.name}</span>
                {collaborator.institution && (
                  <span className="text-foreground/60"> · {collaborator.institution}</span>
                )}
                {collaborator.country && (
                  <span className="text-foreground/50"> ({collaborator.country})</span>
                )}
                {collaborator.topic && (
                  <span className="block text-xs text-foreground/55">{collaborator.topic}</span>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {group.teaching && group.teaching.length > 0 && (
        <Section title={t("teaching")}>
          <div className="max-w-2xl space-y-5">
            {teachingLevels.map((level) => {
              const entries = group.teaching!.filter((e) => e.levels.includes(level));
              if (entries.length === 0) return null;
              return (
                <div key={level}>
                  <h3 className={`text-xs font-semibold uppercase tracking-wide ${levelAccent[level]}`}>
                    {t(`level_${level}`)}
                  </h3>
                  <ul className="mt-2 space-y-2 text-sm leading-relaxed text-foreground/75">
                    {entries.map((entry, i) => (
                      <li key={i} className="flex gap-2">
                        <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${levelDot[level]}`} />
                        <span>{pick(entry, locale)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {group.outreach && group.outreach.length > 0 && (
        <Section title={t("outreach")}>
          <div className="max-w-2xl space-y-5">
            {outreachKinds.map((kind) => {
              const entries = group.outreach!.filter((e) => e.kinds.includes(kind));
              if (entries.length === 0) return null;
              return (
                <div key={kind}>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-crimson">
                    {t(`kind_${kind}`)}
                  </h3>
                  <ul className="mt-2 space-y-2 text-sm leading-relaxed text-foreground/75">
                    {entries.map((entry, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson" />
                        <span>{pick(entry, locale)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {group.publications && group.publications.length > 0 && (
        <Section title={t("publications")}>
          <ol className="max-w-2xl space-y-3 text-sm leading-relaxed text-foreground/70">
            {group.publications.map((pub, i) => (
              <li key={i} className="border-l-2 border-border pl-3">
                {pub.doi ? (
                  <>
                    {pub.citation.replace(/\s*https:\/\/doi\.org\/\S+$/, "")}{" "}
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-teal hover:underline"
                    >
                      doi:{pub.doi}
                    </a>
                  </>
                ) : (
                  pub.citation
                )}
              </li>
            ))}
          </ol>
        </Section>
      )}
    </div>
  );
}
