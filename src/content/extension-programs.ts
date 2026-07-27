/**
 * Department-level outreach programs — the recurring cycles the DCB runs as a
 * whole, as opposed to the per-group actions listed in each group's JSON.
 *
 * Edition data was recovered from the posters and programme pages of the
 * previous DCB site (data/old/images/, data/old/content/extension.md and
 * vicieciba.md). Add a new edition by appending to the relevant `editions`
 * array — the Extensión page renders whatever is here.
 */

export type Speaker = { name: string; group: string; talk?: string };

export type Edition = {
  /** Sort key and heading, e.g. "2024". */
  year: string;
  /** e.g. "20–24 de mayo" */
  date: { es: string; en: string };
  place: string;
  venue?: string;
  speakers?: Speaker[];
  poster?: string;
  note?: { es: string; en: string };
};

export type Program = {
  slug: string;
  name: { es: string; en: string };
  span: string;
  description: { es: string; en: string };
  accent: "teal" | "gold" | "crimson";
  editions: Edition[];
};

export const extensionPrograms: Program[] = [
  {
    slug: "todo-tiene-su-ciencia",
    name: {
      es: "«Todo tiene su ciencia» — Semana de la Ciencia y la Tecnología",
      en: "“Everything Has Its Science” — Science and Technology Week",
    },
    span: "2022 – 2025",
    description: {
      es: "Jornadas que la Subcomisión de Comunicación Académica del DCB organiza desde 2022 en el marco de la Semana de la Ciencia y la Tecnología, para acercar el Departamento, sus integrantes y sus investigaciones a la región que comprende Salto, Paysandú, Artigas y Bella Unión. Cada edición combina charlas de divulgación, ferias de ciencias, stands informativos y visitas a los laboratorios de la plataforma de investigación, orientadas a estudiantes de liceo y UTU y al público general.",
      en: "A programme the DCB's Academic Communications Subcommittee has organised since 2022 as part of Uruguay's Science and Technology Week, bringing the Department, its members, and its research to the region spanning Salto, Paysandú, Artigas, and Bella Unión. Each edition combines outreach talks, science fairs, information stands, and guided visits to the research platform's laboratories, aimed at secondary and technical-school students and the general public.",
    },
    accent: "crimson",
    editions: [
      {
        year: "2023",
        date: { es: "26 de julio", en: "26 July" },
        place: "Artigas",
        venue: "Centro de Diálisis de Gremeda",
        poster: "/images/extension/tts-2023-artigas.jpg",
        speakers: [
          { name: "Mag. Gabriela Burgueño", group: "Genética Molecular Humana", talk: "¿Es posible ser científica/o en Uruguay?" },
          { name: "Dr. Julio da Luz", group: "Genética Molecular Humana", talk: "Ancestralidad, fármacos y genes" },
          { name: "Dra. Nélida Rodríguez", group: "Genómica y Bioinformática", talk: "El genoma de la cumbia" },
          { name: "Dr. Daniel Peluffo", group: "Biofisicoquímica", talk: "De canales iónicos, TTX, sushi y peces globo" },
          { name: "Dr. Matías Victoria", group: "Virología Molecular", talk: "Virus del Papiloma humano en Salto" },
        ],
      },
      {
        year: "2023",
        date: { es: "31 de julio", en: "31 July" },
        place: "Bella Unión",
        venue: "Liceo N.º 2",
        poster: "/images/extension/tts-2023-bella-union.jpg",
        speakers: [
          { name: "Mag. Ana G. Sánchez", group: "Biofisicoquímica", talk: "Mitos y verdades de la radiación ultravioleta" },
          { name: "Dra. Leticia Maya", group: "Virología Molecular", talk: "Momentos que inspiran y abren caminos" },
          { name: "Dr. Germán Traglia", group: "Genómica y Bioinformática", talk: "Resistencia a antibióticos, nos quedamos sin armas para defendernos" },
          { name: "Mag. María José Zuluaga", group: "Biofisicoquímica", talk: "Estrés: una aventura en varios niveles" },
        ],
      },
      {
        year: "2024",
        date: { es: "20–24 de mayo", en: "20–24 May" },
        place: "Salto",
        venue: "Instituto de Alta Especialización (UTU) y CENUR Litoral Norte",
        poster: "/images/extension/tts-2024-salto.jpg",
        speakers: [
          { name: "Dr. José Manuel Venzal", group: "Vectores y Enfermedades Transmitidas", talk: "La vocación en la sangre. Viaje a la Amazonia descubriendo nuevas especies" },
          { name: "Dra. Daiana Mir", group: "Genómica y Bioinformática", talk: "Mujeres con-ciencia" },
          { name: "Dr. Daniel Peluffo", group: "Biofisicoquímica", talk: "Entre las membranas biológicas y Galileo Galilei: «Y sin embargo se mueve»" },
          { name: "Dr. Pablo Dans", group: "MMBAI", talk: "No siempre puedes culpar a tus padres" },
          { name: "Dr. Matías Victoria", group: "Virología Molecular", talk: "Circulación del virus del papiloma humano en Salto" },
          { name: "Dra. Laura Lafón-Hughes", group: "Biofisicoquímica", talk: "Cuando la cercanía invita al desarrollo: actores locales en torno al cáncer de colon" },
          { name: "Lic. Ana Egaña y Lic. Andrea Texo", group: "Coordinación CBB", talk: "Ciclo Biología Bioquímica: un ingreso a las Ciencias Biológicas" },
        ],
        note: {
          es: "Incluyó feria de ciencias y visitas guiadas a la Plataforma de Investigación del CENUR Litoral Norte.",
          en: "Included a science fair and guided visits to the CENUR Litoral Norte Research Platform.",
        },
      },
      {
        year: "2024",
        date: { es: "21 de mayo", en: "21 May" },
        place: "Paysandú",
        venue: "Complejo Educativo (ex-Terminal)",
        poster: "/images/extension/tts-2024-paysandu.jpg",
        speakers: [
          { name: "Dr. Carlo Biancardi", group: "LIBiAM", talk: "¿Qué se investiga en un laboratorio de biomecánica?" },
          { name: "Dra. Silvina Niell", group: "Departamento de Química del Litoral", talk: "Riesgos de pesticidas para las abejas" },
          { name: "Dra. Florencia Parpal", group: "Departamento de Química del Litoral", talk: "La guerra química de los insectos" },
          { name: "Dra. Carolina Fontana", group: "Departamento de Química del Litoral", talk: "Desde el Big Bang a las estrellas: ¿cómo se crearon los elementos de nuestro planeta?" },
          { name: "Dra. Christine Lucas y Dr. Iván González", group: "Ecología Fluvial", talk: "Ecología Fluvial: un laboratorio dedicado al estudio de los ríos y montes del Litoral" },
          { name: "Dra. Lucía Pareja", group: "Departamento de Química del Litoral", talk: "Moléculas enemigas en los alimentos: orígenes y riesgos" },
          { name: "Ing. Agr. Mag. Isabel García", group: "Departamento de Química del Litoral", talk: "¿Qué son los pesticidas y cómo pueden afectar a nuestro suelo?" },
          { name: "Qca. Macarena Eugui", group: "Departamento de Química del Litoral", talk: "Más allá de los libros de historia: mujeres científicas olvidadas" },
        ],
        note: {
          es: "Organizada junto al Departamento de Química del Litoral (DQL), con feria de ciencias y visitas al laboratorio de biomecánica.",
          en: "Co-organised with the Departamento de Química del Litoral (DQL), with a science fair and visits to the biomechanics laboratory.",
        },
      },
      {
        year: "2025",
        date: { es: "19–23 de mayo", en: "19–23 May" },
        place: "Salto y Paysandú",
      },
    ],
  },
  {
    slug: "en-que-andamos",
    name: {
      es: "Ciclo de Seminarios «¿En qué andamos?»",
      en: "“What Are We Up To?” Seminar Series",
    },
    span: "2025",
    description: {
      es: "Ciclo mensual que promueve el intercambio y la colaboración entre los grupos del DCB, invitando también a colaboradores externos. Se desarrolla en modalidad híbrida —presencial en la sede Salto y por Zoom— los miércoles de 10 a 12 h. Las grabaciones de seminarios anteriores, con presentaciones de las líneas de investigación de los distintos grupos, están disponibles en el canal de YouTube del Departamento.",
      en: "A monthly series fostering exchange and collaboration among the DCB's groups, with external collaborators also invited. It runs in hybrid format — in person at the Salto campus and over Zoom — on Wednesdays from 10 am to noon. Recordings of earlier seminars, presenting each group's research lines, are available on the Department's YouTube channel.",
    },
    accent: "gold",
    editions: [
      {
        year: "2025",
        date: { es: "12 de marzo", en: "12 March" },
        place: "Dra. Noelia Zambra",
        venue: "Ecología y Comportamiento de Fauna Silvestre (ECoFauna)",
        poster: "/images/extension/seminario-2025-03.jpg",
      },
      {
        year: "2025",
        date: { es: "9 de abril", en: "9 April" },
        place: "Camila Leal",
        venue: "Genómica y Bioinformática",
      },
      {
        year: "2025",
        date: { es: "14 de mayo", en: "14 May" },
        place: "Jimena Benedetto",
        venue: "Modelado Molecular, Bioinformática e IA (MMBAI)",
      },
      {
        year: "2025",
        date: { es: "11 de junio", en: "11 June" },
        place: "Rodrigo Alvez",
        venue: "Vectores y Enfermedades Transmitidas",
      },
      {
        year: "2025",
        date: { es: "9 de julio", en: "9 July" },
        place: "Noelia Gobel",
        venue: "Ecología Fluvial",
      },
    ],
  },
  {
    slug: "cieciba",
    name: {
      es: "CIECIBA — Congreso Internacional de Enseñanza de las Ciencias Básicas",
      en: "CIECIBA — International Congress on Basic Sciences Education",
    },
    span: "2016 – presente",
    description: {
      es: "Espacio de intercambio académico con impacto en el territorio, nacido en 2016 por iniciativa de la Universidad Tecnológica Nacional (regional Concordia). Integrantes del DCB han formado parte del comité organizador de las ediciones II, IV y VI. La VI edición se realizó en la sede Salto del CENUR Litoral Norte, del 5 al 7 de octubre de 2022, en modalidad híbrida, y buscó mejorar la enseñanza de las ciencias básicas en todos los niveles educativos, promover el diálogo interdisciplinario con las ciencias de la educación y despertar vocaciones científicas en la región.",
      en: "An academic exchange with regional impact, founded in 2016 on the initiative of Universidad Tecnológica Nacional (Concordia). DCB members have sat on the organising committee of the 2nd, 4th, and 6th editions. The 6th was held at CENUR Litoral Norte's Salto campus on 5–7 October 2022 in hybrid format, aiming to improve basic sciences teaching at every educational level, foster interdisciplinary dialogue with the education sciences, and spark scientific vocations across the region.",
    },
    accent: "teal",
    editions: [
      {
        year: "2022",
        date: { es: "5–7 de octubre", en: "5–7 October" },
        place: "VI CIECIBA",
        venue: "Sede Salto, CENUR Litoral Norte",
        note: {
          es: "Comité organizador: Natalia Anzuatte, Zoraima Artía, Domingo Borba, Parag Chatterjee, Ana Egaña, Daniel Peluffo, Leticia Pou, Natalie Robaina, Andrea Texo y María José Zuluaga.",
          en: "Organising committee: Natalia Anzuatte, Zoraima Artía, Domingo Borba, Parag Chatterjee, Ana Egaña, Daniel Peluffo, Leticia Pou, Natalie Robaina, Andrea Texo, and María José Zuluaga.",
        },
      },
    ],
  },
];
