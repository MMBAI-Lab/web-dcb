"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/reveal";
import { asset } from "@/lib/asset";
import { CalendarIcon, FlaskIcon, UsersIcon, ShieldIcon } from "@/components/ui/fact-icons";
import { IconMotifField, type IconName } from "@/components/ui/icon-motif-field";

type Fact = { value: string; label: string };
type SectionCard = { key: string; href: string; title: string; description: string };

const factAccents = ["text-teal", "text-crimson", "text-gold", "text-teal"];
const factBadgeBg = ["bg-teal/10", "bg-crimson/10", "bg-gold/10", "bg-teal/10"];
const factIcons = [CalendarIcon, FlaskIcon, UsersIcon, ShieldIcon];
const cardAccents = ["border-t-teal", "border-t-crimson", "border-t-gold"];
const cardMotifs: IconName[] = ["celula-vegetal", "moleculas", "monitor", "hojas", "microscopio", "jeringa"];
const cardRadii = ["rounded-2xl", "rounded-[1.75rem_1.75rem_1.75rem_0.5rem]", "rounded-[1.75rem_0.5rem_1.75rem_1.75rem]"];

// Bigger icons glide slowly over a shorter straight line; smaller ones
// dart fast over a much longer one. `dir` is +1 (drifts right) or -1
// (drifts left) so neighboring icons visibly cross paths instead of all
// sliding the same way.
function motif(
  icon: IconName,
  top: string,
  left: string,
  size: number,
  rotate: number,
  delay: number,
  dir: 1 | -1 = 1,
  opacity = 0.26,
) {
  const duration = Math.max(4.5, Math.min(34, size / 11 + 3));
  const distance = Math.max(260, Math.min(820, 860 - size * 1.4));
  return {
    icon,
    top,
    left,
    size,
    rotate,
    opacity,
    duration,
    delay,
    driftX: distance * dir,
    driftY: distance * 0.18 * (rotate < 0 ? -1 : 1),
  };
}

// The user's own hand-drawn icon set, extracted from
// data/old/images/IconosDCB_fondo.svg — full color, no copyright issue.
// One continuous field spans the hero + welcome blocks (no seam between
// them). Icons slide in a straight line — some left-to-right, some
// right-to-left — fading in/out at each end instead of bouncing back.
const topMotifs = [
  motif("moleculas", "-2%", "40%", 380, -4, 0, 1),
  motif("neurona", "26%", "10%", 340, 3, 1, -1),
  motif("monitor", "1%", "2%", 210, -3, 1.4, 1),
  motif("microscopio", "4%", "70%", 180, 4, 0.4, -1),
  motif("pez", "16%", "30%", 150, 4, 0.9, 1),
  motif("jeringa", "20%", "80%", 90, 12, 0.8, -1),
  motif("pastillas", "8%", "50%", 50, 20, 2.6, 1),
  motif("hojas", "2%", "20%", 42, 15, 1.9, -1),
  motif("moleculas", "34%", "6%", 30, -10, 3.2, 1),

  motif("celula-vegetal", "40%", "40%", 260, 0, 2, -1),
  motif("hojas", "48%", "14%", 190, -6, 1.6, 1),
  motif("vaca", "56%", "60%", 160, 0, 2.1, -1),
  motif("pastillas", "44%", "4%", 120, -8, 0.2, 1),
  motif("neurona", "62%", "34%", 60, 30, 2.1, -1),
  motif("jeringa", "38%", "50%", 34, -18, 3.6, 1),

  motif("hojas", "74%", "0%", 130, -10, 1.4, -1),
  motif("moleculas", "70%", "30%", 280, 6, 0.3, 1),
  motif("pastillas", "82%", "4%", 55, 40, 4.1, -1),
  motif("microscopio", "86%", "56%", 44, -14, 3.8, 1),
];

export function Home() {
  const t = useTranslations("home");
  const facts = t.raw("facts") as Fact[];
  const sections = t.raw("sections") as SectionCard[];

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,color-mix(in_oklab,var(--teal)_14%,transparent),transparent_55%),radial-gradient(circle_at_85%_75%,color-mix(in_oklab,var(--gold)_12%,transparent),transparent_55%)]" />
        <IconMotifField placements={topMotifs} />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-5 pb-16 pt-20 sm:px-8 sm:pt-28">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-crimson/30 bg-crimson/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-crimson"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-crimson" />
            {t("eyebrow")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-5 sm:gap-7"
          >
            <span className="relative hidden h-20 w-20 shrink-0 sm:block sm:h-28 sm:w-28">
              <Image
                src={asset("/images/logos/dcb-icon.png")}
                alt="DCB"
                fill
                sizes="112px"
                className="object-contain"
                priority
              />
            </span>
            <h1 className="max-w-3xl font-serif text-4xl font-medium leading-tight sm:text-6xl">
              {t("title")}
            </h1>
          </motion.div>
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

        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-20 pt-6 sm:px-8 sm:pb-28 md:grid-cols-[1fr_0.9fr] md:items-center">
          <Reveal>
            <h2 className="font-serif text-2xl font-medium">{t("welcomeTitle")}</h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/75">
              {t("welcome")}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative">
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

      <section className="relative overflow-hidden border-t border-border bg-surface">
        <IconMotifField
          placements={[motif("moleculas", "40%", "-8%", 220, 0, 0, 1, 0.15)]}
        />
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
              const cardIcon = cardMotifs[i % cardMotifs.length];
              return (
                <Reveal key={section.key} delay={Math.min(i * 0.05, 0.3)}>
                  <Link
                    href={section.href}
                    className={`group relative block h-full overflow-hidden border border-t-4 border-border bg-surface p-5 transition-transform hover:-translate-y-0.5 hover:shadow-md ${cardAccents[i % cardAccents.length]} ${cardRadii[i % cardRadii.length]}`}
                  >
                    <img
                      src={asset(`/images/motifs/${cardIcon}.png`)}
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-6 -right-6 h-28 w-28 object-contain opacity-20 transition-transform duration-300 group-hover:scale-110"
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
