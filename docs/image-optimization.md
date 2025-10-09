# Image Optimization Guide

This guide covers image optimization for the **Quando um amor se vai** website, including automated optimization scripts and Vercel's Image Optimization.

## Table of Contents

- [Overview](#overview)
- [Vercel Image Optimization](#vercel-image-optimization)
- [Manual Optimization](#manual-optimization)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

The project uses a **hybrid approach** to image optimization:

1. **Build-time optimization** - Sharp script optimizes source images in `/public/images`
2. **Runtime optimization** - Vercel Image Optimization serves optimized images on-demand
3. **Modern formats** - Next.js automatically converts images to AVIF/WebP for supporting browsers

### Current Setup

- **Total images**: ~20 files in `/public/images`
- **Formats**: PNG (decorative with transparency), JPG (testimonials), SVG (icons), WebP (generated)
- **Optimization tool**: Sharp (Node.js image library)
- **CDN**: Vercel Edge Network with automatic image optimization

---

## Vercel Image Optimization

### How It Works

Vercel automatically optimizes images when using Next.js `<Image>` component:

```tsx
import Image from 'next/image';

<Image
  src="/images/ball.png"
  alt="Decorative ball"
  width={200}
  height={200}
  sizes="(max-width: 768px) 160px, (max-width: 1024px) 256px, 320px"
  priority={false}
/>
```

### Features Enabled

- **Format conversion**: Automatic AVIF → WebP → original format fallback
- **Responsive sizing**: Multiple image sizes generated based on device
- **Lazy loading**: Images load only when entering viewport (unless `priority={true}`)
- **Edge caching**: Optimized images cached for 1 year on Vercel's global CDN
- **Quality**: Default 85% quality, adjustable per image

### Configuration

See `next.config.js` for image optimization settings:

```javascript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
}
```

### Pricing Considerations

- **Hobby plan**: 1,000 source image optimizations/month (FREE)
- **Pro plan**: 5,000/month included
- Each unique **source image × device size = 1 optimization**

**Current project**: Well within free tier limits (~20 source images)

---

## Manual Optimization

Use Sharp-based scripts to optimize source images **before** committing to the repository.

### Quick Start

```bash
# Standard optimization (recommended for first run)
npm run optimize:images

# Aggressive optimization (smaller files, slight quality loss)
npm run optimize:images:aggressive
```

### What the Script Does

1. **Backs up originals** to `/public/images/.originals/`
2. **Analyzes images** for transparency and file size
3. **Optimizes PNGs** with transparency preservation
4. **Converts large opaque images** to WebP (>100KB)
5. **Compresses JPEGs** with MozJPEG
6. **Reports statistics** on file size savings

### Example Output

```bash
🚀 Image Optimization Script
============================
Mode: STANDARD
Directory: /path/to/public/images

📸 Processing: ball.png
  🔧 Optimizing PNG (with transparency)...
  ✅ Saved: 120 KB (37.2% reduction)

📸 Processing: cover-apoio.png
  📦 Large opaque PNG (1.4 MB) - converting to WebP...
  ✅ Created WebP version: cover-apoio.webp
  ✅ Saved: 980 KB (70.1% reduction)

📊 Optimization Summary
======================
Files processed: 18
Total saved: 5.2 MB (45.3% reduction)

💾 Original files backed up to: public/images/.originals
```

### Quality Settings

#### Standard Mode (default)
- PNG: Quality 85%, compression level 9, effort 7
- WebP: Quality 85%, effort 6
- JPEG: Quality 85%, MozJPEG enabled

#### Aggressive Mode
- PNG: Quality 75%, compression level 9, effort 10
- WebP: Quality 80%, effort 6
- JPEG: Quality 80%, MozJPEG enabled

### When to Optimize

**Before committing**:
- New images added to `/public/images`
- Existing images replaced or updated

**After optimization**:
- Test images locally with `npm run dev`
- Verify quality is acceptable
- Commit optimized images to repository

### Restoring Original Images

If optimization reduces quality too much:

```bash
# Restore all originals
cp public/images/.originals/* public/images/

# Restore specific file
cp public/images/.originals/ball.png public/images/ball.png

# Run standard optimization instead of aggressive
npm run optimize:images
```

---

## Best Practices

### 1. Use Next.js Image Component

**Always** use `next/image` instead of `<img>` tags:

```tsx
// ✅ Good - Optimized by Vercel
import Image from 'next/image';
<Image src="/images/ball.png" width={200} height={200} alt="Ball" />

// ❌ Bad - No optimization
<img src="/images/ball.png" alt="Ball" />
```

### 2. Specify Image Dimensions

Provide `width` and `height` to prevent layout shift:

```tsx
<Image
  src="/images/heart.png"
  width={449}  // Original dimensions
  height={449}
  alt="Heart"
/>
```

### 3. Use `sizes` Prop for Responsive Images

Tell Next.js how large the image will be at different breakpoints:

```tsx
<Image
  src="/images/cover.png"
  width={1600}
  height={2133}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt="Book cover"
/>
```

### 4. Set `priority` for Above-Fold Images

Use `priority={true}` for images visible without scrolling:

```tsx
// Hero image - visible immediately
<Image src="/images/logo.png" priority={true} {...props} />

// Floating decorative images - lazy load
<Image src="/images/ball.png" priority={false} {...props} />
```

### 5. Choose the Right Format

- **PNG**: Images with transparency, logos, icons
- **JPG**: Photographs, testimonials, complex images
- **WebP**: Generated automatically by Vercel (no manual conversion needed)
- **SVG**: Icons, simple graphics (no optimization needed)

### 6. Optimize Before Committing

Run optimization script before adding new images:

```bash
# Add new image to /public/images
cp ~/Downloads/new-image.png public/images/

# Optimize
npm run optimize:images

# Test locally
npm run dev

# Commit
git add public/images/new-image.png
git commit -m "feat(assets): add new decorative image"
```

### 7. Monitor Image Performance

Check Vercel deployment logs for image optimization metrics:
- Number of images optimized
- Cache hit rate
- Total bandwidth saved

---

## Troubleshooting

### Script Fails with "Module not found: 'sharp'"

**Solution**: Reinstall Sharp:
```bash
npm install -D sharp
```

### Images Look Blurry After Optimization

**Solution**: Use standard mode instead of aggressive:
```bash
npm run optimize:images
```

Or restore originals and manually adjust quality:
```javascript
// In scripts/optimize-images.js
standard: {
  png: { quality: 90, compressionLevel: 9, effort: 7 },
  webp: { quality: 90, effort: 6 },
}
```

### WebP Images Not Generated

**Solution**: Check that the source image is:
- Larger than 100KB (threshold in script)
- Opaque (no transparency)

Or manually convert:
```bash
# Install webp tools
brew install webp

# Convert manually
cwebp -q 85 public/images/large-image.png -o public/images/large-image.webp
```

### Vercel Image Optimization Not Working

**Verification steps**:

1. Check Next.js Image component is used:
```tsx
import Image from 'next/image';
```

2. Verify `next.config.js` has image configuration

3. Check browser Network tab:
   - Optimized images served as `/_next/image?url=...`
   - Response headers include `Content-Type: image/webp` or `image/avif`

4. Ensure image is in `/public` directory:
```
✅ /public/images/ball.png → works
❌ /images/ball.png → doesn't work
```

### Too Many Image Optimizations (Vercel Quota)

**Solutions**:

1. **Reduce device sizes** in `next.config.js`:
```javascript
deviceSizes: [640, 1080, 1920], // Fewer sizes = fewer optimizations
```

2. **Pre-optimize images** with Sharp script to reduce original file sizes

3. **Upgrade to Vercel Pro** if consistently hitting limits

---

## Additional Resources

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Vercel Image Optimization](https://vercel.com/docs/image-optimization)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [WebP Best Practices](https://developers.google.com/speed/webp)

---

## Change Log

- **2024-10-09**: Initial image optimization setup with Sharp script
- **2024-10-09**: Configured Next.js for AVIF/WebP support with 1-year caching
