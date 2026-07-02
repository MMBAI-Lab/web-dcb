import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PageBanner } from "@/components/ui/page-banner";
import { Institucional } from "@/components/pages/institucional";

export default async function InstitucionalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("institucional");

  return (
    <>
      <PageBanner title={t("title")} subtitle={t("subtitle")} />
      <Institucional />
    </>
  );
}
