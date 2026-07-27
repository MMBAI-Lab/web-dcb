// One-off: replace the `extension` message block for the rebuilt page (the
// standalone COVID-19 card is dropped; that work now lives in Virología
// Molecular's own group page), and add the outreach-kind labels used by the
// group detail pages.
const fs = require("fs");
const path = require("path");

const MSG = path.join(__dirname, "..", "src", "messages");

const extension = {
  es: {
    title: "Extensión",
    subtitle:
      "La extensión atraviesa al DCB de punta a punta: sus 12 grupos llevan la ciencia a liceos, UTU y centros de formación docente, a productores, comunidades rurales y personas privadas de libertad, y a la prensa, la radio y la televisión — con incursiones en el arte y la música. A eso se suman los ciclos que el Departamento organiza como tal: «Todo tiene su ciencia» en el marco de la Semana de la Ciencia y la Tecnología, el ciclo de seminarios «¿En qué andamos?» y el Congreso Internacional de Enseñanza de las Ciencias Básicas (CIECIBA), que llegan a Salto, Paysandú, Artigas y Bella Unión.",
    statActions: "Acciones de extensión",
    statGroups: "Grupos participantes",
    statPrograms: "Ciclos del Departamento",
    statEditions: "Ediciones registradas",
    programsTitle: "Ciclos del Departamento",
    programsIntro:
      "Los ciclos que el DCB organiza como Departamento, con la bitácora de sus ediciones.",
    actionsTitle: "Acciones por grupo",
    actionsIntro:
      "Las actividades de extensión que lleva adelante cada grupo, agrupadas por tipo de acción. Cada una indica el grupo responsable y enlaza a su página.",
    kind_medios: "Medios y divulgación",
    kind_educativo: "Trabajo con centros educativos",
    kind_comunidad: "Comunidad y territorio",
    kind_eventos: "Ferias, congresos y jornadas",
    kind_arte: "Arte y ciencia",
  },
  en: {
    title: "Outreach",
    subtitle:
      "Outreach runs through the whole DCB: its 12 groups take science into secondary and technical schools and teacher-training centres, to farmers, rural communities, and people in prison, and onto the press, radio, and television — with forays into art and music along the way. Added to that are the programmes the Department runs as a whole: “Everything Has Its Science” during Uruguay's Science and Technology Week, the “What Are We Up To?” seminar series, and the International Congress on Basic Sciences Education (CIECIBA), reaching Salto, Paysandú, Artigas, and Bella Unión.",
    statActions: "Outreach actions",
    statGroups: "Participating groups",
    statPrograms: "Department programmes",
    statEditions: "Documented editions",
    programsTitle: "Department programmes",
    programsIntro:
      "The programmes the DCB runs as a Department, with a log of their editions.",
    actionsTitle: "Actions by group",
    actionsIntro:
      "Outreach activities carried out by each group, arranged by kind of action. Each one names the group responsible and links to its page.",
    kind_medios: "Media and science communication",
    kind_educativo: "Work with schools",
    kind_comunidad: "Community and territory",
    kind_eventos: "Fairs, congresses and open days",
    kind_arte: "Art and science",
  },
};

const kindKeys = ["kind_medios", "kind_educativo", "kind_comunidad", "kind_eventos", "kind_arte"];

for (const locale of ["es", "en"]) {
  const file = path.join(MSG, `${locale}.json`);
  const messages = JSON.parse(fs.readFileSync(file, "utf8"));

  messages.extension = extension[locale];

  // The group detail pages reuse the same outreach-kind labels.
  for (const key of kindKeys) {
    messages.grupoDetalle[key] = extension[locale][key];
  }

  fs.writeFileSync(file, JSON.stringify(messages, null, 2) + "\n");
  console.log(
    `${locale}: extension=${Object.keys(messages.extension).length} keys, grupoDetalle=${Object.keys(messages.grupoDetalle).length} keys`
  );
}
