import { asociados, researchGroups, type Bilingual, type Member } from "@/content/groups";

export type Categoria = "docentes" | "posgrado" | "grado" | "tecnicos";
export const categorias: Categoria[] = ["docentes", "posgrado", "grado", "tecnicos"];

export type Integrante = {
  person: Member;
  category: Categoria;
  /** A docente or técnico who is also a student: shown next to the name. */
  alsoStudent?: "posgrado" | "grado";
  groups: { slug: string; name: Bilingual }[];
};

// Positions that make someone staff rather than faculty (técnicos R12/R16,
// preparador D7, Tec. without a teaching grade).
const STAFF = /Técnic|Ingenier|Preparador|\bR ?1\d\b|\bD7\b/i;
// A teaching grade or faculty role. Postdocs and honorary researchers are
// listed with faculty.
const FACULTY =
  /\bGdo\b|\bG\d\b|Profesor|Prof\.|Asistente|Ayudante|Responsable|Investigador|Honorari|postdoctoral|Cursos de perfeccionamiento/i;
const POSGRADO = /doctorand|estudiante de doctorado|estudiante de maestr|estudiante de posgrado|maestrand/i;
const GRADO = /estudiante de licenciatura|tesista de grado|estudiante de la lic|pasant|ciclo de biología/i;

// People the rules above would misfile. Doctoral students whose title also
// mentions a research post elsewhere are students here.
const OVERRIDES: Record<string, Categoria> = {
  "Lic. Gonzalo Lopez": "posgrado",
  "MSc. Denisse Mavis Sánchez": "posgrado",
  "Tec. Wiston Albieni": "tecnicos",
};

function studentLevel(person: Member): "posgrado" | "grado" | undefined {
  const level = person.thesis?.level;
  if (level === "maestria" || level === "doctorado") return "posgrado";
  if (level === "grado") return "grado";
  if (level === "posdoctorado") return undefined;
  if (POSGRADO.test(person.title)) return "posgrado";
  if (GRADO.test(person.title)) return "grado";
  return undefined;
}

function classify(person: Member): Pick<Integrante, "category" | "alsoStudent"> {
  const student = studentLevel(person);
  const override = OVERRIDES[person.name];
  if (override) return { category: override };

  const title = person.title ?? "";
  // A title that opens by describing a student ("Estudiante de Maestría…,
  // co-dirigida por la Prof. …") is a student, whatever it mentions later.
  if (student && /^(Estudiante|Doctorand|Maestrand|Tesista)/i.test(title)) return { category: student };
  const role: Categoria | undefined = /\bGdo\b/.test(title)
    ? "docentes" // a teaching grade wins over a technical-sounding title
    : STAFF.test(title)
      ? "tecnicos"
      : FACULTY.test(title) || person.thesis?.level === "posdoctorado"
        ? "docentes"
        : undefined;

  if (role) return { category: role, alsoStudent: student };
  return { category: student ?? "docentes" };
}

const sortKey = (name: string) =>
  name.replace(/^((Prof\.|Dr\.|Dra\.|Lic\.|MSc\.|Mag\.|M\.V\.|Q\.F\.|Quím\.|Quim\.|Far\.|Bach\.|Tec\.|Ing\.|Agr\.|Elec\.|DCV|DMTV\.|Lic \(candidate\)\.)\s*)+/, "");

/**
 * Everyone on a group page or the associates page, once (people in two
 * groups list both), sorted by name within each category.
 */
export function getIntegrantes(): Record<Categoria, Integrante[]> {
  const byName = new Map<string, Integrante>();
  const add = (person: Member, group: { slug: string; name: Bilingual }) => {
    const existing = byName.get(person.name);
    if (existing) {
      existing.groups.push(group);
      return;
    }
    byName.set(person.name, { person, ...classify(person), groups: [group] });
  };

  for (const g of researchGroups) {
    for (const p of [g.lead, g.coLead, ...g.members]) if (p) add(p, { slug: g.slug, name: g.name });
  }
  const asociadosGroup = {
    slug: "asociados",
    name: { es: "Investigadores asociados", en: "Associated researchers" },
  };
  for (const p of asociados) add(p, asociadosGroup);

  const result = Object.fromEntries(categorias.map((c) => [c, [] as Integrante[]])) as Record<
    Categoria,
    Integrante[]
  >;
  for (const i of byName.values()) result[i.category].push(i);
  for (const c of categorias) {
    result[c].sort((a, b) => sortKey(a.person.name).localeCompare(sortKey(b.person.name), "es"));
  }
  return result;
}
