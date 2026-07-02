import Image from "next/image";
import { useTranslations } from "next-intl";
import { asset } from "@/lib/asset";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 sm:px-8">
        <div className="flex flex-wrap items-center gap-6 opacity-80">
          <span className="relative h-8 w-28">
            <Image
              src={asset("/images/logos/udelar-logo.png")}
              alt="Universidad de la República"
              fill
              sizes="112px"
              className="object-contain object-left"
            />
          </span>
          <span className="relative h-8 w-28">
            <Image
              src={asset("/images/logos/cenur-logo.png")}
              alt="CENUR Litoral Norte"
              fill
              sizes="112px"
              className="object-contain object-left"
            />
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm text-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {t("institution")} — {t("rights")}
          </p>
          <p>{t("builtWith")}</p>
        </div>
      </div>
    </footer>
  );
}
