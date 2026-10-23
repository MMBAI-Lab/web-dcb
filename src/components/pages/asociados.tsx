"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/reveal";
import { PersonCard } from "@/components/ui/person-card";
import { asociados } from "@/content/groups";

export function Asociados() {
  const t = useTranslations("grupoDetalle");

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
      </Reveal>

      <Reveal>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {asociados.map((person) => (
            <PersonCard key={person.name} person={person} />
          ))}
        </div>
      </Reveal>
    </div>
  );
}
