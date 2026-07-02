import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PageBanner } from "@/components/ui/page-banner";
import { Reconocimientos } from "@/components/pages/reconocimientos";

export default async function ReconocimientosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("reconocimientos");

  return (
    <>
      <PageBanner title={t("title")} subtitle={t("subtitle")} />
      <Reconocimientos />
    </>
  );
}
