import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PageBanner } from "@/components/ui/page-banner";
import { PhyloTreeMotif } from "@/components/ui/science-motifs";
import { Ensenanza } from "@/components/pages/ensenanza";

export default async function EnsenanzaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("ensenanza");

  return (
    <>
      <PageBanner title={t("title")} subtitle={t("subtitle")} motif={PhyloTreeMotif} />
      <Ensenanza />
    </>
  );
}
