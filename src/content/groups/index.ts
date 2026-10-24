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
import fisiologia from "./fisiologia.json";
import histologia from "./histologia.json";
import anatomia from "./anatomia.json";
import asociadosData from "../asociados.json";

/** In-progress thesis or postdoc, as reported in the person form. */
export type Thesis = {
  level: "grado" | "maestria" | "doctorado" | "posdoctorado";
  program?: string;
  advisors?: string;
};

export type Member = {
  name: string;
  /** Position and dedication; empty for students with no paid position. */
  title: string;
  photo?: string | null;
  thesis?: Thesis;
  /** `profile` is whichever of ORCID / Google Scholar / ResearchGate / Scopus the person chose. */
  links?: { cvuy?: string; profile?: string };
};

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

/** Some groups list partner institutions without naming a person. */
export type Collaborator = {
  name?: string;
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
  /** Up to 5 projects. */
  currentProjects?: Project[];
  /** Absent only on a `pending` group. */
  lead?: Member;
  coLead?: Member;
  members: Member[];
  /** Up to 8 collaborators. */
  collaborators?: Collaborator[];
  /** Up to 10 publications chosen by the group. */
  publications?: PublicationRef[];
  /** Each entry tagged with the academic level(s) it counts toward — see Enseñanza. */
  teaching?: TeachingEntry[];
  /** Each entry tagged with the kind(s) of action it is — see Extensión. */
  outreach?: OutreachEntry[];
  /** Representative image chosen by the group: carousel cover and detail-page header. */
  image?: string;
  /** The group's own logo, if it has one distinct from the DCB branding. */
  logo?: string;
  /** URL of the group's own external website, if it has one. */
  website?: string;
  note?: Bilingual;
  /** Group exists but hasn't sent its content yet: its page says "in preparation". */
  pending?: boolean;
};

// Every page lists groups alphabetically by their Spanish name, and the
// English site keeps that same order.
// Cast because TS widens JSON string literals to `string`, so teaching
// `levels` can't satisfy the TeachingLevel union on its own; the migration
// script is what guarantees those values are valid.
const groups = [
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
  fisiologia,
  histologia,
  anatomia,
] as ResearchGroup[];

export const researchGroups = groups.sort((a, b) => a.name.es.localeCompare(b.name.es, "es"));

/** DCB members not (yet) in a research group — see /investigacion/asociados. */
export const asociados = asociadosData.members as Member[];
