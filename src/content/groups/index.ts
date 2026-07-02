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

export type Member = { name: string; title: string };

export type ResearchGroup = {
  slug: string;
  name: { es: string; en: string };
  campus: string;
  email: string | null;
  summary: { es: string; en: string };
  lead: { name: string; title: string; photo: string | null };
  coLead?: { name: string; title: string };
  members: Member[];
  students?: string[];
  collaborators?: string[];
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
