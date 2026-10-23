import type { Bilingual, TeachingLevel } from "@/content/groups";

/**
 * Courses taught by more than one group, under a single name.
 *
 * Each group lists the courses it teaches in its own JSON, in its own words
 * ("DREM (UC12)", "DREMRD", "Unidad Curricular 12: Digestivo…" are the same
 * unit). Enseñanza shows each course once, with the groups that teach it
 * underneath: a teaching entry joins the first course of its level whose
 * `match` it satisfies. Entries that match nothing are shown as written.
 *
 * To merge a new variant, widen the course's `match`; to add a shared course,
 * add an entry here.
 */
export type CatalogCourse = {
  id: string;
  level: TeachingLevel;
  name: Bilingual;
  program?: Bilingual;
  match: RegExp;
};

const CBB = { es: "Ciclo Biología-Bioquímica", en: "Biology-Biochemistry Cycle" };
const MEDICINA = { es: "Doctor en Medicina", en: "Doctor of Medicine" };
const BIOTEC = { es: "Licenciatura en Biotecnología", en: "Biotechnology degree" };

export const courseCatalog: CatalogCourse[] = [
  // --- Grado ---------------------------------------------------------------
  {
    id: "bases-biomoleculares",
    level: "grado",
    name: { es: "Bases Biomoleculares I y II", en: "Biomolecular Foundations I and II" },
    program: { es: "CIO Salud · Ciclo Biología-Bioquímica", en: "CIO Salud · Biology-Biochemistry Cycle" },
    match: /^Bases Biomoleculares/,
  },
  {
    id: "bhafh",
    level: "grado",
    name: {
      es: "Bases Histo-Anatomo-Funcionales Humanas (BHAFH)",
      en: "Human Histo-Anatomo-Functional Foundations (BHAFH)",
    },
    program: { es: "CIO Salud", en: "CIO Salud" },
    match: /^Bases Histo-Anatomo/,
  },
  {
    id: "bhafh-profundizacion",
    level: "grado",
    name: { es: "Profundización en BHAFH", en: "Advanced BHAFH" },
    program: {
      es: "CIO Tecnologías Médicas (Psicomotricidad y Fisioterapia)",
      en: "CIO Medical Technologies (Psychomotricity and Physiotherapy)",
    },
    match: /^Profundización BHAFH/,
  },
  {
    id: "biofisica",
    level: "grado",
    name: { es: "Biofísica", en: "Biophysics" },
    program: {
      es: "Ciclo Biología-Bioquímica · Licenciatura en Biología Humana · CIO-CyT",
      en: "Biology-Biochemistry Cycle · Human Biology degree · CIO-CyT",
    },
    match: /^Biofísica\./,
  },
  {
    id: "biologia-celular",
    level: "grado",
    name: { es: "Biología Celular", en: "Cell Biology" },
    program: CBB,
    match: /^Biología Celular/,
  },
  {
    id: "biologia-molecular",
    level: "grado",
    name: { es: "Biología Molecular", en: "Molecular Biology" },
    program: BIOTEC,
    match: /^Biología Molecular/,
  },
  {
    id: "intro-biotecnologia",
    level: "grado",
    name: { es: "Introducción a la Biotecnología", en: "Introduction to Biotechnology" },
    program: BIOTEC,
    match: /^(Seminarios )?Introducción a la Biotecnología/,
  },
  {
    id: "intro-biologia-animal",
    level: "grado",
    name: { es: "Introducción a la Biología Animal", en: "Introduction to Animal Biology" },
    program: CBB,
    match: /^Introducción a la Biología Animal/,
  },
  {
    id: "intro-ciencias-biologicas",
    level: "grado",
    name: {
      es: "Introducción a las Ciencias Biológicas I y II",
      en: "Introduction to the Biological Sciences I and II",
    },
    program: {
      es: "Ciclo Biología-Bioquímica · Licenciatura en Biología Humana · Licenciatura en Biotecnología · CIO-CyT",
      en: "Biology-Biochemistry Cycle · Human Biology degree · Biotechnology degree · CIO-CyT",
    },
    match: /^Introducción a las Ciencias Biológicas/,
  },
  {
    id: "intro-microbiologia",
    level: "grado",
    name: { es: "Introducción a la Microbiología", en: "Introduction to Microbiology" },
    program: {
      es: "Ciclo Biología-Bioquímica · Licenciatura en Biotecnología · CIO-CyT",
      en: "Biology-Biochemistry Cycle · Biotechnology degree · CIO-CyT",
    },
    match: /^Introducción a la Microbiología/,
  },
  {
    id: "genomica",
    level: "grado",
    name: { es: "Genómica", en: "Genomics" },
    program: {
      es: "Ciclo Biología-Bioquímica · Licenciatura en Biotecnología · Licenciatura en Biología Humana",
      en: "Biology-Biochemistry Cycle · Biotechnology degree · Human Biology degree",
    },
    match: /^Genómica\./,
  },
  {
    id: "metodologia-cientifica-ii",
    level: "grado",
    name: { es: "Metodología Científica II", en: "Scientific Methodology II" },
    program: MEDICINA,
    match: /Metodología Científica II/,
  },
  {
    id: "drem",
    level: "grado",
    name: {
      es: "Digestivo, Renal, Endócrino, Metabolismo, Reproducción y Desarrollo (DREM, UC12)",
      en: "Digestive, Renal, Endocrine, Metabolism, Reproduction and Development (DREM, UC12)",
    },
    program: MEDICINA,
    match: /DREM|Unidad Curricular 12/,
  },
  {
    id: "uc8-desarrollo-tejidos",
    level: "grado",
    name: { es: "Biología del Desarrollo y los Tejidos (UC8)", en: "Developmental and Tissue Biology (UC8)" },
    program: MEDICINA,
    match: /^Biología del desarrollo y los tejidos/i,
  },
  {
    id: "uc8-biofisica",
    level: "grado",
    name: {
      es: "Biofísica del Músculo y la Locomoción (UC8)",
      en: "Muscle and Locomotion Biophysics (UC8)",
    },
    program: MEDICINA,
    match: /^UC8 - Biofísica|Unidad Curricular 8: Biofísica/,
  },
  {
    id: "uc11-cardiovascular",
    level: "grado",
    name: { es: "Cardiovascular y Respiratorio (UC11)", en: "Cardiovascular and Respiratory Systems (UC11)" },
    program: MEDICINA,
    match: /^Cardiovascular y respiratorio|Unidad Curricular 11/i,
  },

  // --- Posgrado ------------------------------------------------------------
  {
    id: "evolucion-biologica",
    level: "posgrado",
    name: {
      es: "Evolución Biológica: Enfoque Multidisciplinario",
      en: "Biological Evolution: A Multidisciplinary Approach",
    },
    program: { es: "PEDECIBA", en: "PEDECIBA" },
    match: /^Evolución Biológica: Enfoque Multidisciplinario/,
  },
  {
    id: "gestacion-oveja",
    level: "posgrado",
    name: {
      es: "Gestación y lactación de la oveja y su relación con la supervivencia de los corderos",
      en: "Ewe gestation and lactation and their relation to lamb survival",
    },
    program: { es: "Posgrado de Facultad de Veterinaria", en: "Faculty of Veterinary Medicine graduate program" },
    match: /^Gestación y lactación de la oveja/,
  },
  {
    id: "supervivencia-cordero",
    level: "posgrado",
    name: {
      es: "Optimización de la supervivencia del cordero: claves del servicio al destete",
      en: "Optimizing lamb survival: key points from mating to weaning",
    },
    program: { es: "Posgrado de Facultad de Veterinaria", en: "Faculty of Veterinary Medicine graduate program" },
    match: /^Optimización de la supervivencia del cordero/,
  },

  // --- Otras instancias ----------------------------------------------------
  {
    id: "pasantias-cerp",
    level: "otras",
    name: {
      es: "Pasantías de 4.º año del Profesorado de Biología",
      en: "4th-year internships, Biology Teacher Training Program",
    },
    program: { es: "CeRP del Litoral", en: "CeRP del Litoral" },
    match: /CeRP|CERP/,
  },
  {
    id: "pasantias-prexi",
    level: "otras",
    name: { es: "Pasantías PREXI", en: "PREXI internships" },
    program: { es: "PEDECIBA", en: "PEDECIBA" },
    match: /PREXI|Prexi/,
  },
  {
    id: "pasantias-utu",
    level: "otras",
    name: { es: "Pasantías de estudiantes de UTU", en: "Internships for UTU students" },
    program: { es: "Tecnólogo en Biotecnología (UTU)", en: "Biotechnology Technologist program (UTU)" },
    match: /^Pasantías UTU|Biotecnología de la UTU/,
  },
];
