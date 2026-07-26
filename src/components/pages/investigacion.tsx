"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { asset } from "@/lib/asset";
import { researchGroups } from "@/content/groups";

const accents = ["teal", "crimson", "gold"] as const;
const accentRing: Record<(typeof accents)[number], string> = {
  teal: "ring-teal",
  crimson: "ring-crimson",
  gold: "ring-gold",
};
const accentBg: Record<(typeof accents)[number], string> = {
  teal: "bg-teal",
  crimson: "bg-crimson",
  gold: "bg-gold",
};

// Carousel background photos recovered from the old site
// (data/old/images/Carrousel_*), matched to each group by name.
const carouselPhotos: Record<string, string> = {
  bfq: "/images/groups/bfq.jpg",
  danslab: "/images/groups/danslab.jpg",
  libiam: "/images/groups/libiam.jpg",
  ecologiafluvial: "/images/groups/ecologiafluvial.jpg",
  "ecologia-vertebrados": "/images/groups/ecologia-vertebrados.jpg",
  lgmh: "/images/groups/lgmh.jpg",
  ugb: "/images/groups/ugb.jpg",
  "inmunologia-biotecnologia": "/images/groups/inmunologia-biotecnologia.jpg",
  "moleculas-bioactivas": "/images/groups/moleculas-bioactivas.jpg",
  rumiantes: "/images/groups/rumiantes.jpg",
  virologiamolec: "/images/groups/virologiamolec.jpg",
  vyet: "/images/groups/vyet.jpg",
};

export function Investigacion() {
  const t = useTranslations("investigacion");
  const locale = useLocale() as "es" | "en";
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(slides.indexOf(visible.target as HTMLElement));
      },
      { root: track, threshold: [0.5, 0.75, 0.9] },
    );
    slides.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, []);

  const go = (delta: number) => {
    const next = Math.max(0, Math.min(researchGroups.length - 1, active + delta));
    scrollToIndex(next);
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <Reveal>
        <div className="relative">
          <div
            ref={trackRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4"
          >
            {researchGroups.map((group, i) => {
              const accent = accents[i % accents.length];
              const memberCount = group.members.length + (group.coLead ? 1 : 0) + 1;
              const photo = carouselPhotos[group.slug];

              return (
                <div
                  key={group.slug}
                  className="relative aspect-[4/3] w-[82%] shrink-0 snap-center overflow-hidden rounded-3xl sm:w-[60%] lg:w-[46%]"
                >
                  {photo && (
                    <Image
                      src={asset(photo)}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 46vw, (min-width: 640px) 60vw, 82vw"
                      className="object-cover"
                      priority={i === 0}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/5" />
                  <span className={`absolute left-0 right-0 top-0 h-1.5 ${accentBg[accent]}`} />

                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <div className="flex items-center gap-3">
                      {group.lead.photo && (
                        <span
                          className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-black/0 ${accentRing[accent]}`}
                        >
                          <Image
                            src={asset(group.lead.photo)}
                            alt=""
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </span>
                      )}
                      <div className="min-w-0">
                        <h3 className="truncate font-serif text-lg font-medium leading-snug text-white sm:text-xl">
                          {group.name[locale]}
                        </h3>
                        <p className="truncate text-sm text-white/75">
                          {group.lead.name}
                          {group.coLead ? ` · ${group.coLead.name}` : ""}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/80">
                      {group.summary[locale]}
                    </p>
                    <p className="mt-3 text-xs uppercase tracking-wide text-white/55">
                      {group.campus} · {memberCount} {locale === "es" ? "integrantes" : "members"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            aria-label={locale === "es" ? "Anterior" : "Previous"}
            onClick={() => go(-1)}
            disabled={active === 0}
            className="absolute left-1 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-teal text-teal-foreground shadow-md transition-opacity disabled:opacity-30 sm:flex"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            aria-label={locale === "es" ? "Siguiente" : "Next"}
            onClick={() => go(1)}
            disabled={active === researchGroups.length - 1}
            className="absolute right-1 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-teal text-teal-foreground shadow-md transition-opacity disabled:opacity-30 sm:flex"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {researchGroups.map((group, i) => (
            <button
              key={group.slug}
              type="button"
              aria-label={group.name[locale]}
              onClick={() => scrollToIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === active ? "w-6 bg-teal" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
      </Reveal>

      <Reveal>
        <p className="mx-auto mt-8 max-w-2xl rounded-xl border border-dashed border-border p-4 text-center text-sm text-foreground/55">
          {t("note")}
        </p>
      </Reveal>
    </div>
  );
}
