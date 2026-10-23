import { researchGroups, type Bilingual, type TeachingLevel } from "@/content/groups";
import { courseCatalog } from "@/content/courses";

export type ConsolidatedCourse = {
  key: string;
  name: Bilingual;
  program?: Bilingual;
  groups: { slug: string; name: Bilingual }[];
};

/**
 * Every course of a level, once: entries the catalog recognizes are merged
 * under its name, the rest keep the group's own wording. Sorted by name.
 */
export function getCourses(level: TeachingLevel): ConsolidatedCourse[] {
  const courses = new Map<string, ConsolidatedCourse>();
  const catalog = courseCatalog.filter((c) => c.level === level);

  for (const group of researchGroups) {
    for (const entry of group.teaching ?? []) {
      if (!entry.levels.includes(level)) continue;
      const known = catalog.find((c) => c.match.test(entry.es));
      const key = known ? known.id : `${group.slug}:${entry.es}`;
      let course = courses.get(key);
      if (!course) {
        course = known
          ? { key, name: known.name, program: known.program, groups: [] }
          : { key, name: entry, groups: [] };
        courses.set(key, course);
      }
      if (!course.groups.some((g) => g.slug === group.slug)) {
        course.groups.push({ slug: group.slug, name: group.name });
      }
    }
  }

  return [...courses.values()].sort((a, b) => a.name.es.localeCompare(b.name.es, "es"));
}
