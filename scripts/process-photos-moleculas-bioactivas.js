const path = require("path");
const sharp = require("sharp");

const SRC = path.join(__dirname, "..", "data", "old", "images");
const OUT = path.join(__dirname, "..", "public", "images", "people");

// Moléculas Bioactivas members, matched by filename to name (confirmed via
// data/old/image-manifest.txt page-tagging + name matches; Mauricio Cabrera's
// photo was already processed separately as mauricio-cabrera.jpg).
const people = [
  { src: "Ileana_edited.jpg", out: "ileana-corvo.jpg" },
  { src: "Lia_JPG.jpg", out: "lia-randall.jpg" },
  { src: "cintya.png", out: "cintya-perdomo.jpg" },
  { src: "Tatiana.png", out: "tatiana-sapotiti.jpg" },
  { src: "Zoraima.jpeg", out: "zoraima-artia.jpg" },
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
