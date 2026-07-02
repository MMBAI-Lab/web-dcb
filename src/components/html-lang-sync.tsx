"use client";

import { useEffect } from "react";

// Root <html lang> is fixed at build time in the root layout, so the
// active locale is synced onto it client-side once known.
export function HtmlLangSync({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
