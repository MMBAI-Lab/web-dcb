// One-off tool: crop the DCB icon out of the horizontal lockup and make
// white backgrounds transparent on all three header/footer logos.
// Run with: node scripts/process-logos.js
const path = require("path");
const sharp = require("sharp");

const SRC = path.join(__dirname, "..", "data", "old", "images");
const OUT = path.join(__dirname, "..", "public", "images", "logos");

async function whiteToTransparent(input) {
  const img = sharp(input).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const minC = Math.min(r, g, b);
    if (minC > 232) {
      data[i + 3] = 0;
    } else if (minC > 190) {
      const alpha = Math.round(((232 - minC) / (232 - 190)) * 255);
      data[i + 3] = Math.min(data[i + 3], alpha);
    }
  }

  return sharp(data, { raw: { width, height, channels } }).png();
}

async function main() {
  // 1. DCB: crop the icon (left ~790px of the 2783x799 horizontal lockup),
  //    trim the transparent margin, then key out white.
  const dcbCropped = await sharp(path.join(SRC, "logo dcb_color_horizontal.jpg"))
    .extract({ left: 0, top: 0, width: 790, height: 799 })
    .toBuffer();
  const dcb = await whiteToTransparent(dcbCropped);
  await dcb.trim().toFile(path.join(OUT, "dcb-icon.png"));

  // 2. UdelaR and CENUR: full lockup, just remove the white background.
  const udelar = await whiteToTransparent(path.join(SRC, "udelar_logo.jpg"));
  await udelar.toFile(path.join(OUT, "udelar-logo.png"));

  const cenur = await whiteToTransparent(path.join(SRC, "cenur_logo.jpg"));
  await cenur.toFile(path.join(OUT, "cenur-logo.png"));

  console.log("done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
