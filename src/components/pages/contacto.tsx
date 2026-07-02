"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { asset } from "@/lib/asset";

type Location = { label: string; address: string; phone: string };

const accents = ["bg-teal", "bg-crimson", "bg-gold"];
const photos = [
  "/images/places/sede-salto.jpg",
  "/images/places/sede-paysandu-cep.jpg",
  "/images/places/sede-paysandu-ruta3.jpg",
];

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
              className="overflow-hidden rounded-xl border border-border bg-surface"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={asset(photos[i])}
                  alt={location.label}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <span className={`block h-1 ${accents[i % accents.length]}`} />
              <div className="p-5">
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
