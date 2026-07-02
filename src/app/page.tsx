"use client";

import { useEffect } from "react";
import { routing } from "@/i18n/routing";

// Static export has no middleware, so the default-locale redirect from "/"
// happens client-side based on the browser's language preference.
export default function RootRedirectPage() {
  useEffect(() => {
    const preferred = window.navigator.language.slice(0, 2);
    const locale = (routing.locales as readonly string[]).includes(preferred)
      ? preferred
      : routing.defaultLocale;
    window.location.replace(`/${locale}/`);
  }, []);

  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <p className="text-sm text-foreground/70">
        Redirecting to{" "}
        <a className="underline" href={`/${routing.defaultLocale}/`}>
          /{routing.defaultLocale}/
        </a>
        …
      </p>
    </main>
  );
}
