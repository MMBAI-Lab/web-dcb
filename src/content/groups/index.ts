import bfq from "./bfq.json";
import danslab from "./danslab.json";
import libiam from "./libiam.json";
import ecologiafluvial from "./ecologiafluvial.json";
import ecologiaVertebrados from "./ecologia-vertebrados.json";
import lgmh from "./lgmh.json";
import ugb from "./ugb.json";
import inmunologiaBiotecnologia from "./inmunologia-biotecnologia.json";
import moleculasBioactivas from "./moleculas-bioactivas.json";
import rumiantes from "./rumiantes.json";
import virologiamolec from "./virologiamolec.json";
import vyet from "./vyet.json";

export type Member = { name: string; title: string; photo?: string | null };

/**
 * Bilingual text. `en` may be empty while the DCB's own translation pass is
 * pending — read these through `pick()` in src/lib/i18n-content.ts, never
 * directly by locale key, so the English site falls back to Spanish instead
 * of rendering `undefined`.
 */
export type Bilingual = { es: string; en: string };

/** Which academic level(s) a course/teaching entry counts toward. */
export type TeachingLevel = "grado" | "posgrado" | "otras";
export type TeachingEntry = { es: string; en: string; levels: TeachingLevel[] };

/** What kind of outreach action an entry is — see Extensión. */
export type OutreachKind = "medios" | "educativo" | "comunidad" | "eventos" | "arte";
export type OutreachEntry = { es: string; en: string; kinds: OutreachKind[] };

/** One of the group's (at most 5) specific research lines. */
export type ResearchLine = {
  title: Bilingual;
  body: Bilingual;
  institutions?: string[];
};

/**
 * A publication the group chose to feature (at most 10). Groups supply the
 * DOI; `citation` is generated from it by scripts/resolve-dois.js. Items with
 * no DOI (books, in press) carry a hand-written citation instead.
 */
export type PublicationRef = {
  doi?: string;
  citation: string;
};

export type Project = {
  title: string;
  funder?: string;
  period?: string;
  role?: string;
};

export type Collaborator = {
  name: string;
  institution: string;
  country?: string;
  topic?: string;
};

export type ResearchGroup = {
  slug: string;
  name: { es: string; en: string };
  campus: string;
  email: string | null;
  /** ≤ 50 words. */
  summary: Bilingual;
  /** A ≤100-word overview plus up to 5 specific lines. */
  researchLines?: { intro: Bilingual; lines: ResearchLine[] };
  /** Up to 5 active projects. */
  currentProjects?: Project[];
  lead: { name: string; title: string; photo: string | null };
  coLead?: { name: string; title: string; photo?: string | null };
  members: Member[];
  /** Up to 8 collaborators. */
  collaborators?: Collaborator[];
  /** Up to 10 publications chosen by the group. */
  publications?: PublicationRef[];
  /** Each entry tagged with the academic level(s) it counts toward — see Enseñanza. */
  teaching?: TeachingEntry[];
  /** Each entry tagged with the kind(s) of action it is — see Extensión. */
  outreach?: OutreachEntry[];
  image?: string;
  /** The group's own logo, if it has one distinct from the DCB branding. */
  logo?: string;
  /** URL of the group's own external website, if it has one. */
  website?: string;
  note?: Bilingual;
};

// Display order matches the original site's Investigación page.
// Cast because TS widens JSON string literals to `string`, so teaching
// `levels` can't satisfy the TeachingLevel union on its own; the migration
// script is what guarantees those values are valid.
export const researchGroups = [
  bfq,
  danslab,
  libiam,
  ecologiafluvial,
  ecologiaVertebrados,
  lgmh,
  ugb,
  inmunologiaBiotecnologia,
  moleculasBioactivas,
  rumiantes,
  virologiamolec,
  vyet,
] as ResearchGroup[];
