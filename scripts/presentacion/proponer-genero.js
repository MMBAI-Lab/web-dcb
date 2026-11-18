// Writes data/presentacion/genero.csv: one row per person with a proposed
// gender (F/M) and the reason, for a human to review. The census did not ask
// for gender; nothing here is published, and the presentation reads only the
// reviewed file.
const fs = require("fs");
const path = require("path");
const { ROOT, loadPeople } = require("./personas");

const OUT = path.join(ROOT, "data", "presentacion", "genero.csv");
const fold = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const F_TITLE = /\b(Dra\.|Profesora|Becaria|Investigadora|Doctoranda|Maestranda|Docente asociada|Docente Libre Honoraria|Contratada|Encargada|Responsable .*\(Investigadora)/;
const M_TITLE = /\b(Dr\.(?! en C)|Profesor\b|Becario|Investigador\b|Doctorando|Maestrando|Contratado|Encargado)/;

// Common first names that the "-a" rule gets wrong or misses.
const MALE = new Set("alejo andres artur carlo diego elias elis fernando german guzman ignacio ivan jose juan julio leandro lucas marcos mateo matias mathias mauricio mauro manuel oscar pablo rafael ricardo richard rodney rodrigo santiago sebastian victor christian gonzalo joaquin luis gaston wiston".split(" "));
const FEMALE = new Set("celeste rachel pilar ines luz denisse christine deborah lia elsa cintya zully nelida".split(" "));

function propose(p) {
  // Only the person's own position: drop advisors/directors named in it.
  const own = (p.title ?? "").replace(/([^)]*)/g, "").replace(/(dirigid|co-dirigid|orientad|orientación|tutor).*$/i, "");
  const text = `${p.name} ${own}`;
  if (/^Dra\./.test(p.name)) return ["F", "Dra."];
  if (/^Dr\./.test(p.name)) return ["M", "Dr."];
  const f = F_TITLE.exec(text);
  const m = M_TITLE.exec(text);
  if (f && !m) return ["F", f[1]];
  if (m && !f) return ["M", m[1]];
  const first = fold(p.name.replace(/^((Prof\.|Dr\.|Dra\.|Lic\.|MSc\.|Mag\.|M\.V\.|Q\.F\.|Quím\.|BQ\.|Bach\.|Br\.|Tec\.|Ing\.|Agr\.|Elec\.|DCV|DMTV\.|PhD\.|Lic \(candidate\)\.|en C\.)\s*)+/, "").split(/\s+/)[0]);
  if (MALE.has(first)) return ["M", `nombre "${first}"`];
  if (FEMALE.has(first) || /a$/.test(first)) return ["F", `nombre "${first}"`];
  return ["?", `nombre "${first}" (completar)`];
}

const rows = loadPeople()
  .map((p) => [p.name, ...propose(p), p.groups.join(" ")])
  .sort((a, b) => a[0].localeCompare(b[0], "es"));
const csv = ["nombre;genero;motivo;grupos", ...rows.map((r) => r.join(";"))].join("\n");
fs.mkdirSync(path.dirname(OUT), { recursive: true });
if (fs.existsSync(OUT) && !process.argv.includes("--force")) {
  console.error(`${OUT} ya existe (puede estar revisado); usar --force para regenerarlo`);
  process.exit(1);
}
fs.writeFileSync(OUT, "﻿" + csv + "\n");
console.log(`${rows.length} personas -> ${OUT}`);
const count = (g) => rows.filter((r) => r[1] === g).length;
console.log(`F ${count("F")}, M ${count("M")}, sin asignar ${count("?")}`);
