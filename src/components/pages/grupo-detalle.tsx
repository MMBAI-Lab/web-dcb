"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/reveal";
import { asset } from "@/lib/asset";
import type { ResearchGroup } from "@/content/groups";

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

        <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-crimson">
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
      </Reveal>

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
          <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-foreground/75">
            {group.researchLines[locale].split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </Section>
      )}

      {group.currentProjects && group.currentProjects.length > 0 && (
        <Section title={t("projects")}>
          <ul className="max-w-2xl space-y-2 text-sm leading-relaxed text-foreground/75">
            {group.currentProjects.map((project, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>{project}</span>
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

      {group.students && group.students.length > 0 && (
        <Section title={t("students")}>
          <ul className="max-w-2xl space-y-1.5 text-sm text-foreground/75">
            {group.students.map((student) => (
              <li key={student}>{student}</li>
            ))}
          </ul>
        </Section>
      )}

      {group.collaborators && group.collaborators.length > 0 && (
        <Section title={t("collaborators")}>
          <ul className="max-w-2xl space-y-1.5 text-sm text-foreground/75">
            {group.collaborators.map((collaborator) => (
              <li key={collaborator}>{collaborator}</li>
            ))}
          </ul>
        </Section>
      )}

      {group.teaching && (
        <Section title={t("teaching")}>
          <ul className="max-w-2xl space-y-2 text-sm leading-relaxed text-foreground/75">
            {group.teaching[locale].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {group.outreach && (
        <Section title={t("outreach")}>
          <ul className="max-w-2xl space-y-2 text-sm leading-relaxed text-foreground/75">
            {group.outreach[locale].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {group.publications && group.publications.length > 0 && (
        <Section title={t("publications")}>
          <ol className="max-w-2xl space-y-3 text-sm leading-relaxed text-foreground/70">
            {group.publications.map((pub, i) => (
              <li key={i} className="border-l-2 border-border pl-3">
                {pub}
              </li>
            ))}
          </ol>
        </Section>
      )}
    </div>
  );
}
