"use client";

import { useEffect } from "react";
import { routing } from "@/i18n/routing";
import { asset } from "@/lib/asset";

// Static export has no middleware, so "/" always redirects to the default
// locale client-side (no browser-language detection — Spanish is the
// site's primary language; visitors switch to English via the nav toggle).
export default function RootRedirectPage() {
  useEffect(() => {
    window.location.replace(asset(`/${routing.defaultLocale}/`));
  }, []);

  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <p className="text-sm text-foreground/70">
        Redirecting to{" "}
        <a className="underline" href={asset(`/${routing.defaultLocale}/`)}>
          /{routing.defaultLocale}/
        </a>
        …
      </p>
    </main>
  );
}
