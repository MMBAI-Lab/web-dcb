const path = require("path");
const sharp = require("sharp");

const SRC = path.join(__dirname, "..", "data", "old", "images");
const OUT = path.join(__dirname, "..", "public", "images", "people");

// Genética Molecular Humana (lgmh) members, matched by filename to name
// (confirmed via data/old/image-manifest.txt page-tagging + name matches).
const people = [
  { src: "julio.jpeg", out: "julio-da-luz.jpg" },
  { src: "Ana María Soler.jpg", out: "ana-soler.jpg" },
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
