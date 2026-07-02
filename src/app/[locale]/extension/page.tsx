import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PageBanner } from "@/components/ui/page-banner";
import { DnaMotif } from "@/components/ui/science-motifs";
import { Extension } from "@/components/pages/extension";

export default async function ExtensionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("extension");

  return (
    <>
      <PageBanner title={t("title")} motif={DnaMotif} />
      <Extension />
    </>
  );
}
