"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { asset } from "@/lib/asset";

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground/75">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Institucional() {
  const t = useTranslations("institucional");
  const history = t.raw("history") as string[];
  const boardTitulares = t.raw("boardTitulares") as string[];
  const boardSuplentes = t.raw("boardSuplentes") as string[];
  const budget = t.raw("budget") as string[];
  const comms = t.raw("comms") as string[];
  const support = t.raw("support") as string[];

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <h2 className="font-serif text-2xl font-medium">{t("historyTitle")}</h2>
          <p className="mt-1 text-sm italic text-foreground/55">{t("historyByline")}</p>
          <div className="mt-4 space-y-4">
            {history.map((paragraph, i) => (
              <p key={i} className="text-sm leading-relaxed text-foreground/75">
                {paragraph}
              </p>
            ))}
          </div>

          <h2 className="mt-10 font-serif text-2xl font-medium">{t("infrastructureTitle")}</h2>
          <p className="mt-4 text-sm leading-relaxed text-foreground/75">
            {t("infrastructure")}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <span className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={asset("/images/places/plataforma-1.jpg")}
                alt="Plataforma de investigación, sede Salto"
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
            </span>
            <span className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={asset("/images/places/plataforma-2.jpg")}
                alt="Laboratorio de bioseguridad nivel 3 (P3)"
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-serif text-xl font-medium">{t("governanceTitle")}</h3>

            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-teal">
              {t("directorLabel")}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-foreground/80">{t("director")}</p>

            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-teal">
              {t("boardTitle")}
            </p>
            <List items={[...boardTitulares, ...boardSuplentes]} />

            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-teal">
              {t("budgetTitle")}
            </p>
            <List items={budget} />

            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-teal">
              {t("commsTitle")}
            </p>
            <List items={comms} />

            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-teal">
              {t("supportTitle")}
            </p>
            <List items={support} />
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-serif text-lg font-medium">{t("partnersTitle")}</h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/75">{t("partners")}</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
