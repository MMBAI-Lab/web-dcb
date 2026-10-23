import { asociados, researchGroups, type Member, type Thesis } from "@/content/groups";

export type FormacionLevel = Thesis["level"];

export type FormacionEntry = {
  name: string;
  title: string;
  thesis?: Thesis;
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

// Fallback for people who haven't filled the person form, whose thesis is
// only described inside their title. Ordered most-specific first: a title
// like "Estudiante de Doctorado" must not be caught by the broader
// "estudiante de" grado patterns below it.
const patterns: { level: FormacionLevel; test: RegExp }[] = [
  { level: "posdoctorado", test: /postdoctoral|posdoctoral|posdoctorado/i },
  { level: "doctorado", test: /doctorand|estudiante de doctorado|tesis doctoral|doctorado en/i },
  {
    level: "maestria",
    test: /maestrand|estudiante de maestr|maestría en|posgrado \(maestr|estudiante de posgrado, maestr/i,
  },
  { level: "grado", test: /estudiante de licenciatura|tesista de grado|estudiante de la lic/i },
];

const asociadosGroup = {
  slug: "asociados",
  name: { es: "Investigadores asociados", en: "Associated researchers" },
};

function levelOf(person: Member): FormacionLevel | undefined {
  if (person.thesis) return person.thesis.level;
  const title = person.title ?? "";
  // "Ex Estudiante de…" marks a former member: past, not in progress.
  if (/^ex\s|\bex estudiante\b/i.test(title)) return undefined;
  return patterns.find((p) => p.test.test(title))?.level;
}

/**
 * Derives the department's in-progress theses from each group's roster, so
 * the Enseñanza page stays in sync with the group pages that are the actual
 * source of truth.
 */
export function getFormacion(): Record<FormacionLevel, FormacionEntry[]> {
  const result: Record<FormacionLevel, FormacionEntry[]> = {
    grado: [],
    maestria: [],
    doctorado: [],
    posdoctorado: [],
  };

  const rosters = [
    ...researchGroups.map((g) => ({
      group: { slug: g.slug, name: g.name },
      people: [g.lead, g.coLead, ...g.members].filter(Boolean) as Member[],
    })),
    { group: asociadosGroup, people: asociados },
  ];

  for (const { group, people } of rosters) {
    for (const person of people) {
      const level = levelOf(person);
      if (!level) continue;
      result[level].push({
        name: person.name,
        title: person.title,
        thesis: person.thesis,
        level,
        groupSlug: group.slug,
        groupName: group.name,
      });
    }
  }

  return result;
}
