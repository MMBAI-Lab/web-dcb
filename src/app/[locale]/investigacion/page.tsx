import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PageBanner } from "@/components/ui/page-banner";
import { MoleculeMotif } from "@/components/ui/science-motifs";
import { Investigacion } from "@/components/pages/investigacion";

export default async function InvestigacionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("investigacion");

  return (
    <>
      <PageBanner title={t("title")} subtitle={t("subtitle")} motif={MoleculeMotif} />
      <Investigacion />
    </>
  );
}
