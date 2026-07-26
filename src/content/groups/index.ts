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

export type ResearchGroup = {
  slug: string;
  name: { es: string; en: string };
  campus: string;
  email: string | null;
  summary: { es: string; en: string };
  /** Longer prose description of the group's research lines, for the detail page. */
  researchLines?: { es: string; en: string };
  /** Titles of active grant-funded projects, as named on the old site (kept in Spanish). */
  currentProjects?: string[];
  lead: { name: string; title: string; photo: string | null };
  coLead?: { name: string; title: string; photo?: string | null };
  members: Member[];
  students?: string[];
  collaborators?: string[];
  /** Recent publication citations, kept as-is (not translated). */
  publications?: string[];
  teaching?: { es: string[]; en: string[] };
  outreach?: { es: string[]; en: string[] };
  image?: string;
  note?: { es: string; en: string };
};

// Display order matches the original site's Investigación page.
export const researchGroups: ResearchGroup[] = [
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
];
