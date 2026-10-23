// Import the October 2026 census (the two Google Forms built by
// scripts/forms/) into the group JSONs, the associated-researchers list and
// the people/group photos.
//
//   node scripts/import-censo-oct26.js            # write everything
//   node scripts/import-censo-oct26.js --dry-run  # report only, write nothing
//
// Inputs live in data/censo_oct26/ and are NOT in git (they carry personal
// emails and CV links): the two .xlsx response sheets exported from Forms,
// plus the Drive upload folders FotosIndividuales/ and CaratulaWeb/.
//
// The form is the source of truth for every field a group actually answered.
// A field left empty, or filled with a placeholder ("x", "NNN", "FALTA
// DESCRIPCION", ...), keeps the content the site already had. People who did
// not fill the person form stay on their group's roster untouched.
//
// Every editorial decision (how a name or position is published, which photo
// belongs to whom) is an explicit table below, so the import can be reviewed
// and rerun. After running it, regenerate citations for the new DOIs with
// `node scripts/resolve-dois.js`.
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const ROOT = path.join(__dirname, "..");
const CENSO = path.join(ROOT, "data", "censo_oct26");
const GROUPS_DIR = path.join(ROOT, "src", "content", "groups");
const ASOCIADOS_FILE = path.join(ROOT, "src", "content", "asociados.json");
const PEOPLE_OUT = path.join(ROOT, "public", "images", "people");
const COVERS_OUT = path.join(ROOT, "public", "images", "groups");
const DRY_RUN = process.argv.includes("--dry-run");

// ---------------------------------------------------------------------------
// Minimal .xlsx reader: a zip of XML parts. Only what Forms exports is
// handled — one sheet, shared strings and inline strings.
// ---------------------------------------------------------------------------
function unzip(file) {
  const buf = fs.readFileSync(file);
  let eocd = buf.length - 22;
  while (eocd >= 0 && buf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const entries = {};
  for (let i = 0; i < count; i++) {
    const method = buf.readUInt16LE(p + 10);
    const size = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const name = buf.toString("utf8", p + 46, p + 46 + nameLen);
    const dataStart = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const raw = buf.subarray(dataStart, dataStart + size);
    entries[name] = method === 8 ? zlib.inflateRawSync(raw) : raw;
    p += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

const decodeXml = (s) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&");
const textRuns = (xml) => decodeXml([...xml.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((m) => m[1]).join(""));

function readSheet(file) {
  const zip = unzip(file);
  const sst = zip["xl/sharedStrings.xml"]?.toString("utf8") ?? "";
  const shared = [...sst.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => textRuns(m[1]));
  const xml = zip["xl/worksheets/sheet1.xml"].toString("utf8");
  const rows = [...xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)].map((r) => {
    const row = [];
    for (const c of r[1].matchAll(/<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const col = [...c[1]].reduce((a, ch) => a * 26 + ch.charCodeAt(0) - 64, 0) - 1;
      const v = (c[3] ?? "").match(/<v>([\s\S]*?)<\/v>/);
      if (/t="s"/.test(c[2]) && v) row[col] = shared[+v[1]];
      else if (/t="inlineStr"/.test(c[2])) row[col] = textRuns(c[3]);
      else if (v) row[col] = decodeXml(v[1]);
    }
    return row;
  });
  const [header, ...data] = rows;
  return data.map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? "").trim()])));
}

// Drive downloads may name files in NFD (decomposed accents) and macOS
// screenshots carry a narrow no-break space, so look files up by a
// normalized form instead of joining the path directly.
function censoFile(dir, name) {
  const key = (s) => s.normalize("NFC").replace(/[\s  ]+/g, " ");
  const want = key(name);
  const found = fs.readdirSync(path.join(CENSO, dir)).find((f) => key(f) === want);
  if (!found) throw new Error(`Missing ${dir}/${name}`);
  return path.join(CENSO, dir, found);
}

const sheetPath = (prefix) => {
  const name = fs.readdirSync(CENSO).find((f) => f.startsWith(prefix) && f.endsWith(".xlsx"));
  if (!name) throw new Error(`No "${prefix}*.xlsx" in ${CENSO}`);
  return path.join(CENSO, name);
};

// ---------------------------------------------------------------------------
// Form option -> group slug. "Otros" goes to the associated-researchers page.
// ---------------------------------------------------------------------------
const GROUP_SLUGS = {
  "Biofisicoquímica": "bfq",
  "Modelado Molecular, Bioinformática e IA (MMBAI)": "danslab",
  "Biomecánica y Análisis del Movimiento (LIBiAM)": "libiam",
  "Ecología Fluvial": "ecologiafluvial",
  "Ecología y Comportamiento de Fauna Silvestre (ECoFauna)": "ecologia-vertebrados",
  "Genética Molecular Humana": "lgmh",
  "Genómica y Bioinformática": "ugb",
  "Inmunología y Biotecnología (LIB)": "inmunologia-biotecnologia",
  "Investigación y Desarrollo de Moléculas Bioactivas": "moleculas-bioactivas",
  "Producción y Reproducción de Rumiantes": "rumiantes",
  "Virología Molecular": "virologiamolec",
  "Vectores y Enfermedades Transmitidas": "vyet",
  "Fisiología": "fisiologia",
  "Histología": "histologia",
  "Anatomía": "anatomia",
  "Otros (grupo aún no formado, sin grupo, asociado, etc)": "asociados",
};

// Groups that first appear with this census. Anatomía answered neither form,
// so it gets a "page in preparation" stub.
const NEW_GROUPS = {
  fisiologia: { name: { es: "Fisiología", en: "Physiology" }, lead: "Alejo Rodriguez" },
  histologia: { name: { es: "Histología", en: "Histology" }, lead: "PhD. Andres Di Paolo" },
  anatomia: { name: { es: "Anatomía", en: "Anatomy" }, pending: true },
};

// Rows of the person form that repeat an earlier row for the same group.
const DUPLICATE_ROWS = new Set(["moleculas-bioactivas|MSc. Krislly R. Ramírez"]);

// Person-form row -> the existing roster entry it updates, when the names are
// too different to match automatically.
const MATCH_OVERRIDES = {
  "danslab|Santiago P. Alvariza": "Lic (candidate). Santiago Pintos",
};

// How each name is published. People typed their own name; this adds the
// academic prefix the site already showed when they left it out, and fixes
// casing and accents. Anything not listed is published as typed.
const NAMES = {
  "Renata Luisa Bona": "Dra. Renata Luisa Bona",
  "Ivana Silva Fripp": "MSc. Ivana Silva Fripp",
  "Macarena Menoni": "Lic. Macarena Menoni",
  "Guzman Alvarez": "Dr. Guzmán Álvarez",
  "Gabriela Burgueño Rodríguez": "MSc. Gabriela Burgueño Rodríguez",
  "Dr. Fernando Lopez Tort": "Dr. Fernando López Tort",
  "B. C. Carla Palermo": "Bach. Carla Palermo",
  "Artur Bonezi": "Dr. Artur Bonezi",
  "Rafael Sauto": "MSc. Rafael Sauto",
  "Dr. en C. Víctor Miguel García Velásquez": "Dr. Víctor Miguel García Velásquez",
  "Gabriela da Rosa": "MSc. Gabriela da Rosa",
  "María José Benítez-Galeano, PhD": "Dra. María José Benítez-Galeano",
  "Daiana Mir": "Dra. Daiana Mir",
  "Agustina Añasco Podchibiakin": "Lic. Agustina Añasco Podchibiakin",
  "Dr. German Matias Traglia": "Dr. Germán Matías Traglia",
  "Paulina Boiani": "Bach. Paulina Boiani",
  "Dra. Ana Maria Soler": "Dra. Ana María Soler",
  "Rodrigo Alvez Decesari": "DCV Rodrigo Alvez Decesari",
  "José Manuel Venzal": "Dr. José Manuel Venzal",
  "Sabina Victoria Montero": "Dra. Sabina Victoria Montero",
  "Br. Ignacio Rodríguez de Ávila Soto": "Bach. Ignacio Rodríguez de Ávila Soto",
  "Mag. MV. Diego Almansa": "Mag. M.V. Diego Almansa",
  "Matías Victoria": "Dr. Matías Victoria",
  "Andrés Lizasoain": "Dr. Andrés Lizasoain",
  "Nélida Rodriguez Osorio": "Dra. Nélida Rodríguez Osorio",
  "Diego Queirolo": "Dr. Diego Queirolo",
  "PhD. Valentina Silva": "Dra. Valentina Silva",
  "CINTYA PERDOMO": "MSc. Cintya Perdomo",
  "Qca. Valeria Lucero": "Quím. Valeria Lucero",
  "Tec. Químico. Matías Suárez": "Tec. Quím. Matías Suárez",
  "BC Lucia Thomas": "Bach. Lucía Thomas",
  "Daniela Gabriela Mejias De Nobrega": "Dra. Daniela Mejías De Nobrega",
  "pablo alcoba": "Prof. Pablo Alcoba",
  "Alejo Rodriguez": "Dr. Alejo Rodríguez-Cattáneo",
  "Br. Mauro Méndez": "Bach. Mauro Méndez",
  "Br. Elis Villalba": "Bach. Elis Villalba",
  "Dr.Lucas Vignolo": "Dr. Lucas Vignolo",
  "PhD. Andres Di Paolo": "Dr. Andrés Di Paolo",
  "Br. Ana Gerez": "Bach. Ana Gerez",
  "Ing. Agr. (Dra) Maria Eugenia Lorenzo": "Dra. María Eugenia Lorenzo",
  "Iván González": "Dr. Iván González",
  "Rodney Colina": "Dr. Rodney Colina",
};

// Positions whose wording the generic normalizer below can't fix.
const TITLES = {
  "Grado 5, 40 horas semanales, DT": "Profesor Titular (Gdo 5, 40 hs/sem, DT)",
  "Gdo 2, 40hs/sem, DT": "Asistente (Gdo 2, 40 hs/sem, DT)",
  "Gdo 2, 40 hs/sem, DT": "Asistente (Gdo 2, 40 hs/sem, DT)",
  "Gdo 1, 22 hs/sem": "Ayudante (Gdo 1, 22 hs/sem)",
  "Gdo 1, 20 hs/sem": "Ayudante (Gdo 1, 20 hs/sem)",
  "Profesor Agregado 40 hrs/sem, DT": "Profesor Agregado (Gdo 4, 40 hs/sem, DT)",
  "Profesor Agregado, grado 4, 40 hrs. semanales, DT": "Profesor Agregado (Gdo 4, 40 hs/sem, DT)",
  "Profesor Adjunto, Gdo 3, 40 hs/sem, DT": "Profesor Adjunto (Gdo 3, 40 hs/sem, DT)",
  "Profesora Adjunta. Grado 3, 40 hs/semana.": "Profesora Adjunta (Gdo 3, 40 hs/sem)",
  "Profesor Adjunto, Grado 3, 40 horas semanales": "Profesor Adjunto (Gdo 3, 40 hs/sem)",
  "Profesora adjunta (Gr3, 40 hs/sem, DT)": "Profesora Adjunta (Gdo 3, 40 hs/sem, DT)",
  "Profesora Adjunta (Gdo 3, 40 hs/ DT)": "Profesora Adjunta (Gdo 3, 40 hs/sem, DT)",
  "Profesor Adjunto- G3, 40h, DT": "Profesor Adjunto (Gdo 3, 40 hs/sem, DT)",
  "Profesora Adjunta (Grado 3, con DT )": "Profesora Adjunta (Gdo 3, DT)",
  "Prof. Adj. (Gdo 3, 40 hs/sem)": "Profesor Adjunto (Gdo 3, 40 hs/sem)",
  "Profesor Agregado (Gdo. 4, 35 h/semanales, DT interumpida por cargo de Gobierno))":
    "Profesor Agregado (Gdo 4, 35 hs/sem, DT interrumpida por cargo de gobierno)",
  "Ingeniero en Electrónica R16, 40hs/sem": "Ingeniero en Electrónica (R16, 40 hs/sem)",
  "Gdo 2, 40 hs/sem, DT (DQL), G3-libre IIUS": "Asistente (Gdo 2, 40 hs/sem, DT, DQL); Gdo 3 libre, IIUS",
  "Cargo docente grado 2, 20 hs semanales": "Asistente (Gdo 2, 20 hs/sem)",
  "Técnica en instrumentación de laboratorio (R 12, 30 hs/sem) - Con ext. a 40 hs y dedicación compensada (Comisión Mantenimiento Plataforma de Investigación y P3)":
    "Técnica en instrumentación de laboratorio (R12, 30 hs/sem, con extensión a 40 hs y dedicación compensada)",
  "Ayudante (Gdo 1, 30/sem, Contratado)": "Ayudante contratado (Gdo 1, 30 hs/sem)",
  "Contratado (Gdo 1,15 hs/sem)": "Ayudante contratado (Gdo 1, 15 hs/sem)",
  "Asistente (G2, 24 hs/sem Contratado)": "Asistente contratado (Gdo 2, 24 hs/sem)",
  "Preparador de área biologíca (D7, 30 hs/sem)": "Preparador de área biológica (D7, 30 hs/sem)",
  "Estudiante de Doctorado con Beca ANII": "Becario ANII",
  "Estudiante de Doctorado beca CAP": "Becaria CAP",
  "Profesora Adjunta (Gdo 3, 40 hs/sem, DT) - SNI Iniciación": "Profesora Adjunta (Gdo 3, 40 hs/sem, DT), SNI Iniciación",
};

// Positions that mean "no paid position": the card then shows the thesis
// level instead, or keeps the site's previous wording.
const NO_POSITION = /^(sin cargo|estudiante "?sin cargo"?|estudiante sin remuneración)$/i;

function normalizeTitle(raw) {
  if (TITLES[raw]) return TITLES[raw];
  let t = raw
    .replace(/^Progfesor/, "Profesor")
    .replace(/^Profesir adjunto/, "Profesor Adjunto")
    .replace(/\b(?:Gdo\.?|Grado|grado|Gr|G)\s*(\d)\b/g, "Gdo $1")
    .replace(/(\d+)\s*(?:hs|hrs|Hs|h)\.?\s*\/\s*(?:sem|Sem|semana|s)\b/g, "$1 hs/sem")
    .replace(/Gdo (\d) (\d)/g, "Gdo $1, $2")
    .replace(/^(\S.*?)\s+(Gdo \d,.*)$/, (m, role, rest) => (m.includes("(") ? m : `${role} (${rest})`))
    .replace(/\s+\)/g, ")")
    .replace(/\.$/, "")
    .trim();
  const open = (t.match(/\(/g) ?? []).length;
  const close = (t.match(/\)/g) ?? []).length;
  if (open > close) t += ")";
  return t;
}

// Thesis program/advisor fixes (typos, a missing program).
const PROGRAMS = {
  "pablo alcoba": "Licenciatura en Biología Humana, CENUR Litoral Norte",
};
const ADVISORS = {
  "Dr. R. Daniel Peluffo - Dra. Laura Lafón": "Dr. R. Daniel Peluffo, Dra. Laura Lafon-Hughes",
  "Dr. Danien. R Peluffo, Dra Maria.J. Zuluaga": "Dr. R. Daniel Peluffo, Dra. María José Zuluaga",
  "Mauricio Cabrera": "Dr. Mauricio Cabrera",
};
const cleanAdvisors = (s) =>
  (ADVISORS[s] ?? s)
    .replace(/\bDa Luz\b/g, "da Luz")
    .replace(/\bGaria\b/g, "García")
    .replace(/;\s*/g, ", ")
    .replace(/\bDra?\b(?!\.)/g, (m) => `${m}.`)
    .replace(/\s{2,}/g, " ")
    .replace(/\.$/, "")
    .trim();

const THESIS_LEVELS = {
  "Sí — tesis de grado": "grado",
  "Sí — maestría": "maestria",
  "Sí — doctorado": "doctorado",
  "Sí — estancia posdoctoral": "posdoctorado",
};

// Uploaded portrait for each person-form row (Drive names files
// "<original> - <uploader>", and some people uploaded for others).
const PHOTOS = {
  "Renata Luisa Bona": "RenataBona - Renata Bona.jpeg",
  "Ivana Silva Fripp": "Ivana Silva - Ivana Silva.png",
  "Ing. Tec. Marcos Grilli": "MarcosGrilli - Marcos Grilli.jpg",
  "Dra. Natalia Ruetalo": "Natalia Ruetalo - Natalia Ruetalo.jpg",
  "Lic. Zoraima Artía Blanc": "WhatsApp Image 2024-10-14 at 15.18.05 - Zoraima Artía.jpeg",
  "Macarena Menoni": "Macarena Menoni - Macarena Menoni.jpg",
  "Guzman Alvarez": "DSC_0166 - Guzman Alvarez.JPG",
  "Gabriela Burgueño Rodríguez": "Gabriela Burgueño - Gabriela Burgueño.jpeg",
  "Dr. Fernando Lopez Tort": "Foto perfil 2026 - Fernando López.PNG",
  "MSc. Krislly R. Ramírez L.": "MSc. Krislly R. Ramírez L - Krislly Ramirez.jpg",
  "B. C. Carla Palermo": "CarlaPalermo - Carla Palermo.jpeg",
  "Rachel Ramos Granja": "Ramos Rachel - Rachel Ramos Granja.jpg",
  "Lic. Christian Schneider": "ChristianSchneider - Christian Schneider.png",
  "Artur Bonezi": "2.Bonezi_picture - Artur Bonezi.jpg",
  "Lic. Vanessa Yelós Tellagorry": "VanessaYelós - Vanessa Yelós Tellagorry.jpg",
  "Pierina Umpierre": "Pierina Umpierre - Ana Maria Soler.jpg",
  "Camila Suárez": "Camila Suarez - Ana Maria Soler.jpg",
  "Rafael Sauto": "RafaelSauto - Rafael Sauto Vinicio.jpeg",
  "Dr. en C. Víctor Miguel García Velásquez": "VictorMiguelGarcia - Victor Miguel Garcia Velasquez.jpeg",
  "Gabriela da Rosa": "IMG_20200606_150357 - Gabriela da Rosa.jpg",
  "Florencia Delfino": "F Delfino - Florencia Delfino.jpg",
  "MSc. Q.F. Adriana Gabrielli": "Adriana Gabrielli - Adriana Gabrielli.jpg",
  "María José Benítez-Galeano, PhD": "MajoBenítez - Majo Benitez Galeano.jpg",
  "Dr. Carlo M. Biancardi": "Carlo Biancardi DCB - Carlo Biancardi.jpg",
  "Daiana Mir": "DM - daiana mir.jpg",
  "Agustina Añasco Podchibiakin": "AgustinaAñasco - Agustina Añasco.jpg",
  "Dr. German Matias Traglia": "GermanTraglia - German Matias Traglia.jpeg",
  "Paulina Boiani": "MEITU_20250521_102608247 - Paulina Boiani.jpg",
  "Santiago P. Alvariza": "SantiagoP - Santiago Pintos.png",
  "MSc. Sebastian Rivera": "Foto Sebastian Rivera - Ana Maria Soler.jpeg",
  "Dra. Ileana Corvo": "Ileana Corvo - Ileana Corvo.jpeg",
  "Dra. Ana Maria Soler": "Foto ALAG Ana - Ana Maria Soler.jpg",
  "Rodrigo Alvez Decesari": "RodrigoAlvez - Rodrigo Alvez Decesari.png",
  "Dra. Leticia Maya Soto": "Leticia Maya - Leticia Maya.jpg",
  "José Manuel Venzal": "Fotos JM Venzal antrevista Radio La Regional. 23may2023 (4) - José M. Venzal.jpg",
  "MSc. Ana Gabriela Sánchez Reolon": "Ana G. Sánchez - Ana G. Sánchez.JPG",
  "Lic. Natalia Ibargoyen": "NataliaIbargoyen - Polo Biofisicoquimica.jpg",
  "Sabina Victoria Montero": "Sabina Victoria foto - Sabina.png",
  "Br. Ignacio Rodríguez de Ávila Soto": "IgnacioRodriguezdeAvila - Lucas Ignacio Rodríguez.jpeg",
  "Mag. MV. Diego Almansa": "DiegoAlmansa - Diego Alejandro Almansa Villa.jpg",
  "Dr. Julio da Luz": "Julio DCB - Julio J.jpg",
  "Matías Victoria": "WhatsApp Image 2026-04-20 at 14.20.28 - Matías Victoria Montero.jpeg",
  "Andrés Lizasoain": "alc - Andres Lizasoain Cuelho.jpg",
  "Dr. Richard Núñez Olivera": "Richard_Núñez_Olivera_(foto_perfil_DCB) - Richard Núñez Olivera.jpeg",
  "MSc. Oscar Irabuena": "oscar-irabuena - Oscar Irabuena.jpg",
  "Nélida Rodriguez Osorio": "IMG_9160_1 - Nelida Rodriguez Osorio.png",
  "Diego Queirolo": "DiegoQueirolo - Diego Queirolo.jpeg",
  "Dr. Pablo D. Dans": "PabloDans - Pablo Dans.jpg",
  "PhD. Valentina Silva": "ValentinaSilva - Valentina Silva.jpeg",
  "CINTYA PERDOMO": "WhatsApp Image 2026-09-14 at 10.04.08 - CINTYA PERDOMO.jpeg",
  "Dra. Macarena Eugui": "MacarenaEugui - Macarena Eugui.webp",
  "Lic. Mariana Chaves": "MarianaChaves - Mariana Chaves.jpg",
  "Qca. Valeria Lucero": "Foto Valeria Lucero - Valeria Lucero.jpeg",
  "Inés Telles": "Inés Telles - Inés Telles.png",
  "Dr. Mauricio Cabrera": "MauricioCabrera - Mauricio Cabrera.jpg",
  "Juan Diego Llona": "Juan Diego Llona - juan diego llona.jpeg",
  "Tec. Químico. Matías Suárez": "Matías Suárez. jpg - Matias Suarez.jpg",
  "Sebastián Fernández Barrios": "Sebastián Fernández - Sebastián Fernández.png",
  "Lic. Sylvia Cuchman": "SylviaCuchman - Sylvia Cuchman.jpg",
  "Daniela Gabriela Mejias De Nobrega": "foto cv Daniela M (1) - Daniela Mejias.jpg",
  "pablo alcoba": "Pablo Alcoba - pablo alcoba.jpg",
  "Dra. María José Zuluaga": "MJ Zuluaga - Maria Jose Zuluaga.jpg",
  "BC Lucia Thomas": "image - Lucía Thomas.jpg",
  "Alejo Rodriguez": "WhatsApp Image 2026-09-14 at 1.24.43 PM - Alejo Rodriguez.jpeg",
  "Dra. Noelia Zambra": "Captura de pantalla 2026-06-26 a las 6.29.05 p. m. - Noelia Zambra.png",
  "Santiago Cruces": "SantiagoCruces - Santiago Cruces Vallo.JPG",
  "Dra. María Hilda Avellanal": "MHAvellanal - Maria Hilda Avellanal Sanguinetti.jpg",
  "Ing. Agr. (Dra) Maria Eugenia Lorenzo": "Foto - Maria Eugenia Lorenzo.jpg",
  "Dr. Matías Castells": "MatiasCastells - Matías Castells.jpg",
  "Br. Mauro Méndez": "MauroMendez.jpng - Mauro Méndez.png",
  "Dra. Christine Lucas": "IMG_5956 - Christine Lucas.jpeg",
  "Br. Elis Villalba": "Elisvillalba - Elis Gastón Villalba.jpeg",
  "Iván González": "Ivan Gonzalez - Ivan Gonzalez Bergonzoni.jpeg",
  "Rodney Colina": "Foto Rodney Colina McGill 2026 - Rodney Colina.jpeg",
  "Dr.Lucas Vignolo": "IMG_20261007_214630121~2 - lucas vignolo.jpg",
  "Lic. Ana Carolina Souza Fin": "AnaSouza - Ana Carolina Souza Fin.jpg",
  "Celeste Guerrero": "cv6 - Celee Guerrero.jpeg",
  "PhD. Andres Di Paolo": "Di Paolo_Photo - Andrés Di Paolo.jpg",
  "Tec. Candelaria Banchero": "WhatsApp Image 2026-10-09 at 23.01.54 - María Banchero.jpeg",
  "Br. Ana Gerez": "AnaGerez - Ana Gerez.jpeg",
  "Dra. Lía M. Randall Carlevaro": "Lia Randall.jpg - Lía Randall.jpg",
};

// Portraits where the person is small in the frame (full-body or scenery
// shots), so the automatic crop misses the face. Square crop centred at
// (cx, cy), as fractions of the upright image, with side s as a fraction of
// its shorter dimension. Checked by eye against the originals.
const CROPS = {
  "Foto Rodney Colina McGill 2026 - Rodney Colina.jpeg": { cx: 0.39, cy: 0.53, s: 0.36 },
  "MajoBenítez - Majo Benitez Galeano.jpg": { cx: 0.7, cy: 0.55, s: 0.45 },
  "VictorMiguelGarcia - Victor Miguel Garcia Velasquez.jpeg": { cx: 0.34, cy: 0.32, s: 0.55 },
  "SylviaCuchman - Sylvia Cuchman.jpg": { cx: 0.48, cy: 0.24, s: 0.7 },
  "WhatsApp Image 2026-10-09 at 23.01.54 - María Banchero.jpeg": { cx: 0.5, cy: 0.35, s: 0.5 },
  "Leticia Maya - Leticia Maya.jpg": { cx: 0.48, cy: 0.55, s: 0.9 },
};

// Group cover image uploaded with the group form.
const COVERS = {
  fisiologia: "Captura de pantalla 2026-09-10 155417 - Alejo Rodriguez.png",
  histologia: "Caratula_Histologia_DCB - Andrés Di Paolo.tif",
  ecologiafluvial: "EcologiaFluvial_lancha - Christine Lucas.jpg",
  "inmunologia-biotecnologia": "Imagen LIB para página WEB - Natalia Ruetalo.png",
  rumiantes: "Imagen_portada_DCB - Richard Núñez Olivera.jpg",
  ugb: "Imagen_UGB - Nelida Rodriguez Osorio.png",
  virologiamolec: "Integrantes Lab Virología Cenur Litoral Norte Udelar Salto - Rodney Colina.jpeg",
  bfq: "izquierda control sin colageno 24h - Laura Lafon-Hughes.tif",
  libiam: "LIBiAM - Carlo Biancardi.png",
  danslab: "MMBAI_cover_dcb - Pablo Dans.png",
  "moleculas-bioactivas": "Moléculas Bioactivas - Zoraima Artía.png",
  "ecologia-vertebrados": "WhatsApp Image 2026-09-21 at 15.25.57 - Diego Queirolo.jpeg",
};

// ---------------------------------------------------------------------------
// Group-form cleanup
// ---------------------------------------------------------------------------
const PLACEHOLDER = /^(x|n+|falta descripcion|.*\bCOMPLETAR\b.*)$/i;
const isReal = (s) => Boolean(s && s.trim() && !PLACEHOLDER.test(s.trim()));
const clean = (s) => s.replace(/​/g, "").replace(/\s+/g, " ").trim();

// Multi-line list answers: one item per line, minus bullets, numbering,
// section headers ("PASANTÍAS:") and empty lines.
function listItems(s) {
  if (!isReal(s)) return [];
  return s
    .split(/\n/)
    .map((l) => clean(l.replace(/^\s*(?:[●•·\-–]|\d+\))\s*/, "")))
    .filter((l) => l && !/^[A-ZÁÉÍÓÚÑ ]+:$/.test(l) && !PLACEHOLDER.test(l));
}

// Per-group fixes for answers whose shape doesn't fit one-item-per-line.
const LIST_FIXES = {
  virologiamolec: {
    "Cursos de grado": [
      "Biología Celular. Ciclo Biología-Bioquímica (anual)",
      "Microbiología. Facultad de Veterinaria (anual)",
      "Microbiología. EUTM (anual)",
    ],
  },
  rumiantes: {
    // The answer ends with a note naming the programs, not a course.
    "Cursos de grado": (items) => items.filter((i) => !i.startsWith("Cursos pertenecientes")),
  },
};

// Research-line descriptions given as a numbered list.
const LINE_BODY_FIXES = {
  "4.1 transición de epitelio a mesénquima en un modelo de cáncer colorrectal\n4.2 sinaptogénesis y neuritogénesis\n4.3 daño y reparación del ADN":
    "Transición de epitelio a mesénquima en un modelo de cáncer colorrectal; sinaptogénesis y neuritogénesis; daño y reparación del ADN.",
};

function cleanDoi(s) {
  return s
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .replace(/^doi:\s*/i, "")
    .replace(/\.?\s.*$/, ""); // DOIs have no spaces: drop a trailing ". eCollection 2021"
}

const institutions = (s) => {
  if (!isReal(s)) return undefined;
  if (/^solo dcb$/i.test(s.trim())) return ["DCB"];
  return s
    .split(";")
    .map((x) => clean(x).replace(/[.,]$/, ""))
    .filter(Boolean);
};

// Spanish text -> English, from what the site already has, so re-imported
// entries that didn't change keep their translation.
function translationIndex(groups) {
  const index = new Map();
  const add = (b) => b?.es && b.en && index.set(clean(b.es), b.en);
  for (const g of groups) {
    add(g.summary);
    add(g.researchLines?.intro);
    g.researchLines?.lines.forEach((l) => (add(l.title), add(l.body)));
    g.teaching?.forEach(add);
    g.outreach?.forEach(add);
  }
  return index;
}
const bilingual = (es, index) => ({ es, en: index.get(es) ?? "" });

const TEACHING_FIELDS = {
  "Cursos de grado": "grado",
  "Cursos de posgrado": "posgrado",
  "Otras instancias (pasantías, educación permanente)": "otras",
};
const OUTREACH_FIELDS = {
  "Medios y divulgación": "medios",
  "Trabajo con centros educativos": "educativo",
  "Comunidad y territorio": "comunidad",
  "Ferias, congresos y jornadas": "eventos",
  "Arte y ciencia": "arte",
};

function applyGroupForm(group, row, ctx) {
  const { index, citations, report } = ctx;
  const slug = group.slug;
  const fixes = LIST_FIXES[slug] ?? {};
  const items = (field) => {
    const fix = fixes[field];
    if (Array.isArray(fix)) return fix;
    const list = listItems(row[field]);
    return typeof fix === "function" ? fix(list) : list;
  };

  if (isReal(row["Correo electrónico de contacto del grupo"])) {
    group.email = row["Correo electrónico de contacto del grupo"].trim();
  }
  if (isReal(row.Sede)) group.campus = row.Sede;
  if (isReal(row["Sitio web propio del grupo"])) group.website = row["Sitio web propio del grupo"].trim();
  if (isReal(row["Resumen del grupo"])) group.summary = bilingual(clean(row["Resumen del grupo"]), index);

  // Research lines: a line counts when it has a real title; its description
  // may still be a placeholder, in which case it is published title-only.
  const lines = [];
  for (let i = 1; i <= 5; i++) {
    const title = row[`Línea ${i} — título`];
    if (!isReal(title)) continue;
    const rawBody = row[`Línea ${i} — descripción (1–2 oraciones)`] ?? "";
    const body = LINE_BODY_FIXES[rawBody] ?? (isReal(rawBody) ? clean(rawBody) : "");
    if (!body) report.push(`${slug}: línea "${clean(title)}" sin descripción`);
    const line = {
      title: bilingual(clean(title).replace(/\.$/, ""), index),
      body: bilingual(body, index),
    };
    const inst = institutions(row[`Línea ${i} — instituciones involucradas`]);
    if (inst) line.institutions = inst;
    lines.push(line);
  }
  const intro = row["Panorama general de la investigación del grupo"];
  if (isReal(intro) || lines.length) {
    group.researchLines = {
      intro: isReal(intro) ? bilingual(clean(intro), index) : group.researchLines?.intro ?? { es: "", en: "" },
      lines: lines.length ? lines : group.researchLines?.lines ?? [],
    };
  }

  const projects = [];
  for (let i = 1; i <= 5; i++) {
    const title = row[`Proyecto ${i} — título`];
    if (!isReal(title)) continue;
    const p = { title: clean(title) };
    const funder = row[`Proyecto ${i} — financiador o programa`];
    const period = row[`Proyecto ${i} — período`];
    const role = row[`Proyecto ${i} — rol del grupo`];
    if (isReal(funder)) p.funder = clean(funder);
    if (isReal(period)) p.period = clean(period);
    if (isReal(role)) p.role = clean(role);
    projects.push(p);
  }
  if (projects.length) group.currentProjects = projects;

  // Collaborators. People who filled the person form for this same group are
  // members, not collaborators (Fisiología listed its two students here).
  // Older roster entries the group now lists as collaborators are left as
  // the group chose.
  const own = ctx.respondents.get(slug) ?? [];
  const collaborators = [];
  for (let i = 1; i <= 8; i++) {
    const name = row[`Colaborador/a ${i} — nombre`];
    const inst = row[`Colaborador/a ${i} — institución`];
    if (!isReal(name) && !isReal(inst)) continue;
    const c = {};
    if (isReal(name)) c.name = clean(name.replace(/\/\s*$/, ""));
    if (c.name && own.some((p) => samePerson(p.name, c.name))) {
      report.push(`${slug}: colaborador ${c.name} es integrante del grupo (omitido)`);
      continue;
    }
    c.institution = isReal(inst) ? clean(inst).replace(/[.,]$/, "") : "";
    const country = row[`Colaborador/a ${i} — país`];
    const topic = row[`Colaborador/a ${i} — tema de colaboración`];
    if (isReal(country)) c.country = clean(country).replace(/\.$/, "");
    if (isReal(topic)) c.topic = clean(topic).replace(/\.$/, "");
    collaborators.push(c);
  }
  if (collaborators.length) group.collaborators = collaborators;

  // Publications: the DOIs the group chose, then its DOI-less items.
  const dois = [];
  for (let i = 1; i <= 10; i++) {
    const raw = row[`DOI publicación ${i}`];
    if (!isReal(raw)) continue;
    const doi = cleanDoi(raw);
    if (dois.includes(doi)) {
      report.push(`${slug}: DOI repetido ${doi} (se publica una vez)`);
      continue;
    }
    dois.push(doi);
  }
  const noDoi = listItems(row["Publicaciones sin DOI (libros, capítulos, en prensa)"]);
  if (dois.length || noDoi.length) {
    group.publications = [
      ...dois.map((doi) => ({ doi, citation: citations.get(doi.toLowerCase()) ?? `doi:${doi}` })),
      ...noDoi.map((citation) => ({ citation })),
    ];
  }

  // Teaching and outreach: an answered level/kind replaces what the site had
  // for it; an unanswered one keeps the existing entries.
  const answered = (fields) => Object.keys(fields).filter((f) => items(f).length > 0);
  const teachingAnswered = answered(TEACHING_FIELDS);
  if (teachingAnswered.length) {
    const levels = new Set(teachingAnswered.map((f) => TEACHING_FIELDS[f]));
    group.teaching = [
      ...(group.teaching ?? []).filter((e) => !e.levels.some((l) => levels.has(l))),
      ...teachingAnswered.flatMap((f) =>
        items(f).map((es) => ({ ...bilingual(es, index), levels: [TEACHING_FIELDS[f]] }))
      ),
    ];
  }
  const outreachAnswered = answered(OUTREACH_FIELDS);
  if (outreachAnswered.length) {
    const kinds = new Set(outreachAnswered.map((f) => OUTREACH_FIELDS[f]));
    group.outreach = [
      ...(group.outreach ?? []).filter((e) => !e.kinds.some((k) => kinds.has(k))),
      ...outreachAnswered.flatMap((f) =>
        items(f).map((es) => ({ ...bilingual(es, index), kinds: [OUTREACH_FIELDS[f]] }))
      ),
    ];
  }

  group.image = `/images/groups/${slug}.jpg`;
}

// ---------------------------------------------------------------------------
// People
// ---------------------------------------------------------------------------
const PREFIX = /^((?:Prof\.|Dr\.|Dra\.|Lic\.|MSc\.|Mag\.|M\.V\.|Q\.F\.|Quím\.|Bach\.|Br\.|Tec\.|Ing\.|Elec\.|DCV|DMTV\.|PhD\.|Lic \(candidate\)\.)\s*)+/;
const fold = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
function personKey(name) {
  return fold(name.replace(PREFIX, ""))
    .replace(/[^a-z ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}
const sameKey = (a, b) => a.length === b.length && a.every((w, i) => w === b[i]);
// Two names refer to the same person when they share at least two words
// (first name + a surname), which tolerates added second surnames.
const samePerson = (a, b) => {
  const ka = personKey(a);
  const kb = personKey(b);
  return ka.filter((w) => kb.includes(w)).length >= Math.min(2, ka.length, kb.length);
};
const photoSlug = (name) =>
  fold(name.replace(PREFIX, ""))
    .replace(/[^a-z]+/g, "-")
    .replace(/^-|-$/g, "");

function profileUrl(s) {
  const v = (s ?? "").trim();
  if (/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(v)) return `https://orcid.org/${v}`;
  return /^https?:\/\//.test(v) ? v : undefined;
}

function personFromRow(row, existing) {
  const typed = row["Nombre completo"].trim();
  const person = { name: NAMES[typed] ?? typed };

  const rawTitle = row["Cargo y dedicación"] ?? "";
  const thesisLevel = THESIS_LEVELS[row["¿Está cursando una tesis o estancia posdoctoral?"]];
  if (rawTitle && !NO_POSITION.test(rawTitle)) person.title = normalizeTitle(rawTitle);
  else if (!thesisLevel && existing?.title) person.title = existing.title;
  else person.title = "";

  const photoFile = PHOTOS[typed];
  person.photo = photoFile
    ? existing?.photo?.endsWith(".jpg")
      ? existing.photo
      : `/images/people/${photoSlug(person.name)}.jpg`
    : existing?.photo ?? null;

  if (thesisLevel) {
    const thesis = { level: thesisLevel };
    const program = (PROGRAMS[typed] ?? clean(row["Programa de posgrado e institución"] ?? ""))
      .replace(/^PostDoc - /, "")
      .replace(/\s*\/\s*/g, " / ")
      .replace(/\.$/, "");
    const advisors = cleanAdvisors(row["Orientador/es"] ?? "");
    if (program) thesis.program = program;
    if (advisors) thesis.advisors = advisors;
    person.thesis = thesis;
  }

  const links = {};
  const cvuy = (row["Copiar el link al CVuy:"] ?? "").trim();
  if (/anii\.org\.uy/.test(cvuy)) links.cvuy = cvuy;
  const profile = profileUrl(
    row["Copiar el link a Scholar Google, Scopus, OrcID o ResearchGate (elegir el que mejor se ajuste a su perfil):"]
  );
  if (profile) links.profile = profile;
  if (Object.keys(links).length) person.links = links;

  return { person, photoFile };
}

// Replace a roster entry in place, keeping key order stable in the JSON.
function updatePerson(target, person) {
  for (const k of Object.keys(target)) delete target[k];
  Object.assign(target, person);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const groupRows = readSheet(sheetPath("DCB — Información"));
  const personRows = readSheet(sheetPath("DCB — Ficha"));
  const report = [];

  const groups = {};
  for (const f of fs.readdirSync(GROUPS_DIR).filter((f) => f.endsWith(".json"))) {
    const g = JSON.parse(fs.readFileSync(path.join(GROUPS_DIR, f), "utf8"));
    groups[g.slug] = g;
  }
  const index = translationIndex(Object.values(groups));
  const citations = new Map();
  for (const g of Object.values(groups)) {
    for (const p of g.publications ?? []) if (p.doi) citations.set(p.doi.toLowerCase(), p.citation);
  }

  for (const [slug, def] of Object.entries(NEW_GROUPS)) {
    if (groups[slug]) continue;
    // Undefined keys reserve their position, so a new group's JSON has the
    // same field order as the existing ones once the forms fill them in.
    groups[slug] = {
      slug,
      name: def.name,
      campus: "",
      email: null,
      summary: { es: "", en: "" },
      researchLines: undefined,
      currentProjects: undefined,
      lead: undefined,
      members: [],
      ...(def.pending ? { pending: true } : {}),
    };
  }
  const asociados = { members: [] };

  // People first, so a group's own members are known when collaborators
  // are filtered.
  const photoJobs = [];
  const seen = new Set();
  const respondents = new Map();
  for (const row of personRows) {
    const slug = GROUP_SLUGS[row.Grupo];
    const typed = row["Nombre completo"].trim();
    if (!slug) throw new Error(`Unknown group "${row.Grupo}"`);
    const rowKey = `${slug}|${typed}`;
    if (DUPLICATE_ROWS.has(rowKey)) continue;
    if (seen.has(rowKey)) throw new Error(`Duplicate row ${rowKey}`);
    seen.add(rowKey);

    if (slug === "asociados") {
      const { person, photoFile } = personFromRow(row, null);
      asociados.members.push(person);
      if (photoFile) photoJobs.push({ src: censoFile("FotosIndividuales", photoFile), out: person.photo });
      continue;
    }

    const group = groups[slug];
    const roster = [group.lead, group.coLead, ...group.members].filter(Boolean);
    const matchName = MATCH_OVERRIDES[rowKey];
    const existing = matchName
      ? roster.find((p) => p.name === matchName)
      : roster.find((p) => samePerson(p.name, typed));
    const { person, photoFile } = personFromRow(row, existing);
    respondents.set(slug, [...(respondents.get(slug) ?? []), person]);
    if (photoFile) photoJobs.push({ src: censoFile("FotosIndividuales", photoFile), out: person.photo });
    else report.push(`${slug}: ${person.name} sin foto en FotosIndividuales/`);

    if (existing) {
      updatePerson(existing, person);
    } else if (NEW_GROUPS[slug]?.lead === typed) {
      group.lead = person;
    } else {
      group.members.push(person);
      report.push(`${slug}: nuevo integrante ${person.name}`);
    }
  }

  const answeredGroups = new Set();
  for (const row of groupRows) {
    const slug = GROUP_SLUGS[row["Grupo de investigación"]];
    if (!slug || slug === "asociados") throw new Error(`Unknown group "${row["Grupo de investigación"]}"`);
    answeredGroups.add(slug);
    applyGroupForm(groups[slug], row, { index, citations, report, respondents });
    if (COVERS[slug]) {
      photoJobs.push({ src: censoFile("CaratulaWeb", COVERS[slug]), out: groups[slug].image, cover: true });
    }
  }
  // Groups that didn't send the group form keep their old Wix cover.
  for (const g of Object.values(groups)) {
    if (!g.image && fs.existsSync(path.join(COVERS_OUT, `${g.slug}.jpg`))) g.image = `/images/groups/${g.slug}.jpg`;
  }

  // ---- report ----
  for (const slug of Object.keys(groups).filter((s) => !answeredGroups.has(s))) {
    report.push(`${slug}: no envió el formulario de grupo`);
  }
  const words = (s) => (s ?? "").split(/\s+/).filter(Boolean).length;
  for (const g of Object.values(groups)) {
    if (words(g.summary?.es) > 50) report.push(`${g.slug}: resumen de ${words(g.summary.es)} palabras (tope 50)`);
    if (words(g.researchLines?.intro.es) > 100) {
      report.push(`${g.slug}: panorama de ${words(g.researchLines.intro.es)} palabras (tope 100)`);
    }
  }
  const usedPhotos = new Set(photoJobs.map((j) => j.src));
  for (const f of fs.readdirSync(path.join(CENSO, "FotosIndividuales"))) {
    if (!usedPhotos.has(path.join(CENSO, "FotosIndividuales", f))) report.push(`foto sin usar: ${f}`);
  }
  console.log(report.map((l) => `  - ${l}`).join("\n"));

  if (DRY_RUN) return;

  for (const g of Object.values(groups)) {
    fs.writeFileSync(path.join(GROUPS_DIR, `${g.slug}.json`), JSON.stringify(g, null, 2) + "\n");
  }
  fs.writeFileSync(ASOCIADOS_FILE, JSON.stringify(asociados, null, 2) + "\n");

  const sharp = require("sharp");
  for (const j of photoJobs) {
    const out = path.join(ROOT, "public", j.out);
    if (j.cover) {
      await sharp(j.src).rotate().resize(1200, 900, { fit: "cover", position: sharp.strategy.attention }).jpeg({ quality: 82 }).toFile(out);
      continue;
    }
    // Rotate first so a manual crop is measured on the upright image.
    const upright = await sharp(j.src).rotate().toBuffer({ resolveWithObject: true });
    let img = sharp(upright.data);
    const crop = CROPS[path.basename(j.src).normalize("NFC")];
    if (crop) {
      const { width, height } = upright.info;
      const side = Math.round(crop.s * Math.min(width, height));
      const left = Math.max(0, Math.min(width - side, Math.round(crop.cx * width - side / 2)));
      const top = Math.max(0, Math.min(height - side, Math.round(crop.cy * height - side / 2)));
      img = img.extract({ left, top, width: side, height: side });
    }
    await img.resize(400, 400, { fit: "cover", position: sharp.strategy.attention }).jpeg({ quality: 82 }).toFile(out);
  }
  console.log(`\n${Object.keys(groups).length} grupos, ${asociados.members.length} asociados, ${photoJobs.length} imágenes`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
