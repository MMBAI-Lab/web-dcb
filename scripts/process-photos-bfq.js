const path = require("path");
const sharp = require("sharp");

const SRC = path.join(__dirname, "..", "data", "old", "images");
const OUT = path.join(__dirname, "..", "public", "images", "people");

// Biofisicoquímica members, matched by filename to name (confirmed via
// data/old/image-manifest.txt page-tagging + name matches).
const people = [
  { src: "María José Zuluaga.jpeg", out: "maria-jose-zuluaga.jpg" },
  { src: "sanchez recortada_edited.jpg", out: "ana-sanchez.jpg" },
  { src: "Foto DK 1_edited.jpg", out: "deborah-keszenman.jpg" },
  { src: "Adriana_edited.jpg", out: "adriana-gabrielli.jpg" },
  { src: "Alcoba_JPG.jpg", out: "pablo-alcoba.jpg" },
  { src: "Valentina Seballos.jpeg", out: "valentina-seballos.jpg" },
  { src: "Lucrecia Macarena Menoni.jpeg", out: "macarena-menoni.jpg" },
  { src: "DanielaMejias.jpeg", out: "daniela-mejias.jpg" },
];

async function main() {
  for (const { src, out } of people) {
    await sharp(path.join(SRC, src))
      .rotate()
      .resize(400, 400, { fit: "cover", position: sharp.strategy.attention })
      .jpeg({ quality: 82 })
      .toFile(path.join(OUT, out));
    console.log("done", out);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
