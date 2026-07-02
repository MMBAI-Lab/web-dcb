"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

type Location = { label: string; address: string; phone: string };

export function Contact() {
  const t = useTranslations("contact");
  const locations = t.raw("locations") as Location[];

  return (
    <section id="contact" className="scroll-mt-16">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <Reveal>
          <h2 className="font-serif text-3xl font-medium sm:text-4xl">{t("title")}</h2>
          <p className="mt-3 max-w-2xl text-base text-foreground/70">{t("subtitle")}</p>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {locations.map((location) => (
              <div key={location.label} className="rounded-xl border border-border bg-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                  {location.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/75">
                  {location.address}
                </p>
                {location.phone && (
                  <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                    {location.phone}
                  </p>
                )}
              </div>
            ))}
          </div>

          <p className="mt-6 max-w-2xl rounded-xl border border-dashed border-border p-4 text-sm text-foreground/55">
            {t("note")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
