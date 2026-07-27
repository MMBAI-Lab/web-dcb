// Reports which bilingual content in src/content/groups/*.json still needs an
// English translation, so the DCB has a concrete work list.
//
// Group content is collected in Spanish and the English pass is done later by
// the department, so `en` is routinely empty for a while (see the `pick()`
// fallback in src/lib/i18n-content.ts). This script finds every Bilingual
// field and flags the ones that are missing, empty or byte-identical to `es`.
//
// The traversal is deliberately shape-agnostic: it walks the whole object tree
// looking for `{es, en}` nodes instead of hardcoding field paths. That way it
// keeps working across the in-flight migrations (`researchLines` going from
// `{es,en}` to `{intro,lines[]}`, `publications` from `string[]` to objects)
// without needing any edit here.
//
// Usage:
//   node scripts/report-missing-translations.js           human report (Spanish)
//   node scripts/report-missing-translations.js --json    machine-readable JSON
//
// Finding reasons (stable codes, used in the JSON output):
//   missing    the node has no `en` key at all (or it is null)
//   empty      `en` exists but is empty or only whitespace
//   identical  `en` is byte-identical to `es`
//   noSource   both `es` and `en` are empty — nothing to translate yet, the
//              group still owes the Spanish text
//
// An `identical` finding on a very short, proper-noun-only string (an acronym,
// a place name) is usually legitimate, so those are reported apart from the
// real work list instead of padding it.

const fs = require("fs");
const path = require("path");

const GROUPS_DIR = path.join(__dirname, "..", "src", "content", "groups");

/** Max characters of Spanish text shown per finding in the human report. */
const EXCERPT_LEN = 60;

/** Upper bounds for treating an identical string as a plausible proper noun. */
const PROPER_NOUN_MAX_CHARS = 40;
const PROPER_NOUN_MAX_WORDS = 5;

/**
 * Lowercase words allowed inside an otherwise proper-noun-only string.
 * Spanish connectors, plus the English ones that show up in institution names.
 */
const CONNECTORS = new Set([
  "de", "del", "la", "las", "el", "los", "y", "e", "en", "al", "a",
  "of", "the", "and", "for", "in",
]);

const REASON_LABELS = {
  missing: 'falta la clave "en"',
  empty: 'la clave "en" está vacía',
  identical: "el inglés es idéntico al español",
  noSource: "el campo está vacío en español y en inglés",
};

// ---------------------------------------------------------------------------
// Traversal
// ---------------------------------------------------------------------------

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * A Bilingual node is an object whose `es` is a string. `en` may be absent,
 * null or a string — anything else (an array, an object) means this is not a
 * Bilingual field but some other structure that happens to use those keys,
 * e.g. the legacy `{es: string[], en: string[]}` parallel-array pairs.
 */
function isBilingual(node) {
  if (!isPlainObject(node)) return false;
  if (typeof node.es !== "string") return false;
  if (!("en" in node)) return true;
  return node.en === null || typeof node.en === "string";
}

/** The legacy `{es: [...], en: [...]}` shape, reported as a warning. */
function isLegacyPair(node) {
  return isPlainObject(node) && Array.isArray(node.es) && Array.isArray(node.en);
}

function joinPath(parent, key) {
  return parent ? `${parent}.${key}` : String(key);
}

/**
 * Walks an arbitrary JSON tree and calls `onBilingual` / `onLegacyPair` for
 * every match, passing a dotted path (`researchLines.lines[2].title`) and the
 * same path split into segments, which is what a later fill-in script needs to
 * write the translation back without parsing the string.
 */
function walk(node, dottedPath, segments, handlers) {
  if (Array.isArray(node)) {
    node.forEach((item, i) => {
      walk(item, `${dottedPath}[${i}]`, segments.concat(i), handlers);
    });
    return;
  }

  if (!isPlainObject(node)) return;

  if (isBilingual(node)) {
    handlers.onBilingual(node, dottedPath, segments);
    return; // `es`/`en` are strings; nothing deeper to visit.
  }

  if (isLegacyPair(node)) {
    handlers.onLegacyPair(node, dottedPath);
    return;
  }

  for (const key of Object.keys(node)) {
    walk(node[key], joinPath(dottedPath, key), segments.concat(key), handlers);
  }
}

// ---------------------------------------------------------------------------
// Classification
// ---------------------------------------------------------------------------

/**
 * True for short strings made only of proper nouns, acronyms and numbers —
 * "MMBAI", "Salto", "PEDECIBA Biología". For those, an English version equal
 * to the Spanish one is plausibly correct rather than a pending translation.
 * It is a heuristic, hence the "probablemente" in the report heading.
 */
function looksLikeProperNoun(text) {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length > PROPER_NOUN_MAX_CHARS) return false;

  // Sentence punctuation means prose or a course title ("Biofísica. Ciclo
  // Biología-Bioquímica"), not a bare name — those do need translating even
  // though every word happens to be capitalised. Commas are allowed: they show
  // up in legitimate names such as "PEDECIBA Biología, Facultad de Ciencias".
  if (/[.:;!?]/.test(trimmed)) return false;

  const words = trimmed.split(/\s+/);
  if (words.length > PROPER_NOUN_MAX_WORDS) return false;

  return words.every((word) => {
    // Drop punctuation and brackets so "(MMBAI)," is judged as "MMBAI".
    const clean = word.replace(/[^\p{L}\p{N}]/gu, "");
    if (!clean) return true; // pure punctuation
    if (/^\p{N}+$/u.test(clean)) return true; // a year, a number
    if (CONNECTORS.has(clean.toLowerCase())) return true;
    const first = clean[0];
    return first !== first.toLowerCase(); // starts with an uppercase letter
  });
}

/** Returns a reason code, or null when the field is properly translated. */
function classify(node) {
  const es = typeof node.es === "string" ? node.es : "";
  const hasEn = "en" in node && node.en !== null;
  const en = hasEn ? String(node.en) : "";

  // Empty on both sides: the Spanish original is what is missing, so this is
  // not translation work at all. Reported apart so nobody is asked to
  // translate an empty string.
  if (!es.trim() && !en.trim()) return "noSource";

  if (!hasEn) return "missing";
  if (!en.trim()) return "empty";
  if (en === es) return "identical";
  return null;
}

// ---------------------------------------------------------------------------
// Collection
// ---------------------------------------------------------------------------

function collect() {
  if (!fs.existsSync(GROUPS_DIR)) {
    throw new Error(`No existe el directorio de grupos: ${GROUPS_DIR}`);
  }

  const files = fs
    .readdirSync(GROUPS_DIR)
    .filter((name) => name.endsWith(".json"))
    .sort();

  const groups = [];
  const warnings = [];
  let totalFields = 0;

  for (const file of files) {
    const fullPath = path.join(GROUPS_DIR, file);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(fullPath, "utf8"));
    } catch (err) {
      throw new Error(`No se pudo leer ${file}: ${err.message}`);
    }

    const group = {
      file,
      slug: typeof data.slug === "string" ? data.slug : file.replace(/\.json$/, ""),
      groupName: data.name && typeof data.name.es === "string" ? data.name.es : "(sin nombre)",
      fields: 0,
      pending: [],
      likelyFine: [],
      noSource: [],
    };

    walk(data, "", [], {
      onBilingual(node, dottedPath, segments) {
        group.fields += 1;
        totalFields += 1;

        const reason = classify(node);
        if (!reason) return;

        const finding = {
          file,
          slug: group.slug,
          path: dottedPath,
          pathSegments: segments,
          reason,
          es: typeof node.es === "string" ? node.es : "",
          en: "en" in node && node.en !== null ? String(node.en) : "",
        };

        // An identical short proper noun is probably fine as-is; anything else
        // identical is almost certainly an untranslated copy-paste.
        if (reason === "noSource") {
          group.noSource.push(finding);
        } else if (reason === "identical" && looksLikeProperNoun(finding.es)) {
          group.likelyFine.push(finding);
        } else {
          group.pending.push(finding);
        }
      },
      onLegacyPair(_node, dottedPath) {
        warnings.push(
          `${file}: "${dottedPath}" todavía usa la forma antigua {es:[...], en:[...]}; ` +
            "sus textos no se revisan hasta que se migre a objetos {es, en}."
        );
      },
    });

    groups.push(group);
  }

  const pending = groups.reduce((n, g) => n + g.pending.length, 0);
  const likelyFine = groups.reduce((n, g) => n + g.likelyFine.length, 0);
  const noSource = groups.reduce((n, g) => n + g.noSource.length, 0);
  const byReason = { missing: 0, empty: 0, identical: 0, noSource: 0 };
  for (const group of groups) {
    for (const finding of [...group.pending, ...group.likelyFine, ...group.noSource]) {
      byReason[finding.reason] += 1;
    }
  }

  return {
    directory: GROUPS_DIR,
    files: files.length,
    totalFields,
    pending,
    likelyFine,
    noSource,
    byReason,
    groups,
    warnings,
  };
}

// ---------------------------------------------------------------------------
// Human report (Spanish — the audience is the DCB)
// ---------------------------------------------------------------------------

function excerpt(text) {
  const flat = String(text).replace(/\s+/g, " ").trim();
  if (flat.length <= EXCERPT_LEN) return flat;
  return flat.slice(0, EXCERPT_LEN - 3).trimEnd() + "...";
}

const RULE = "=".repeat(72);
const THIN = "-".repeat(72);

function printHumanReport(result) {
  const out = [];

  out.push(RULE);
  out.push(" Traducciones al inglés pendientes — contenido de los grupos del DCB");
  out.push(RULE);
  out.push(`Directorio            : ${result.directory}`);
  out.push(`Archivos analizados   : ${result.files}`);
  out.push(`Campos bilingües      : ${result.totalFields}`);
  out.push(`Pendientes de traducir: ${result.pending}`);
  out.push(`Idénticos pero probablemente correctos: ${result.likelyFine}`);
  out.push(`Vacíos en español (falta el original): ${result.noSource}`);
  out.push("");

  if (result.warnings.length) {
    out.push(THIN);
    out.push(" AVISOS");
    out.push(THIN);
    for (const warning of result.warnings) out.push(`  - ${warning}`);
    out.push("");
  }

  out.push(THIN);
  out.push(" PENDIENTES DE TRADUCCIÓN");
  out.push(THIN);
  out.push("");

  if (result.pending === 0) {
    out.push("  No hay traducciones pendientes: todos los campos bilingües");
    out.push("  tienen una versión en inglés distinta del español.");
    out.push("");
  } else {
    for (const group of result.groups) {
      if (!group.pending.length) continue;
      out.push(`### ${group.file} — ${group.groupName}  (${group.pending.length} pendiente(s))`);
      out.push("");
      group.pending.forEach((finding, i) => {
        out.push(`  ${String(i + 1).padStart(2, " ")}. ${finding.path}`);
        out.push(`      motivo: ${REASON_LABELS[finding.reason]}`);
        out.push(`      es: «${excerpt(finding.es)}»`);
      });
      out.push("");
    }
  }

  if (result.noSource > 0) {
    out.push(THIN);
    out.push(" SIN TEXTO EN ESPAÑOL (no hay nada que traducir)");
    out.push(THIN);
    out.push("  El campo está vacío en los dos idiomas. No es trabajo de");
    out.push("  traducción: hay que pedirle el texto en español al grupo.");
    out.push("");
    for (const group of result.groups) {
      if (!group.noSource.length) continue;
      out.push(`  ${group.file} — ${group.groupName}`);
      for (const finding of group.noSource) {
        out.push(`    - ${finding.path}`);
      }
      out.push("");
    }
  }

  if (result.likelyFine > 0) {
    out.push(THIN);
    out.push(" PROBABLEMENTE CORRECTO (inglés idéntico al español)");
    out.push(THIN);
    out.push("  Textos cortos formados solo por nombres propios, siglas o");
    out.push("  números: que no cambien entre idiomas suele ser correcto.");
    out.push("  Quedan fuera de la lista de trabajo, pero conviene REVISARLOS:");
    out.push("  la detección es heurística y puede colar algún texto que sí");
    out.push("  haya que traducir.");
    out.push("");
    for (const group of result.groups) {
      if (!group.likelyFine.length) continue;
      out.push(`  ${group.file} — ${group.groupName}`);
      for (const finding of group.likelyFine) {
        out.push(`    - ${finding.path}  ->  «${excerpt(finding.es)}»`);
      }
      out.push("");
    }
  }

  out.push(THIN);
  out.push(" RESUMEN POR GRUPO");
  out.push(THIN);

  const nameWidth = Math.max(...result.groups.map((g) => g.file.length), 12);
  const tallyLine = (label, pending, fields, notes) =>
    `  ${label.padEnd(nameWidth)}  ${`${pending} pendiente(s)`.padStart(15)}  ` +
    `de ${String(fields).padStart(3)} campos${notes}`;

  for (const group of result.groups) {
    const notes = [];
    if (group.likelyFine.length) notes.push(`${group.likelyFine.length} probablemente correcto(s)`);
    if (group.noSource.length) notes.push(`${group.noSource.length} sin original`);
    out.push(
      tallyLine(
        group.file,
        group.pending.length,
        group.fields,
        notes.length ? `  [${notes.join("; ")}]` : ""
      )
    );
  }
  out.push(tallyLine("TOTAL", result.pending, result.totalFields, ""));
  out.push("");
  out.push(
    `  Desglose: ${result.byReason.missing} sin clave "en", ` +
      `${result.byReason.empty} vacío(s) en inglés, ` +
      `${result.byReason.identical} idéntico(s) al español, ` +
      `${result.byReason.noSource} sin texto en español.`
  );
  out.push("");

  process.stdout.write(out.join("\n") + "\n");
}

// ---------------------------------------------------------------------------
// JSON report (same findings, for a later fill-in script)
// ---------------------------------------------------------------------------

function printJsonReport(result) {
  const payload = {
    generatedAt: new Date().toISOString(),
    directory: result.directory,
    totals: {
      files: result.files,
      bilingualFields: result.totalFields,
      pending: result.pending,
      likelyFine: result.likelyFine,
      noSource: result.noSource,
      byReason: result.byReason,
    },
    byGroup: result.groups.map((group) => ({
      file: group.file,
      slug: group.slug,
      groupName: group.groupName,
      bilingualFields: group.fields,
      pending: group.pending.length,
      likelyFine: group.likelyFine.length,
      noSource: group.noSource.length,
    })),
    // The real work list.
    pending: result.groups.flatMap((group) => group.pending),
    // Identical strings that are probably legitimate, kept apart so a fill-in
    // script does not "translate" acronyms by mistake.
    likelyFine: result.groups.flatMap((group) => group.likelyFine),
    // Empty on both sides: the Spanish original is missing, not the English.
    noSource: result.groups.flatMap((group) => group.noSource),
    warnings: result.warnings,
  };

  process.stdout.write(JSON.stringify(payload, null, 2) + "\n");
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function main(argv) {
  const args = argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    process.stdout.write(
      [
        "Uso: node scripts/report-missing-translations.js [--json]",
        "",
        "  (sin opciones)  Informe legible, en español, de los campos bilingües",
        "                  de src/content/groups/*.json que faltan traducir.",
        "  --json          Los mismos datos como JSON en la salida estándar,",
        "                  para alimentar un script de completado posterior.",
        "",
      ].join("\n")
    );
    return 0;
  }

  const asJson = args.includes("--json");
  const unknown = args.filter((arg) => arg !== "--json");
  if (unknown.length) {
    process.stderr.write(
      `Opción desconocida: ${unknown.join(", ")}\n` +
        "Uso: node scripts/report-missing-translations.js [--json]\n"
    );
    return 1;
  }

  const result = collect();
  if (asJson) printJsonReport(result);
  else printHumanReport(result);

  // Always exit 0: this is a report, not a gate. Only a read/parse failure of
  // the group JSONs is an error, and that throws below.
  return 0;
}

try {
  process.exitCode = main(process.argv);
} catch (err) {
  process.stderr.write(`Error: ${err.message}\n`);
  process.exitCode = 1;
}
