const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const SRC = path.join(__dirname, "..", "data", "old", "images");
const PEOPLE_OUT = path.join(__dirname, "..", "public", "images", "people");
const PLACES_OUT = path.join(__dirname, "..", "public", "images", "places");
const LOGOS_OUT = path.join(__dirname, "..", "public", "images", "logos");

async function whiteToTransparent(input) {
  const img = sharp(input).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const minC = Math.min(r, g, b);
    if (minC > 232) data[i + 3] = 0;
    else if (minC > 190) data[i + 3] = Math.min(data[i + 3], Math.round(((232 - minC) / (232 - 190)) * 255));
  }
  return sharp(data, { raw: { width, height, channels } }).png();
}

const people = [
  { src: "Mauricio_edited.jpg", out: "mauricio-cabrera.jpg" },
  { src: "Humberto Rodney Colina.jpg", out: "rodney-colina.jpg" },
];

async function main() {
  for (const { src, out } of people) {
    await sharp(path.join(SRC, src))
      .resize(400, 400, { fit: "cover", position: sharp.strategy.attention })
      .jpeg({ quality: 82 })
      .toFile(path.join(PEOPLE_OUT, out));
  }

  // LGMH group logo: white bg -> transparent
  const lgmh = await whiteToTransparent(path.join(SRC, "LGMH - Logotipo Final WEB PNG.png"));
  await lgmh.resize(400, 400, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFile(path.join(LOGOS_OUT, "lgmh-logo.png"));

  // LIBIAM lab photo (landscape, keep as-is aspect)
  await sharp(path.join(SRC, "LIBIAM 2019.png"))
    .resize(640, 420, { fit: "cover" })
    .jpeg({ quality: 82 })
    .toFile(path.join(PLACES_OUT, "libiam-lab.jpg"));

  // Institucional platform photos
  await sharp(path.join(SRC, "plataforma1.jpg")).resize(640, 420, { fit: "cover" }).jpeg({ quality: 82 }).toFile(path.join(PLACES_OUT, "plataforma-1.jpg"));
  await sharp(path.join(SRC, "plataforma2.jpg")).resize(640, 420, { fit: "cover" }).jpeg({ quality: 82 }).toFile(path.join(PLACES_OUT, "plataforma-2.jpg"));

  // Extension seminar flyer
  await sharp(path.join(SRC, "sem1DCB2025.jpg")).resize(640, 640, { fit: "cover" }).jpeg({ quality: 85 }).toFile(path.join(PLACES_OUT, "seminario-2025.jpg"));

  console.log("done");
}

main().catch((err) => { console.error(err); process.exit(1); });
