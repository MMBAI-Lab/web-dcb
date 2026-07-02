"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { asset } from "@/lib/asset";

export function Extension() {
  const t = useTranslations("extension");

  const blocks = [
    { title: t("covidTitle"), body: t("covid"), accent: "border-t-teal", image: null },
    {
      title: t("scienceWeekTitle"),
      body: t("scienceWeek"),
      accent: "border-t-crimson",
      image: null,
    },
    {
      title: t("seminarsTitle"),
      body: t("seminars"),
      accent: "border-t-gold",
      image: "/images/places/seminario-2025.jpg",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <Reveal>
        <p className="max-w-3xl text-base leading-relaxed text-foreground/70">{t("subtitle")}</p>
      </Reveal>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {blocks.map((block, i) => (
          <Reveal key={block.title} delay={i * 0.08}>
            <div
              className={`flex h-full flex-col overflow-hidden rounded-xl border border-t-4 border-border bg-surface ${block.accent}`}
            >
              {block.image && (
                <span className="relative aspect-square w-full">
                  <Image
                    src={asset(block.image)}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </span>
              )}
              <div className="p-6">
                <h3 className="font-serif text-lg font-medium">{block.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/75">{block.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
