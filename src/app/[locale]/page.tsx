import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Home } from "@/components/pages/home";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return <Home />;
}
