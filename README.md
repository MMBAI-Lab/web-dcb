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
- [ ] Publicar, por grupo de investigación, la nómina completa de
      integrantes con fotos (material ya disponible en `data/old/`).
- [ ] Reemplazar el email de contacto de ejemplo (`dcb@cenur.edu.uy`) por
      uno real, y decidir cómo reemplazar el formulario de contacto de Wix
      (mailto, Formspree, u otro).
- [ ] Optimizar/recortar las imágenes grandes de `data/old/images/` antes
      de promoverlas a `public/images/` (el logo del DCB pesa ~430 KB).
- [ ] Crear el repositorio `MMBAI-Lab/web-dcb` en GitHub y hacer el primer
      push (el remote `origin` ya está configurado localmente).
