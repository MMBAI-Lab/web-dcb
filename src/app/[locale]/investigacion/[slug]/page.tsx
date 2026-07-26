import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { PageBanner } from "@/components/ui/page-banner";
import { MoleculeMotif } from "@/components/ui/science-motifs";
import { GrupoDetalle } from "@/components/pages/grupo-detalle";
import { researchGroups } from "@/content/groups";

// Only groups with a fully-built detail page (i.e. with researchLines
// populated) get a static route — the rest are added one at a time.
const detailedGroups = researchGroups.filter((g) => g.researchLines);

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    detailedGroups.map((group) => ({ locale, slug: group.slug }))
  );
}

export default async function GrupoPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);

  const group = detailedGroups.find((g) => g.slug === slug);
  if (!group) notFound();

  const t = await getTranslations("investigacion");

  return (
    <div className="subpage-bg bg-background min-h-full">
      <PageBanner
        eyebrow={t("title")}
        title={group.name[locale as "es" | "en"]}
        subtitle={group.summary[locale as "es" | "en"]}
        motif={MoleculeMotif}
      />
      <GrupoDetalle group={group} />
    </div>
  );
}
