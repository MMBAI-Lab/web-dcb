import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Research } from "@/components/sections/research";
import { Teaching } from "@/components/sections/teaching";
import { Staff } from "@/components/sections/staff";
import { Contact } from "@/components/sections/contact";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <>
      <Hero />
      <About />
      <Research />
      <Teaching />
      <Staff />
      <Contact />
    </>
  );
}
