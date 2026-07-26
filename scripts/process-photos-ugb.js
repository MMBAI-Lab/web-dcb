const path = require("path");
const sharp = require("sharp");

const SRC = path.join(__dirname, "..", "data", "old", "images");
const OUT = path.join(__dirname, "..", "public", "images", "people");

// Genómica y Bioinformática (UGB) members, matched by filename to name
// (confirmed via data/old/image-manifest.txt page-tagging + name matches,
// and visually confirmed as solo portraits).
const people = [
  { src: "daiana_edited_edited.jpg", out: "daiana-mir.jpg" },
  { src: "Diego_Almansa.jpg", out: "diego-almansa-villa.jpg" },
  { src: "María José Benitez_edited.png", out: "maria-jose-benitez-galeano.jpg" },
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
