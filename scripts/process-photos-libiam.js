const path = require("path");
const sharp = require("sharp");

const SRC = path.join(__dirname, "..", "data", "old", "images");
const OUT = path.join(__dirname, "..", "public", "images", "people");

// LIBiAM members, matched by filename to name (confirmed via
// data/old/image-manifest.txt page-tagging + name matches + visual confirmation
// that each source image is a genuine solo portrait).
const people = [
  { src: "Carlo DigaBarbellino.jpeg", out: "carlo-biancardi.jpg" },
  { src: "Renata Bona.jpeg", out: "renata-bona.jpg" },
  { src: "1_Bonezi_cvuy_foto.jpg", out: "artur-bonezi.jpg" },
  { src: "Patricia Polero.jpeg", out: "patricia-polero.jpg" },
  { src: "Vale Silva.jpeg", out: "valentina-silva.jpg" },
  { src: "Josefa González_jfif.jpg", out: "josefa-gonzalez.jpg" },
  { src: "Paula Radesca_jfif.jpg", out: "paula-radesca.jpg" },
  { src: "Christian Scnheider.png", out: "christian-schneider.jpg" },
  { src: "Mateo Rodrigues.png", out: "mateo-rodrigues-zabala.jpg" },
  { src: "Vanessa Yelós_jfif.jpg", out: "vanessa-yelos.jpg" },
  { src: "Parada.jpg", out: "luis-parada.jpg" },
  { src: "Racedo.jpg", out: "angelina-rancedo.jpg" },
  { src: "Matias de Pablo.png", out: "matias-de-pablo.jpg" },
  { src: "Gabriel Fábrica.png", out: "gabriel-fabrica.jpg" },
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
