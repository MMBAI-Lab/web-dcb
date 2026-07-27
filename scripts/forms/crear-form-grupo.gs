/**
 * ============================================================================
 *  DCB — Formulario de relevamiento de grupos de investigación
 *  Departamento de Ciencias Biológicas · CENUR Litoral Norte · Udelar
 * ============================================================================
 *
 *  QUÉ HACE ESTE ARCHIVO
 *  --------------------
 *  Crea, de una sola vez, un Formulario de Google (en español) para que cada
 *  uno de los 12 grupos de investigación del DCB envíe UNA respuesta con su
 *  información normalizada. Esas respuestas reemplazan los datos despares que
 *  se migraron del viejo sitio Wix y alimentan la página de cada grupo en el
 *  sitio del DCB.
 *
 *  CÓMO USARLO (no hace falta saber programar)
 *  -------------------------------------------
 *   1. Entrar a https://script.google.com con la cuenta de Google que quieran
 *      que quede como DUEÑA del formulario y de las respuestas (idealmente una
 *      cuenta institucional del DCB, no una cuenta personal: quien sea dueño
 *      es quien después puede editar el formulario y ver las respuestas).
 *   2. Hacer clic en "Nuevo proyecto".
 *   3. Borrar todo el contenido del archivo "Código.gs" (o "Code.gs") y pegar
 *      en su lugar TODO este archivo.
 *   4. Guardar con Ctrl+S y ponerle un nombre al proyecto, por ejemplo
 *      "Formulario grupos DCB".
 *   5. En el desplegable de funciones de la barra superior elegir
 *      crearFormularioGrupo y presionar "Ejecutar".
 *   6. La primera vez Google pide autorización:
 *         "Revisar permisos" → elegir la cuenta → "Configuración avanzada" →
 *         "Ir a Formulario grupos DCB (no seguro)" → "Permitir".
 *      Es la advertencia habitual para scripts propios sin verificar por
 *      Google; el script solo crea un formulario en el Drive de esa cuenta.
 *   7. La ejecución demora normalmente entre 1 y 3 minutos (el formulario
 *      tiene ~95 preguntas). Al terminar, mirar el panel "Registro de
 *      ejecución" al pie del editor: ahí quedan impresas la URL de edición y
 *      la URL para responder.
 *
 *  DESPUÉS DE CREARLO
 *  ------------------
 *   - El formulario queda guardado en "Mi unidad" (la raíz del Drive de la
 *     cuenta que ejecutó el script).
 *   - Conviene abrir la URL de edición y, en Configuración → Respuestas,
 *     revisar quién puede responder, y vincular una hoja de cálculo para ver
 *     las respuestas en forma de tabla.
 *   - Cada vez que se ejecuta el script se crea un formulario NUEVO; no
 *     actualiza el anterior. Si algo salió mal, borrar de Drive el formulario
 *     a medio hacer y volver a ejecutar.
 *   - Si la ejecución se cortara por tiempo (Apps Script corta a los 6 minutos
 *     en cuentas gratuitas y a los 30 en cuentas Workspace), no hay forma de
 *     retomar donde quedó: borrar el formulario incompleto y reejecutar.
 *
 *  NOTA SOBRE EL IDIOMA
 *  --------------------
 *  El formulario es íntegramente en español a propósito. La traducción al
 *  inglés del sitio la hace el Departamento por separado; no se le pide a los
 *  grupos ningún texto en inglés.
 */

function crearFormularioGrupo() {

  // ==========================================================================
  //  1. CONSTANTES
  // ==========================================================================

  /**
   * Los 12 grupos, escritos EXACTAMENTE como figuran en el sitio
   * (src/content/groups/*.json → name.es). No cambiar la redacción sin
   * cambiarla también allí: el texto de la opción es la clave que permite
   * emparejar cada respuesta con su archivo JSON.
   */
  var GRUPOS = [
    'Biofisicoquímica',                                   // bfq.json
    'Modelado Molecular, Bioinformática e IA (MMBAI)',    // danslab.json
    'Biomecánica y Análisis del Movimiento (LIBiAM)',     // libiam.json
    'Ecología Fluvial',                                   // ecologiafluvial.json
    'Ecología y Comportamiento de Fauna Silvestre (ECoFauna)', // ecologia-vertebrados.json
    'Genética Molecular Humana',                          // lgmh.json
    'Genómica y Bioinformática',                          // ugb.json
    'Inmunología y Biotecnología (LIB)',                  // inmunologia-biotecnologia.json
    'Investigación y Desarrollo de Moléculas Bioactivas', // moleculas-bioactivas.json
    'Producción y Reproducción de Rumiantes',             // rumiantes.json
    'Virología Molecular',                                // virologiamolec.json
    'Vectores y Enfermedades Transmitidas'                // vyet.json
  ];

  var SEDES = ['Salto', 'Paysandú'];

  var ROLES = ['Responsable', 'Co-responsable', 'Integrante del equipo'];

  /**
   * Patrón de DOI. OJO: en Google Forms la validación "coincide con" exige que
   * la respuesta COMPLETA coincida con el patrón (no alcanza con que lo
   * contenga). Es decir, se acepta  10.1016/j.rbc.2024.100028
   * y se rechaza  https://doi.org/10.1016/j.rbc.2024.100028 — que es
   * justamente lo que queremos: el DOI pelado, uniforme para todos los grupos.
   *
   * Si en la práctica resultara demasiado estricto, alcanza con reemplazar la
   * línea de abajo por esta otra, que además acepta la forma con URL:
   *   var PATRON_DOI = '(https?://(dx\\.)?doi\\.org/)?10\\.\\d{4,9}/.+';
   */
  var PATRON_DOI = '10\\.\\d{4,9}/.+';

  /**
   * Tamaño máximo por archivo subido. La API solo acepta unos pocos valores
   * exactos: 1 MB, 10 MB, 100 MB, 1 GB y 10 GB (expresados en bytes).
   * 10 MB alcanza de sobra para un logo o una foto.
   */
  var MAX_ARCHIVO_BYTES = 10485760; // 10 * 1024 * 1024

  // Contador local de preguntas: se lleva en memoria para no tener que pedirle
  // después la lista de ítems al servidor (una llamada menos a la API).
  var preguntas = 0;

  // ==========================================================================
  //  2. CREACIÓN DEL FORMULARIO Y AJUSTES GENERALES
  // ==========================================================================

  // FormApp.create() fija a la vez el título visible y el nombre del archivo
  // en Drive. Por eso NO llamamos después a setTitle(): si lo hiciéramos, el
  // título y el nombre del archivo quedarían distintos.
  var form = FormApp.create('DCB — Información de los grupos de investigación');

  form.setDescription(
    'Este formulario recoge, de manera uniforme, la información de cada grupo de ' +
    'investigación del Departamento de Ciencias Biológicas (CENUR Litoral Norte, Udelar). ' +
    'Lo que se complete acá pasa directamente a la página del grupo en el sitio web del DCB ' +
    'y reemplaza los datos heredados del sitio anterior.\n\n' +
    'Se espera UNA sola respuesta por grupo. Podés completarlo entre varias personas del ' +
    'grupo y, si te falta algún dato, enviarlo igual y volver a editarlo después con el ' +
    'enlace que aparece al confirmar el envío.\n\n' +
    'Solo unas pocas preguntas son obligatorias (van marcadas con *). El resto se completa ' +
    'únicamente si corresponde: los bloques que queden en blanco simplemente no se publican.\n\n' +
    'La traducción al inglés la hace el Departamento; no hace falta que escribas nada en inglés.\n\n' +
    'Tiempo estimado: 20 a 30 minutos. Consultas: comunicacion del DCB.'
  );

  form.setProgressBar(true);

  // Pide la dirección de quien responde (obliga a iniciar sesión con Google).
  activarRecoleccionDeEmail();

  // Extras opcionales pensados para un formulario largo. Si el Departamento
  // prefiere respuestas cerradas, se pueden borrar estas dos líneas.
  form.setAllowResponseEdits(true); // permite volver y corregir lo enviado
  form.setConfirmationMessage(
    '¡Gracias! Ya recibimos la información del grupo.\n\n' +
    'Guardá el enlace "Editar tu respuesta" que aparece arriba: te sirve para completar o ' +
    'corregir datos más adelante. Ante cualquier duda, escribinos.'
  );

  // NO llamamos a form.setRequireLogin(): esa opción solo existe en cuentas de
  // Google Workspace y lanza un error en cuentas comunes de Gmail. Igual,
  // recolectar el correo ya obliga a iniciar sesión.

  // Dejamos registrada la URL de edición ANTES de armar las preguntas: si la
  // ejecución se cortara por tiempo, el formulario a medio hacer igual queda
  // ubicable desde el registro.
  Logger.log('Formulario creado. URL de edición: ' + form.getEditUrl());

  // ==========================================================================
  //  3. FUNCIONES AUXILIARES
  //  (viven dentro de crearFormularioGrupo() para que el desplegable
  //  "Ejecutar" del editor muestre una sola función y nadie se confunda)
  // ==========================================================================

  /**
   * Activa la recolección del correo de quien responde.
   * setCollectEmail() es la forma clásica y sigue funcionando, pero Google la
   * marcó como obsoleta a favor de setEmailCollectionType(). Probamos una y
   * después la otra para que el script no se caiga con ninguna de las dos
   * versiones de la API.
   * Ojo: el correo recolectado es el de la CUENTA de quien completa, que puede
   * no ser el correo de contacto del grupo; por eso más abajo se pregunta
   * aparte el correo del grupo.
   */
  function activarRecoleccionDeEmail() {
    try {
      form.setCollectEmail(true);
      return;
    } catch (e1) {
      try {
        form.setEmailCollectionType(FormApp.EmailCollectionType.VERIFIED);
        return;
      } catch (e2) {
        Logger.log('AVISO: no se pudo activar la recolección de correo por API (' +
                   e2 + '). Activala a mano en Configuración → Respuestas → ' +
                   'Recopilar direcciones de correo electrónico.');
      }
    }
  }

  /**
   * Pregunta de texto corto.
   * @param {string} titulo       Texto de la pregunta.
   * @param {string} ayuda        Texto de ayuda; si va vacío no se llama a la API.
   * @param {boolean} obligatorio Solo se llama a setRequired() cuando es true,
   *                              porque "no obligatoria" ya es el valor por
   *                              defecto: así ahorramos decenas de llamadas.
   * @param {TextValidation} validacion  Validación opcional ya construida.
   */
  function texto(titulo, ayuda, obligatorio, validacion) {
    var item = form.addTextItem().setTitle(titulo);
    if (ayuda) { item.setHelpText(ayuda); }
    if (obligatorio) { item.setRequired(true); }
    if (validacion) { item.setValidation(validacion); }
    preguntas++;
    return item;
  }

  /** Pregunta de texto largo (párrafo). */
  function parrafo(titulo, ayuda, obligatorio) {
    var item = form.addParagraphTextItem().setTitle(titulo);
    if (ayuda) { item.setHelpText(ayuda); }
    if (obligatorio) { item.setRequired(true); }
    preguntas++;
    return item;
  }

  /**
   * Pregunta desplegable. Se usa desplegable (y no opción múltiple) porque en
   * las preguntas no obligatorias el desplegable se puede volver a dejar en
   * blanco, cosa que con los botones de opción es más engorrosa.
   */
  function lista(titulo, opciones, ayuda, obligatorio) {
    var item = form.addListItem().setTitle(titulo).setChoiceValues(opciones);
    if (ayuda) { item.setHelpText(ayuda); }
    if (obligatorio) { item.setRequired(true); }
    preguntas++;
    return item;
  }

  /** Salto de página: cada uno abre una sección nueva del formulario. */
  function seccion(titulo, ayuda) {
    var item = form.addPageBreakItem().setTitle(titulo);
    if (ayuda) { item.setHelpText(ayuda); }
    return item;
  }

  /**
   * Pregunta de subida de archivo, restringida a imágenes.
   *
   * LIMITACIONES IMPORTANTES DE LAS PREGUNTAS DE ARCHIVO:
   *  - El formulario tiene que estar guardado en Google Drive (lo está: lo
   *    crea FormApp.create() en "Mi unidad") y quien responde TIENE que estar
   *    con sesión iniciada en una cuenta de Google. Forms lo exige solo; no es
   *    algo que se pueda desactivar.
   *  - Los archivos subidos se guardan en una carpeta del Drive de la cuenta
   *    DUEÑA del formulario y ocupan su cuota de almacenamiento.
   *  - Si la cuenta dueña es de Google Workspace, puede que, por configuración
   *    de la organización, las personas de afuera de esa organización no
   *    puedan subir archivos. Se ajusta en la configuración del formulario.
   *  - Por eso todo esto va dentro de un try/catch: si Google rechaza la
   *    pregunta de archivo, se registra el aviso y el resto del formulario se
   *    crea igual (los grupos pueden mandar el logo por correo).
   */
  function subidaDeImagen(titulo, ayuda) {
    try {
      var item = form.addFileUploadItem()
        .setTitle(titulo)
        .setHelpText(ayuda)
        .setAllowedFileTypes([FormApp.FileType.IMAGE])
        .setMaxFiles(1)                      // valores admitidos: 1, 5 o 10
        .setMaxFileSize(MAX_ARCHIVO_BYTES);  // ver comentario de la constante
      preguntas++;
      return item;
    } catch (e) {
      Logger.log('AVISO: no se pudo crear la pregunta de archivo "' + titulo +
                 '": ' + e + '. Revisá esa pregunta a mano en el formulario ' +
                 'o pedile el archivo al grupo por correo.');
      return null;
    }
  }

  /** Bloque de una línea de investigación (3 preguntas). */
  function bloqueLinea(n) {
    var primera = (n === 1); // la Línea 1 es la única obligatoria

    texto('Línea ' + n + ' — título',
      primera ? 'Título corto, de pocas palabras. Ej.: Transporte a través de biomembranas.' : '',
      primera);

    parrafo('Línea ' + n + ' — descripción (1–2 oraciones)',
      primera ? 'Ej.: Farmacogenética de la Leucemia Linfoblástica Aguda pediátrica y de los ' +
                'inhibidores de la recaptación de serotonina (ISRS).' : '',
      primera);

    texto('Línea ' + n + ' — instituciones involucradas',
      primera
        ? 'Separadas por punto y coma. Ej.: Facultad de Medicina, Udelar; Institut Pasteur de ' +
          'Montevideo; INIA. Si la línea la lleva adelante solo el DCB, escribí: solo DCB.'
        : 'Separadas por punto y coma. Dejar en blanco si no corresponde.',
      primera);
  }

  /** Bloque de un proyecto en curso (4 preguntas). */
  function bloqueProyecto(n) {
    var primero = (n === 1); // el Proyecto 1 es el único obligatorio

    texto('Proyecto ' + n + ' — título',
      primero ? 'Título del proyecto tal como figura en la resolución o el llamado.' : '',
      primero);

    texto('Proyecto ' + n + ' — financiador o programa',
      primero ? 'Ej.: CSIC (Udelar), Proyectos I+D. Otros habituales: ANII, PEDECIBA, ' +
                'CAPES/AUGM, Espacio Interdisciplinario.' : '',
      primero);

    texto('Proyecto ' + n + ' — período',
      'Ej.: 2023–2026. Si todavía no tiene fecha de cierre, escribí solo el año de inicio ' +
      '(ej.: desde 2024).',
      primero);

    lista('Proyecto ' + n + ' — rol del grupo', ROLES,
      primero ? 'Rol del grupo del DCB dentro del proyecto (no el de la persona).' : '',
      primero);
  }

  /** Bloque de un colaborador o colaboradora (4 preguntas, ninguna obligatoria). */
  function bloqueColaborador(n) {
    var primero = (n === 1); // los ejemplos van solo en el primer bloque

    texto('Colaborador/a ' + n + ' — nombre',
      primero ? 'Ej.: Dra. Paola Panizza.' : '');

    texto('Colaborador/a ' + n + ' — institución',
      primero ? 'Ej.: Facultad de Química, Universidad de la República.' : '');

    texto('Colaborador/a ' + n + ' — país',
      primero ? 'Ej.: Uruguay.' : '');

    texto('Colaborador/a ' + n + ' — tema de colaboración',
      primero ? 'Ej.: Diseño in silico de transaminasas y fluorinasas.' : '');
  }

  // ==========================================================================
  //  4. VALIDACIONES REUTILIZABLES
  //  Se construyen una sola vez y se reutilizan en varias preguntas.
  //  El setHelpText() de una validación es el mensaje de ERROR que ve quien
  //  responde cuando lo que escribió no pasa la validación.
  // ==========================================================================

  var validacionEmail = FormApp.createTextValidation()
    .setHelpText('Escribí una dirección de correo válida, por ejemplo grupo@cup.edu.uy')
    .requireTextIsEmail()
    .build();

  var validacionDoi = FormApp.createTextValidation()
    .setHelpText('Escribí solamente el DOI, sin https://doi.org/ ni doi: adelante y sin ' +
                 'espacios al principio. Ejemplo válido: 10.1016/j.rbc.2024.100028')
    .requireTextMatchesPattern(PATRON_DOI)
    .build();

  var validacionUrl = FormApp.createTextValidation()
    .setHelpText('Escribí la dirección completa, empezando por https:// ' +
                 '(ejemplo: https://www.danslab.xyz)')
    .requireTextIsUrl()
    .build();

  // Las validaciones NO se aplican a las preguntas que quedan vacías: si una
  // pregunta no es obligatoria y se deja en blanco, Forms la da por buena.
  // Por eso podemos poner la validación de DOI en las 10 publicaciones aunque
  // solo la primera sea obligatoria.

  // ==========================================================================
  //  5. SECCIÓN 1 — IDENTIFICACIÓN
  //  Va en la primera página, junto al título y la descripción del formulario
  //  (así se evita una primera página vacía).
  // ==========================================================================

  form.addSectionHeaderItem()
    .setTitle('1. Identificación')
    .setHelpText('Se espera una sola respuesta por grupo. Si la completan entre varias ' +
                 'personas, poné los datos de quien coordina el envío.');

  lista('Grupo de investigación', GRUPOS,
    'Elegí el grupo al que corresponde esta respuesta.',
    true);

  texto('Nombre de quien responde',
    'Nombre y apellido de la persona que completa el formulario, por si necesitamos ' +
    'consultarte algo.',
    true);

  texto('Correo electrónico de contacto del grupo',
    'Es el correo que se va a publicar en la página del grupo. Puede ser distinto del ' +
    'correo personal con el que estás completando este formulario.',
    true, validacionEmail);

  lista('Sede', SEDES,
    'Sede principal del grupo. Si el grupo trabaja en las dos, elegí la sede de referencia.',
    true);

  // ==========================================================================
  //  6. SECCIÓN 2 — RESUMEN
  // ==========================================================================

  seccion('2. Resumen',
    'Un párrafo breve que presenta al grupo.');

  parrafo('Resumen del grupo',
    'Máximo 50 palabras. Es el texto corto que aparece en la tarjeta del grupo y al ' +
    'comienzo de su página, así que conviene que se entienda sin conocer el tema.\n\n' +
    'Ejemplo (37 palabras): Integrado por el Laboratorio de Biomembranas y el Laboratorio ' +
    'de Radiobiología Médica y Ambiental. Estudia el transporte de sustancias a través de ' +
    'membranas biológicas y las respuestas biológicas al daño genómico inducido por agentes ' +
    'físicos y químicos.',
    true);

  // Google Forms no sabe contar palabras: el límite de 50 va solo como
  // indicación. Si algún día se quisiera imponerlo por las malas, se puede
  // agregar a la pregunta de arriba una validación de largo, por ejemplo:
  //   .setValidation(FormApp.createParagraphTextValidation()
  //      .requireTextLengthLessThanOrEqualTo(400).build())
  // (50 palabras en español rondan los 350–400 caracteres). No se hace por
  // defecto para no rechazar resúmenes correctos con términos técnicos largos.

  // ==========================================================================
  //  7. SECCIÓN 3 — LÍNEAS DE INVESTIGACIÓN
  // ==========================================================================

  seccion('3. Líneas de investigación',
    'Primero un panorama general y después hasta 5 líneas específicas. Completá solo las ' +
    'que correspondan: la Línea 1 es obligatoria y las líneas 2 a 5 son opcionales. Los ' +
    'bloques que queden en blanco no se publican.');

  parrafo('Panorama general de la investigación del grupo',
    'Máximo 100 palabras. Es el texto que encabeza la sección de investigación de la página ' +
    'del grupo: qué estudia el grupo en conjunto, con qué enfoque y para qué. Las líneas ' +
    'específicas van una por una más abajo, así que acá no hace falta detallarlas.',
    true);

  for (var l = 1; l <= 5; l++) {
    bloqueLinea(l);
  }

  // ==========================================================================
  //  8. SECCIÓN 4 — PUBLICACIONES
  // ==========================================================================

  seccion('4. Publicaciones',
    'Hasta 10 publicaciones elegidas por el grupo: las que quieran destacar en su página, ' +
    'no la lista completa.\n\n' +
    'Se pide SOLAMENTE el DOI. La cita completa se genera automáticamente a partir de él, ' +
    'en formato Vancouver, de modo que todas las páginas del sitio queden con el mismo ' +
    'formato y sin erratas. Solo la primera publicación es obligatoria.');

  for (var p = 1; p <= 10; p++) {
    texto('DOI publicación ' + p,
      (p === 1)
        ? 'Solo el DOI, sin https://doi.org/ adelante. Ejemplo: 10.1016/j.rbc.2024.100028'
        : '',
      (p === 1),
      validacionDoi);
  }

  parrafo('Publicaciones sin DOI (libros, capítulos, en prensa)',
    'Opcional, y solo para lo que no tiene DOI. Una por línea, escrita en formato Vancouver.\n\n' +
    'Ejemplos:\n' +
    'Fernández Abella D. Biotecnologías reproductivas bovinas y ovinas. Montevideo; 2015.\n' +
    'Félix ML, Muñoz-Leal S, Carvalho LA, Queirolo D, Remesar S, Armúa-Fernández MT, et al. ' +
    'Characterization of Candidatus Ehrlichia pampeana in Haemaphysalis juxtakochi ticks. ' +
    'Microorganisms. [Aceptado, en prensa].');

  // ==========================================================================
  //  9. SECCIÓN 5 — PROYECTOS EN CURSO
  // ==========================================================================

  seccion('5. Proyectos en curso',
    'Hasta 5 proyectos vigentes. Solo el Proyecto 1 es obligatorio; dejá en blanco los ' +
    'bloques que no uses. Si el grupo no tiene proyectos vigentes, poné "Sin proyectos ' +
    'vigentes" en el título del Proyecto 1.');

  for (var pr = 1; pr <= 5; pr++) {
    bloqueProyecto(pr);
  }

  // ==========================================================================
  //  10. SECCIÓN 6 — COLABORADORES
  // ==========================================================================

  seccion('6. Colaboradores',
    'Hasta 8 colaboradores o colaboradoras de fuera del grupo, con quienes haya trabajo ' +
    'conjunto en curso. Si la colaboración es con una institución y no con una persona en ' +
    'particular, poné el nombre de la institución en el campo "nombre".\n\n' +
    'Ninguna pregunta de esta sección es obligatoria: completá los bloques que correspondan ' +
    'y dejá el resto en blanco.');

  for (var c = 1; c <= 8; c++) {
    bloqueColaborador(c);
  }

  // ==========================================================================
  //  11. SECCIÓN 7 — DOCENCIA
  // ==========================================================================

  seccion('7. Docencia',
    'Hasta 12 cursos en total entre los tres niveles. Cada nivel tiene su recuadro; el sitio ' +
    'los muestra agrupados en Grado, Posgrado y Otras.');

  parrafo('Cursos de grado',
    'Un curso por línea, indicando la carrera o programa.\n' +
    'Ej.: Biofísica. Ciclo Biología-Bioquímica');

  parrafo('Cursos de posgrado',
    'Un curso por línea, indicando la carrera o programa.\n' +
    'Ej.: Curso PEDECIBA: Daño genómico por agentes físicos. Aplicaciones y herramientas ' +
    'para su estudio');

  parrafo('Otras instancias (pasantías, educación permanente)',
    'Un curso o instancia por línea, indicando la carrera o programa.\n' +
    'Ej.: Pasantías de 4to año, Profesorado de Biología, CeRP Salto');

  // ==========================================================================
  //  12. SECCIÓN 8 — EXTENSIÓN
  //  Las cinco categorías son exactamente las que usa la sección Extensión del
  //  sitio (src/messages/es.json → kind_medios, kind_educativo, kind_comunidad,
  //  kind_eventos, kind_arte).
  // ==========================================================================

  seccion('8. Extensión',
    'Hasta 8 actividades en total entre las cinco categorías. Son las mismas categorías con ' +
    'las que el sitio ordena la sección Extensión; poné cada actividad en la que mejor le ' +
    'calce y dejá vacías las que no correspondan.');

  parrafo('Medios y divulgación',
    'Una actividad por línea.\n' +
    'Ej.: "En qué nos metimos": ciclo de entrevistas a investigadores del DCB en Radio La Regional');

  parrafo('Trabajo con centros educativos',
    'Una actividad por línea.\n' +
    'Ej.: Científicos en el aula');

  parrafo('Comunidad y territorio',
    'Una actividad por línea.\n' +
    'Ej.: Charlas con mujeres rurales, en el marco de un proyecto sobre cáncer y exposición ' +
    'ambiental a agroquímicos');

  parrafo('Ferias, congresos y jornadas',
    'Una actividad por línea.\n' +
    'Ej.: Comité organizador del VI Congreso Internacional de Educación en Ciencias Básicas, ' +
    'CENUR Litoral Norte');

  parrafo('Arte y ciencia',
    'Una actividad por línea.\n' +
    'Ej.: Sonificación molecular: traducción de la dinámica molecular del ADN en música, en ' +
    'colaboración con el compositor Nicolás Molla');

  // ==========================================================================
  //  13. SECCIÓN 9 — OPCIONALES
  // ==========================================================================

  seccion('9. Opcionales',
    'Todo lo de esta sección es opcional. Para poder subir archivos, Google exige tener la ' +
    'sesión iniciada en una cuenta de Google; si no podés, mandanos el archivo por correo y ' +
    'lo subimos nosotros.');

  subidaDeImagen('Logo del grupo',
    'Solo si el grupo tiene un logo propio, distinto del logo del DCB. Preferentemente PNG ' +
    'con fondo transparente y al menos 600 píxeles de ancho. Máximo 10 MB.');

  texto('Sitio web propio del grupo',
    'Solo si el grupo tiene un sitio propio, aparte de su página en el sitio del DCB. ' +
    'Ej.: https://www.danslab.xyz',
    false, validacionUrl);

  subidaDeImagen('Foto representativa del grupo',
    'Una foto horizontal que represente al grupo: el equipo, el laboratorio o el trabajo de ' +
    'campo. Cuanto más grande mejor (al menos 1600 píxeles de ancho). Máximo 10 MB. ' +
    'Asegurate de contar con el consentimiento de las personas que aparecen.');

  // ==========================================================================
  //  14. RESULTADO
  //  Todo esto queda en el panel "Registro de ejecución" del editor.
  // ==========================================================================

  Logger.log('=====================================================');
  Logger.log('Formulario creado correctamente.');
  Logger.log('Preguntas: ' + preguntas + ' (sin contar los títulos de sección).');
  Logger.log('Queda guardado en "Mi unidad" del Drive de esta cuenta.');
  Logger.log('-----------------------------------------------------');
  Logger.log('URL DE EDICIÓN (para vos): ' + form.getEditUrl());
  Logger.log('URL PARA RESPONDER (para enviar a los grupos): ' + form.getPublishedUrl());

  // La URL corta (forms.gle/...) es cómoda para pegar en un correo. Va última y
  // dentro de un try/catch para que un fallo acá no tape los enlaces de arriba.
  try {
    Logger.log('URL CORTA: ' + form.shortenFormUrl(form.getPublishedUrl()));
  } catch (e) {
    Logger.log('(No se pudo generar la URL corta: ' + e + '. Usá la URL para responder.)');
  }
  Logger.log('=====================================================');
}
