/**
 * Generates the home-screen icons as PNGs: a soft apricot circle on the
 * Night background. Uses only Node's zlib (same encoder as nono55), so
 * the project needs no image library. Run: node scripts/make-icons.mjs
 */
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const BG = [16, 19, 24];
const AMBER = [231, 176, 126];

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let k = 0; k < 8; k++) crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

function encodePng(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: RGBA
  const raw = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// A soft circle with a faint halo, kept inside the central 60% so maskable
// crops never clip it. Returns how much accent colour (0..1) a point gets.
const CORE = 0.17, HALO = 0.31;
function glow(x, y) {
  const d = Math.hypot(x - 0.5, y - 0.5);
  if (d <= CORE) return 1;
  if (d >= HALO) return 0;
  const k = 1 - (d - CORE) / (HALO - CORE);
  return 0.28 * k * k;
}

function drawIcon(size) {
  const px = Buffer.alloc(size * size * 4);
  const SS = 4; // 4x4 supersampling for smooth edges
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let sum = 0;
      for (let sy = 0; sy < SS; sy++)
        for (let sx = 0; sx < SS; sx++)
          sum += glow((x + (sx + 0.5) / SS) / size, (y + (sy + 0.5) / SS) / size);
      const t = sum / (SS * SS);
      const i = (y * size + x) * 4;
      for (let c = 0; c < 3; c++) px[i + c] = Math.round(BG[c] + (AMBER[c] - BG[c]) * t);
      px[i + 3] = 255; // opaque: iOS fills transparency with black anyway
    }
  }
  return px;
}

for (const [name, size] of [["icon-192.png", 192], ["icon-512.png", 512], ["apple-touch-icon.png", 180], ["favicon-64.png", 64]]) {
  writeFileSync(join(ROOT, name), encodePng(size, size, drawIcon(size)));
  console.log("wrote", name);
}
