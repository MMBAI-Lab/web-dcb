"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

type Item = { title: string; description: string };

const accents = ["border-l-teal", "border-l-crimson", "border-l-gold"];

export function Reconocimientos() {
  const t = useTranslations("reconocimientos");
  const items = t.raw("items") as Item[];

  return (
    <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
      <div className="space-y-4">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={Math.min(i * 0.04, 0.3)}>
            <div
              className={`rounded-xl border border-l-4 border-border bg-surface p-5 ${accents[i % accents.length]}`}
            >
              <h3 className="font-serif text-base font-medium leading-snug">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                {item.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
