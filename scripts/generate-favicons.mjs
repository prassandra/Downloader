import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Exact SVG matching the header logo:
// Blue squircle (gradient from #3b82f6 to #4338ca) with white cloud and downward arrow
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="50%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#4338ca" />
    </linearGradient>
    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#2563eb" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Squircle rounded background matching header logo exactly -->
  <rect x="24" y="24" width="464" height="464" rx="140" fill="url(#headerGrad)" />

  <!-- Cloud with Down Arrow matching Header Logo SVG -->
  <!-- Scaled up from 24x24 viewBox into 512x512 with center at 256, 256 -->
  <!-- Scale factor = 13.5, translate(256 - 12*13.5, 256 - 12*13.5) = translate(94, 94) -->
  <g transform="translate(94, 94) scale(13.5)">
    <!-- Cloud Path -->
    <path
      d="M7 16.5A4.5 4.5 0 0 1 7 7.5A6 6 0 0 1 18.5 9A4.5 4.5 0 0 1 17 17.5"
      fill="none"
      stroke="#ffffff"
      stroke-width="2.3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <!-- Down Arrow Stem -->
    <path
      d="M12 12v7"
      fill="none"
      stroke="#ffffff"
      stroke-width="2.3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <!-- Down Arrow Head -->
    <path
      d="m9 16 3 3 3-3"
      fill="none"
      stroke="#ffffff"
      stroke-width="2.3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </g>
</svg>`;

async function main() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Write SVG files
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf8');
  console.log('Saved favicon.svg and icon.svg');

  const svgBuffer = Buffer.from(svgContent);

  // 2. Generate PNGs: 48x48 (Google SERP mandatory multiple of 48), 96x96, 180x180, 192x192, 512x512
  const sizes = [
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'favicon-96x96.png', size: 96 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'favicon-192x192.png', size: 192 },
    { name: 'icon-512x512.png', size: 512 },
  ];

  for (const { name, size } of sizes) {
    const pngBuffer = await sharp(svgBuffer)
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toBuffer();
    fs.writeFileSync(path.join(publicDir, name), pngBuffer);
    console.log(`Generated ${name} (${size}x${size})`);
  }

  // 3. Generate standard multi-layer favicon.ico (16, 32, 48)
  // An ICO file contains standard header followed by icon directory entries and raw PNG or BMP images.
  // Modern ICO format allows embedded PNG data (supported by all browsers and Googlebot since 2010).
  const icoSizes = [16, 32, 48];
  const pngBuffers = [];
  for (const s of icoSizes) {
    const buf = await sharp(svgBuffer).resize(s, s).png().toBuffer();
    pngBuffers.push({ size: s, data: buf });
  }

  // Build ICO file buffer
  const count = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + count * dirEntrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(count, 4); // Number of images

  const dirEntries = [];
  for (const img of pngBuffers) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(img.size === 256 ? 0 : img.size, 0); // Width
    entry.writeUInt8(img.size === 256 ? 0 : img.size, 1); // Height
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(img.data.length, 8); // Size of image data
    entry.writeUInt32LE(offset, 12); // Offset of image data
    dirEntries.push(entry);
    offset += img.data.length;
  }

  const icoBuffer = Buffer.concat([
    header,
    ...dirEntries,
    ...pngBuffers.map((img) => img.data),
  ]);

  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('Generated favicon.ico successfully');
}

main().catch(console.error);
