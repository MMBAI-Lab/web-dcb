"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const other = routing.locales.find((l) => l !== locale) ?? locale;

  return (
    <button
      type="button"
      aria-label={t("toggleLanguage")}
      title={t("toggleLanguage")}
      onClick={() => router.replace(pathname, { locale: other })}
      className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-border px-2.5 text-xs font-semibold tracking-wide text-foreground/70 transition-colors hover:border-brand hover:text-brand"
    >
      {other.toUpperCase()}
    </button>
  );
}
