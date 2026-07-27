// One-off migration: convert each group's outreach {es:[],en:[]} pair into a
// flat OutreachEntry[] ({es,en,kinds}), classified by the kind of action.
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "..", "src", "content", "groups");

// index -> kinds. Classification follows each entry's own wording:
//   medios    = radio/TV/press interviews and coverage
//   educativo = work with schools, teacher training, student placements
//   comunidad = talks, projects and exchanges with communities/territory
//   eventos   = congresses, science fairs, open days, seminar series
//   arte      = art-and-science collaborations
const KINDS = {
  bfq: {
    0: ["medios"], 1: ["medios"], 2: ["medios"], 3: ["medios"],
    4: ["comunidad"], 5: ["eventos"], 6: ["eventos"], 7: ["eventos"],
    8: ["educativo"], 9: ["educativo"], 10: ["comunidad"],
  },
  danslab: {
    0: ["medios"], 1: ["comunidad"], 2: ["comunidad"], 3: ["medios"],
    4: ["medios"], 5: ["medios"], 6: ["medios"], 7: ["medios"],
    8: ["eventos"], 9: ["arte"], 10: ["arte"],
  },
  ecologiafluvial: {
    0: ["eventos"], 1: ["comunidad"], 2: ["comunidad"], 3: ["eventos"], 4: ["eventos"],
  },
  libiam: {
    0: ["comunidad"], 1: ["educativo"], 2: ["comunidad"], 3: ["comunidad"],
    4: ["educativo"], 5: ["comunidad"], 6: ["comunidad"],
  },
  lgmh: {
    0: ["educativo"], 1: ["eventos"], 2: ["educativo"], 3: ["medios"],
  },
  "moleculas-bioactivas": {
    0: ["educativo"], 1: ["comunidad"], 2: ["comunidad"], 3: ["comunidad"],
    4: ["comunidad"], 5: ["eventos"], 6: ["eventos"], 7: ["educativo"],
  },
  virologiamolec: {
    0: ["educativo"], 1: ["educativo"], 2: ["eventos"], 3: ["educativo"],
    4: ["comunidad"], 5: ["educativo"], 6: ["medios"], 7: ["medios"],
    8: ["medios"], 9: ["medios"], 10: ["medios"], 11: ["medios"], 12: ["medios"],
  },
  "inmunologia-biotecnologia": {
    0: ["comunidad"], 1: ["comunidad"],
  },
};

for (const [slug, kindMap] of Object.entries(KINDS)) {
  const file = path.join(DIR, `${slug}.json`);
  const group = JSON.parse(fs.readFileSync(file, "utf8"));
  const { es, en } = group.outreach;
  if (es.length !== en.length) {
    throw new Error(`${slug}: es/en length mismatch (${es.length} vs ${en.length})`);
  }
  const entries = es.map((esText, i) => {
    const kinds = kindMap[i];
    if (!kinds) throw new Error(`${slug}: no kind mapping for index ${i}`);
    return { es: esText, en: en[i], kinds };
  });
  group.outreach = entries;
  fs.writeFileSync(file, JSON.stringify(group, null, 2) + "\n");
  console.log(`${slug}: migrated ${entries.length} entries`);
}
