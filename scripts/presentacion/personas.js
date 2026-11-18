// Everyone on the site (group pages + associates), once, with their groups —
// the same people the /integrantes page lists. Shared by the presentation
// scripts.
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const GROUPS_DIR = path.join(ROOT, "src", "content", "groups");

function loadGroups() {
  return fs
    .readdirSync(GROUPS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(GROUPS_DIR, f), "utf8")))
    .sort((a, b) => a.name.es.localeCompare(b.name.es, "es"));
}

function loadPeople(groups = loadGroups()) {
  const byName = new Map();
  const add = (p, slug, role) => {
    const e = byName.get(p.name);
    if (e) e.groups.push(slug);
    else byName.set(p.name, { ...p, groups: [slug], role });
  };
  for (const g of groups) {
    if (g.lead) add(g.lead, g.slug, "lead");
    if (g.coLead) add(g.coLead, g.slug, "colead");
    for (const m of g.members) add(m, g.slug, "member");
  }
  const asociados = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "content", "asociados.json"), "utf8"));
  for (const m of asociados.members) add(m, "asociados", "member");
  return [...byName.values()];
}

module.exports = { ROOT, loadGroups, loadPeople };
