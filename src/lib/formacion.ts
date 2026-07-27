import { researchGroups } from "@/content/groups";

export type FormacionLevel = "grado" | "maestria" | "doctorado" | "posdoctorado";

export type FormacionEntry = {
  name: string;
  title: string;
  level: FormacionLevel;
  groupSlug: string;
  groupName: { es: string; en: string };
};

export const formacionLevels: FormacionLevel[] = [
  "grado",
  "maestria",
  "doctorado",
  "posdoctorado",
];

// Ordered most-specific first: a title like "Estudiante de Doctorado" must not
// be caught by the broader "estudiante de" grado patterns below it.
const patterns: { level: FormacionLevel; test: RegExp }[] = [
  { level: "posdoctorado", test: /postdoctoral|posdoctoral|posdoctorado/i },
  { level: "doctorado", test: /doctorand|estudiante de doctorado|tesis doctoral|doctorado en/i },
  {
    level: "maestria",
    test: /maestrand|estudiante de maestr|maestría en|posgrado \(maestr|estudiante de posgrado, maestr/i,
  },
  { level: "grado", test: /estudiante de licenciatura|tesista de grado|estudiante de la lic/i },
];

/**
 * Derives the department's in-progress theses from each group's roster, so
 * the Enseñanza page stays in sync with the group pages that are the actual
 * source of truth. People whose title marks them as former members
 * ("Ex Estudiante de…") are past, not in-progress, so they're skipped.
 */
export function getFormacion(): Record<FormacionLevel, FormacionEntry[]> {
  const result: Record<FormacionLevel, FormacionEntry[]> = {
    grado: [],
    maestria: [],
    doctorado: [],
    posdoctorado: [],
  };

  for (const group of researchGroups) {
    const people = [group.lead, group.coLead, ...group.members].filter(Boolean) as {
      name: string;
      title: string;
    }[];

    for (const person of people) {
      const title = person.title ?? "";
      if (/^ex\s|\bex estudiante\b/i.test(title)) continue;

      const match = patterns.find((p) => p.test.test(title));
      if (!match) continue;

      result[match.level].push({
        name: person.name,
        title,
        level: match.level,
        groupSlug: group.slug,
        groupName: group.name,
      });
    }
  }

  return result;
}
