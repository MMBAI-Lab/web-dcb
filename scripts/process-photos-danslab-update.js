const path = require("path");
const sharp = require("sharp");

// Source photos and logo pulled from the group's own site/repo:
// https://github.com/MMBAI-Lab/web-danslab (data/figures/*).
const SRC = path.join(__dirname, "..", "data", "old", "images");
const PEOPLE_OUT = path.join(__dirname, "..", "public", "images", "people");
const LOGOS_OUT = path.join(__dirname, "..", "public", "images", "logos");

const people = [
  { src: "GonzaloLopez.jpg", out: "gonzalo-lopez.jpg" },
  { src: "MageTeliz.jpg", out: "mage-teliz.jpg" },
  { src: "RafaelSauto.jpg", out: "rafael-sauto.jpg" },
  { src: "SantiagoPintos.jpg", out: "santiago-pintos.jpg" },
  { src: "DenisseMavisSánchez.jpg", out: "denisse-mavis-sanchez.jpg" },
  { src: "PaulinaBoiani.jpg", out: "paulina-boiani.jpg" },
  { src: "SofiaAlmiron.jpg", out: "sofia-almiron.jpg" },
  { src: "VictorGarcia.jpg", out: "victor-garcia.jpg" },
  { src: "GastonLeal.jpg", out: "gaston-leal.jpg" },
];

async function main() {
  for (const { src, out } of people) {
    await sharp(path.join(SRC, src))
      .rotate()
      .resize(400, 400, { fit: "cover", position: sharp.strategy.attention })
      .jpeg({ quality: 82 })
      .toFile(path.join(PEOPLE_OUT, out));
    console.log("done", out);
  }

  // DansLab / MMBAI's own logo (transparent PNG), kept at native aspect,
  // downsized so it's a reasonably small badge asset.
  await sharp(path.join(SRC, "WEBDansLab_logoBLACK.png"))
    .resize({ height: 300, withoutEnlargement: true })
    .png()
    .toFile(path.join(LOGOS_OUT, "danslab-logo.png"));
  console.log("done danslab-logo.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
