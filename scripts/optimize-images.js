#!/usr/bin/env node

/**
 * Image Optimization Script
 *
 * Uses Sharp to recursively optimize images in /public/images directory and subdirectories:
 * - Compresses PNGs with transparency (lossless and lossy modes)
 * - Converts large opaque images to WebP
 * - Generates statistics on file size savings
 * - Creates backups before optimization (preserving directory structure)
 *
 * Usage:
 *   npm run optimize:images           # Standard optimization
 *   npm run optimize:images:aggressive # Aggressive compression
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const CONFIG = {
  imagesDir: path.join(process.cwd(), 'public', 'images'),
  backupDir: path.join(process.cwd(), 'public', 'images', '.originals'),

  // Quality settings
  standard: {
    png: { quality: 85, compressionLevel: 9, effort: 7 },
    webp: { quality: 85, effort: 6 },
    jpeg: { quality: 85, mozjpeg: true },
  },

  aggressive: {
    png: { quality: 75, compressionLevel: 9, effort: 10 },
    webp: { quality: 80, effort: 6 },
    jpeg: { quality: 80, mozjpeg: true },
  },

  // Thresholds
  minSizeForWebP: 100 * 1024, // 100KB - convert large PNGs without transparency to WebP
  skipFiles: ['.DS_Store', '.gitkeep', 'hotmart-icon.svg', 'hotmart-flame-icon.svg'],
};

// Stats tracker
const stats = {
  totalOriginalSize: 0,
  totalOptimizedSize: 0,
  filesProcessed: 0,
  filesSkipped: 0,
  errors: [],
};

/**
 * Check if image has transparency
 */
async function hasTransparency(imagePath) {
  try {
    const metadata = await sharp(imagePath).metadata();
    return metadata.hasAlpha || metadata.channels === 4;
  } catch (error) {
    console.error(`Error checking transparency for ${imagePath}:`, error.message);
    return true; // Assume transparency on error (safer)
  }
}

/**
 * Get file size in bytes
 */
async function getFileSize(filePath) {
  const stat = await fs.stat(filePath);
  return stat.size;
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Create backup of original file (preserving directory structure)
 */
async function backupFile(filePath, imagesDir, backupDir) {
  // Get relative path from images directory
  const relativePath = path.relative(imagesDir, filePath);
  const backupPath = path.join(backupDir, relativePath);
  const backupDirPath = path.dirname(backupPath);

  // Create backup directory structure
  await fs.mkdir(backupDirPath, { recursive: true });

  // Only backup if not already backed up
  try {
    await fs.access(backupPath);
    return; // Backup already exists
  } catch {
    await fs.copyFile(filePath, backupPath);
  }
}

/**
 * Optimize PNG image
 */
async function optimizePNG(filePath, quality) {
  const tempPath = filePath + '.tmp';

  await sharp(filePath)
    .png({
      quality: quality.png.quality,
      compressionLevel: quality.png.compressionLevel,
      effort: quality.png.effort,
    })
    .toFile(tempPath);

  await fs.rename(tempPath, filePath);
}

/**
 * Convert image to WebP
 */
async function convertToWebP(filePath, quality) {
  const webpPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');

  await sharp(filePath)
    .webp({
      quality: quality.webp.quality,
      effort: quality.webp.effort,
    })
    .toFile(webpPath);

  console.log(`  ✅ Created WebP version: ${path.basename(webpPath)}`);
  return webpPath;
}

/**
 * Optimize JPEG image
 */
async function optimizeJPEG(filePath, quality) {
  const tempPath = filePath + '.tmp';

  await sharp(filePath)
    .jpeg({
      quality: quality.jpeg.quality,
      mozjpeg: quality.jpeg.mozjpeg,
    })
    .toFile(tempPath);

  await fs.rename(tempPath, filePath);
}

/**
 * Process a single image file
 */
async function processImage(filePath, quality, imagesDir, backupDir) {
  const fileName = path.basename(filePath);
  const ext = path.extname(filePath).toLowerCase();

  // Skip non-image files
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
    stats.filesSkipped++;
    return;
  }

  console.log(`📸 Processing: ${fileName}`);

  const originalSize = await getFileSize(filePath);
  stats.totalOriginalSize += originalSize;

  // Backup original (preserving directory structure)
  await backupFile(filePath, imagesDir, backupDir);

  try {
    if (ext === '.png') {
      const hasAlpha = await hasTransparency(filePath);

      if (!hasAlpha && originalSize > CONFIG.minSizeForWebP) {
        // Large opaque PNG - convert to WebP
        console.log(`  📦 Large opaque PNG (${formatBytes(originalSize)}) - converting to WebP...`);
        await convertToWebP(filePath, quality);

        // Still optimize the original PNG
        await optimizePNG(filePath, quality);
      } else {
        // PNG with transparency or small file - just optimize
        console.log(`  🔧 Optimizing PNG ${hasAlpha ? '(with transparency)' : ''}...`);
        await optimizePNG(filePath, quality);
      }
    } else if (['.jpg', '.jpeg'].includes(ext)) {
      console.log(`  🔧 Optimizing JPEG...`);
      await optimizeJPEG(filePath, quality);
    }

    const optimizedSize = await getFileSize(filePath);
    stats.totalOptimizedSize += optimizedSize;
    stats.filesProcessed++;

    const savedBytes = originalSize - optimizedSize;
    const savedPercent = ((savedBytes / originalSize) * 100).toFixed(1);

    if (savedBytes > 0) {
      console.log(`  ✅ Saved: ${formatBytes(savedBytes)} (${savedPercent}% reduction)`);
    } else {
      console.log(`  ℹ️  No reduction (already optimized)`);
    }

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    stats.errors.push({ file: fileName, error: error.message });
  }
}

/**
 * Recursively find all image files in a directory
 */
async function findImageFiles(dir, fileList = []) {
  const files = await fs.readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dir, file.name);

    if (file.isDirectory()) {
      // Skip backup directory
      if (file.name === '.originals') continue;
      // Recursively process subdirectories
      await findImageFiles(filePath, fileList);
    } else {
      const ext = path.extname(file.name).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext) && !CONFIG.skipFiles.includes(file.name)) {
        fileList.push(filePath);
      }
    }
  }

  return fileList;
}

/**
 * Main optimization function
 */
async function optimizeImages(mode = 'standard') {
  console.log('🚀 Image Optimization Script');
  console.log('============================');
  console.log(`Mode: ${mode.toUpperCase()}`);
  console.log(`Directory: ${CONFIG.imagesDir} (recursive)\n`);

  const quality = CONFIG[mode] || CONFIG.standard;

  try {
    // Recursively find all image files
    const imageFiles = await findImageFiles(CONFIG.imagesDir);

    console.log(`Found ${imageFiles.length} images to process\n`);

    // Process each image
    for (const filePath of imageFiles) {
      const relativePath = path.relative(CONFIG.imagesDir, filePath);
      const dirPath = path.dirname(relativePath);
      console.log(`\n📂 ${dirPath === '.' ? 'root' : dirPath}`);
      await processImage(filePath, quality, CONFIG.imagesDir, CONFIG.backupDir);
    }

    // Print summary
    console.log('\n\n📊 Optimization Summary');
    console.log('======================');
    console.log(`Files processed: ${stats.filesProcessed}`);
    console.log(`Files skipped: ${stats.filesSkipped}`);
    console.log(`Original total size: ${formatBytes(stats.totalOriginalSize)}`);
    console.log(`Optimized total size: ${formatBytes(stats.totalOptimizedSize)}`);

    const totalSaved = stats.totalOriginalSize - stats.totalOptimizedSize;
    const totalSavedPercent = ((totalSaved / stats.totalOriginalSize) * 100).toFixed(1);

    console.log(`\n✨ Total saved: ${formatBytes(totalSaved)} (${totalSavedPercent}% reduction)`);
    console.log(`\n💾 Original files backed up to: ${CONFIG.backupDir}`);

    if (stats.errors.length > 0) {
      console.log('\n\n⚠️  Errors encountered:');
      stats.errors.forEach(({ file, error }) => {
        console.log(`  - ${file}: ${error}`);
      });
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run optimization
const mode = process.argv[2] || 'standard';
optimizeImages(mode);
