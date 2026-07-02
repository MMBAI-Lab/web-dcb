"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/reveal";
import { asset } from "@/lib/asset";

type Fact = { value: string; label: string };
type SectionCard = { key: string; href: string; title: string; description: string };

const factAccents = ["text-teal", "text-crimson", "text-gold", "text-teal"];
const cardAccents = ["border-t-teal", "border-t-crimson", "border-t-gold"];

export function Home() {
  const t = useTranslations("home");
  const facts = t.raw("facts") as Fact[];
  const sections = t.raw("sections") as SectionCard[];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,color-mix(in_oklab,var(--teal)_16%,transparent),transparent_55%)]" />
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-20 sm:px-8 sm:py-28">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-[0.18em] text-crimson"
          >
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
              className="rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-teal-foreground transition-transform hover:scale-[1.03]"
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

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 md:grid-cols-2 md:items-center">
          <Reveal>
            <h2 className="font-serif text-2xl font-medium">{t("welcomeTitle")}</h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/75">
              {t("welcome")}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="relative block aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={asset("/images/places/edificio-salto.jpg")}
                alt={t("imageAlt")}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </span>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
          <Reveal>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {facts.map((fact, i) => (
                <div key={fact.label} className="text-center sm:text-left">
                  <p className={`font-serif text-4xl font-semibold ${factAccents[i % factAccents.length]}`}>
                    {fact.value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-foreground/60">
                    {fact.label}
                  </p>
                </div>
              ))}
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
            {sections.map((section, i) => (
              <Reveal key={section.key} delay={Math.min(i * 0.05, 0.3)}>
                <Link
                  href={section.href}
                  className={`group block h-full rounded-xl border border-t-4 border-border bg-surface p-5 transition-shadow hover:shadow-md ${cardAccents[i % cardAccents.length]}`}
                >
                  <h3 className="font-serif text-lg font-medium group-hover:text-teal">
                    {section.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                    {section.description}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
