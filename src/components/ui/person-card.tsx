"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { asset } from "@/lib/asset";
import type { Member } from "@/content/groups";

// Label for the one profile link each person chose, by host.
function profileLabel(url: string): string {
  if (url.includes("orcid.org")) return "ORCID";
  if (url.includes("scholar.google")) return "Google Scholar";
  if (url.includes("researchgate")) return "ResearchGate";
  if (url.includes("scopus")) return "Scopus";
  return "Perfil";
}

export function PersonCard({ person }: { person: Member }) {
  const t = useTranslations("grupoDetalle");
  const { name, title, photo, thesis, links } = person;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-3">
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
      <div className="min-w-0">
        <p className="text-sm font-medium leading-snug">{name}</p>
        {title && <p className="text-xs text-foreground/60">{title}</p>}
        {thesis && (
          <p className="mt-1 text-xs leading-relaxed text-foreground/55">
            <span className="font-medium text-gold">{t(`thesis_${thesis.level}`)}</span>
            {thesis.program && ` · ${thesis.program}`}
            {thesis.advisors && (
              <>
                {" · "}
                {t("advisors")}: {thesis.advisors}
              </>
            )}
          </p>
        )}
        {links && (
          <p className="mt-1 flex flex-wrap gap-x-3 text-xs font-medium">
            {links.cvuy && (
              <a href={links.cvuy} target="_blank" rel="noreferrer" className="text-teal hover:underline">
                CVUy
              </a>
            )}
            {links.profile && (
              <a href={links.profile} target="_blank" rel="noreferrer" className="text-teal hover:underline">
                {profileLabel(links.profile)}
              </a>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
