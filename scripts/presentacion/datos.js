// Numbers for the census presentation, from the same content the site
// publishes (src/content) plus the reviewed gender list
// (data/presentacion/genero.csv, not in git).
const fs = require("fs");
const path = require("path");
const { ROOT, loadGroups, loadPeople } = require("./personas");

// --- Category, as on /integrantes (port of src/lib/integrantes.ts) --------
const STAFF = /Técnic|Ingenier|Preparador|\bR ?1\d\b|\bD7\b/i;
const FACULTY =
  /\bGdo\b|\bG\d\b|Profesor|Prof\.|Asistente|Ayudante|Responsable|Investigador|Honorari|postdoctoral|Cursos de perfeccionamiento|Docente/i;
const POSGRADO = /doctorand|estudiante de doctorado|estudiante de maestr|estudiante de posgrado|maestrand/i;
const GRADO = /estudiante de licenciatura|tesista de grado|estudiante de la lic|pasant|ciclo de biología/i;
const OVERRIDES = { "Lic. Denisse Mavis Sánchez": "posgrado" };

function studentLevel(p) {
  const level = p.thesis?.level;
  if (level === "maestria" || level === "doctorado") return "posgrado";
  if (level === "grado") return "grado";
  if (level === "posdoctorado") return undefined;
  if (POSGRADO.test(p.title)) return "posgrado";
  if (GRADO.test(p.title)) return "grado";
  return undefined;
}
function category(p) {
  if (OVERRIDES[p.name]) return OVERRIDES[p.name];
  const student = studentLevel(p);
  const title = p.title ?? "";
  if (student && /^(Estudiante|Doctorand|Maestrand|Tesista)/i.test(title)) return student;
  const role = /\bGdo\b/.test(title)
    ? "docentes"
    : STAFF.test(title)
      ? "tecnicos"
      : FACULTY.test(title) || p.thesis?.level === "posdoctorado"
        ? "docentes"
        : undefined;
  return role ?? student ?? "docentes";
}

// --- Highest degree, from the academic prefix of the published name -------
function degree(p) {
  const n = p.name;
  if (/^(Prof\. )?Dra?\.|PhD/.test(n)) return "Doctorado";
  if (/^(MSc\.|Mag\.)/.test(n)) return "Maestría";
  if (/^(Lic\.(?! \(candidate\))|Q\.F\.|MSc\. Q\.F\.|Quím\.|BQ\.|DCV|DMTV\.|M\.V\.|Ing\.|Prof\.)/.test(n)) return "Grado";
  if (/^Tec\./.test(n)) return "Técnico/a";
  return "Estudiante de grado o sin título informado";
}

const gradoDocente = (p) => {
  const m = (p.title ?? "").match(/\bG(?:do|rado)?\s?(\d)\b/);
  return m ? +m[1] : null;
};
const hours = (p) => {
  const m = (p.title ?? "").match(/(\d{2})\s?h/);
  return m ? +m[1] : null;
};

// Six-way split for the deck: only people who report a paid teaching post
// count as "cargo"; honorary/free faculty and associated researchers apart;
// postdocs join the graduate students; interns apart from undergraduates.
const ROL = {
  cargo: "Con cargo docente",
  honorarios: "Docentes libres u honorarios",
  posgrado: "Estudiantes de posgrado y posdocs",
  grado: "Estudiantes de grado",
  pasantes: "Pasantes",
  tecnicos: "Técnicos",
};
function rol(p) {
  const title = p.title ?? "";
  if (p.category === "tecnicos") return "tecnicos";
  if (p.category === "grado") return /pasant/i.test(title) ? "pasantes" : "grado";
  if (p.category === "posgrado") return "posgrado";
  if (p.grado || /^Asistente|Ayudante|Profesor|Adjunt/.test(title)) return "cargo";
  if (p.thesis?.level === "posdoctorado") return "posgrado";
  return "honorarios";
}

function readGender() {
  const file = path.join(ROOT, "data", "presentacion", "genero.csv");
  const map = new Map();
  for (const line of fs.readFileSync(file, "utf8").replace(/^﻿/, "").split(/\r?\n/).slice(1)) {
    if (!line.trim()) continue;
    const [name, g] = line.split(";");
    map.set(name, g.trim().toUpperCase());
  }
  return map;
}

function funderAgencies(funder) {
  const f = (funder ?? "").toLowerCase();
  const out = new Set();
  if (/anii|clemente|ida.?holz|maria viñas|eulac/.test(f)) out.add("ANII");
  if (/csic|paie/.test(f)) out.add("CSIC (Udelar)");
  if (/pedeciba/.test(f)) out.add("PEDECIBA");
  if (/capes|cnpq|augm|isagen|baden|l'oreal/.test(f)) out.add("Internacional");
  if (/fpta|irauy|vaz ferreira|cap\b|; cap/.test(f) && !out.size) out.add("Otros nacionales");
  if (/irauy|fpta|vaz ferreira/.test(f)) out.add("Otros nacionales");
  if (!out.size) out.add("Sin dato");
  return [...out];
}

function count(items, key) {
  const m = {};
  for (const i of items) for (const k of [].concat(key(i))) m[k] = (m[k] ?? 0) + 1;
  return m;
}

function build() {
  const groups = loadGroups();
  const active = groups.filter((g) => !g.pending);
  const gender = readGender();
  const people = loadPeople(groups)
    // Postdocs listed only by their title (no thesis entry), e.g. MMBAI.
    .map((p) => (!p.thesis && /postdoc|posdoc/i.test(p.title ?? "") ? { ...p, thesis: { level: "posdoctorado" } } : p))
    .map((p) => ({
    ...p,
    category: category(p),
    degree: degree(p),
    grado: gradoDocente(p),
    hours: hours(p),
    dt: /\bDT\b/.test(p.title ?? ""),
    gender: gender.get(p.name) ?? "?",
    campus: p.groups.map((s) => groups.find((g) => g.slug === s)?.campus).filter(Boolean)[0] ?? "Sin grupo",
  }));

  const pubs = active.flatMap((g) => (g.publications ?? []).map((p) => ({ ...p, group: g.slug })));
  const year = (c) => {
    const m = c.citation.match(/\.\s((?:19|20)\d\d)[;.(\s]/) ?? c.citation.match(/\b(20\d\d)\b/);
    return m ? +m[1] : null;
  };
  const projects = active.flatMap((g) => (g.currentProjects ?? []).map((p) => ({ ...p, group: g.slug })));
  const collaborators = active.flatMap((g) => (g.collaborators ?? []).map((c) => ({ ...c, group: g.slug })));
  const outreach = active.flatMap((g) => g.outreach ?? []);

  // Consolidated course counts as Enseñanza shows them (from the built site).
  const html = fs.readFileSync(path.join(ROOT, "out", "es", "ensenanza", "index.html"), "utf8").replace(/<[^>]+>/g, " ");
  const m = html.match(/docencia en (\d+) cursos de grado, (\d+) de posgrado y (\d+)/);
  if (!m) throw new Error("No encuentro los totales de cursos en out/es/ensenanza (correr npm run build)");

  for (const p of people) p.rol = rol(p);
  return {
    ROL,
    groups,
    active,
    people,
    pubs: pubs.map((p) => ({ ...p, year: year(p) })),
    projects: projects.map((p) => ({ ...p, agencies: funderAgencies(p.funder) })),
    collaborators,
    outreach,
    courses: { grado: +m[1], posgrado: +m[2], otras: +m[3] },
    count,
  };
}

module.exports = { build };

if (require.main === module) {
  const d = build();
  const c = d.count;
  console.log("personas", d.people.length, "grupos", d.groups.length, "activos", d.active.length);
  console.log("categoría", c(d.people, (p) => p.category));
  console.log("rol", c(d.people, (p) => p.rol));
  console.log("género", c(d.people, (p) => p.gender));
  console.log("formación", c(d.people, (p) => p.degree));
  console.log("grado docente", c(d.people.filter((p) => p.grado), (p) => p.grado));
  console.log("DT", d.people.filter((p) => p.dt).length);
  console.log("sede", c(d.people, (p) => p.campus));
  console.log("tesis", c(d.people.filter((p) => p.thesis), (p) => p.thesis.level));
  console.log("pubs", d.pubs.length, c(d.pubs, (p) => p.year ?? "?"));
  console.log("proyectos", d.projects.length, c(d.projects, (p) => p.agencies));
  console.log("colab", d.collaborators.length, c(d.collaborators, (x) => x.country ?? "?"));
  console.log("extensión", d.outreach.length, c(d.outreach, (o) => o.kinds));
  console.log("cursos", d.courses);
  for (const p of d.people.filter((p) => p.degree.startsWith("Estudiante") && p.category !== "grado")) console.log("  sin título:", p.name, "|", p.category, "|", p.title);
}
