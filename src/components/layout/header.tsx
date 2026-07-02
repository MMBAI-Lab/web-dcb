"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";

const sections = ["about", "research", "teaching", "staff", "contact"] as const;

export function Header() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative h-9 w-24 shrink-0 overflow-hidden rounded-sm bg-white/90 dark:bg-white">
            <Image
              src="/images/logos/dcb-logo.jpg"
              alt="DCB"
              fill
              sizes="96px"
              className="object-contain p-1"
              priority
            />
          </span>
          <span className="hidden font-serif text-base font-medium leading-tight sm:block">
            Ciencias Biológicas
            <span className="block text-[11px] font-sans font-normal uppercase tracking-wide text-foreground/60">
              CENUR Litoral Norte
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
          {sections.map((key) => (
            <a
              key={key}
              href={`#${key}`}
              className="text-foreground/75 transition-colors hover:text-brand"
            >
              {t(key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border md:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-4.5 w-4.5">
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-5 py-3 text-sm font-medium md:hidden">
          {sections.map((key) => (
            <a
              key={key}
              href={`#${key}`}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-foreground/80 hover:bg-surface hover:text-brand"
            >
              {t(key)}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
