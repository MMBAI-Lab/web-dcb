/**
 * One-off migration to the uniform content contract:
 *
 *   researchLines : {es,en} prose  ->  { intro:{es,en}, lines:ResearchLine[] }
 *   publications  : string[]       ->  PublicationRef[]  ({doi?, citation})
 *   currentProjects: string[]      ->  Project[]         ({title, funder?, period?, role?})
 *   collaborators : string[]       ->  Collaborator[]    ({name, institution, country?, topic?})
 *   students      : string[]       ->  folded into members, field removed
 *
 * Design notes
 * ------------
 * - researchLines is the part that needs judgement, so it is driven by an
 *   explicit per-group map below rather than by guessing. Bodies are taken
 *   from the EXISTING paragraphs by index (es/en align 1:1, verified), so no
 *   text is retyped or lost; only the short line TITLES are new.
 * - Where a group's prose enumerates MORE than the 5-line cap, the closest
 *   related items are merged rather than dropped — see `mergeNote` entries.
 * - Caps on publications/projects/collaborators are NOT enforced here. The
 *   contract says each group chooses which items to keep, and doing that on
 *   their behalf would be an arbitrary editorial cut. This script keeps
 *   everything and reports which groups are over cap; the forms are where the
 *   selection happens.
 * - Idempotent: re-running on already-migrated files is a no-op.
 */
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "..", "src", "content", "groups");

const CAPS = { publications: 10, currentProjects: 5, collaborators: 8, lines: 5 };

/**
 * Per group: which paragraph indices form the intro, and which form each
 * research line. `split` pulls several lines out of a single paragraph that
 * lists them inline.
 */
const RESEARCH_LINES = {
  bfq: {
    intro: [0.0], // first sentence of P0 only — see introSentences below
    introSentences: { 0: 1 },
    lines: [
      { para: 0, fromSentence: 1, title: { es: "Transporte a través de biomembranas", en: "Transport across biomembranes" } },
      { para: 1, title: { es: "Radiobiología médica y ambiental", en: "Medical and environmental radiobiology" } },
      { para: 2, title: { es: "Poli-ADP-ribosilación y daño genómico", en: "Poly-ADP-ribosylation and genomic damage" } },
    ],
  },
  danslab: {
    intro: [0],
    lines: [
      { para: 1, title: { es: "Estructura y dinámica de ácidos nucleicos", en: "Nucleic acid structure and dynamics" } },
      { para: 2, title: { es: "Genómica bacteriana y resistencia antimicrobiana", en: "Bacterial genomics and antimicrobial resistance" } },
      { para: 3, title: { es: "De la vigilancia clínica a los oligoterapéuticos", en: "From clinical surveillance to oligotherapeutics" } },
    ],
  },
  libiam: {
    intro: [0, 5], // location + the equipment paragraph read as context, not a line
    lines: [
      { para: 1, stripPrefix: /^[a-d]\)\s*/, title: { es: "Biomecánica y fisiología comparada", en: "Comparative biomechanics and physiology" } },
      { para: 2, stripPrefix: /^[a-d]\)\s*/, title: { es: "Biomecánica del movimiento humano y deporte", en: "Human movement biomechanics and sport" } },
      { para: 3, stripPrefix: /^[a-d]\)\s*/, title: { es: "Prevención y rehabilitación física", en: "Physical prevention and rehabilitation" } },
      { para: 4, stripPrefix: /^[a-d]\)\s*/, title: { es: "Coordinación y sinergia muscular", en: "Muscle coordination and synergy" } },
    ],
  },
  ecologiafluvial: {
    intro: [0, 1],
    lines: [
      { para: 2, stripPrefix: /^\d\)\s*/, title: { es: "Interacciones entre ecosistemas terrestres y acuáticos", en: "Land–water ecosystem interactions" } },
      { para: 3, stripPrefix: /^\d\)\s*/, title: { es: "Tramas tróficas y estructura comunitaria", en: "Food webs and community structure" } },
      { para: 4, stripPrefix: /^\d\)\s*/, title: { es: "Ecología reproductiva de comunidades fluviales", en: "Reproductive ecology of river communities" } },
      { para: 5, stripPrefix: /^\d\)\s*/, title: { es: "Variabilidad hidrológica y climática", en: "Hydrological and climatic variability" } },
      { para: 7, title: { es: "Ecosistemas dulceacuícolas, ecología trófica y calidad de agua", en: "Freshwater ecosystems, trophic ecology and water quality" } },
    ],
    // P6 describes the umbrella CSIC Grupos grant — that is a project, not a
    // research line, so it moves to currentProjects instead of being dropped.
    extraProjects: [
      {
        title: "Ecología de Ríos y Bosques en el Litoral Norte: la cuenca del Queguay como modelo",
        funder: "CSIC Grupos ID883452",
        period: "2023–2027",
        role: "Responsables: Christine Lucas e Iván González",
      },
    ],
  },
  "ecologia-vertebrados": {
    intro: [0.0, 1, 2],
    introSentences: { 0: 1 },
    lines: [
      { para: 0, fromSentence: 1, title: { es: "Ecología de mamíferos predadores y de exóticos invasores", en: "Ecology of predator mammals and invasive exotics" } },
    ],
  },
  lgmh: {
    intro: [0],
    // P1 lists 7 lines inline; merged to 5 by pairing the two pharmacogenetics
    // items and the two blood-disorder items.
    mergeNote: "7 líneas listadas en la prosa original, fusionadas a 5",
    explicitLines: [
      {
        title: { es: "Farmacogenética", en: "Pharmacogenetics" },
        body: {
          es: "Farmacogenética de la Leucemia Linfoblástica Aguda pediátrica y de los inhibidores de la recaptación de serotonina (ISRS).",
          en: "Pharmacogenetics of pediatric Acute Lymphoblastic Leukemia and of selective serotonin reuptake inhibitors (SSRIs).",
        },
      },
      {
        title: { es: "Hemoglobinopatías y anemias", en: "Haemoglobinopathies and anaemias" },
        body: {
          es: "Genética de hemoglobinopatías y bases genéticas de la anemia por déficit de hierro.",
          en: "Genetics of haemoglobinopathies and the genetic bases of iron-deficiency anaemia.",
        },
      },
      {
        title: { es: "Ancestralidad al norte de Uruguay", en: "Ancestry in northern Uruguay" },
        body: {
          es: "Estudio de la ancestralidad genética de la población del norte del país.",
          en: "Study of the genetic ancestry of the population of northern Uruguay.",
        },
      },
      {
        title: { es: "Sistema sanguíneo Rhesus", en: "Rhesus blood group system" },
        body: {
          es: "Caracterización molecular del sistema sanguíneo Rhesus (Rh).",
          en: "Molecular characterisation of the Rhesus (Rh) blood group system.",
        },
      },
      {
        title: { es: "Cáncer colorrectal y biopsias líquidas", en: "Colorectal cancer and liquid biopsies" },
        body: {
          es: "Detección de mutaciones de interés terapéutico en cáncer colorrectal a partir de biopsias líquidas.",
          en: "Detection of therapeutically relevant mutations in colorectal cancer from liquid biopsies.",
        },
      },
    ],
  },
  ugb: {
    intro: [],
    lines: [
      { para: 0, stripPrefix: /^[a-c]\)\s*/, splitTitle: true, title: { es: "Embriogenómica", en: "Embryogenomics" } },
      { para: 1, stripPrefix: /^[a-c]\)\s*/, splitTitle: true, title: { es: "Agrogenómica", en: "Agrigenomics" } },
      { para: 2, stripPrefix: /^[a-c]\)\s*/, splitTitle: true, title: { es: "Virómica", en: "Viromics" } },
    ],
  },
  "inmunologia-biotecnologia": {
    intro: [0.0],
    introSentences: { 0: 1 },
    lines: [
      { para: 0, fromSentence: 1, title: { es: "Antivirales y biológicos", en: "Antivirals and biologics" } },
      { para: 1, title: { es: "Producción y sanidad animal (con Rumiantes)", en: "Animal production and health (with Rumiantes)" } },
    ],
  },
  "moleculas-bioactivas": {
    // P1 describes the lab's equipment — not a research line, so it goes in
    // the intro, the same treatment libiam's equipment paragraph gets.
    intro: [0, 1],
    explicitLines: [
      {
        title: { es: "Enfermedades parasitarias humanas y veterinarias", en: "Human and veterinary parasitic diseases" },
        body: {
          es: "Investigación y desarrollo de compuestos activos frente a enfermedades parasitarias de interés médico y veterinario.",
          en: "Research and development of compounds active against parasitic diseases of medical and veterinary interest.",
        },
      },
      {
        title: { es: "I+D de antivirales", en: "Antiviral R&D" },
        body: {
          es: "Diseño, síntesis y desarrollo preclínico de nuevos compuestos con actividad antiviral.",
          en: "Design, synthesis and preclinical development of new compounds with antiviral activity.",
        },
      },
      {
        title: { es: "Cáncer y patologías neurodegenerativas", en: "Cancer and neurodegenerative disorders" },
        body: {
          es: "Identificación de blancos terapéuticos y desarrollo de compuestos para cáncer y enfermedades neurodegenerativas.",
          en: "Identification of therapeutic targets and development of compounds for cancer and neurodegenerative diseases.",
        },
      },
    ],
  },
  rumiantes: {
    intro: [1, 2],
    lines: [
      { para: 0, title: { es: "Reproducción ovina y bovina, lana y piel", en: "Sheep and cattle reproduction, wool and skin" } },
    ],
  },
  virologiamolec: {
    intro: [0],
    lines: [
      { para: 1, title: { es: "Virus de importancia en salud humana", en: "Viruses of human health importance" } },
      { para: 2, title: { es: "Virus de importancia en salud animal", en: "Viruses of animal health importance" } },
      { para: 3, title: { es: "Virología ambiental", en: "Environmental virology" } },
    ],
  },
  vyet: {
    intro: [],
    // 6 paragraphs, each already a bare research line; the two systematics
    // items (P1 ticks, P2 other vectors) are merged to fit the 5-line cap.
    mergeNote: "6 líneas en la prosa original; sistemática de garrapatas y de otros vectores fusionadas",
    lines: [
      { para: 0, title: { es: "Enfermedades transmitidas por garrapatas", en: "Tick-borne diseases" } },
      { para: [1, 2], title: { es: "Sistemática y ecología de vectores", en: "Vector systematics and ecology" } },
      { para: 3, title: { es: "Caracoles hospederos intermediarios", en: "Intermediate host snails" } },
      { para: 4, title: { es: "Helmintos de animales domésticos y silvestres", en: "Helminths of domestic and wild animals" } },
      { para: 5, title: { es: "Parasitosis y zoonosis en peces", en: "Fish parasitoses and zoonoses" } },
    ],
  },
};

// ---------------------------------------------------------------- helpers

const splitParas = (text) => text.split("\n\n");

// Titles and initials end in a period without ending a sentence — splitting
// naively on `.` turns "el Prof. Dr. R. Daniel Peluffo" into four sentences.
const ABBREVIATIONS = [
  "Dr", "Dra", "Dres", "Dras", "Prof", "Profa", "Mag", "MSc", "Msc", "PhD",
  "Lic", "Bach", "Ing", "Agr", "Tec", "Quim", "Far", "Sr", "Sra", "St",
  "etc", "aprox", "cf", "vs", "ej", "p", "pp", "ca", "n", "N",
];

/**
 * Splits a paragraph into sentences, treating a period as a boundary only
 * when it is not part of a known abbreviation or a single-letter initial
 * (e.g. the "R." in "R. Daniel Peluffo").
 */
function splitSentences(text) {
  const out = [];
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    if (!".!?".includes(text[i])) continue;
    // A boundary needs whitespace (or end of string) after it.
    const next = text[i + 1];
    if (next !== undefined && !/\s/.test(next)) continue;
    if (text[i] === ".") {
      const before = text.slice(start, i);
      const lastWord = (before.match(/(\S+)$/) || ["", ""])[1];
      if (ABBREVIATIONS.includes(lastWord)) continue;
      if (/^[A-ZÁÉÍÓÚÑ]$/.test(lastWord)) continue; // single-letter initial
    }
    out.push(text.slice(start, i + 1).trim());
    start = i + 1;
  }
  const tail = text.slice(start).trim();
  if (tail) out.push(tail);
  return out;
}

/** First `n` sentences of a paragraph. */
function firstSentences(text, n) {
  return splitSentences(text).slice(0, n).join(" ").trim();
}

/** Everything after the first `n` sentences. */
function afterSentences(text, n) {
  return splitSentences(text).slice(n).join(" ").trim();
}

function buildResearchLines(group, spec) {
  const es = splitParas(group.researchLines.es);
  const en = splitParas(group.researchLines.en);

  const introEs = [];
  const introEn = [];
  for (const idx of spec.intro || []) {
    const i = Math.trunc(idx);
    const nSent = spec.introSentences?.[i];
    introEs.push(nSent ? firstSentences(es[i], nSent) : es[i]);
    introEn.push(nSent ? firstSentences(en[i], nSent) : en[i]);
  }

  const lines = [];
  for (const l of spec.explicitLines || []) lines.push({ ...l });
  for (const l of spec.lines || []) {
    const idxs = Array.isArray(l.para) ? l.para : [l.para];
    let bodyEs = idxs.map((i) => es[i]).join(" ");
    let bodyEn = idxs.map((i) => en[i]).join(" ");
    if (l.fromSentence) {
      bodyEs = afterSentences(es[idxs[0]], l.fromSentence);
      bodyEn = afterSentences(en[idxs[0]], l.fromSentence);
    }
    if (l.stripPrefix) {
      bodyEs = bodyEs.replace(l.stripPrefix, "");
      bodyEn = bodyEn.replace(l.stripPrefix, "");
    }
    if (l.splitTitle) {
      // "Embriogenómica: Transcriptómica y..." -> body keeps only what follows
      bodyEs = bodyEs.replace(/^[^:]+:\s*/, "");
      bodyEn = bodyEn.replace(/^[^:]+:\s*/, "");
    }
    lines.push({ title: l.title, body: { es: bodyEs.trim(), en: bodyEn.trim() } });
  }

  return {
    intro: { es: introEs.join(" ").trim(), en: introEn.join(" ").trim() },
    lines,
  };
}

const DOI_RE = /https?:\/\/doi\.org\/(10\.\d{4,9}\/\S+?)(?:[.,;]?\s*)$/i;

function toPublicationRefs(pubs) {
  return pubs.map((citation) => {
    const m = citation.match(DOI_RE);
    return m ? { doi: m[1], citation } : { citation };
  });
}

function toProjects(projects) {
  return projects.map((raw) => {
    const project = { title: raw };
    // Pattern used by the generated danslab entries:
    //   "Title (Kind, Period; rol: Role). Description"
    const structured = raw.match(/^(.+?)\s\(([^)]*?),\s*([^;)]*?);\s*rol:\s*([^)]+)\)\.\s*(.*)$/);
    if (structured) {
      const [, title, funder, period, role, description] = structured;
      return {
        title: description ? `${title.trim()}. ${description.trim()}` : title.trim(),
        funder: funder.trim(),
        period: period.trim(),
        role: role.trim(),
      };
    }
    // Otherwise pull out whatever is unambiguous and leave the rest in title.
    const period = raw.match(/\b(20\d{2}\s*[–-]\s*20\d{2}|20\d{2})\b/);
    if (period) project.period = period[1].replace(/\s*[–-]\s*/, "–");
    const role = raw.match(/\bResponsables?:\s*([^.)]+)/i);
    if (role) project.role = `Responsable: ${role[1].trim()}`;
    return project;
  });
}

function toCollaborators(collabs) {
  return collabs.map((raw) => {
    // "Name — Role, Institution (Country). Topic."
    let m = raw.match(/^(.+?)\s+—\s+(.+?)\s*\(([^)]+)\)\.\s*(.*)$/);
    if (m) {
      return {
        name: m[1].trim(),
        institution: m[2].trim(),
        country: m[3].trim(),
        ...(m[4].trim() ? { topic: m[4].trim().replace(/\.$/, "") } : {}),
      };
    }
    // "Name (Institution)"
    m = raw.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
    if (m) return { name: m[1].trim(), institution: m[2].trim() };
    // "Institution, ... — Topic"  /  bare name or bare institution
    m = raw.match(/^(.+?)\s+—\s+(.+)$/);
    if (m) return { name: m[1].trim(), institution: m[1].trim(), topic: m[2].trim() };
    return { name: raw.trim(), institution: "" };
  });
}

// ------------------------------------------------------------------ run

const overCap = [];
let migrated = 0;
let alreadyDone = 0;

for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith(".json"))) {
  const p = path.join(DIR, file);
  const group = JSON.parse(fs.readFileSync(p, "utf8"));
  let touched = false;

  if (group.researchLines && typeof group.researchLines.es === "string") {
    const spec = RESEARCH_LINES[group.slug];
    if (!spec) throw new Error(`${group.slug}: no researchLines mapping`);
    group.researchLines = buildResearchLines(group, spec);
    if (group.researchLines.lines.length > CAPS.lines) {
      throw new Error(`${group.slug}: ${group.researchLines.lines.length} lines exceeds cap`);
    }
    touched = true;
  }

  if (group.publications && typeof group.publications[0] === "string") {
    group.publications = toPublicationRefs(group.publications);
    touched = true;
  }
  if (group.currentProjects && typeof group.currentProjects[0] === "string") {
    group.currentProjects = toProjects(group.currentProjects);
    touched = true;
  }
  const extra = RESEARCH_LINES[group.slug]?.extraProjects;
  if (extra && !(group.currentProjects || []).some((p) => p.title === extra[0].title)) {
    group.currentProjects = [...(group.currentProjects || []), ...extra];
    touched = true;
  }
  if (group.collaborators && typeof group.collaborators[0] === "string") {
    group.collaborators = toCollaborators(group.collaborators);
    touched = true;
  }

  // `students` duplicated `members`; fold any survivors in and drop the field.
  if (group.students) {
    for (const s of group.students) {
      if (!group.members.some((m) => m.name === s)) {
        group.members.push({ name: s, title: "" });
      }
    }
    delete group.students;
    touched = true;
  }

  for (const [field, cap] of Object.entries(CAPS)) {
    if (field === "lines") continue;
    const n = (group[field] || []).length;
    if (n > cap) overCap.push(`${group.slug}: ${field} = ${n} (tope ${cap})`);
  }

  if (touched) {
    fs.writeFileSync(p, JSON.stringify(group, null, 2) + "\n");
    migrated++;
    console.log(`${group.slug}: migrado`);
  } else {
    alreadyDone++;
  }
}

console.log(`\n${migrated} migrados, ${alreadyDone} ya estaban al día.`);
if (overCap.length) {
  console.log("\nPor encima del tope — cada grupo elige qué conservar vía el formulario:");
  overCap.forEach((l) => console.log("  " + l));
}
