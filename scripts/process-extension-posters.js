const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

// Posters recovered from the old DCB site's Extensión page. They're portrait
// flyers, so keep the aspect ratio and just cap the width — they're shown as
// thumbnails that open at full size.
const SRC = path.join(__dirname, "..", "data", "old", "images");
const OUT = path.join(__dirname, "..", "public", "images", "extension");

const posters = [
  { src: "f66cd6_25402dd15b97456db392ad3fa646b6e8.jpg", out: "tts-2023-artigas.jpg" },
  { src: "f66cd6_d61a39383dd346c49f1d7c75fcd6d45b.png", out: "tts-2023-bella-union.jpg" },
  { src: "f66cd6_857729ca9a704b8e90b35bebe5221b7e.png", out: "tts-2024-salto.jpg" },
  { src: "f66cd6_d94811051a1d472c8078c659805bbc25.png", out: "tts-2024-paysandu.jpg" },
  { src: "sem1DCB2025.jpg", out: "seminario-2025-03.jpg" },
];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  for (const { src, out } of posters) {
    await sharp(path.join(SRC, src))
      .rotate()
      .resize({ width: 800, withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 80 })
      .toFile(path.join(OUT, out));
    console.log("done", out);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
