import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PageBanner } from "@/components/ui/page-banner";
import { Contacto } from "@/components/pages/contacto";

export default async function ContactoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("contacto");

  return (
    <>
      <PageBanner title={t("title")} subtitle={t("subtitle")} />
      <Contacto />
    </>
  );
}
