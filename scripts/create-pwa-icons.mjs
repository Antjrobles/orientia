import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { stat } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ICONS_DIR = join(__dirname, '..', 'public', 'icons');
const SOURCE_LOGO = join(ICONS_DIR, 'logo4.svg'); // Using SVG for best quality

const sizes = [
  { size: 192, name: 'icon-192x192' },
  { size: 512, name: 'icon-512x512' },
  { size: 180, name: 'apple-touch-icon' },
  { size: 32, name: 'favicon-32x32' },
  { size: 16, name: 'favicon-16x16' }
];

console.log('🎨 Creating PWA icons from SVG logo...\n');

for (const { size, name } of sizes) {
  try {
    // Create PNG
    const pngPath = join(ICONS_DIR, `${name}.png`);
    await sharp(SOURCE_LOGO)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(pngPath);

    const pngStats = await stat(pngPath);
    console.log(`✓ ${name}.png (${size}x${size}) - ${(pngStats.size / 1024).toFixed(1)}KB`);

    // Create WebP version
    const webpPath = join(ICONS_DIR, `${name}.webp`);
    await sharp(SOURCE_LOGO)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .webp({ quality: 90 })
      .toFile(webpPath);

    const webpStats = await stat(webpPath);
    const reduction = ((pngStats.size - webpStats.size) / pngStats.size * 100).toFixed(1);
    console.log(`  → ${name}.webp - ${(webpStats.size / 1024).toFixed(1)}KB (-${reduction}%)\n`);

  } catch (error) {
    console.error(`✗ Error creating ${name}:`, error.message);
  }
}

console.log('✅ PWA icons created successfully!');
