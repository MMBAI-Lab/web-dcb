"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/reveal";
import { asset } from "@/lib/asset";
import { researchGroups } from "@/content/groups";

// Color block of each group's tile, cycled in order like the old site's
// checkerboard (crimson, gold, green, grey).
const blocks = [
  "bg-crimson text-white",
  "bg-gold text-gold-foreground",
  "bg-teal text-teal-foreground",
  "bg-foreground/10 text-foreground",
];

type Tile = {
  key: string;
  href: string;
  name: string;
  image?: string;
  people: string[];
  peopleLabel?: string;
};

/**
 * One group = a photo square plus a color square. On wide screens two groups
 * share a row and the photo/color order flips every row; on narrow screens
 * each group is its own row and flips every group — either way the page reads
 * as a checkerboard, as on the previous site.
 */
function GroupTile({ tile, index }: { tile: Tile; index: number }) {
  const flipNarrow = index % 2 === 1;
  const flipWide = Math.floor(index / 2) % 2 === 1;

  return (
    <Link
      href={tile.href}
      className={`group flex ${flipNarrow ? "flex-row-reverse" : "flex-row"} ${
        flipWide ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      <div className="relative aspect-square w-1/2 overflow-hidden bg-foreground/10">
        {tile.image && (
          <Image
            src={asset(tile.image)}
            alt=""
            fill
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div
        className={`flex aspect-square w-1/2 flex-col justify-center p-4 sm:p-6 ${blocks[index % blocks.length]}`}
      >
        <h2 className="font-serif text-base font-semibold leading-snug sm:text-xl group-hover:underline">
          {tile.name}
        </h2>
        {tile.peopleLabel && (
          <div className="mt-3 text-[11px] leading-relaxed opacity-90 sm:mt-6 sm:text-xs">
            <p>{tile.peopleLabel}</p>
            {tile.people.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export function Investigacion() {
  const t = useTranslations("investigacion");
  const tg = useTranslations("grupoDetalle");
  const locale = useLocale() as "es" | "en";

  const tiles: Tile[] = researchGroups.map((group) => {
    const people = [group.lead, group.coLead].filter(Boolean).map((p) => p!.name);
    return {
      key: group.slug,
      href: `/investigacion/${group.slug}`,
      name: group.name[locale],
      image: group.image,
      people,
      peopleLabel: group.pending
        ? t("pending")
        : people.length > 1
          ? tg("leads")
          : people.length === 1
            ? tg("lead")
            : undefined,
    };
  });
  tiles.push({
    key: "asociados",
    href: "/investigacion/asociados",
    name: t("asociadosLink"),
    image: "/images/groups/asociados.jpg",
    people: [],
  });

  return (
    <div className="py-10">
      <Reveal>
        <p className="mx-auto mb-8 max-w-2xl px-5 text-center text-sm text-foreground/55">{t("note")}</p>
      </Reveal>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {tiles.map((tile, i) => (
          <GroupTile key={tile.key} tile={tile} index={i} />
        ))}
      </div>
    </div>
  );
}
