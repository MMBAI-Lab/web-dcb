"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { asset } from "@/lib/asset";

const pages = [
  { key: "home", href: "/" },
  { key: "about", href: "/institucional" },
  { key: "research", href: "/investigacion" },
  { key: "teaching", href: "/ensenanza" },
  { key: "outreach", href: "/extension" },
  { key: "contact", href: "/contacto" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    // "dark" is applied here on purpose: the header always uses the dark
    // theme's teal/crimson/gold values, regardless of the site's active
    // light/dark theme, so it doesn't shift color when the user toggles it.
    <header className="dark sticky top-0 z-50">
      <div className="bg-teal text-teal-foreground">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="relative h-10 w-10 shrink-0">
              <Image
                src={asset("/images/logos/dcb-icon.png")}
                alt="DCB"
                fill
                sizes="40px"
                className="object-contain"
                priority
              />
            </span>
            <span className="hidden font-serif text-base font-medium leading-tight sm:block">
              Ciencias Biológicas
              <span className="block text-[11px] font-sans font-normal uppercase tracking-wide text-teal-foreground/70">
                CENUR Litoral Norte
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-5 text-sm font-medium lg:flex">
            {pages.map(({ key, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={key}
                  href={href}
                  className={`relative py-1 transition-colors hover:text-white ${
                    active ? "text-white" : "text-teal-foreground/80"
                  }`}
                >
                  {t(key)}
                  {active && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gold" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-teal-foreground/30 lg:hidden"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-4.5 w-4.5">
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <nav className="flex flex-col gap-1 border-t border-teal-foreground/15 px-5 py-3 text-sm font-medium lg:hidden">
            {pages.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-2 py-2 ${
                  pathname === href
                    ? "bg-white/10 text-white"
                    : "text-teal-foreground/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {t(key)}
              </Link>
            ))}
          </nav>
        )}
      </div>
      <div className="flex h-1">
        <span className="flex-1 bg-teal" />
        <span className="flex-1 bg-crimson" />
        <span className="flex-1 bg-gold" />
      </div>
    </header>
  );
}
