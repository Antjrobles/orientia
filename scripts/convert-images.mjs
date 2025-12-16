import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, '..', 'public');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

async function convertImage(imagePath) {
  const ext = extname(imagePath).toLowerCase();

  if (!IMAGE_EXTENSIONS.includes(ext)) {
    return;
  }

  const dir = dirname(imagePath);
  const name = basename(imagePath, ext);

  try {
    console.log(`Converting ${imagePath}...`);

    // Get original file size
    const stats = await stat(imagePath);
    const originalSize = stats.size;

    // Convert to WebP
    const webpPath = join(dir, `${name}.webp`);
    await sharp(imagePath)
      .webp({ quality: 85, effort: 6 })
      .toFile(webpPath);

    const webpStats = await stat(webpPath);
    const webpSize = webpStats.size;
    const webpReduction = ((originalSize - webpSize) / originalSize * 100).toFixed(1);

    console.log(`  ✓ WebP: ${(originalSize / 1024).toFixed(1)}KB → ${(webpSize / 1024).toFixed(1)}KB (-${webpReduction}%)`);

    // Convert to AVIF (even better compression)
    const avifPath = join(dir, `${name}.avif`);
    await sharp(imagePath)
      .avif({ quality: 80, effort: 6 })
      .toFile(avifPath);

    const avifStats = await stat(avifPath);
    const avifSize = avifStats.size;
    const avifReduction = ((originalSize - avifSize) / originalSize * 100).toFixed(1);

    console.log(`  ✓ AVIF: ${(originalSize / 1024).toFixed(1)}KB → ${(avifSize / 1024).toFixed(1)}KB (-${avifReduction}%)`);

  } catch (error) {
    console.error(`  ✗ Error converting ${imagePath}:`, error.message);
  }
}

async function findAndConvertImages(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursively process subdirectories
        await findAndConvertImages(fullPath);
      } else if (entry.isFile()) {
        await convertImage(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
}

console.log('🖼️  Converting images to WebP and AVIF...\n');
await findAndConvertImages(PUBLIC_DIR);
console.log('\n✅ Image conversion complete!');
