const path = require("path");
const sharp = require("sharp");

const SRC = path.join(__dirname, "..", "data", "old", "images");
const OUT = path.join(__dirname, "..", "public", "images", "people");

// Producción y Reproducción de Rumiantes members, matched by filename to name
// (confirmed via data/old/image-manifest.txt page-tagging + name matches, and
// visually confirmed as solo portraits).
const people = [
  { src: "Silvia-Sterla.jpg", out: "silvia-sterla.jpg" },
  { src: "Zully María Hernandez.jpg", out: "zully-hernandez-russo.jpg" },
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
