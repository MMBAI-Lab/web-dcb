# DCB · Departamento de Ciencias Biológicas

Sitio web estático del **Departamento de Ciencias Biológicas (DCB)**, CENUR
Litoral Norte, Universidad de la República, Uruguay.

Reemplaza el sitio anterior en Wix
([pdans2.wixsite.com/my-site](https://pdans2.wixsite.com/my-site)) por un
sitio estático moderno, bilingüe (ES/EN) y con tema claro/oscuro, mantenible
como código.

- **Repositorio:** https://github.com/MMBAI-Lab/web-dcb
- **Organización:** [MMBAI-Lab](https://github.com/MMBAI-Lab) (DansLab)
- **Contacto técnico:** Pablo D. Dans — pablo.d.dans@gmail.com

## Stack técnico

| Área          | Tecnología                                              |
| ------------- | -------------------------------------------------------- |
| Framework     | [Next.js 15](https://nextjs.org) (App Router, `output: export`) |
| Lenguaje      | TypeScript                                                |
| Estilos       | Tailwind CSS v4                                           |
| Animación     | [Framer Motion](https://motion.dev)                       |
| i18n          | [next-intl](https://next-intl.dev) — `es` (default) / `en` |
| Tema          | [next-themes](https://github.com/pacocoursey/next-themes) — claro / oscuro |
| Hosting       | GitHub Pages (export estático, sin servidor)              |

El sitio se compila 100% a HTML/CSS/JS estático (`next build` con
`output: "export"`) — no requiere Node en producción, ideal para GitHub
Pages o cualquier hosting estático.

## Estructura del proyecto

```
src/
  app/
    layout.tsx            # Root layout: <html>/<body>, fuentes, ThemeProvider
    page.tsx               # Redirect "/" -> "/es/" (idioma por defecto; EN se elige a mano en el nav)
    [locale]/
      layout.tsx            # Layout localizado: NextIntlClientProvider, Header, Footer
      page.tsx              # Home (hero + cifras + tarjetas de navegación)
      institucional/page.tsx
      investigacion/page.tsx
      investigacion/[slug]/page.tsx   # Una página por grupo (las "pending" dicen "en preparación")
      investigacion/asociados/page.tsx # Integrantes del DCB sin grupo
      ensenanza/page.tsx
      extension/page.tsx
      reconocimientos/page.tsx
      contacto/page.tsx      # Una página real por solapa, no un scroll único con todo mezclado
    globals.css             # Tailwind + paleta de marca (teal/crimson/gold del logo del DCB)
  components/
    layout/                 # Header (nav real + banda tricolor), Footer
    pages/                   # Cuerpo de cada página: Home, Institucional, Investigacion, Ensenanza, Extension, Reconocimientos, Contacto
    ui/                      # Primitivas visuales: PageBanner, Reveal (animación al hacer scroll)
    theme-provider.tsx, theme-toggle.tsx, language-switcher.tsx, html-lang-sync.tsx
  i18n/
    routing.ts               # Locales soportados, locale por defecto
    navigation.ts             # Link/usePathname/useRouter conscientes del locale
    request.ts                # Config de next-intl (carga de mensajes)
  messages/
    es.json, en.json          # Todo el copy del sitio, por idioma y por página
  lib/
    asset.ts                  # Helper para anteponer NEXT_PUBLIC_BASE_PATH a imágenes estáticas

data/
  old/                       # Volcado del sitio Wix anterior (HTML, imágenes, texto extraído)
                              # NO está en git (~170MB, ver .gitignore) — vive solo en local
                              # como material de referencia mientras se completa el sitio nuevo
    html/                     # HTML crudo descargado por página
    images/                   # Imágenes (logos, fotos) descargadas
    content/                  # Texto extraído por página, en Markdown
    SUMMARY.md                # Qué se pudo rescatar y qué falta revisar a mano
  censo_oct26/               # Respuestas de los formularios de octubre 2026 + fotos de Drive
                              # NO está en git (emails y CVs personales)

public/
  images/
    logos/, photos/, staff/    # Activos finales ya curados, listos para usar en el sitio
  .nojekyll                   # Evita que GitHub Pages ignore carpetas con "_" (ej. _next)

.github/workflows/deploy.yml # CI: build estático + deploy a GitHub Pages
```

## Idiomas

- Español (`es`) es el idioma por defecto; inglés (`en`, inglés académico
  americano) es el segundo idioma.
- Las rutas siempre llevan prefijo de idioma: `/es/...` y `/en/...`.
- `/` no renderiza contenido: redirige siempre a `/es/` en el cliente (el
  export estático no soporta middleware). El cambio a inglés es una acción
  explícita del usuario, con el botón EN/ES del header.
- Todo el copy vive en `src/messages/es.json` y `src/messages/en.json`. Al
  agregar una sección nueva, agregar la clave en **ambos** archivos.

## Tema claro / oscuro

Se usa `next-themes` con `attribute="class"` y una variante personalizada de
Tailwind (`@custom-variant dark`) en `globals.css`. La paleta usa los tres
colores del logo del DCB (teal, crimson, gold) como variables CSS en
`:root` / `.dark`, expuestas a Tailwind vía `@theme inline`.

## Migración de contenido desde el sitio anterior (Wix)

El sitio anterior (`data/old/`) se usa como fuente de texto e imágenes para
completar las secciones que hoy están marcadas como pendientes
(Investigación, Docencia, Personal, datos de contacto reales). Ver
`data/old/SUMMARY.md` para el detalle de qué se logró extraer
automáticamente y qué requiere copiar/verificar a mano (los sitios Wix
renderizan gran parte del contenido con JavaScript, por lo que el rescate
automático es parcial).

**La sección "Noticias" del sitio anterior no se migra** — se decidió
descontinuarla en el sitio nuevo.

## Desarrollo local

```bash
npm install
npm run dev       # http://localhost:3000 (redirige a /es)
npm run build     # genera el sitio estático en out/
npm run lint
```

## Deploy

El deploy es automático vía GitHub Actions (`.github/workflows/deploy.yml`)
en cada push a `main`: build estático (`next build`) + publicación a GitHub
Pages con `actions/deploy-pages`.

Como el repo se publica en `MMBAI-Lab/web-dcb` (página de proyecto, no de
organización), el build de CI fija `NEXT_PUBLIC_BASE_PATH=/web-dcb` para que
los assets resuelvan bajo `MMBAI-Lab.github.io/web-dcb/`. Si en el futuro se
usa un dominio propio (agregando un archivo `public/CNAME`), quitar esa
variable de entorno del workflow.

Pasos para habilitar Pages en el repo (una sola vez, en GitHub):
1. Settings → Pages → Source: **GitHub Actions**.
2. Hacer push a `main` (o disparar el workflow manualmente).

## Migración al servidor del CENUR (planificada)

El sitio deja GitHub Pages y pasa a un servidor Linux del CENUR Litoral
Norte, con su dominio propio: **https://dcb.litoralnorte.udelar.edu.uy**.
GitHub sigue siendo la fuente del código; el servidor solo sirve los
archivos estáticos de `out/` (no necesita Node para eso).

### 0. Espejo en el GitLab del Interior

El repo también vive en el GitLab de la Red de Unidades Informáticas del
Interior: `git@git.interior.edu.uy:pdans/web-dcb.git` (web:
https://git.interior.edu.uy; ojo, *no* `git.interior.udelar.edu.uy`, que no
existe). Ambos repos se mantienen iguales con un `origin` de push doble,
configurado una vez en cada máquina desde la que se hace push:

```bash
git remote set-url --add --push origin https://github.com/MMBAI-Lab/web-dcb.git
git remote set-url --add --push origin git@git.interior.edu.uy:pdans/web-dcb.git
git remote add cenur git@git.interior.edu.uy:pdans/web-dcb.git   # para consultarlo aparte
```

Así `git push` sube a los dos; `git pull` sigue bajando de GitHub. Requiere
la clave SSH de la máquina cargada en GitLab (Preferences → SSH Keys). El
servidor del CENUR puede tomar el código de este GitLab en el paso 3.

### 1. Relevar el servidor

Antes de tocar nada, averiguar en el servidor:

```bash
cat /etc/os-release                      # distribución y versión
nginx -v; apache2 -v; httpd -v           # qué servidor web hay (alguno fallará)
ls /etc/nginx/sites-enabled /etc/apache2/sites-enabled 2>/dev/null
node -v; git --version                   # opcionales
curl -sI https://graph.instagram.com | head -1     # ¿sale a internet?
curl -sI https://www.youtube.com | head -1
ls /etc/letsencrypt/live 2>/dev/null     # ¿certificado HTTPS existente?
```

Y con el área de informática del CENUR: si GitHub Actions puede entrar por
SSH al servidor desde afuera (define el paso 3), en qué carpeta se publica
el sitio y con qué usuario.

### 2. Cambios en el repositorio

- [ ] Quitar `NEXT_PUBLIC_BASE_PATH: /web-dcb` de
      `.github/workflows/deploy.yml`: en el dominio propio el sitio vive en
      la raíz.
- [ ] Reemplazar los pasos de GitHub Pages del workflow por el deploy al
      servidor (paso 3) y desactivar Pages en Settings → Pages.
- [ ] Actualizar en este README las menciones a GitHub Pages y a
      `MMBAI-Lab.github.io/web-dcb`.

### 3. Cómo llega el sitio al servidor

Según lo que permita la red del CENUR:

- **Si GitHub puede entrar por SSH (preferido):** el workflow compila y
  copia `out/` con `rsync` en cada push a `main`. Requiere una clave
  SSH de deploy (solo para ese usuario y esa carpeta) guardada como secreto
  del repositorio.
- **Si no se puede entrar desde afuera:** el workflow publica `out/`
  compilado en una rama (p. ej. `deploy`) y un `cron` del servidor hace
  `git pull` de esa rama cada pocos minutos. Tampoco requiere Node en el
  servidor.

### 4. Configuración del servidor web

- [ ] Raíz del sitio apuntando a la carpeta donde queda `out/`.
- [ ] Redirección `/` → `/es/` en el servidor (hoy la hace el navegador
      en `src/app/page.tsx`, porque Pages no permite redirecciones).
- [ ] URLs con barra final (`trailingSlash: true` en `next.config.ts`):
      `/es/contacto` debe redirigir a `/es/contacto/`.
- [ ] Página de error: `out/404.html`.
- [ ] HTTPS (Let's Encrypt si no hay certificado) y redirección de HTTP a
      HTTPS.
- [ ] Cache largo para `/_next/static/` (los nombres de archivo cambian en
      cada build) y corto para el HTML.
- [ ] Redirigir las URLs conocidas del sitio de Wix a sus equivalentes
      nuevas, si había enlaces externos a ellas.

Ejemplo para nginx (ajustar rutas):

```nginx
server {
    server_name dcb.litoralnorte.udelar.edu.uy;
    root /var/www/dcb;               # contenido de out/
    error_page 404 /404.html;

    location = / { return 302 /es/; }
    location /_next/static/ { expires 1y; add_header Cache-Control "public, immutable"; }
    location / { try_files $uri $uri/ $uri.html =404; }
}
```

### 5. Después de la migración: Noticias (Instagram) y Videos (YouTube)

Con el servidor propio, ambas se resuelven sin recompilar el sitio: un
`cron` del servidor baja los datos a una carpeta pública
(`/datos/noticias.json`, `/datos/videos.json` e imágenes) y las páginas
Noticias y Videos los leen al abrirse.

- **Videos:** el canal de YouTube publica la lista de sus últimos 15 videos
  sin clave; el cron va acumulando los nuevos. Para traer el historial
  completo una vez, usar una clave gratuita de la YouTube Data API.
  Necesario: el link del canal.
- **Noticias:** la cuenta de Instagram del DCB tiene que ser *profesional*
  (Empresa o Creador) y hace falta una app en developers.facebook.com con
  "Instagram API con inicio de sesión de Instagram" y su token. El token
  vence a los 60 días: el cron lo renueva y lo guarda en un archivo del
  servidor, fuera de la carpeta pública. Las imágenes se descargan porque
  los links de Instagram vencen.
- Ambas requieren que el servidor pueda salir a internet (paso 1).

## Próximos pasos

- [x] Completar `about`, `research`, `teaching`, `staff`, `contact` en
      `src/messages/{es,en}.json` con datos reales extraídos del sitio
      anterior (historia institucional, 12 grupos de investigación,
      Comisión Directiva, CBB, direcciones de Salto y Paysandú).
- [x] Curar el logo del DCB y los logos de UdelaR/CENUR en
      `public/images/logos/` y usarlos en el Header/Footer.
- [ ] Revisar `data/old/SUMMARY.md` y resolver los puntos marcados como
      "needs manual review" (páginas `copy-of-*` duplicadas, formulario de
      contacto, formato de las páginas por grupo).
- [x] Publicar, por grupo de investigación, la nómina completa de
      integrantes con fotos (censo de octubre 2026, ver abajo).
- [ ] Reemplazar el email de contacto de ejemplo (`dcb@cenur.edu.uy`) por
      uno real, y decidir cómo reemplazar el formulario de contacto de Wix
      (mailto, Formspree, u otro).
- [ ] Optimizar/recortar las imágenes grandes de `data/old/images/` antes
      de promoverlas a `public/images/` (el logo del DCB pesa ~430 KB).
- [x] Crear el repositorio `MMBAI-Lab/web-dcb` en GitHub y hacer el primer
      push (el remote `origin` ya está configurado localmente).

### Censo de octubre 2026

Los grupos y sus integrantes completaron dos formularios de Google
(generados con `scripts/forms/`). Las respuestas y las fotos subidas viven en
`data/censo_oct26*/` (fuera de git); cada exportación es un superconjunto de
la anterior y el script usa la más reciente (`censo_oct26_extension_2`, de
noviembre). Si una exportación trae un solo formulario o le faltan fotos, lo
que falta se toma de la exportación anterior más nueva. Se vuelcan al sitio con:

```bash
node scripts/import-censo-oct26.js --dry-run   # reporte, sin escribir
node scripts/import-censo-oct26.js             # JSONs + fotos
node scripts/resolve-dois.js                   # citas Vancouver de los DOI nuevos
```

El formulario manda en todo campo que el grupo respondió; un campo vacío o
con relleno ("x", "NNN", "FALTA DESCRIPCION") conserva lo que había. Quienes
no completaron su ficha siguen en la nómina tal como estaban. Las decisiones
editoriales (nombres, cargos, qué foto es de quién, recortes) son tablas
explícitas dentro del script, igual que las bajas (`DEPARTED`), para que
reimportar nunca devuelva a nadie que se fue, y las correcciones que los
grupos mandan después por mail (`AMENDMENTS`: altas, cursos, proyectos,
publicaciones), que se aplican sobre los formularios en cada corrida.
Quedó pendiente:

- [ ] **Anatomía** no completó ningún formulario: su página dice "en
      preparación" y todavía no tiene mail de contacto.
- [ ] **Genética Molecular Humana** no envió el formulario de grupo:
      conserva el contenido anterior (sus integrantes sí se actualizaron).
- [ ] **Biofisicoquímica** envió el formulario a medio completar: tres
      líneas sin descripción y proyectos, colaboradores y cursos con texto de
      relleno (se conservaron los anteriores).
- [ ] Líneas sin descripción también en **Rumiantes** (3) e **Inmunología y
      Biotecnología** (2).
- [ ] **Ecología Fluvial** cargó dos veces el DOI del libro *Rivers of South
      America* (10.1016/C2020-0-00035-6); probablemente eran dos capítulos
      con DOI propio.
- [ ] Superan el tope de palabras: resumen de **Virología** (58/50) y de
      **Vectores y Enfermedades Transmitidas** (52/50), panorama de
      **Virología** (105/100) e **Histología** (266/100).
- [ ] 7 integrantes no completaron la ficha (el `--dry-run` los lista con
      "sin ficha de integrante"), entre ellos Peluffo y Keszenman
      (Biofisicoquímica) y Hernández Russo (Rumiantes).
- [ ] Todo el texto nuevo está solo en español: correr
      `node scripts/report-missing-translations.js` para la pasada de inglés.

### Presentación del censo

`scripts/presentacion/` arma una presentación (.pptx) con las cifras del
censo, con los colores y el logo del DCB. Lee el mismo contenido que publica
el sitio, más una lista de género revisada a mano (el formulario no lo
preguntaba), que vive fuera de git:

```bash
cd scripts/presentacion && npm install && cd ../..   # pptxgenjs, solo para esto
node scripts/presentacion/proponer-genero.js         # propone data/presentacion/genero.csv
# revisar y corregir el CSV (columna genero: F, M o ?)
npm run build                                        # los totales de cursos salen de out/
node scripts/presentacion/generar.js                 # data/presentacion/DCB-censo-2026.pptx
```

### Pendiente en la solapa Enseñanza

La solapa se genera a partir de los JSON de cada grupo
(`src/content/groups/*.json`): `teaching[]` alimenta **Docencia** y la tesis
de cada integrante (`thesis`, o en su defecto palabras clave del título)
alimenta **Formación** vía `src/lib/formacion.ts`. Editar un grupo alcanza
para actualizar la solapa.

Un mismo curso lo cargan varios grupos con nombres distintos; Docencia lo
muestra una sola vez gracias al catálogo de `src/content/courses.ts` (nombre
canónico + expresión que reconoce cada variante). Si un curso aparece
repetido, ampliar su `match` ahí.

La página **Integrantes** (`/integrantes`, enlazada desde la cifra de la
home) clasifica a cada persona con las reglas de `src/lib/integrantes.ts`;
los casos que esas reglas resuelven mal van en su tabla `OVERRIDES`.

Queda pendiente:

- [ ] **Licenciatura en Biotecnología**: su tarjeta es más liviana que la
      del CBB porque falta su currícula, créditos y equipo de coordinación.
      Sumarlos a `ensenanza.biotec*` en `src/messages/{es,en}.json` para
      equipararla al CBB.
