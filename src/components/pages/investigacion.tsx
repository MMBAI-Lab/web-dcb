"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/reveal";
import { asset } from "@/lib/asset";
import { pick } from "@/lib/i18n-content";
import { researchGroups } from "@/content/groups";

const accents = ["teal", "crimson", "gold"] as const;
const accentText: Record<(typeof accents)[number], string> = {
  teal: "text-teal",
  crimson: "text-crimson",
  gold: "text-gold",
};
const accentRing: Record<(typeof accents)[number], string> = {
  teal: "ring-teal",
  crimson: "ring-crimson",
  gold: "ring-gold",
};

const COUNT = researchGroups.length;

export function Investigacion() {
  const t = useTranslations("investigacion");
  const locale = useLocale() as "es" | "en";
  const [active, setActive] = useState(0);
  const dragX = useRef<number | null>(null);

  const go = (delta: number) => setActive((a) => Math.max(0, Math.min(COUNT - 1, a + delta)));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const active_group = researchGroups[active];
  const activeAccent = accents[active % accents.length];
  const memberCount =
    active_group.members.length + (active_group.lead ? 1 : 0) + (active_group.coLead ? 1 : 0);
  const leadPhoto = active_group.lead?.photo;

  return (
    <div className="mx-auto max-w-6xl overflow-hidden px-5 py-14 sm:px-8">
      <Reveal>
        <div
          className="relative h-72 select-none sm:h-80 md:h-96"
          style={{ perspective: "1400px" }}
          onPointerDown={(e) => (dragX.current = e.clientX)}
          onPointerUp={(e) => {
            if (dragX.current === null) return;
            const delta = e.clientX - dragX.current;
            if (delta > 40) go(-1);
            else if (delta < -40) go(1);
            dragX.current = null;
          }}
        >
          {researchGroups.map((group, i) => {
            const offset = i - active;
            const abs = Math.abs(offset);
            const isActive = offset === 0;
            const sign = Math.sign(offset);
            const rotate = isActive ? 0 : sign * -52;
            const translateX = offset * 56;
            const translateZ = isActive ? 40 : -Math.min(abs, 4) * 40;
            const scale = isActive ? 1 : Math.max(0.62, 0.86 - abs * 0.08);
            const opacity = abs > 5 ? 0 : 1 - Math.min(abs, 4) * 0.18;
            const photo = group.image;

            const cardStyle: CSSProperties = {
              transform: `translate(-50%, -50%) translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotate}deg) scale(${scale})`,
              zIndex: 100 - abs,
              opacity,
              transition: "transform 0.5s cubic-bezier(0.22,0.61,0.36,1), opacity 0.5s",
              pointerEvents: abs > 5 ? "none" : "auto",
              WebkitBoxReflect:
                "below 6px linear-gradient(transparent, transparent 55%, rgba(0,0,0,0.18))" as never,
            };
            const cardClassName =
              "absolute left-1/2 top-1/2 aspect-square w-44 cursor-pointer overflow-hidden rounded-2xl shadow-2xl outline-none sm:w-56 md:w-64";
            const cardContent = (
              <>
                {photo ? (
                  <Image
                    src={asset(photo)}
                    alt=""
                    fill
                    sizes="256px"
                    className="object-cover"
                    priority={isActive}
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-teal/15 p-4 text-center font-serif text-xl text-teal">
                    {group.name[locale]}
                  </span>
                )}
                {isActive && (
                  <span className={`absolute inset-0 ring-4 ${accentRing[activeAccent]} ring-inset rounded-2xl`} />
                )}
              </>
            );

            // The centered cover is a link to the group's page; off-center
            // covers just bring themselves to the center first.
            if (isActive) {
              return (
                <Link
                  key={group.slug}
                  href={`/investigacion/${group.slug}`}
                  aria-label={group.name[locale]}
                  className={cardClassName}
                  style={cardStyle}
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <button
                key={group.slug}
                type="button"
                aria-label={group.name[locale]}
                aria-current={isActive}
                onClick={() => setActive(i)}
                className={cardClassName}
                style={cardStyle}
              >
                {cardContent}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label={locale === "es" ? "Anterior" : "Previous"}
            onClick={() => go(-1)}
            disabled={active === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-teal-foreground shadow-md transition-opacity disabled:opacity-30"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {researchGroups.map((group, i) => (
              <button
                key={group.slug}
                type="button"
                aria-label={group.name[locale]}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all ${
                  i === active ? "w-6 bg-teal" : "w-2 bg-border"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label={locale === "es" ? "Siguiente" : "Next"}
            onClick={() => go(1)}
            disabled={active === COUNT - 1}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-teal-foreground shadow-md transition-opacity disabled:opacity-30"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active_group.slug}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mx-auto mt-8 max-w-xl text-center"
          >
            <div className="flex items-center justify-center gap-3">
              {leadPhoto && (
                <span className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ${accentRing[activeAccent]}`}>
                  <Image
                    src={asset(leadPhoto)}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </span>
              )}
              <div className="text-left">
                <h3 className="font-serif text-xl font-medium leading-snug">
                  {active_group.name[locale]}
                </h3>
                {active_group.lead && (
                  <p className="text-sm text-foreground/65">
                    {active_group.lead.name}
                    {active_group.coLead ? ` · ${active_group.coLead.name}` : ""}
                  </p>
                )}
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-foreground/75">
              {active_group.pending ? t("pending") : pick(active_group.summary, locale)}
            </p>
            {!active_group.pending && (
              <p className={`mt-3 text-xs font-semibold uppercase tracking-wide ${accentText[activeAccent]}`}>
                {active_group.campus} · {memberCount} {locale === "es" ? "integrantes" : "members"}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </Reveal>

      <Reveal>
        <p className="mx-auto mt-8 max-w-2xl rounded-xl border border-dashed border-border p-4 text-center text-sm text-foreground/55">
          {t("note")}
        </p>
      </Reveal>

      <Reveal>
        <div className="mx-auto mt-6 max-w-2xl text-center">
          <Link
            href="/investigacion/asociados"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:underline"
          >
            {t("asociadosLink")}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
