"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/reveal";
import { asset } from "@/lib/asset";
import { pick } from "@/lib/i18n-content";
import { categorias, getIntegrantes, type Categoria } from "@/lib/integrantes";

const integrantes = getIntegrantes();

const accent: Record<Categoria, string> = {
  docentes: "text-teal",
  posgrado: "text-gold",
  grado: "text-crimson",
  tecnicos: "text-teal",
};

export function Integrantes() {
  const t = useTranslations("integrantes");
  const locale = useLocale() as "es" | "en";

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <Reveal>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
          {categorias.map((c) => (
            <a key={c} href={`#${c}`} className={`${accent[c]} hover:underline`}>
              {t(`cat_${c}`)} ({integrantes[c].length})
            </a>
          ))}
        </nav>
      </Reveal>

      {categorias.map((c) => (
        <section key={c} id={c} className="mt-12 scroll-mt-24">
          <div className="flex items-baseline gap-3">
            <h2 className={`font-serif text-2xl font-medium ${accent[c]}`}>{t(`cat_${c}`)}</h2>
            <span className="text-xs uppercase tracking-wide text-foreground/45">{integrantes[c].length}</span>
          </div>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {integrantes[c].map(({ person, alsoStudent, groups }) => (
              <li key={person.name} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-3">
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-border/40">
                  {person.photo && (
                    <Image src={asset(person.photo)} alt="" fill sizes="44px" className="object-cover" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-snug">
                    {person.name}
                    {alsoStudent && (
                      <span className="ml-2 inline-block rounded-full bg-gold/15 px-2 py-0.5 align-middle text-[10px] font-medium text-gold">
                        {t(`also_${alsoStudent}`)}
                      </span>
                    )}
                  </p>
                  {person.title && <p className="text-xs text-foreground/55">{person.title}</p>}
                  <p className="mt-1 flex flex-wrap gap-x-3 text-[11px] font-medium">
                    {groups.map((g) => (
                      <Link key={g.slug} href={`/investigacion/${g.slug}`} className="text-teal hover:underline">
                        {pick(g.name, locale)}
                      </Link>
                    ))}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
