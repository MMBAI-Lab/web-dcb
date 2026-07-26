const path = require("path");
const sharp = require("sharp");

const SRC = path.join(__dirname, "..", "data", "old", "images");
const OUT = path.join(__dirname, "..", "public", "images", "people");

// Inmunología y Biotecnología (LIB) members, matched by filename to name
// (confirmed via data/old/image-manifest.txt page-tagging under
// "copy-of-genómica-y-bioinformática" — the LIB group's page was misfiled
// under that slug on the old Wix site — + name/initials matches, and by
// visually confirming each is a genuine solo portrait).
const people = [
  { src: "Foto NR.png", out: "natalia-ruetalo.jpg" },
  { src: "Oscar.jpg", out: "oscar-irabuena.jpg" },
  { src: "Foto MHA.jpg", out: "maria-hilda-avellanal.jpg" },
  { src: "Foto Sabina Victoria.jpeg", out: "sabina-victoria.jpg" },
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
