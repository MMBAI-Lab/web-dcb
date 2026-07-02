"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

type Location = { label: string; address: string; phone: string };

const accents = ["border-t-teal", "border-t-crimson", "border-t-gold"];

export function Contacto() {
  const t = useTranslations("contacto");
  const locations = t.raw("locations") as Location[];

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <Reveal>
        <div className="grid gap-6 sm:grid-cols-3">
          {locations.map((location, i) => (
            <div
              key={location.label}
              className={`rounded-xl border border-t-4 border-border bg-surface p-5 ${accents[i % accents.length]}`}
            >
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
  );
}
