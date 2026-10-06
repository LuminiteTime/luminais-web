// Renders raster icons from public/favicon.svg. Run after changing the SVG: `pnpm icons`.
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const pub = new URL('../public/', import.meta.url);
const svg = await readFile(new URL('favicon.svg', pub));
const png = (size) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();

for (const [name, size] of [
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]) {
  await writeFile(new URL(name, pub), await png(size));
}

// favicon.ico: a single 32px PNG inside an ICO container (supported by every browser and search crawler)
const image = await png(32);
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // image count
header.writeUInt8(32, 6); // width
header.writeUInt8(32, 7); // height
header.writeUInt16LE(1, 10); // colour planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(image.length, 14); // image size
header.writeUInt32LE(22, 18); // image offset
await writeFile(new URL('favicon.ico', pub), Buffer.concat([header, image]));

console.log('icons written to public/');
