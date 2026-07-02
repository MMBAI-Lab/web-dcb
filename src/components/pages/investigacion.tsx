"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { asset } from "@/lib/asset";

type Group = { name: string; lead: string };

const accents = ["border-t-teal", "border-t-crimson", "border-t-gold"];

// Photos recovered from the old site, matched by group index — only for
// groups where a lead's name in the source clearly matched a named photo.
// The rest are left photo-less rather than guessing an attribution.
const photoByIndex: Record<number, string> = {
  0: "/images/people/daniel-peluffo.png",
  1: "/images/people/pablo-dans.jpg",
  3: "/images/people/christine-lucas.jpg",
  6: "/images/people/nelida-rodriguez.jpg",
  11: "/images/people/jose-manuel-venzal.jpg",
};

export function Investigacion() {
  const t = useTranslations("investigacion");
  const groups = t.raw("groups") as Group[];

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group, i) => {
          const photo = photoByIndex[i];
          return (
            <Reveal key={group.name} delay={Math.min(i * 0.04, 0.3)}>
              <div
                className={`flex h-full items-start gap-4 rounded-xl border border-t-4 border-border bg-surface p-5 ${accents[i % accents.length]}`}
              >
                {photo ? (
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-background">
                    <Image
                      src={asset(photo)}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </span>
                ) : null}
                <div>
                  <h3 className="font-serif text-base font-medium leading-snug">{group.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/65">{group.lead}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal>
        <p className="mt-8 max-w-2xl rounded-xl border border-dashed border-border p-4 text-sm text-foreground/55">
          {t("note")}
        </p>
      </Reveal>
    </div>
  );
}
