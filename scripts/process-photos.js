// One-off tool: pull a first batch of real photos from the old Wix mirror
// into public/images, resized/cropped for web use.
// Run with: node scripts/process-photos.js
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const SRC = path.join(__dirname, "..", "data", "old", "images");
const PEOPLE_OUT = path.join(__dirname, "..", "public", "images", "people");
const PLACES_OUT = path.join(__dirname, "..", "public", "images", "places");

fs.mkdirSync(PEOPLE_OUT, { recursive: true });
fs.mkdirSync(PLACES_OUT, { recursive: true });

const people = [
  { src: "Dans.jpg", out: "pablo-dans.jpg" },
  { src: "Christine_Lucas2023_JPG.jpg", out: "christine-lucas.jpg" },
  { src: "nelida.jpeg", out: "nelida-rodriguez.jpg" },
  { src: "José Manuel Venzal.jpg", out: "jose-manuel-venzal.jpg" },
];

const places = [
  { src: "SedeSalto.jpg", out: "sede-salto.jpg" },
  { src: "SedePaysanduCiudad.jpg", out: "sede-paysandu-cep.jpg" },
  { src: "SedeRuta3.jpg", out: "sede-paysandu-ruta3.jpg" },
];

async function main() {
  for (const { src, out } of people) {
    await sharp(path.join(SRC, src))
      .resize(400, 400, { fit: "cover", position: sharp.strategy.attention })
      .jpeg({ quality: 82 })
      .toFile(path.join(PEOPLE_OUT, out));
  }

  // Already a pre-cropped circular headshot with alpha corners — keep as PNG.
  await sharp(path.join(SRC, "Ruben Daniel Peluffo.png"))
    .resize(400, 400)
    .png()
    .toFile(path.join(PEOPLE_OUT, "daniel-peluffo.png"));

  for (const { src, out } of places) {
    await sharp(path.join(SRC, src))
      .resize(640, 420, { fit: "cover" })
      .jpeg({ quality: 82 })
      .toFile(path.join(PLACES_OUT, out));
  }

  console.log("done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
