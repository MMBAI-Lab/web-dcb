const path = require("path");
const sharp = require("sharp");

const SRC = path.join(__dirname, "..", "data", "old", "images");
const OUT = path.join(__dirname, "..", "public", "images", "groups");

// slug -> source Carrousel_* file, matched by group name.
const map = {
  bfq: "Carrousel_Biofisicoquimica.jpg",
  danslab: "Carrousel_MMBAI.jpg",
  libiam: "Carrousel_Biomecanica.png",
  ecologiafluvial: "Carrousel_Ecologiafluvial.jpg",
  "ecologia-vertebrados": "Carrousel_ecofauna.png",
  lgmh: "Carrousel_Geneticamolecular.jpg",
  ugb: "Carrousel_Genomicabioinformatica.jpeg",
  "inmunologia-biotecnologia": "Carrousel_inmunologiabbiotecnologia.jpg",
  "moleculas-bioactivas": "Carrousel_moleculasbioactivas.jpeg",
  rumiantes: "Carrousel_rumiantes.jpg",
  virologiamolec: "Carrousel_virologiamolecular.jpg",
  vyet: "Carrousel_vectores.jpg",
};

async function main() {
  for (const [slug, file] of Object.entries(map)) {
    await sharp(path.join(SRC, file))
      .resize(900, 600, { fit: "cover", position: sharp.strategy.attention })
      .jpeg({ quality: 82 })
      .toFile(path.join(OUT, `${slug}.jpg`));
    console.log("done", slug);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
