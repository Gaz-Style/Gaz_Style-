const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createHero() {
  const inputPath = path.join(__dirname, '../public/images/trail-running-cosa-mi-serve.jpg');
  const outputPath = path.join(__dirname, '../public/images/expedition-hero-gradient.jpg');
  
  // High quality retina output (1040x585 - 16:9 ratio for 520px container)
  const width = 1040;
  const height = 585;

  // Exact gradient matching https://www.santiagohiking.com/desafios/triple-corona
  // bg-gradient-to-t from-stone-950 via-stone-950/65 to-stone-950/25
  const svgOverlay = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tripleCoronaDegrade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0c0a09" stop-opacity="0.04" />
          <stop offset="35%" stop-color="#0c0a09" stop-opacity="0.18" />
          <stop offset="65%" stop-color="#0c0a09" stop-opacity="0.55" />
          <stop offset="86%" stop-color="#0c0a09" stop-opacity="0.88" />
          <stop offset="100%" stop-color="#0c0a09" stop-opacity="1.0" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#tripleCoronaDegrade)" />
    </svg>
  `);

  await sharp(inputPath)
    .resize(width, height, { fit: 'cover', position: 'center' })
    .composite([{ input: svgOverlay, top: 0, left: 0 }])
    .jpeg({ quality: 92 })
    .toFile(outputPath);

  console.log('Successfully generated hero from trail-running-cosa-mi-serve.jpg:', outputPath, fs.statSync(outputPath).size, 'bytes');
}

createHero().catch(console.error);
