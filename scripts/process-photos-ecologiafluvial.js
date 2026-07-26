const path = require("path");
const sharp = require("sharp");

const SRC = path.join(__dirname, "..", "data", "old", "images");
const OUT = path.join(__dirname, "..", "public", "images", "people");

// Ecología Fluvial members, matched by filename to name (confirmed via
// data/old/image-manifest.txt page-tagging + name matches).
const people = [
  { src: "Ivan.jpeg", out: "ivan-gonzalez.jpg" },
  { src: "Mary.jpg", out: "ana-lucia-mary.jpg" },
  { src: "Feris.jpg", out: "anna-lucia-feris.jpg" },
  { src: "Imagen1iVANA.png", out: "ivana-silva.jpg" },
  { src: "Albieni.jpg", out: "wiston-albieni.jpg" },
  { src: "Noelia_fluvia_edited.png", out: "noelia-gobel.jpg" },
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
