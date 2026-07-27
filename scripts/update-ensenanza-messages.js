// One-off: expand the `ensenanza` message block in both locales for the
// rebuilt Docencia + Formación page. Keeps every existing CBB/LBH key.
const fs = require("fs");
const path = require("path");

const MSG = path.join(__dirname, "..", "src", "messages");

const addEs = {
  subtitle:
    "El DCB coordina el Ciclo Biología-Bioquímica (CBB) y, de forma análoga, la Licenciatura en Biotecnología, y lleva adelante la docencia en 51 cursos de grado, 37 de posgrado y 9 instancias de otra naturaleza (pasantías, educación permanente y cursos de red). Sus docentes cubren la Licenciatura en Biología Humana, Bioquímica, Biotecnología, Ciencias Biológicas, las carreras de Doctor en Medicina y en Ciencias Veterinarias, Ingeniería Biológica, Ingeniería Agronómica, Recursos Hídricos y Riego, y los ciclos iniciales CIO-CT y CIO-Salud, en una red académica que integra a las Facultades de Ciencias, Medicina, Veterinaria, Agronomía y Química de la UdelaR, el PEDECIBA, ProInBio, ProMEF, el ISEF y el CeRP del Litoral, junto a socios internacionales.",
  docenciaTitle: "Docencia",
  docenciaIntro:
    "Los cursos que dictan los grupos del DCB, agrupados por nivel. Cada curso indica el grupo que lo dicta y enlaza a su página.",
  formacionTitle: "Formación",
  formacionIntro:
    "Tesis y estancias en curso dentro de los grupos del DCB. Cada persona enlaza a la página de su grupo.",
  level_grado: "Grado",
  level_posgrado: "Posgrado",
  level_otras: "Otras",
  level_maestria: "Maestría",
  level_doctorado: "Doctorado",
  level_posdoctorado: "Posdoctorado",
  statCoursesGrado: "Cursos de grado",
  statCoursesPosgrado: "Cursos de posgrado",
  statCoursesOtras: "Pasantías y ed. permanente",
  statTheses: "Tesis en curso",
  featuredLabel: "Coordinado por el DCB",
  biotecTitle: "Licenciatura en Biotecnología",
  biotec:
    "El DCB coordina la Licenciatura en Biotecnología de forma análoga al CBB, aportando el cuerpo docente de sus grupos de investigación. Varios cursos del Departamento —Biología Molecular, Introducción a la Microbiología, entre otros— se dictan de forma conjunta para el CBB, la Licenciatura en Biotecnología y la Licenciatura en Biología Humana, aprovechando la infraestructura de la plataforma de investigación de la sede Salto.",
  cioctTitle: "Ciclo Inicial Optativo Científico-Tecnológico (CIO-CT)",
  cioct:
    "El DCB también participa del CIO-CT, un ciclo inicial optativo de un año y 80 créditos dictado en Salto y Paysandú, que habilita el ingreso a carreras del área científico-tecnológica —entre ellas Biología, Bioquímica, Ingeniería Biológica y Química Farmacéutica— y funciona, junto al CIO-Salud, como puerta de entrada regional a la Licenciatura en Biología Humana.",
};

const addEn = {
  subtitle:
    "The DCB coordinates the Biology-Biochemistry Cycle (CBB) and, in the same way, the Biotechnology degree program, and teaches 51 undergraduate courses, 37 graduate courses, and 9 other instances (internships, continuing education, and network courses). Its faculty cover the Human Biology, Biochemistry, Biotechnology, and Biological Sciences degrees, the Doctor of Medicine and Doctor of Veterinary Science programs, Biological Engineering, Agricultural Engineering, Water Resources and Irrigation, and the CIO-CT and CIO-Salud entry cycles — within an academic network spanning UdelaR's Faculties of Sciences, Medicine, Veterinary Medicine, Agronomy, and Chemistry, plus PEDECIBA, ProInBio, ProMEF, ISEF, CeRP del Litoral, and international partners.",
  docenciaTitle: "Teaching",
  docenciaIntro:
    "Courses taught by the DCB's research groups, grouped by level. Each course names the group that teaches it and links to its page.",
  formacionTitle: "Training",
  formacionIntro:
    "Theses and research stays currently under way within the DCB's groups. Each person links to their group's page.",
  level_grado: "Undergraduate",
  level_posgrado: "Graduate",
  level_otras: "Other",
  level_maestria: "Master's",
  level_doctorado: "Doctorate",
  level_posdoctorado: "Postdoctorate",
  statCoursesGrado: "Undergraduate courses",
  statCoursesPosgrado: "Graduate courses",
  statCoursesOtras: "Internships & continuing ed.",
  statTheses: "Theses under way",
  featuredLabel: "Coordinated by the DCB",
  biotecTitle: "Biotechnology degree program",
  biotec:
    "The DCB coordinates the Biotechnology degree program in the same way as the CBB, staffing it with faculty from its research groups. Several departmental courses — Molecular Biology and Introduction to Microbiology, among others — are taught jointly for the CBB, the Biotechnology degree, and the Human Biology degree, drawing on the research platform facilities at the Salto campus.",
  cioctTitle: "Optional Initial Cycle, Scientific-Technological Area (CIO-CT)",
  cioct:
    "The DCB also takes part in the CIO-CT, a one-year, 80-credit optional entry cycle taught in Salto and Paysandú that opens the way into scientific-technological degrees — Biology, Biochemistry, Biological Engineering, and Pharmaceutical Chemistry among them — and serves, alongside CIO-Salud, as the regional gateway into the Human Biology degree.",
};

for (const [locale, additions] of [
  ["es", addEs],
  ["en", addEn],
]) {
  const file = path.join(MSG, `${locale}.json`);
  const messages = JSON.parse(fs.readFileSync(file, "utf8"));
  Object.assign(messages.ensenanza, additions);
  fs.writeFileSync(file, JSON.stringify(messages, null, 2) + "\n");
  console.log(`${locale}: ensenanza now has ${Object.keys(messages.ensenanza).length} keys`);
}
