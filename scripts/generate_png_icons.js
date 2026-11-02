import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPng(size, text = '9') {
  const width = size;
  const height = size;

  // CRC32 table
  const crcTable = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[i] = c;
  }

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ -1) >>> 0;
  }

  function createChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const crc = crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  // Raw image buffer with filter byte per scanline
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(scanlineLength * height);

  const bgR = 0xF8, bgG = 0xF8, bgB = 0xF6; // #F8F8F6 (warm paper)
  const boardR = 0xFF, boardG = 0xFF, boardB = 0xFF; // #FFFFFF
  const inkR = 0x11, inkG = 0x12, inkB = 0x15; // #111215 (dark sumi ink)
  const accentR = 0x1E, accentG = 0x3A, accentB = 0x8A; // #1E3A8A (ink blue)
  const borderR = 0x2B, borderG = 0x2D, borderB = 0x31;

  const margin = Math.round(size * 0.1);
  const boardSize = size - 2 * margin;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;

      let r = bgR, g = bgG, b = bgB, a = 255;

      // Inside board
      if (x >= margin && x < size - margin && y >= margin && y < size - margin) {
        r = boardR; g = boardG; b = boardB;

        // Outer board border
        if (x === margin || x === size - margin - 1 || y === margin || y === size - margin - 1) {
          r = borderR; g = borderG; b = borderB;
        }

        // 3x3 block grid lines
        const step = boardSize / 3;
        const lx1 = Math.round(margin + step);
        const lx2 = Math.round(margin + 2 * step);
        const ly1 = Math.round(margin + step);
        const ly2 = Math.round(margin + 2 * step);

        if (Math.abs(x - lx1) <= 1 || Math.abs(x - lx2) <= 1 || Math.abs(y - ly1) <= 1 || Math.abs(y - ly2) <= 1) {
          r = borderR; g = borderG; b = borderB;
        }

        // Active center block accent
        if (x > lx1 && x < lx2 && y > ly1 && y < ly2) {
          r = 0xE8; g = 0xEE; b = 0xF8;
        }

        // Draw a stylized dark Sudoku "9" or center square in center
        const cx = size / 2;
        const cy = size / 2;
        const dx = x - cx;
        const dy = y - cy;
        const rad = size * 0.18;

        // Top loop of 9
        const topCy = cy - rad * 0.35;
        const distTop = Math.sqrt(dx * dx + (y - topCy) * (y - topCy));
        if (distTop >= rad * 0.35 && distTop <= rad * 0.75) {
          r = inkR; g = inkG; b = inkB;
        }
        // Stem and bottom curve of 9
        if (x >= cx + rad * 0.35 && x <= cx + rad * 0.75 && y >= topCy && y <= cy + rad * 0.6) {
          r = inkR; g = inkG; b = inkB;
        }
        const botCy = cy + rad * 0.4;
        const distBot = Math.sqrt(dx * dx + (y - botCy) * (y - botCy));
        if (distBot >= rad * 0.35 && distBot <= rad * 0.75 && y >= cy + rad * 0.4 && x <= cx + rad * 0.75) {
          r = inkR; g = inkG; b = inkB;
        }
      }

      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', deflated);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const outDir = path.resolve('public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), createPng(192));
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), createPng(512));
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), createPng(180));
console.log('Successfully generated PNG icons in public/');
