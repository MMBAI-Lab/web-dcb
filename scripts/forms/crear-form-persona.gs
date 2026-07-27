/**
 * DCB — Generador del formulario "Ficha de persona"
 * =================================================
 *
 * Crea, de una sola pasada, el Google Form con el que se releva la ficha de
 * cada integrante del Departamento de Ciencias Biológicas (CENUR Litoral
 * Norte, Udelar). Se espera UNA respuesta POR PERSONA (~88 en total) y una
 * respuesta extra por cada grupo adicional al que la persona pertenezca.
 *
 * Los datos alimentan directamente el sitio del DCB:
 *   - "Nombre completo" y "Cargo y dedicación"  -> nombre y cargo en la
 *     página del grupo (src/content/groups/*.json, campos `name` y `title`).
 *   - "¿Está cursando una tesis...?" + programa  -> sección "Formación" de la
 *     página de Enseñanza, que se deriva automáticamente del texto del cargo
 *     (ver src/lib/formacion.ts).
 *   - "Foto" -> retrato en la ficha de la persona.
 *
 * El formulario es íntegramente en español: la versión en inglés del sitio la
 * produce el propio Departamento en una pasada aparte, así que acá no se pide
 * ningún texto en inglés.
 *
 * CÓMO USARLO
 * -----------
 *   1. Entrar a https://script.google.com con la cuenta de Google que va a
 *      quedar como DUEÑA del formulario. Importante: las fotos que suban las
 *      personas se guardan en el Drive de esa cuenta, así que conviene usar
 *      una cuenta institucional con espacio disponible.
 *   2. "Nuevo proyecto".
 *   3. Borrar todo el contenido del archivo "Código.gs" que viene por defecto
 *      y pegar en su lugar TODO este archivo.
 *   4. Guardar (Ctrl+S). En el selector de funciones de la barra superior
 *      elegir "crearFormularioPersona" y hacer clic en "Ejecutar".
 *   5. Autorizar los permisos que pide Google (crear formularios y archivos en
 *      Drive). La primera vez aparece el cartel "Google no verificó esta
 *      aplicación": ir a "Configuración avanzada" -> "Ir a <nombre del
 *      proyecto> (no seguro)" -> "Permitir". Es esperable: la "aplicación" no
 *      verificada es este mismo script, que corre en la propia cuenta.
 *   6. Cuando termine, abrir el "Registro de ejecución" (aparece solo abajo;
 *      si no, Ctrl+Enter o menú "Ver" -> "Registros"). Ahí quedan impresas la
 *      URL de edición (para retocar el formulario) y la URL para responder
 *      (la que se envía a las personas).
 *   7. Ejecutar el script UNA sola vez. Cada ejecución crea un formulario
 *      nuevo y vacío; si hace falta cambiar algo después de haber empezado a
 *      recibir respuestas, editar el formulario existente desde su URL de
 *      edición, no volver a correr el script.
 *
 * LA PREGUNTA DE LA FOTO HAY QUE AGREGARLA A MANO
 * -----------------------------------------------
 *   El servicio Forms de Apps Script NO permite crear preguntas de subida de
 *   archivo: `Form.addFileUploadItem()` no existe, y la documentación de
 *   `FormApp.ItemType.FILE_UPLOAD` lo dice expresamente ("This item cannot be
 *   created by scripts"). Por eso el script crea las seis preguntas de texto
 *   y deja la de la foto para agregar con dos clics en la interfaz:
 *
 *     1. Abrir el formulario con la URL de edición que queda en el registro.
 *     2. "Añadir pregunta" al final → cambiar el tipo a "Subida de archivos"
 *        → aceptar el aviso de Google.
 *     3. Título: Foto
 *        Texto de ayuda: el que imprime este script al terminar (copiarlo del
 *        registro de ejecución).
 *        Tipos de archivo permitidos: solo imágenes.
 *        Número máximo de archivos: 1. Tamaño máximo: 10 MB.
 *        Dejarla como NO obligatoria.
 *
 *   Dos cosas a tener en cuenta sobre esa pregunta, una vez agregada:
 *   - Obliga a quien responde a iniciar sesión con una cuenta de Google. Quien
 *     no tenga cuenta no va a poder enviar el formulario: para esos casos,
 *     pedir la foto por correo y cargar los datos a mano.
 *   - Los archivos no quedan en el Drive de quien responde: se copian al Drive
 *     del dueño del formulario, en una carpeta que Google crea sola.
 */

// Opciones EXACTAS del desplegable de grupo. El orden es el mismo que usa la
// página de Investigación del sitio. El comentario al costado es el `slug` del
// JSON correspondiente en src/content/groups/, para que el script que después
// importe las respuestas pueda mapear cada respuesta a su archivo sin adivinar.
const GRUPOS = [
  "Biofisicoquímica",                                      // bfq
  "Modelado Molecular, Bioinformática e IA (MMBAI)",       // danslab
  "Biomecánica y Análisis del Movimiento (LIBiAM)",        // libiam
  "Ecología Fluvial",                                      // ecologiafluvial
  "Ecología y Comportamiento de Fauna Silvestre (ECoFauna)", // ecologia-vertebrados
  "Genética Molecular Humana",                             // lgmh
  "Genómica y Bioinformática",                             // ugb
  "Inmunología y Biotecnología (LIB)",                     // inmunologia-biotecnologia
  "Investigación y Desarrollo de Moléculas Bioactivas",    // moleculas-bioactivas
  "Producción y Reproducción de Rumiantes",                // rumiantes
  "Virología Molecular",                                   // virologiamolec
  "Vectores y Enfermedades Transmitidas",                  // vyet
];

// Opciones del desplegable de formación en curso. El texto de cada opción es
// el que después se traduce a un cargo redactado para el sitio (ver la tabla
// de equivalencias al final de este archivo).
const OPCIONES_TESIS = [
  "No",
  "Sí — tesis de grado",
  "Sí — maestría",
  "Sí — doctorado",
  "Sí — estancia posdoctoral",
];

const TITULO = "DCB — Ficha de integrante (datos para el sitio web)";

const DESCRIPCION = [
  "Este formulario releva los datos de cada integrante del Departamento de " +
    "Ciencias Biológicas (CENUR Litoral Norte, Udelar) que se publican en el " +
    "sitio web del Departamento: nombre, cargo, formación en curso y foto.",
  "",
  "Se completa UNA VEZ POR PERSONA y lleva unos 3 minutos. Si integrás más de " +
    "un grupo, enviá una respuesta por cada grupo.",
  "",
  "La versión en inglés del sitio la traduce el propio Departamento, así que " +
    "acá solo se pide texto en español.",
  "",
  "Consultas: escribir al referente de comunicación del DCB.",
].join("\n");

/**
 * Crea el formulario completo. Es la única función que hay que ejecutar.
 */
function crearFormularioPersona() {
  const form = FormApp.create(TITULO);

  form.setTitle(TITULO);
  form.setDescription(DESCRIPCION);

  // Registra la dirección de correo de quien responde: sirve para volver a
  // contactar a la persona si falta un dato o si la foto no sirve.
  // (En runtimes recientes de Apps Script esta llamada figura como obsoleta y
  // se reemplaza por
  //   form.setEmailCollectionType(FormApp.EmailCollectionType.VERIFIED);
  // Si al ejecutar aparece un aviso de método obsoleto, cambiar esta línea por
  // esa otra; el efecto para quien responde es el mismo.)
  form.setCollectEmail(true);

  // Barra de progreso: el formulario es corto, pero deja claro cuánto falta.
  form.setProgressBar(true);

  // IMPORTANTE: NO limitar a una respuesta por cuenta. Quienes integran más de
  // un grupo tienen que poder enviar una respuesta por cada grupo.
  form.setLimitOneResponsePerUser(false);

  // Permite que la persona corrija su propia respuesta desde el enlace de
  // confirmación, en lugar de mandar una segunda respuesta duplicada.
  form.setAllowResponseEdits(true);

  // --- 1. Nombre completo ------------------------------------------------
  form
    .addTextItem()
    .setTitle("Nombre completo")
    .setHelpText(
      "Escribilo tal como querés que aparezca publicado: la forma que usás en " +
        "tus publicaciones, incluyendo el prefijo académico. " +
        'Ejemplos: "Dra. Ana Soler", "MSc. Gabriela da Rosa", "Lic. Martín Pereira".'
    )
    .setRequired(true);

  // --- 2. Grupo ----------------------------------------------------------
  form
    .addListItem()
    .setTitle("Grupo")
    .setHelpText(
      "Grupo de investigación del DCB al que pertenecés. Si integrás más de un " +
        "grupo, enviá una respuesta por cada grupo (el cargo y la dedicación " +
        "suelen ser distintos en cada uno)."
    )
    .setChoiceValues(GRUPOS)
    .setRequired(true);

  // --- 3. Cargo y dedicación ---------------------------------------------
  // El texto de esta respuesta se publica tal cual como cargo de la persona,
  // así que los ejemplos son cargos reales ya publicados en el sitio.
  form
    .addTextItem()
    .setTitle("Cargo y dedicación")
    .setHelpText(
      "Cargo, grado y carga horaria semanal, y si tenés Dedicación Total (DT). " +
        'Ejemplos: "Profesora Adjunta (Gdo 3, 40 hs/sem, DT)", ' +
        '"Asistente (Gdo 2, 30 hs/sem)", "Ayudante (Gdo 1, 20 hs/sem)", ' +
        '"Técnica en instrumental de laboratorio (R12, 30 hs/sem)". ' +
        "Si no tenés cargo docente (por ejemplo, estudiante con beca o sin " +
        'remuneración), escribí tu situación: "Becaria ANII", "Sin cargo".'
    )
    .setRequired(true);

  // --- 4. Formación en curso ---------------------------------------------
  form
    .addListItem()
    .setTitle("¿Está cursando una tesis o estancia posdoctoral?")
    .setHelpText(
      'Con esta respuesta se arma la sección "Formación" del sitio, que lista ' +
        "las tesis y estancias posdoctorales EN CURSO en el Departamento. " +
        "Responder por la formación que estás cursando ahora; si ya la " +
        'terminaste, elegí "No".'
    )
    .setChoiceValues(OPCIONES_TESIS)
    .setRequired(true);

  // --- 5. Programa de posgrado e institución -----------------------------
  form
    .addTextItem()
    .setTitle("Programa de posgrado e institución")
    .setHelpText(
      "Completar solo si respondiste que Sí en la pregunta anterior. " +
        'Ejemplos: "PEDECIBA Biología, Facultad de Ciencias", ' +
        '"Maestría en Bioinformática, PEDECIBA", ' +
        '"Doctorado en Química, Facultad de Química". ' +
        "Si es tesis de grado, indicá la licenciatura y el servicio: " +
        '"Licenciatura en Biología Humana, CENUR Litoral Norte".'
    )
    .setRequired(false);

  // --- 6. Orientador/es ---------------------------------------------------
  form
    .addTextItem()
    .setTitle("Orientador/es")
    .setHelpText(
      "Completar solo si respondiste que Sí en la pregunta sobre tesis o " +
        "estancia posdoctoral. Nombre de quien te orienta y, si hay " +
        "co-orientación, de ambas personas separadas por coma. " +
        'Ejemplo: "Dra. Laura Fernández, Dr. Pablo Dans".'
    )
    .setRequired(false);

  // --- 7. Foto ------------------------------------------------------------
  // NO se crea acá: Apps Script no puede crear preguntas de subida de archivo
  // (ver la nota del encabezado). Se agrega a mano; el texto de ayuda queda
  // impreso al final para copiar y pegar.
  const AYUDA_FOTO =
    "Retrato frontal, con fondo liso y buena luz, de al menos 400 × 400 " +
    "píxeles (cuanto más grande, mejor: se recorta en cuadrado). Sirve una " +
    "foto tomada con el celular contra una pared clara. La foto se publica " +
    "en la página de tu grupo en el sitio del DCB, junto a tu nombre y tu " +
    "cargo. Para subirla vas a tener que iniciar sesión con una cuenta de " +
    "Google.";

  form.setConfirmationMessage(
    "¡Gracias! Ya registramos tus datos. Si integrás otro grupo del DCB, " +
      "volvé a completar el formulario indicando ese otro grupo."
  );

  // URLs de trabajo. Quedan en el "Registro de ejecución" del editor.
  Logger.log("Formulario creado con sus 6 preguntas de texto.");
  Logger.log("URL de edición (para el DCB): " + form.getEditUrl());
  Logger.log("URL para responder (para enviar a las personas): " + form.getPublishedUrl());
  Logger.log("URL corta para responder: " + form.shortenFormUrl(form.getPublishedUrl()));

  Logger.log("");
  Logger.log("FALTA UN PASO A MANO — la pregunta de la foto");
  Logger.log("Apps Script no puede crear preguntas de subida de archivo, así que");
  Logger.log("hay que agregarla desde la interfaz (dos minutos):");
  Logger.log("  1. Abrir la URL de edición de arriba.");
  Logger.log('  2. "Añadir pregunta" al final y elegir el tipo "Subida de archivos".');
  Logger.log('  3. Título: Foto');
  Logger.log("  4. Texto de ayuda (copiar la línea siguiente completa):");
  Logger.log("     " + AYUDA_FOTO);
  Logger.log("  5. Solo imágenes · máximo 1 archivo · 10 MB · NO obligatoria.");
}

/**
 * EQUIVALENCIAS ENTRE LAS RESPUESTAS Y EL CAMPO `title` DEL SITIO
 * ---------------------------------------------------------------
 * El sitio deriva la sección "Formación" buscando palabras clave dentro del
 * cargo de cada persona (src/lib/formacion.ts). Quien vuelque las respuestas a
 * los JSON tiene que componer el campo `title` de modo que esas palabras clave
 * aparezcan. La regla es: cargo, coma, frase de formación.
 *
 *   Respuesta                     Frase que hay que incluir en `title`
 *   ---------------------------   ------------------------------------------
 *   No                            (ninguna; solo el cargo)
 *   Sí — tesis de grado           "Estudiante de Licenciatura en <programa>"
 *   Sí — maestría                 "Estudiante de Maestría en <programa>"
 *   Sí — doctorado                "Estudiante de Doctorado <programa>"
 *   Sí — estancia posdoctoral     "Becario/a posdoctoral"
 *
 * Ejemplo completo:
 *   cargo    = "Asistente (Gdo 2, 30 hs/sem)"
 *   tesis    = "Sí — doctorado"
 *   programa = "PEDECIBA Biología, Facultad de Ciencias"
 *   title    = "Asistente (Gdo 2, 30 hs/sem), Estudiante de Doctorado PEDECIBA Biología"
 *
 * Cuidados (verificados contra las expresiones de src/lib/formacion.ts):
 *   - "Estudiante de grado" NO se reconoce. Tiene que decir "Estudiante de
 *     Licenciatura ..." o "Tesista de grado".
 *   - Para maestría, escribir siempre "Estudiante de Maestría ...". La forma
 *     suelta "Maestría en ..." solo se reconoce con tilde; anteponer
 *     "Estudiante de" la vuelve insensible a la tilde.
 *   - Para doctorado sirven tanto "Estudiante de Doctorado ..." como
 *     "Doctorando/a en ...".
 *   - Para posdoctorado alcanza con que aparezca "posdoctoral" o
 *     "postdoctoral" en cualquier parte del cargo.
 *   - No anteponer "Ex ": los cargos que empiezan con "Ex " se toman como
 *     formación terminada y quedan fuera de la sección "Formación".
 *   - Si la persona cursa dos formaciones a la vez, gana la de mayor nivel:
 *     el orden de búsqueda es posdoctorado, doctorado, maestría, grado.
 */
