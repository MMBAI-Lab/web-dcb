// Builds the census presentation (data/presentacion/DCB-censo-2026.pptx)
// from the site's content and the reviewed gender list.
//
//   node scripts/presentacion/proponer-genero.js   # once; then review the CSV
//   npm run build                                    # course totals come from out/
//   node scripts/presentacion/generar.js
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const { build } = require("./datos");
const { ROOT } = require("./personas");

const OUT = path.join(ROOT, "data", "presentacion", "DCB-censo-2026.pptx");
const LOGO = path.join(ROOT, "public", "images", "logos", "dcb-icon.png");

// Brand: the three colors of the DCB cube, as the site uses them.
const THEME = {
  name: "DCB",
  headFontFace: "Cambria",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "1B1F1E",
    lt1: "FFFFFF",
    dk2: "0E2A27",
    lt2: "EEF5F4",
    accent1: "12897F", // teal
    accent2: "C23A56", // crimson
    accent3: "E2932E", // gold
    accent4: "7FC4BC",
    accent5: "E8A2B1",
    accent6: "8A9492",
    hlink: "12897F",
    folHlink: "C23A56",
  },
};
const HEX = THEME.colors;
const MUTED = "5F6B69";
const GRID = "DCE5E3";
// Gender colors are fixed across the deck.
const GENDER = { F: HEX.accent2, M: HEX.accent1, "?": HEX.accent6 };

const d = build();
const P = d.people;
const c = d.count;

const SHORT = {
  bfq: "Biofisicoquímica",
  libiam: "LIBiAM",
  ecologiafluvial: "Ecología Fluvial",
  "ecologia-vertebrados": "ECoFauna",
  fisiologia: "Fisiología",
  lgmh: "Gen. Molecular Humana",
  ugb: "Genómica y Bioinf.",
  histologia: "Histología",
  "inmunologia-biotecnologia": "LIB",
  "moleculas-bioactivas": "Moléculas Bioactivas",
  danslab: "MMBAI",
  rumiantes: "Rumiantes",
  vyet: "VyET",
  virologiamolec: "Virología",
  anatomia: "Anatomía",
};
const CAT = d.ROL;
const ROLES = Object.keys(CAT);
const ROL_COLORS = ["12897F", "0E2A27", "C23A56", "E2932E", "B5651D", "6B7775"];
// n colors from light to dark, for a year-by-year gradient.
function ramp(from, to, n) {
  const rgb = (h) => [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [a, b] = [rgb(from), rgb(to)];
  return Array.from({ length: n }, (_, i) =>
    a.map((v, j) => Math.round(v + ((b[j] - v) * i) / Math.max(n - 1, 1)).toString(16).padStart(2, "0")).join("").toUpperCase(),
  );
}
const pct = (a, b) => `${Math.round((100 * a) / b)} %`;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.title = "El DCB en números — Censo 2026";
pres.author = "Departamento de Ciencias Biológicas";
pres.company = "CENUR Litoral Norte, Udelar";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;

// --- Layouts ---------------------------------------------------------------
const W = 13.333;
pres.defineSlideMaster({
  title: "PORTADA",
  background: { color: HEX.dk2 },
  objects: [
    { image: { path: LOGO, x: 8.9, y: 1.35, w: 3.6, h: 3.95 } },
    { placeholder: { options: { name: "title", type: "title", x: 0.7, y: 1.7, w: 7.8, h: 1.9, fontFace: THEME.headFontFace, fontSize: 44, bold: true, color: C.background1, valign: "bottom", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: 0.7, y: 3.8, w: 7.8, h: 1.6, fontSize: 18, color: "CFE3E0", valign: "top", margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "SECCION",
  background: { color: HEX.dk2 },
  objects: [
    { image: { path: LOGO, x: 11.6, y: 6.25, w: 0.85, h: 0.93 } },
    { placeholder: { options: { name: "title", type: "title", x: 0.7, y: 2.6, w: 10, h: 1.2, fontFace: THEME.headFontFace, fontSize: 40, bold: true, color: C.background1, valign: "bottom", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: 0.7, y: 3.95, w: 10, h: 1.0, fontSize: 18, color: "CFE3E0", valign: "top", margin: 0 }, text: "" } },
  ],
  slideNumber: { x: 0.7, y: 6.85, w: 1, h: 0.3, fontSize: 10, color: "9FBFBA" },
});
pres.defineSlideMaster({
  title: "CIERRE",
  background: { color: HEX.dk2 },
  objects: [
    { image: { path: LOGO, x: 11.6, y: 6.25, w: 0.85, h: 0.93 } },
    { placeholder: { options: { name: "title", type: "title", x: 0.7, y: 0.6, w: 10, h: 1.1, fontFace: THEME.headFontFace, fontSize: 36, bold: true, color: C.background1, valign: "bottom", align: "left", margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "CONTENIDO",
  background: { color: HEX.lt1 },
  objects: [
    { image: { path: LOGO, x: 12.35, y: 6.75, w: 0.4, h: 0.44 } },
    { text: { text: "DCB · Censo 2026", options: { x: 0.6, y: 6.85, w: 4, h: 0.3, fontSize: 10, color: MUTED, margin: 0 } } },
    { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.35, w: 12.1, h: 1.0, fontFace: THEME.headFontFace, fontSize: 30, bold: true, color: C.text2, valign: "middle", align: "left", margin: 0 }, text: "" } },
  ],
  slideNumber: { x: 11.4, y: 6.85, w: 0.8, h: 0.3, fontSize: 10, color: MUTED, align: "right" },
});

// --- Helpers ---------------------------------------------------------------
const AX = { catAxisLabelColor: MUTED, valAxisLabelColor: MUTED, catAxisLabelFontFace: "+mn-lt", valAxisLabelFontFace: "+mn-lt", catAxisLabelFontSize: 12, valAxisLabelFontSize: 11, dataLabelFontFace: "+mn-lt", dataLabelFontSize: 12, dataLabelColor: "1B1F1E", dataLabelFormatCode: "0;;;", legendFontFace: "+mn-lt", legendFontSize: 12, legendColor: "1B1F1E" };
const grid = () => ({ valGridLine: { color: GRID, size: 0.75 }, catGridLine: { style: "none" } });

let section;
function slide(layout, title, notes) {
  const s = pres.addSlide({ masterName: layout, sectionTitle: section });
  if (title) s.addText(title, { placeholder: "title" });
  if (notes) s.addNotes(notes);
  return s;
}
function startSection(title, subtitle, notes) {
  section = title;
  pres.addSection({ title });
  const s = slide("SECCION", title, notes);
  s.addText(subtitle, { placeholder: "body" });
}
function caption(s, text, y = 6.3) {
  s.addText(text, { x: 0.6, y, w: 11.5, h: 0.4, fontSize: 11, italic: true, color: MUTED, margin: 0, isTextBox: true });
}
function stat(s, { x, y, w, h, value, label, color = C.accent1, fill = C.background2, size = 40 }) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { type: "none" }, rectRadius: 0.12, objectName: `stat ${label}` });
  s.addText(String(value), { x: x + 0.25, y: y + 0.15, w: w - 0.5, h: h * 0.55, fontFace: THEME.headFontFace, fontSize: size, bold: true, color, valign: "bottom", margin: 0, isTextBox: true });
  s.addText(label, { x: x + 0.25, y: y + 0.2 + h * 0.55, w: w - 0.5, h: h * 0.38 - 0.2, fontSize: 14, color: C.text1, valign: "top", margin: 0, isTextBox: true });
}
function bullets(s, items, opts) {
  s.addText(
    items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < items.length - 1, paraSpaceAfter: 8 } })),
    { fontSize: 16, color: C.text1, valign: "top", margin: 0, isTextBox: true, ...opts },
  );
}

// --- Numbers used across slides --------------------------------------------
const total = P.length;
const g = c(P, (p) => p.gender);
const cats = c(P, (p) => p.rol);
// "Sin dato" only appears while the gender list has blanks.
const GN = g["?"] ? 3 : 2;
const GL = ["Mujeres", "Varones", "Sin dato"];
const GC = [GENDER.F, GENDER.M, GENDER["?"]].slice(0, GN);
const theses = P.filter((p) => p.thesis);
const docentesEstudiantes = P.filter((p) => p.rol === "cargo" && p.thesis && p.thesis.level !== "posdoctorado").length;
const campusGroups = c(d.active, (x) => x.campus);
const coursesTotal = d.courses.grado + d.courses.posgrado + d.courses.otras;
const COUNTRY = { EEUU: "Estados Unidos", Inglaterra: "Reino Unido", Escocia: "Reino Unido", Panama: "Panamá" };
const countries = c(d.collaborators.filter((x) => x.country), (x) => COUNTRY[x.country] ?? x.country);
const foreignCountries = Object.keys(countries).filter((k) => k !== "Uruguay").length;

// 1. Cover ------------------------------------------------------------------
section = "Portada";
pres.addSection({ title: section });
{
  const s = slide("PORTADA", "El DCB en números", "Resumen del censo de integrantes y grupos de octubre–noviembre de 2026. Todas las cifras salen del contenido publicado en el sitio del DCB.");
  s.addText(
    [
      { text: "Censo de integrantes y grupos 2026", options: { breakLine: true } },
      { text: "Departamento de Ciencias Biológicas · CENUR Litoral Norte · Udelar", options: { fontSize: 14 } },
    ],
    { placeholder: "body" },
  );
}

// 2. At a glance ------------------------------------------------------------
section = "Resumen";
pres.addSection({ title: section });
{
  const s = slide("CONTENIDO", "El DCB en una mirada", "Las ocho cifras que resumen el censo. Las siguientes secciones abren cada una.");
  const cards = [
    [total, "integrantes", C.accent1],
    [`${d.active.length}`, `grupos de investigación activos (${d.groups.length} con Anatomía)`, C.accent1],
    ["2", `sedes: Salto (${campusGroups.Salto} grupos) y Paysandú (${campusGroups["Paysandú"]})`, C.accent1],
    [theses.length, "tesis de grado, posgrado y posdoctorado en curso", C.accent2],
    [d.projects.length, "proyectos de investigación vigentes", C.accent2],
    [d.pubs.length, "publicaciones destacadas por los grupos", C.accent2],
    [coursesTotal, "cursos y pasantías en los que se enseña", C.accent3],
    [d.outreach.length, "acciones de extensión y divulgación", C.accent3],
  ];
  const cw = 2.85, ch = 2.2, gap = 0.25;
  cards.forEach(([v, label, color], i) => {
    const col = i % 4, row = Math.floor(i / 4);
    stat(s, { x: 0.6 + col * (cw + gap), y: 1.65 + row * (ch + gap), w: cw, h: ch, value: v, label, color });
  });
}

// 3–7. Who we are -------------------------------------------------------------
startSection("Quiénes somos", `${total} personas: docentes, estudiantes y funcionarios de ${d.active.length} grupos`, "Composición del departamento: categoría, género, grado docente, dedicación y formación.");

{
  const order = ROLES;
  const s = slide("CONTENIDO", `${cats.cargo} de ${total} integrantes tienen cargo docente`, `Con cargo docente: quienes declaran un cargo rentado (grado o carga horaria). Docentes libres u honorarios incluye a un investigador asociado sin cargo. Los posdoctorados sin cargo se cuentan con los estudiantes de posgrado. ${docentesEstudiantes} docentes con cargo cursan además una tesis: se cuentan solo como docentes.`);
  s.addChart(pres.charts.DOUGHNUT, [{ name: "Integrantes", labels: order.map((k) => CAT[k]), values: order.map((k) => cats[k] ?? 0) }], {
    x: 0.5, y: 1.5, w: 6.4, h: 4.9, holeSize: 58, chartColors: ROL_COLORS,
    showLegend: true, legendPos: "b", showPercent: false, showValue: true, dataLabelColor: "FFFFFF", dataLabelFontSize: 14, dataLabelFontBold: true, ...AX, dataLabelColor: "FFFFFF",
  });
  stat(s, { x: 7.4, y: 1.7, w: 5.3, h: 2.0, value: `${cats.cargo} de ${total}`, label: "integrantes declaran un cargo docente rentado" });
  stat(s, { x: 7.4, y: 3.95, w: 5.3, h: 2.0, value: docentesEstudiantes, label: "docentes con cargo cursan además una maestría, doctorado o tesis de grado", color: C.accent2 });
}

{
  const order = ROLES;
  const by = (gen) => order.map((k) => P.filter((p) => p.rol === k && p.gender === gen).length);
  const s = slide("CONTENIDO", `Las mujeres son mayoría: ${g.F} de ${total} integrantes`, "El censo no preguntó género: se asignó a partir de títulos y nombres y lo revisó la dirección del DCB. Proporciones dentro de cada categoría.");
  s.addChart(pres.charts.DOUGHNUT, [{ name: "Género", labels: GL.slice(0, GN), values: [g.F ?? 0, g.M ?? 0, g["?"] ?? 0].slice(0, GN) }], {
    x: 0.5, y: 1.5, w: 4.6, h: 4.7, holeSize: 58, chartColors: GC, showLegend: true, legendPos: "b", showValue: true, ...AX, dataLabelColor: "FFFFFF", dataLabelFontBold: true,
  });
  s.addChart(pres.charts.BAR, [
    { name: "Mujeres", labels: order.map((k) => CAT[k]), values: by("F") },
    { name: "Varones", labels: order.map((k) => CAT[k]), values: by("M") },
    { name: "Sin dato", labels: order.map((k) => CAT[k]), values: by("?") },
  ].slice(0, GN), {
    x: 5.4, y: 1.5, w: 7.4, h: 4.7, barDir: "bar", barGrouping: "percentStacked", chartColors: GC, catAxisOrientation: "maxMin",
    showValue: true, dataLabelPosition: "ctr", ...AX, dataLabelColor: "FFFFFF", showLegend: true, legendPos: "b", valAxisHidden: true, ...grid(), valGridLine: { style: "none" },
  });
  caption(s, "Género asignado a partir de títulos y nombres y revisado por el DCB (el formulario no lo preguntaba). Barras: proporción dentro de cada categoría.");
}

{
  const levels = [1, 2, 3, 4, 5];
  const NAMES = ["G1 Ayudante", "G2 Asistente", "G3 Adjunto/a", "G4 Agregado/a", "G5 Titular"];
  const by = (gen) => levels.map((l) => P.filter((p) => p.grado === l && p.gender === gen).length);
  const f = by("F"), m = by("M");
  const s = slide("CONTENIDO", "Mayoría femenina en los grados de ingreso, masculina arriba", `Docentes con grado informado: ${P.filter((p) => p.grado).length}. G2: ${f[1]} mujeres y ${m[1]} varones; G4 y G5: ${f[3] + f[4]} mujeres y ${m[3] + m[4]} varones. Los responsables de grupo son ${P.filter((p) => p.role === "lead" && p.gender === "F").length} mujeres y ${P.filter((p) => p.role === "lead" && p.gender === "M").length} varones.`);
  s.addChart(pres.charts.BAR, [
    { name: "Mujeres", labels: NAMES, values: f },
    { name: "Varones", labels: NAMES, values: m },
  ], {
    x: 0.5, y: 1.5, w: 8.2, h: 4.8, barDir: "col", barGrouping: "clustered", barGapWidthPct: 60, chartColors: [GENDER.F, GENDER.M],
    showValue: true, dataLabelPosition: "outEnd", ...AX, showLegend: true, legendPos: "b", ...grid(),
  });
  const leadsF = P.filter((p) => p.role === "lead" && p.gender === "F").length;
  const leadsM = P.filter((p) => p.role === "lead" && p.gender === "M").length;
  stat(s, { x: 9.1, y: 1.7, w: 3.7, h: 2.0, value: `${f[1]} / ${m[1]}`, label: "mujeres / varones en G2, el grado más numeroso", color: C.accent2 });
  stat(s, { x: 9.1, y: 3.95, w: 3.7, h: 2.0, value: `${leadsF} / ${leadsM}`, label: "mujeres / varones entre responsables de grupo" });
}

{
  const doc = P.filter((p) => p.rol === "cargo");
  const bucket = (p) => (p.hours == null ? "Sin dato" : p.hours <= 20 ? "Hasta 20 h" : p.hours < 40 ? "21 a 39 h" : "40 h o más");
  const order = ["Hasta 20 h", "21 a 39 h", "40 h o más", "Sin dato"];
  const dtDoc = doc.filter((p) => p.dt);
  const dt = dtDoc.length;
  const dt40 = dtDoc.filter((p) => p.hours >= 40).length;
  const h40 = doc.filter((p) => p.hours >= 40).length;
  const s = slide("CONTENIDO", `${dt} docentes en Dedicación Total, ${dt40} de ellos con 40 horas`, `Docentes con cargo, por horas semanales del cargo. Cada barra separa a quienes están en régimen de Dedicación Total de quienes no. De los ${h40} docentes con 40 horas o más, ${dt40} tienen DT y ${h40 - dt40} no. Las DT con menos de 40 horas figuran así en la ficha.`);
  const dtBy = (flag) => order.map((k) => doc.filter((p) => p.dt === flag && bucket(p) === k).length);
  s.addChart(pres.charts.BAR, [
    { name: "Con Dedicación Total", labels: order, values: dtBy(true) },
    { name: "Sin Dedicación Total", labels: order, values: dtBy(false) },
  ], {
    x: 0.5, y: 1.5, w: 7.6, h: 4.8, barDir: "col", barGrouping: "stacked", barGapWidthPct: 55, chartColors: [HEX.accent2, HEX.accent1],
    showValue: true, dataLabelPosition: "ctr", ...AX, dataLabelColor: "FFFFFF", showLegend: true, legendPos: "b", ...grid(), valAxisHidden: true, valGridLine: { style: "none" },
  });
  stat(s, { x: 8.6, y: 1.7, w: 4.2, h: 2.0, value: dt, label: `docentes en Dedicación Total (${pct(dt, doc.length)} de los docentes con cargo)`, color: C.accent2 });
  stat(s, { x: 8.6, y: 3.95, w: 4.2, h: 2.0, value: `${dt40} de ${h40}`, label: "docentes con 40 horas o más están en DT" });
  caption(s, "Horas semanales del cargo docente, según la ficha. Rojo: en régimen de Dedicación Total; verde: sin DT.");
}

{
  const order = ["Doctorado", "Maestría", "Grado", "Técnico/a", "Estudiante de grado o sin título informado"];
  const labels = ["Doctorado", "Maestría", "Título de grado", "Técnico/a", "Sin título informado"];
  const deg = c(P, (p) => p.degree);
  const s = slide("CONTENIDO", `${deg.Doctorado} integrantes tienen doctorado y ${theses.filter((t) => t.thesis.level === "doctorado").length} más lo están cursando`, "Máximo título según el prefijo con que cada persona publica su nombre (Dr./Dra., MSc./Mag., Lic., etc.). 'Sin título informado' incluye estudiantes de grado y a quienes no lo indicaron.");
  s.addChart(pres.charts.BAR, [
    { name: "Mujeres", labels, values: order.map((k) => P.filter((p) => p.degree === k && p.gender === "F").length) },
    { name: "Varones", labels, values: order.map((k) => P.filter((p) => p.degree === k && p.gender === "M").length) },
    { name: "Sin dato", labels, values: order.map((k) => P.filter((p) => p.degree === k && p.gender === "?").length) },
  ].slice(0, GN), {
    x: 0.5, y: 1.5, w: 8.4, h: 4.8, barDir: "bar", barGrouping: "stacked", catAxisOrientation: "maxMin", chartColors: GC,
    showValue: true, dataLabelPosition: "ctr", ...AX, dataLabelColor: "FFFFFF", showLegend: true, legendPos: "b", ...grid(),
  });
  stat(s, { x: 9.3, y: 1.7, w: 3.5, h: 2.0, value: pct(deg.Doctorado, total), label: "de los integrantes con doctorado" });
  stat(s, { x: 9.3, y: 3.95, w: 3.5, h: 2.0, value: `${deg.Doctorado}`, label: `doctores: ${P.filter((p) => p.degree === "Doctorado" && p.gender === "F").length} mujeres y ${P.filter((p) => p.degree === "Doctorado" && p.gender === "M").length} varones`, color: C.accent2 });
  caption(s, "Máximo título según el prefijo del nombre publicado. «Sin título informado» incluye estudiantes de grado.");
}

// 8–9. Groups -----------------------------------------------------------------
startSection("Grupos y sedes", `${d.active.length} grupos de investigación en Salto y Paysandú`, "Tamaño de cada grupo y reparto entre sedes.");

{
  const rows = d.active
    .map((x) => {
      const ppl = P.filter((p) => p.groups.includes(x.slug));
      return { slug: x.slug, campus: x.campus, n: ppl.length, by: ROLES.map((k) => ppl.filter((p) => p.rol === k).length) };
    })
    .sort((a, b) => b.n - a.n);
  const labels = rows.map((r) => `${SHORT[r.slug]} · ${r.campus}`);
  const sizes = rows.map((r) => r.n);
  const s = slide("CONTENIDO", `Grupos de ${Math.min(...sizes)} a ${Math.max(...sizes)} integrantes`, "Integrantes por grupo y por categoría (quien está en dos grupos cuenta en ambos). Anatomía todavía no envió su información.");
  s.addChart(pres.charts.BAR, ROLES.map((k, i) => ({ name: CAT[k], labels, values: rows.map((r) => r.by[i]) })), {
    x: 0.5, y: 1.3, w: 12.3, h: 5.3, barDir: "bar", barGrouping: "stacked", barGapWidthPct: 35, catAxisOrientation: "maxMin", chartColors: ROL_COLORS,
    showValue: true, dataLabelPosition: "ctr", ...AX, dataLabelColor: "FFFFFF", dataLabelFontSize: 11, catAxisLabelFontSize: 12, showLegend: true, legendPos: "b", legendFontSize: 11, ...grid(), valAxisHidden: true, valGridLine: { style: "none" },
  });
}

{
  const camp = (name) => {
    const gs = d.active.filter((x) => x.campus === name).map((x) => x.slug);
    const ppl = P.filter((p) => p.groups.some((s) => gs.includes(s)));
    return {
      groups: gs.length,
      people: ppl.length,
      theses: ppl.filter((p) => p.thesis).length,
      projects: d.projects.filter((x) => gs.includes(x.group)).length,
      pubs: d.pubs.filter((x) => gs.includes(x.group)).length,
    };
  };
  const sa = camp("Salto"), pa = camp("Paysandú");
  const s = slide("CONTENIDO", `Paysandú: ${pa.groups} grupos con ${pct(pa.people, sa.people + pa.people)} de los integrantes`, `Salto: ${sa.groups} grupos, ${sa.people} integrantes. Paysandú: ${pa.groups} grupos, ${pa.people} integrantes. Los dos asociados sin grupo no se cuentan aquí.`);
  const card = (x, name, v, color) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.55, w: 5.9, h: 4.65, fill: { color: C.background2 }, line: { type: "none" }, rectRadius: 0.15, objectName: `sede ${name}` });
    s.addText(name, { x: x + 0.4, y: 1.8, w: 5.1, h: 0.7, fontFace: THEME.headFontFace, fontSize: 28, bold: true, color, margin: 0, isTextBox: true });
    const items = [[v.groups, "grupos"], [v.people, "integrantes"], [v.theses, "tesis en curso"], [v.projects, "proyectos"], [v.pubs, "publicaciones destacadas"]];
    items.forEach(([n, l], i) => {
      const col = i % 2, row = Math.floor(i / 2);
      s.addText([{ text: String(n), options: { fontFace: THEME.headFontFace, fontSize: 32, bold: true, color, breakLine: true } }, { text: l, options: { fontSize: 14, color: C.text1 } }], {
        x: x + 0.4 + col * 2.6, y: 2.7 + row * 1.15, w: 2.5, h: 1.05, valign: "top", margin: 0, isTextBox: true,
      });
    });
  };
  card(0.6, "Salto", sa, C.accent1);
  card(6.85, "Paysandú", pa, C.accent3);
}

// 10. Theses ------------------------------------------------------------------
startSection("Formación de recursos humanos", `${theses.length} tesis y posdoctorados en curso dentro de los grupos`, "Tesis de grado, maestrías, doctorados y posdoctorados declarados en las fichas.");

{
  const LV = { doctorado: "Doctorado", maestria: "Maestría", grado: "Tesis de grado", posdoctorado: "Posdoctorado" };
  const order = ["doctorado", "maestria", "grado", "posdoctorado"];
  const lv = c(theses, (p) => p.thesis.level);
  const groups = d.active
    .map((x) => ({ slug: x.slug, by: order.map((l) => theses.filter((p) => p.groups[0] === x.slug && p.thesis.level === l).length) }))
    .filter((r) => r.by.some(Boolean))
    .sort((a, b) => b.by.reduce((s, v) => s + v, 0) - a.by.reduce((s, v) => s + v, 0));
  const s = slide("CONTENIDO", `${lv.doctorado + lv.maestria} posgrados en curso: ${lv.doctorado} doctorados y ${lv.maestria} maestrías`, "Cada tesis se cuenta en el primer grupo de la persona.");
  s.addChart(pres.charts.DOUGHNUT, [{ name: "Tesis", labels: order.map((l) => LV[l]), values: order.map((l) => lv[l] ?? 0) }], {
    x: 0.4, y: 1.45, w: 4.6, h: 4.9, holeSize: 55, chartColors: [HEX.accent2, HEX.accent1, HEX.accent3, HEX.accent6], showLegend: true, legendPos: "b", showValue: true, ...AX, dataLabelColor: "FFFFFF", dataLabelFontBold: true,
  });
  s.addChart(pres.charts.BAR, order.map((l, i) => ({ name: LV[l], labels: groups.map((r) => SHORT[r.slug]), values: groups.map((r) => r.by[i]) })), {
    x: 5.2, y: 1.45, w: 7.6, h: 4.9, barDir: "bar", barGrouping: "stacked", barGapWidthPct: 40, catAxisOrientation: "maxMin", chartColors: [HEX.accent2, HEX.accent1, HEX.accent3, HEX.accent6],
    showValue: false, ...AX, showLegend: false, ...grid(),
  });
}

// 11–13. Research ---------------------------------------------------------------
startSection("Investigación", `${d.projects.length} proyectos vigentes, ${d.pubs.length} publicaciones destacadas y ${d.collaborators.length} colaboraciones`, "Proyectos, publicaciones y redes de colaboración que informó cada grupo.");

{
  const ag = c(d.projects, (p) => p.agencies);
  const order = ["ANII", "CSIC (Udelar)", "PEDECIBA", "Internacional", "Otros nacionales", "Sin dato"].filter((k) => ag[k]);
  const s = slide("CONTENIDO", "ANII y CSIC financian la mayoría de los proyectos", "Un proyecto con varias fuentes cuenta en cada una. Internacional: CAPES, CNPq (PROSUL), AUGM, ISAGEN, Fundación Baden-Württemberg, L'Oréal. Otros nacionales: Fundación IRAUy, FPTA (INIA), Fondo Vaz Ferreira.");
  s.addChart(pres.charts.BAR, [{ name: "Proyectos", labels: order, values: order.map((k) => ag[k]) }], {
    x: 0.5, y: 1.5, w: 8.0, h: 4.8, barDir: "bar", barGapWidthPct: 45, catAxisOrientation: "maxMin", chartColors: [HEX.accent1],
    showValue: true, dataLabelPosition: "outEnd", ...AX, showLegend: false, ...grid(), valAxisHidden: true, valGridLine: { style: "none" },
  });
  const withProjects = new Set(d.projects.map((p) => p.group)).size;
  stat(s, { x: 9.0, y: 1.7, w: 3.8, h: 2.0, value: d.projects.length, label: `proyectos vigentes en ${withProjects} grupos` });
  stat(s, { x: 9.0, y: 3.95, w: 3.8, h: 2.0, value: ag.Internacional ?? 0, label: "con financiamiento internacional", color: C.accent3 });
  caption(s, "Un proyecto con varias fuentes de financiamiento cuenta en cada una.");
}

{
  const years = d.pubs.map((p) => p.year).filter(Boolean);
  const from = 2020, to = Math.max(...years);
  const labels = ["Antes de 2020", ...Array.from({ length: to - from + 1 }, (_, i) => String(from + i))];
  const values = [years.filter((y) => y < from).length, ...labels.slice(1).map((l) => years.filter((y) => y === +l).length)];
  const recent = years.filter((y) => y >= 2021).length;
  const s = slide("CONTENIDO", `${pct(recent, years.length)} de las publicaciones destacadas son de 2021 en adelante`, "Cada grupo eligió hasta diez publicaciones para su página: no es la producción total del DCB.");
  s.addChart(pres.charts.BAR, [{ name: "Publicaciones", labels, values }], {
    x: 0.5, y: 1.5, w: 12.3, h: 4.7, barDir: "col", barGapWidthPct: 45, chartColors: [HEX.accent6, ...ramp("F2C4CE", "8E1F3A", labels.length - 1)],
    showValue: true, dataLabelPosition: "outEnd", ...AX, showLegend: false, ...grid(), valAxisHidden: true, valGridLine: { style: "none" },
  });
  caption(s, `${d.pubs.length} publicaciones elegidas por los grupos para su página (hasta diez cada uno); no es la producción total del DCB.`);
}

{
  const rows = Object.entries(countries).sort((a, b) => b[1] - a[1]);
  const top = rows.slice(0, 9);
  const rest = rows.slice(9).reduce((s, [, n]) => s + n, 0);
  if (rest) top.push([`Otros (${rows.length - 9} países)`, rest]);
  const s = slide("CONTENIDO", `Colaboraciones con ${foreignCountries} países además de Uruguay`, "Colaboradores que listó cada grupo (hasta ocho). Sin país: instituciones nacionales cargadas sin indicar el país.");
  s.addChart(pres.charts.BAR, [{ name: "Colaboraciones", labels: top.map(([k]) => k), values: top.map(([, n]) => n) }], {
    x: 0.5, y: 1.5, w: 8.0, h: 4.8, barDir: "bar", barGapWidthPct: 40, catAxisOrientation: "maxMin", chartColors: [HEX.accent1],
    showValue: true, dataLabelPosition: "outEnd", ...AX, showLegend: false, ...grid(), valAxisHidden: true, valGridLine: { style: "none" },
  });
  const latam = ["Brasil", "Argentina", "Chile", "Paraguay", "Colombia", "México", "Panamá", "Ecuador"].reduce((s, k) => s + (countries[k] ?? 0), 0);
  stat(s, { x: 9.0, y: 1.7, w: 3.8, h: 2.0, value: d.collaborators.length, label: "colaboraciones declaradas por los grupos" });
  stat(s, { x: 9.0, y: 3.95, w: 3.8, h: 2.0, value: latam, label: "con instituciones del resto de América Latina", color: C.accent3 });
}

// 14–15. Teaching and outreach --------------------------------------------------
startSection("Enseñanza y extensión", `${coursesTotal} cursos y pasantías, ${d.outreach.length} acciones de extensión`, "Docencia de grado y posgrado, y actividades con la comunidad.");

{
  const s = slide("CONTENIDO", `Los grupos enseñan en ${d.courses.grado} cursos de grado y ${d.courses.posgrado} de posgrado`, "Cada curso cuenta una vez aunque lo dicten varios grupos, como en la página Enseñanza del sitio.");
  s.addChart(pres.charts.DOUGHNUT, [{ name: "Cursos", labels: ["Grado", "Posgrado", "Pasantías y educación permanente"], values: [d.courses.grado, d.courses.posgrado, d.courses.otras] }], {
    x: 0.4, y: 1.45, w: 5.6, h: 4.9, holeSize: 55, chartColors: [HEX.accent1, HEX.accent2, HEX.accent3], showLegend: true, legendPos: "b", showValue: true, ...AX, dataLabelColor: "FFFFFF", dataLabelFontBold: true,
  });
  const teach = c(d.active.filter((x) => x.teaching?.length), () => "n").n;
  stat(s, { x: 6.6, y: 1.7, w: 6.2, h: 2.0, value: "CBB · Biotecnología", label: "el DCB coordina el Ciclo Biología-Bioquímica y la Licenciatura en Biotecnología", size: 28 });
  stat(s, { x: 6.6, y: 3.95, w: 6.2, h: 2.0, value: `${teach} de ${d.active.length}`, label: "grupos dictan cursos de grado, posgrado o pasantías", color: C.accent3 });
  caption(s, "Cada curso cuenta una vez aunque lo dicten varios grupos, como en la página Enseñanza del sitio.");
}

{
  const KIND = { medios: "Medios y divulgación", educativo: "Trabajo con centros educativos", eventos: "Ferias, congresos y jornadas", comunidad: "Comunidad y territorio", arte: "Arte y ciencia" };
  const k = c(d.outreach, (o) => o.kinds);
  const order = Object.keys(KIND).sort((a, b) => (k[b] ?? 0) - (k[a] ?? 0));
  const groupsWith = d.active.filter((x) => x.outreach?.length).length;
  const s = slide("CONTENIDO", "Medios y centros educativos encabezan la extensión", "Una acción puede tener más de un tipo y cuenta en cada uno.");
  s.addChart(pres.charts.BAR, [{ name: "Acciones", labels: order.map((x) => KIND[x]), values: order.map((x) => k[x] ?? 0) }], {
    x: 0.5, y: 1.5, w: 8.0, h: 4.8, barDir: "bar", barGapWidthPct: 45, catAxisOrientation: "maxMin", chartColors: [HEX.accent3],
    showValue: true, dataLabelPosition: "outEnd", ...AX, showLegend: false, ...grid(), valAxisHidden: true, valGridLine: { style: "none" },
  });
  stat(s, { x: 9.0, y: 1.7, w: 3.8, h: 2.0, value: d.outreach.length, label: "acciones de extensión y divulgación", color: C.accent3 });
  stat(s, { x: 9.0, y: 3.95, w: 3.8, h: 2.0, value: groupsWith, label: `de ${d.active.length} grupos hacen extensión` });
  caption(s, "Una acción puede tener más de un tipo y cuenta en cada uno.");
}

// 16. About the data ------------------------------------------------------------
section = "Sobre los datos";
pres.addSection({ title: section });
{
  const s = slide("CIERRE", "Sobre los datos", "Qué incluyen y qué no incluyen las cifras.");
  bullets(
    s,
    [
      "Fuente: censo de octubre–noviembre de 2026 (fichas de integrante y de grupo) y lo publicado hoy en el sitio del DCB.",
      `Anatomía todavía no envió información; ${P.length} integrantes incluye a quienes no completaron su ficha, con los datos que ya tenía el sitio.`,
      "El género no estaba en el formulario: se asignó a partir de títulos y nombres y lo revisó la dirección.",
      "Publicaciones: las que eligió cada grupo para su página, no la producción total. Proyectos: los vigentes informados por cada grupo.",
    ],
    { x: 0.7, y: 2.1, w: 10.6, h: 4.0, color: "E3EFED", fontSize: 18 },
  );
}

// pptxgenjs writes Office's stock theme; scheme colors (C.accent1, ...) only
// become the DCB's once the theme's color scheme and fonts are replaced.
// Folder entries are dropped too: some cloud viewers refuse zips with them.
async function applyTheme(file, theme) {
  const JSZip = require(require.resolve("jszip", { paths: [require.resolve("pptxgenjs")] }));
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const out = new JSZip();
  for (const [name, entry] of Object.entries(zip.files)) {
    if (entry.dir) continue;
    let data = await entry.async("nodebuffer");
    if (/^ppt\/theme\/theme\d+\.xml$/.test(name)) {
      const slots = ["dk1", "lt1", "dk2", "lt2", "accent1", "accent2", "accent3", "accent4", "accent5", "accent6", "hlink", "folHlink"];
      const scheme = `<a:clrScheme name="${theme.name}">${slots.map((k) => `<a:${k}><a:srgbClr val="${theme.colors[k]}"/></a:${k}>`).join("")}</a:clrScheme>`;
      data = Buffer.from(
        data
          .toString("utf8")
          .replace(/<a:clrScheme[\s\S]*?<\/a:clrScheme>/, scheme)
          .replace(/(<a:majorFont>\s*<a:latin typeface=")[^"]*/, `$1${theme.headFontFace}`)
          .replace(/(<a:minorFont>\s*<a:latin typeface=")[^"]*/, `$1${theme.bodyFontFace}`),
      );
    }
    out.file(name, data, { compression: "DEFLATE", createFolders: false });
  }
  fs.writeFileSync(file, await out.generateAsync({ type: "nodebuffer" }));
}

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log(OUT);
})();
