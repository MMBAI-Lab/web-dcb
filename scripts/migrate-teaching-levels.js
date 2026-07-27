// One-off migration: convert each group's teaching {es:[],en:[]} pair into
// a flat TeachingEntry[] ({es,en,levels}), classified by academic level
// using each entry's own wording (see plan for the per-group breakdown).
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "..", "src", "content", "groups");

// index -> levels (array, since a few entries serve two levels at once)
const LEVELS = {
  bfq: { 0: ["grado"], 1: ["grado"], 2: ["grado"], 3: ["grado"], 4: ["grado"], 5: ["posgrado"], 6: ["posgrado"], 7: ["posgrado"], 8: ["posgrado"], 9: ["posgrado"], 10: ["otras"] },
  danslab: { 0: ["posgrado"], 1: ["grado"], 2: ["posgrado"], 3: ["posgrado"], 4: ["grado"], 5: ["posgrado"], 6: ["grado", "posgrado"], 7: ["posgrado"], 8: ["grado"], 9: ["grado"], 10: ["otras"] },
  ecologiafluvial: { 0: ["grado"], 1: ["grado", "posgrado"], 2: ["posgrado"], 3: ["posgrado"], 4: ["posgrado"], 5: ["posgrado"], 6: ["grado", "posgrado"], 7: ["otras"], 8: ["otras"], 9: ["otras"], 10: ["otras"] },
  libiam: { 0: ["grado"], 1: ["grado"], 2: ["grado"], 3: ["grado"], 4: ["grado"], 5: ["grado"], 6: ["grado"], 7: ["grado"], 8: ["grado"], 9: ["grado"], 10: ["posgrado"], 11: ["posgrado"], 12: ["posgrado"], 13: ["posgrado"], 14: ["otras"], 15: ["otras"] },
  lgmh: { 0: ["grado"], 1: ["grado"], 2: ["grado"], 3: ["grado"], 4: ["grado"], 5: ["grado"], 6: ["posgrado"], 7: ["posgrado"], 8: ["posgrado"] },
  "moleculas-bioactivas": { 0: ["grado"], 1: ["grado"], 2: ["grado"], 3: ["grado"], 4: ["grado"], 5: ["grado"], 6: ["posgrado"], 7: ["posgrado"], 8: ["posgrado"] },
  virologiamolec: { 0: ["grado"], 1: ["grado"], 2: ["grado"], 3: ["grado"], 4: ["grado"], 5: ["grado"], 6: ["grado"], 7: ["grado"], 8: ["posgrado"], 9: ["posgrado"], 10: ["posgrado"], 11: ["posgrado"], 12: ["posgrado"], 13: ["posgrado"] },
  "inmunologia-biotecnologia": { 0: ["grado"], 1: ["grado"], 2: ["grado"], 3: ["grado"], 4: ["grado"], 5: ["grado"], 6: ["grado"], 7: ["posgrado"] },
  vyet: { 0: ["grado"], 1: ["posgrado"], 2: ["posgrado"], 3: ["posgrado"], 4: ["otras"] },
};

for (const [slug, levelMap] of Object.entries(LEVELS)) {
  const file = path.join(DIR, `${slug}.json`);
  const group = JSON.parse(fs.readFileSync(file, "utf8"));
  const { es, en } = group.teaching;
  if (es.length !== en.length) {
    throw new Error(`${slug}: es/en length mismatch (${es.length} vs ${en.length})`);
  }
  const entries = es.map((esText, i) => {
    const levels = levelMap[i];
    if (!levels) throw new Error(`${slug}: no level mapping for index ${i}`);
    return { es: esText, en: en[i], levels };
  });
  group.teaching = entries;
  fs.writeFileSync(file, JSON.stringify(group, null, 2) + "\n");
  console.log(`${slug}: migrated ${entries.length} entries`);
}
