/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Enable modern image formats (AVIF first, then WebP fallback)
    formats: ['image/avif', 'image/webp'],

    // Device sizes for responsive images (mobile-first)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Image sizes for layout="intrinsic" or layout="fixed"
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Cache optimized images for 1 year (immutable assets)
    minimumCacheTTL: 60 * 60 * 24 * 365,

    // Allowed image domains (if fetching external images)
    // domains: [],

    // Disable static imports from public folder (forces optimization)
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

module.exports = nextConfig
