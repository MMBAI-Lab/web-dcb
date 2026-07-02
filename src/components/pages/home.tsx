"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/reveal";
import { asset } from "@/lib/asset";
import { CalendarIcon, FlaskIcon, UsersIcon, ShieldIcon } from "@/components/ui/fact-icons";
import { MotifField } from "@/components/ui/motif-field";
import {
  DnaMotif,
  MoleculeMotif,
  PhyloTreeMotif,
  CellMotif,
  ChromosomeMotif,
  NetworkMotif,
} from "@/components/ui/science-motifs";

type Fact = { value: string; label: string };
type SectionCard = { key: string; href: string; title: string; description: string };

const factAccents = ["text-teal", "text-crimson", "text-gold", "text-teal"];
const factBadgeBg = ["bg-teal/10", "bg-crimson/10", "bg-gold/10", "bg-teal/10"];
const factIcons = [CalendarIcon, FlaskIcon, UsersIcon, ShieldIcon];
const cardAccents = ["border-t-teal", "border-t-crimson", "border-t-gold"];
const cardMotifs = [CellMotif, MoleculeMotif, PhyloTreeMotif, DnaMotif, ChromosomeMotif, NetworkMotif];
const cardRadii = ["rounded-2xl", "rounded-[1.75rem_1.75rem_1.75rem_0.5rem]", "rounded-[1.75rem_0.5rem_1.75rem_1.75rem]"];

const heroMotifs = [
  { Icon: DnaMotif, top: "8%", left: "78%", size: 190, rotate: -8, color: "teal" as const },
  { Icon: MoleculeMotif, top: "58%", left: "88%", size: 140, rotate: 10, color: "gold" as const },
  { Icon: PhyloTreeMotif, top: "68%", left: "4%", size: 150, rotate: 4, color: "crimson" as const },
  { Icon: NetworkMotif, top: "4%", left: "6%", size: 110, rotate: -6, color: "teal" as const, opacity: 0.07 },
];

export function Home() {
  const t = useTranslations("home");
  const facts = t.raw("facts") as Fact[];
  const sections = t.raw("sections") as SectionCard[];

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,color-mix(in_oklab,var(--teal)_16%,transparent),transparent_55%)]" />
        <MotifField placements={heroMotifs} />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-5 py-20 sm:px-8 sm:py-28">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-crimson/30 bg-crimson/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-crimson"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-crimson" />
            {t("eyebrow")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-3xl font-serif text-4xl font-medium leading-tight sm:text-6xl"
          >
            {t("title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl text-lg leading-relaxed text-foreground/70"
          >
            {t("subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-3 pt-2"
          >
            <Link
              href="/institucional"
              className="rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-teal-foreground transition-transform hover:-rotate-1 hover:scale-[1.03]"
            >
              {t("ctaPrimary")}
            </Link>
            <Link
              href="/investigacion"
              className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground/80 transition-colors hover:border-teal hover:text-teal"
            >
              {t("ctaSecondary")}
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1fr_0.9fr] md:items-center">
          <Reveal>
            <h2 className="font-serif text-2xl font-medium">{t("welcomeTitle")}</h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/75">
              {t("welcome")}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative">
              <DnaMotif className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 text-gold opacity-[0.1]" aria-hidden="true" />
              <span
                className="relative block aspect-[4/3] overflow-hidden shadow-sm"
                style={{ borderRadius: "62% 38% 41% 59% / 55% 45% 55% 45%" }}
              >
                <Image
                  src={asset("/images/places/plataforma-home.jpg")}
                  alt={t("imageAlt")}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-surface">
        <MoleculeMotif className="pointer-events-none absolute -bottom-10 -left-10 h-56 w-56 text-teal opacity-[0.06]" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-5 py-12 sm:px-8">
          <Reveal>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {facts.map((fact, i) => {
                const Icon = factIcons[i % factIcons.length];
                const accent = factAccents[i % factAccents.length];
                return (
                  <div key={fact.label} className="flex items-start gap-3 sm:flex-col sm:items-start sm:gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${factBadgeBg[i % factBadgeBg.length]} ${accent}`}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <p className={`font-serif text-4xl font-semibold ${accent}`}>{fact.value}</p>
                      <p className="mt-1 text-xs uppercase tracking-wide text-foreground/60">
                        {fact.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <Reveal>
            <h2 className="font-serif text-2xl font-medium">{t("sectionsTitle")}</h2>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section, i) => {
              const CardMotif = cardMotifs[i % cardMotifs.length];
              return (
                <Reveal key={section.key} delay={Math.min(i * 0.05, 0.3)}>
                  <Link
                    href={section.href}
                    className={`group relative block h-full overflow-hidden border border-t-4 border-border bg-surface p-5 transition-transform hover:-translate-y-0.5 hover:shadow-md ${cardAccents[i % cardAccents.length]} ${cardRadii[i % cardRadii.length]}`}
                  >
                    <CardMotif
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-6 -right-6 h-28 w-28 text-foreground opacity-[0.05] transition-transform duration-300 group-hover:scale-110"
                    />
                    <h3 className="relative font-serif text-lg font-medium group-hover:text-teal">
                      {section.title}
                    </h3>
                    <p className="relative mt-2 text-sm leading-relaxed text-foreground/65">
                      {section.description}
                    </p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
