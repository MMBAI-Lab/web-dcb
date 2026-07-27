import type { Bilingual } from "@/content/groups";

export type Locale = "es" | "en";

/**
 * Reads a bilingual content field, falling back to Spanish when the requested
 * locale is missing or empty.
 *
 * Group content is collected from the groups in Spanish; the English pass is
 * done separately by the DCB and lands later. Without this fallback the
 * English site would render `undefined` for anything not yet translated —
 * showing the Spanish text is correct and visible instead.
 *
 * Use scripts/report-missing-translations.js to list what still needs an
 * English version.
 */
export function pick(field: Bilingual | undefined, locale: Locale): string {
  if (!field) return "";
  return field[locale]?.trim() ? field[locale] : field.es;
}
