// Regenerate the `citation` of every DOI-bearing publication in
// src/content/groups/*.json from Crossref metadata, in the same Vancouver
// style the hand-written citations already use.
//
//   node scripts/resolve-dois.js --dry-run   # print OLD/NEW, write nothing
//   node scripts/resolve-dois.js             # rewrite the group JSONs
//
// Entries with no `doi` are hand-written (books, in press) and are never
// touched. Groups whose `publications` are still plain strings (i.e. not yet
// migrated to PublicationRef[]) are skipped whole. One bad DOI never aborts
// the run: the entry keeps its existing citation and a warning is printed.
// Rerunning produces byte-identical files.
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "..", "src", "content", "groups");
const USER_AGENT = "web-dcb/1.0 (mailto:pdans@pasteur.edu.uy)";
const DELAY_MS = 1000; // Crossref politeness: ~1 request per second.
const TIMEOUT_MS = 20000;
const MAX_ATTEMPTS = 3; // only for 429/5xx/network; 404 & friends fail fast.

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const unknownArgs = args.filter((a) => a !== "--dry-run");
if (unknownArgs.length > 0) {
  console.error(`Unknown argument(s): ${unknownArgs.join(", ")}`);
  console.error("Usage: node scripts/resolve-dois.js [--dry-run]");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Crossref types. Anything not listed is treated as a chapter when it carries
// no journal-style volume/issue (see isChapterLike).
// ---------------------------------------------------------------------------
const JOURNAL_TYPES = new Set([
  "journal-article",
  "journal-issue",
  "journal-volume",
  "posted-content",
  "preprint",
  "report",
  "report-component",
  "dissertation",
  "dataset",
  "peer-review",
]);
const CHAPTER_TYPES = new Set([
  "book-chapter",
  "book-part",
  "book-section",
  "book-track",
  "reference-entry",
  "proceedings-article",
  "standard",
]);

// ---------------------------------------------------------------------------
// Sentence case. Crossref usually hands back Title Case, so the default is to
// lowercase; a word survives untouched when it is an acronym (all caps or
// internal caps), carries digits, was italicised in the source markup, or is
// on this list. The list only needs to cover words this corpus actually uses:
// proper nouns that are indistinguishable from ordinary Title Case otherwise.
// Keys are lowercase, values are the form to emit.
// ---------------------------------------------------------------------------
const PROPER_NOUNS = new Map(
  [
    // Places, demonyms, languages
    "Uruguay", "Uruguayan", "Argentina", "Argentine", "Argentinian", "Brazil",
    "Brazilian", "Chile", "Chilean", "Paraguay", "Paraguayan", "Bolivia",
    "Bolivian", "Peru", "Peruvian", "Colombia", "Colombian", "Venezuela",
    "Ecuador", "Panama", "Panamanian", "Mexico", "Mexican", "Cuba", "Spain",
    "Spanish", "Portugal", "Portuguese", "France", "French", "Germany",
    "German", "Italy", "Italian", "Europe", "European", "Africa", "African",
    "Asia", "Asian", "America", "American", "Americas", "Latin", "Iberoamerican",
    "Caribbean", "Antarctica", "Antarctic", "Patagonia", "Patagonian", "Amazon",
    "Amazonian", "Andes", "Andean", "Neotropical", "Neotropics", "Pampean",
    "Pampas", "Caatinga", "Cerrado", "Montevideo", "Buenos", "Aires", "English",
    // Genera, families and other taxa
    "Acinetobacter", "Aeromonas", "Amblyomma", "Anaplasma", "Arabidopsis",
    "Aspergillus", "Asteraceae", "Babesia", "Bacillus", "Borrelia", "Brucella",
    "Caenorhabditis", "Campylobacter", "Candida", "Cerdocyon", "Characiformes",
    "Cryptosporidium", "Danio", "Dermacentor", "Diphyllobothriidae",
    "Drosophila", "Echinococcus", "Ehrlichia", "Enterococcus", "Escherichia",
    "Eucestoda", "Eugenia", "Fasciola", "Giardia", "Haemaphysalis",
    "Hepatozoon", "Ixodes", "Ixodida", "Ixodidae", "Klebsiella", "Kosakonia",
    "Lactobacillus", "Leishmania", "Leptospira", "Listeria", "Lycalopex",
    "Mazama", "Megaleporinus", "Mycobacterium", "Neospora", "Ornithodoros",
    "Plasmodium", "Pseudomonas", "Rangelia", "Rhipicephalus", "Rickettsia",
    "Salmonella", "Spirometra", "Staphylococcus", "Taenia", "Teleostei",
    "Toxoplasma", "Trichinella", "Trichoderma", "Trypanosoma", "Urolepis",
    "Wolbachia", "Xenopus",
    // Eponyms and other names that Title Case hides
    "Frankenstein", "Gram", "Ramachandran",
  ].map((w) => [w.toLowerCase(), w]),
);

const WORD_RE = /[\p{L}\p{N}][\p{L}\p{N}'’]*/gu;

const NAMED_ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–",
  mdash: "—", lsquo: "‘", rsquo: "’", ldquo: "“",
  rdquo: "”", hellip: "…", deg: "°", times: "×",
  alpha: "α", beta: "β", gamma: "γ", delta: "δ",
  mu: "μ", micro: "µ",
};

function decodeEntities(text) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => safeCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => safeCodePoint(parseInt(dec, 10)))
    .replace(/&([a-z]+);/gi, (whole, name) => {
      const hit = NAMED_ENTITIES[name.toLowerCase()];
      return hit === undefined ? whole : hit;
    });
}

function safeCodePoint(code) {
  try {
    return String.fromCodePoint(code);
  } catch {
    return "";
  }
}

/** Crossref embeds JATS markup (<jats:italic>, <jats:sub>, ...) in strings. */
function stripTags(text) {
  return text.replace(/<[^>]*>/g, "");
}

/** Tidy any Crossref string: drop markup, decode entities, collapse spaces. */
function clean(value) {
  if (typeof value !== "string") return "";
  return decodeEntities(stripTags(value)).replace(/\s+/g, " ").trim();
}

/** Crossref returns most of these as arrays; take the first usable value. */
function firstString(value) {
  if (Array.isArray(value)) {
    for (const item of value) {
      const text = clean(item);
      if (text) return text;
    }
    return "";
  }
  return clean(value);
}

function withPeriod(text) {
  return /[.?!]$/.test(text) ? text : `${text}.`;
}

/**
 * Words the source italicised — Crossref marks genus/species names this way,
 * which is the one reliable signal that a capital is not just Title Case.
 */
function italicisedWords(raw) {
  const found = new Set();
  const re = /<(jats:italic|i|em|italic)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;
  while ((match = re.exec(raw)) !== null) {
    const inner = clean(match[2]);
    for (const word of inner.match(WORD_RE) || []) found.add(word.toLowerCase());
  }
  return found;
}

/** Records typed IN ALL CAPS: every long word shouting means none is an acronym. */
function looksShouted(text) {
  const words = text.match(WORD_RE) || [];
  const long = words.filter((w) => /\p{L}{3,}/u.test(w));
  if (long.length < 5) return false;
  const upper = long.filter((w) => w === w.toLocaleUpperCase());
  return upper.length / long.length > 0.7;
}

/**
 * Decide one hyphen-free chunk. Returns `preserved: true` when the source
 * casing was kept, so the caller knows not to re-capitalise it.
 */
function fixWord(word, italic, shouted) {
  if (!/\p{L}/u.test(word)) return { text: word, preserved: true };
  const key = word.toLowerCase();
  const proper = PROPER_NOUNS.get(key);
  if (proper) return { text: proper, preserved: true };
  if (italic.has(key)) return { text: word, preserved: true };
  // Mixed letters and digits: B12, CAT-2A, 3DAHM, delta13C.
  if (/\p{N}/u.test(word)) return { text: word, preserved: true };
  // A lone capital is usually a designation (vitamin A, T cell, type I).
  // "A" itself is far more often the article, so it goes to lowercase.
  if (word.length === 1 && word === word.toLocaleUpperCase()) {
    if (word !== "A") return { text: word, preserved: true };
    return { text: "a", preserved: false };
  }
  const allCaps = word === word.toLocaleUpperCase();
  if (/\p{Lu}/u.test(word.slice(1)) && !(shouted && allCaps)) {
    return { text: word, preserved: true }; // DNA, PeerJ, hexABC, SARS/CoV
  }
  return { text: word.toLocaleLowerCase(), preserved: false };
}

/**
 * Title Case (or ALL CAPS) -> sentence case: first word capitalised, the rest
 * lowercased unless they are clearly proper nouns or acronyms. Hyphenated
 * compounds are judged part by part, so `Ramachandran-Like` -> `Ramachandran-like`
 * and `SARS-CoV-2` survives intact.
 */
function sentenceCase(raw) {
  const italic = italicisedWords(raw);
  const text = clean(raw);
  const shouted = looksShouted(text);
  let seenFirst = false;
  const cased = text.replace(WORD_RE, (word, offset) => {
    const startsSentence = !seenFirst || /[?!]["')\]]?\s+$/.test(text.slice(0, offset));
    seenFirst = true;
    const { text: fixed, preserved } = fixWord(word, italic, shouted);
    if (startsSentence && !preserved && fixed) {
      return fixed[0].toLocaleUpperCase() + fixed.slice(1);
    }
    return fixed;
  });
  return { title: withPeriod(cased.replace(/[\s,;:]+$/, "")), shouted };
}

/**
 * Vancouver page ranges drop the repeated leading digits of the closing page:
 * 8339-8348 -> 8339-48. Anything the rule cannot shorten unambiguously
 * (e521-e533, 8-1200, 100028, comma-separated ranges) is passed through as-is.
 */
function formatPages(raw) {
  const page = clean(raw).replace(/[–—]/g, "-").replace(/\s*-\s*/g, "-");
  if (!page) return "";
  const match = /^(\d+)-(\d+)$/.exec(page);
  if (!match) return page;
  const [, start, end] = match;
  if (start === end) return start;
  if (start.length !== end.length) return page;
  let i = 0;
  while (i < end.length - 1 && start[i] === end[i]) i += 1;
  return `${start}-${end.slice(i)}`;
}

/** `Dans PD`, `da Rosa G`, `Cheatham TE 3rd`. Multi-word surnames kept verbatim. */
function formatAuthor(author) {
  if (!author || typeof author !== "object") return "";
  const family = clean(author.family);
  if (!family) return clean(author.name); // consortium / organisation author
  const given = clean(author.given);
  const initials = (given.match(/\p{L}+/gu) || [])
    .map((part) => part[0].toLocaleUpperCase())
    .join("");
  return [family, initials, clean(author.suffix)].filter(Boolean).join(" ");
}

function formatAuthors(list) {
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error("Crossref record has no author list");
  }
  const names = list.map(formatAuthor).filter(Boolean);
  if (names.length === 0) throw new Error("Crossref record has no usable author names");
  if (names.length > 6) return `${names.slice(0, 6).join(", ")}, et al`;
  return names.join(", ");
}

function pickYear(message) {
  for (const key of ["issued", "published", "published-print", "published-online", "created"]) {
    const parts = message[key] && message[key]["date-parts"];
    const year = Array.isArray(parts) && Array.isArray(parts[0]) ? parts[0][0] : null;
    if (Number.isInteger(year) && year > 1000) return year;
  }
  throw new Error("Crossref record has no publication year");
}

function isChapterLike(type, volume, issue) {
  if (CHAPTER_TYPES.has(type)) return true;
  if (JOURNAL_TYPES.has(type)) return false;
  return !volume && !issue;
}

/** Throws when the record is too thin to format without garbling the citation. */
function formatCitation(message, doi) {
  const { title, shouted } = sentenceCase(firstStringOrThrow(message.title, "title"));
  const authors = formatAuthors(message.author);
  const year = pickYear(message);
  const container = firstString(message["container-title"]);
  const publisher = clean(message.publisher);
  const volume = clean(message.volume);
  const issue = clean(message.issue);
  const pages = formatPages(message.page);
  const link = `https://doi.org/${doi}`;
  const type = clean(message.type);

  let citation;
  if (isChapterLike(type, volume, issue)) {
    const bits = [`${withPeriod(authors)}`, title];
    if (container) bits.push(`In: ${withPeriod(container)}`);
    bits.push(publisher ? `${publisher}; ${year}.` : `${year}.`);
    if (pages) bits.push(`p. ${pages}.`);
    bits.push(link);
    citation = bits.join(" ");
  } else {
    const bits = [`${withPeriod(authors)}`, title];
    if (container) bits.push(withPeriod(container));
    let numeric = String(year);
    if (volume) numeric += `;${volume}`;
    if (issue) numeric += `(${issue})`;
    if (pages) numeric += `:${pages}`;
    bits.push(`${numeric}.`);
    bits.push(link);
    citation = bits.join(" ");
  }
  return { citation, shouted };
}

function firstStringOrThrow(value, label) {
  const text = firstString(value);
  if (!text) throw new Error(`Crossref record has no ${label}`);
  return text;
}

// ---------------------------------------------------------------------------
// Crossref access
// ---------------------------------------------------------------------------
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let requestsMade = 0;

async function fetchWork(doi) {
  const url = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;
  if (requestsMade > 0) await sleep(DELAY_MS);
  requestsMade += 1;
  let lastError = "unknown error";
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    if (attempt > 1) await sleep(DELAY_MS * attempt);
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (res.ok) {
        const body = await res.json();
        if (!body || typeof body !== "object" || !body.message) {
          throw new Error("response carried no `message` object");
        }
        return { ok: true, message: body.message };
      }
      const status = `HTTP ${res.status} ${res.statusText || ""}`.trim();
      // 404/403/400 will not get better by asking again.
      if (res.status !== 429 && res.status < 500) return { ok: false, error: status };
      lastError = status;
    } catch (err) {
      lastError = err && err.message ? err.message : String(err);
    }
  }
  return { ok: false, error: `${lastError} (gave up after ${MAX_ATTEMPTS} attempts)` };
}

/** Accept a bare DOI, a doi: prefix or a doi.org URL; emit the bare DOI. */
function normaliseDoi(raw) {
  if (typeof raw !== "string") return "";
  return raw
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .replace(/^doi:\s*/i, "")
    .replace(/\/+$/, "")
    .trim();
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const files = fs
    .readdirSync(DIR)
    .filter((name) => name.endsWith(".json"))
    .sort();

  let regenerated = 0;
  let alreadyCurrent = 0;
  let noDoi = 0;
  let failed = 0;
  let groupsNotMigrated = 0;

  for (const file of files) {
    const slug = path.basename(file, ".json");
    const fullPath = path.join(DIR, file);

    let group;
    try {
      group = JSON.parse(fs.readFileSync(fullPath, "utf8"));
    } catch (err) {
      console.warn(`${slug}: cannot parse JSON (${err.message}), skipping`);
      continue;
    }

    const pubs = group.publications;
    if (!Array.isArray(pubs) || pubs.length === 0) {
      console.log(`${slug}: no publications, skipping`);
      continue;
    }
    const isRef = (p) => typeof p === "object" && p !== null && !Array.isArray(p);
    if (!pubs.every(isRef)) {
      console.log(`${slug}: publications not yet migrated to PublicationRef[], skipping`);
      groupsNotMigrated += 1;
      continue;
    }

    console.log(`${slug}: ${pubs.length} publication(s)`);
    const updates = []; // { index, doi, citation }

    for (let i = 0; i < pubs.length; i += 1) {
      const doi = normaliseDoi(pubs[i].doi);
      if (!doi) {
        noDoi += 1;
        continue;
      }
      const result = await fetchWork(doi);
      if (!result.ok) {
        console.warn(`  ! [${i}] ${doi}: ${result.error} — citation left unchanged`);
        failed += 1;
        continue;
      }
      let formatted;
      try {
        formatted = formatCitation(result.message, doi);
      } catch (err) {
        console.warn(`  ! [${i}] ${doi}: ${err.message} — citation left unchanged`);
        failed += 1;
        continue;
      }
      if (formatted.shouted) {
        console.warn(`  ? [${i}] ${doi}: Crossref title is ALL CAPS — check the casing below`);
      }
      // Editorial notes such as "[Corresponding author]" are not in Crossref
      // and would be silently dropped when the citation is rebuilt. Carry any
      // bracketed note over from the existing citation, ahead of the DOI link.
      const note = pubs[i].citation.match(/\s(\[[^\]]+\])(?=\s*(?:https?:\/\/\S+)?\s*$)/);
      if (note && !formatted.citation.includes(note[1])) {
        formatted.citation = formatted.citation.replace(
          /(\s*)(https?:\/\/doi\.org\/\S+)$/,
          ` ${note[1]}$1$2`
        );
      }
      if (formatted.citation === pubs[i].citation) {
        alreadyCurrent += 1;
        continue;
      }
      regenerated += 1;
      console.log(`  ~ [${i}] ${doi}`);
      console.log(`    OLD: ${pubs[i].citation}`);
      console.log(`    NEW: ${formatted.citation}`);
      updates.push({ index: i, doi, citation: formatted.citation });
    }

    if (updates.length === 0) continue;
    if (DRY_RUN) {
      console.log(`  = ${updates.length} citation(s) would be rewritten`);
      continue;
    }
    applyUpdates(fullPath, slug, updates);
  }

  console.log("");
  console.log(`Citations regenerated: ${regenerated}`);
  console.log(`Already up to date:    ${alreadyCurrent}`);
  console.log(`Skipped (no DOI):      ${noDoi}`);
  console.log(`Failed (left as-is):   ${failed}`);
  if (groupsNotMigrated > 0) {
    console.log(`Groups skipped (not migrated): ${groupsNotMigrated}`);
  }
  if (DRY_RUN) console.log("\nDry run — no files written.");
}

/**
 * Re-read before writing: another migration script may be rewriting these same
 * files while this one waits on Crossref, and a citation is only re-applied if
 * the entry at that index still carries the DOI it was fetched for.
 */
function applyUpdates(fullPath, slug, updates) {
  const fresh = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  const pubs = fresh.publications;
  let applied = 0;
  for (const update of updates) {
    const entry = Array.isArray(pubs) ? pubs[update.index] : null;
    if (!entry || typeof entry !== "object" || normaliseDoi(entry.doi) !== update.doi) {
      console.warn(`  ! [${update.index}] ${update.doi}: file changed under us, not written`);
      continue;
    }
    entry.citation = update.citation;
    applied += 1;
  }
  if (applied === 0) return;
  fs.writeFileSync(fullPath, JSON.stringify(fresh, null, 2) + "\n");
  console.log(`  = ${slug}: wrote ${applied} citation(s)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
