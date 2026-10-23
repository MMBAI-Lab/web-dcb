import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PageBanner } from "@/components/ui/page-banner";
import { MoleculeMotif } from "@/components/ui/science-motifs";
import { Integrantes } from "@/components/pages/integrantes";

export default async function IntegrantesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("integrantes");

  return (
    <div className="subpage-bg bg-background min-h-full">
      <PageBanner title={t("title")} subtitle={t("subtitle")} motif={MoleculeMotif} />
      <Integrantes />
    </div>
  );
}
