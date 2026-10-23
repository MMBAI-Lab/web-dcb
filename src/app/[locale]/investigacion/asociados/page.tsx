import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PageBanner } from "@/components/ui/page-banner";
import { MoleculeMotif } from "@/components/ui/science-motifs";
import { Asociados } from "@/components/pages/asociados";

export default async function AsociadosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("asociados");
  const ti = await getTranslations("investigacion");

  return (
    <div className="subpage-bg bg-background min-h-full">
      <PageBanner eyebrow={ti("title")} title={t("title")} subtitle={t("subtitle")} motif={MoleculeMotif} />
      <Asociados />
    </div>
  );
}
