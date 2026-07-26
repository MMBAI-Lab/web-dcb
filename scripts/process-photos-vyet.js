const path = require("path");
const sharp = require("sharp");

const SRC = path.join(__dirname, "..", "data", "old", "images");
const OUT = path.join(__dirname, "..", "public", "images", "people");

// Vectores y Enfermedades Transmitidas members, matched by filename to name
// (confirmed via data/old/image-manifest.txt page-tagging + name matches,
// and visually verified as genuine solo portraits).
const people = [
  { src: "María Laura Félix.jpg", out: "maria-laura-felix.jpg" },
  { src: "Rodrigo Alvez.jpg", out: "rodrigo-alvez.jpg" },
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
