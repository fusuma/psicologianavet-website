'use client';

import { motion, useScroll, useTransform, useMotionValue, animate } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

// All available toy images
const TOY_IMAGES = [
  'ball.png',
  'bone.png',
  'cat.png',
  'cloud.png',
  'color-bone-2.png',
  'color-bone.png',
  'dog.png',
  'fish.png',
  'fox.png',
  'heart.png',
  'knot.png',
  'mice.png',
  'rabbit.png',
];

/**
 * Randomly selects N unique items from an array
 */
function selectRandomImages(count: number): string[] {
  const shuffled = [...TOY_IMAGES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * FloatingImages Component
 *
 * Displays decorative pet-themed images with advanced scroll-triggered parallax effects.
 *
 * Features:
 * - Random image selection from toys folder on each page load
 * - GSAP-style scroll parallax (each image moves at different speeds)
 * - Scroll-linked fade effect (images fade as you scroll)
 * - Proximity-based opacity (images become more visible when mouse is closer - desktop only)
 * - Staggered entrance animations with smart activation
 * - Responsive sizing (larger on desktop, smaller on mobile)
 *
 * Performance optimizations:
 * - Mobile: Simplified effects for 60fps scrolling (no proximity calc, blur, or scale)
 * - Desktop: Full effects with proximity-based opacity, blur, and scale
 * - Smart animation activation based on device type
 *
 * Activation behavior:
 * - Desktop: Triggers on first mouse movement (preserves anti-flicker)
 * - Mobile: Auto-starts after 100ms for immediate visibility
 */
export function FloatingImages() {
  // Randomly select 4 unique images on component mount
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setSelectedImages(selectRandomImages(4));

    // Detect mobile devices
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const { scrollYProgress } = useScroll();

  // Mouse position tracking for proximity-based opacity
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
  const scrollTrigger = useMotionValue(0); // Triggers recalculation on scroll
  const hasMouseMoved = useMotionValue(0); // Track if mouse has moved
  const fadeInProgress = useMotionValue(0); // Fade-in multiplier (0 to 1)

  // Refs to track each image's position
  const ballRef = useRef<HTMLDivElement>(null);
  const miceRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const boneRef = useRef<HTMLDivElement>(null);

  // GSAP-style parallax transforms (different speeds for depth)
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, -120]);

  // Helper function to calculate opacity based on Y proximity only
  const calculateProximityOpacity = (
    ref: React.RefObject<HTMLDivElement | null>,
    mx: number,
    my: number,
    baseOpacity: number,
    maxOpacity: number = 0.6,
    scrollProgress: number = 0,
    mouseHasMoved: number = 0
  ): number => {
    if (!ref.current || mouseHasMoved === 0) return baseOpacity;

    const rect = ref.current.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;

    // Calculate vertical distance only
    const distance = Math.abs(my - centerY);

    // Increase proximity threshold as you scroll (300px at top, 1000px at bottom)
    const proximityThreshold = 500 + (scrollProgress * 700);

    if (distance < proximityThreshold) {
      // Linear interpolation from baseOpacity to maxOpacity
      const factor = 1 - distance / proximityThreshold;
      return baseOpacity + (maxOpacity - baseOpacity) * factor;
    }

    return baseOpacity;
  };

  // Proximity-based opacity transforms (update on mouse move AND scroll)
  // Multiplied by fadeInProgress to enable smooth fade-in on first mouse movement
  // On mobile: use simple static opacity multiplied by fadeInProgress
  const ballOpacity = useTransform([mouseX, mouseY, scrollTrigger, scrollYProgress, hasMouseMoved, fadeInProgress], ([mx, my, _, scroll, moved, fadeIn]) =>
    isMobile ? 0.5 * (fadeIn as number) : calculateProximityOpacity(ballRef, mx as number, my as number, 0.5, 0.6, scroll as number, moved as number) * (fadeIn as number)
  );

  const miceOpacity = useTransform([mouseX, mouseY, scrollTrigger, scrollYProgress, hasMouseMoved, fadeInProgress], ([mx, my, _, scroll, moved, fadeIn]) =>
    isMobile ? 0.45 * (fadeIn as number) : calculateProximityOpacity(miceRef, mx as number, my as number, 0.4, 0.6, scroll as number, moved as number) * (fadeIn as number)
  );

  const heartOpacity = useTransform([mouseX, mouseY, scrollTrigger, scrollYProgress, hasMouseMoved, fadeInProgress], ([mx, my, _, scroll, moved, fadeIn]) =>
    isMobile ? 0.45 * (fadeIn as number) : calculateProximityOpacity(heartRef, mx as number, my as number, 0.4, 0.6, scroll as number, moved as number) * (fadeIn as number)
  );

  const boneOpacity = useTransform([mouseX, mouseY, scrollTrigger, scrollYProgress, hasMouseMoved, fadeInProgress], ([mx, my, _, scroll, moved, fadeIn]) =>
    isMobile ? 0.5 * (fadeIn as number) : calculateProximityOpacity(boneRef, mx as number, my as number, 0.5, 0.6, scroll as number, moved as number) * (fadeIn as number)
  );

  // Blur transforms - inversely proportional to opacity (more blur when less visible)
  const ballBlur = useTransform(ballOpacity, [0.5, 0.6], [5.6, 0]);
  const miceBlur = useTransform(miceOpacity, [0.4, 0.6], [7, 0]);
  const heartBlur = useTransform(heartOpacity,[0.4, 0.6], [7, 0]);
  const boneBlur = useTransform(boneOpacity, [0.5, 0.6], [8.4, 0]);

  // Scale transforms - proportional to opacity (smaller when faded)
  const ballScale = useTransform(ballOpacity, [0.5, 0.6], [0.95, 1.0]);
  const miceScale = useTransform(miceOpacity, [0.4, 0.6], [0.95, 1.0]);
  const heartScale = useTransform(heartOpacity, [0.4, 0.6], [0.95, 1.0]);
  const boneScale = useTransform(boneOpacity, [0.5, 0.6], [0.95, 1.0]);

  // Filter transforms - convert blur values to CSS filter strings
  const ballFilter = useTransform(ballBlur, (b) => `blur(${b}px)`);
  const miceFilter = useTransform(miceBlur, (b) => `blur(${b}px)`);
  const heartFilter = useTransform(heartBlur, (b) => `blur(${b}px)`);
  const boneFilter = useTransform(boneBlur, (b) => `blur(${b}px)`);

  // Mouse tracking for proximity-based opacity
  useEffect(() => {
    let hasTriggeredFadeIn = false;
    let autoStartTimer: NodeJS.Timeout | null = null;

    const triggerFadeIn = () => {
      if (!hasTriggeredFadeIn) {
        hasTriggeredFadeIn = true;
        hasMouseMoved.set(1); // Enable proximity calculations
        // Animate fadeInProgress from 0 to 1 (smooth fade-in)
        animate(fadeInProgress, 1, { duration: 0.8, ease: 'easeOut' });
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      triggerFadeIn();
    };

    const handleTouchStart = () => {
      // On touch devices, trigger fade-in immediately
      triggerFadeIn();
    };

    const handleScroll = () => {
      // Trigger recalculation by updating scrollTrigger (only on desktop)
      if (!isMobile) {
        scrollTrigger.set(Math.random());
      }
    };

    // Auto-start after 100ms if no interaction (for mobile devices without touch events)
    autoStartTimer = setTimeout(() => {
      triggerFadeIn();
    }, 100);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    // Only add scroll listener on desktop for proximity calculations
    if (!isMobile) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (autoStartTimer) clearTimeout(autoStartTimer);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      if (!isMobile) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [mouseX, mouseY, scrollTrigger, hasMouseMoved, fadeInProgress, isMobile]);

  // Don't render until images are selected
  if (selectedImages.length !== 4) {
    return <div className="fixed inset-0 z-0 pointer-events-none" />;
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Position 1 - Upper Right */}
      <motion.div
        ref={ballRef}
        className="absolute top-[5%] right-[-6%] md:right-[-6%] pointer-events-none will-change-transform"
        style={{
          y: y1,
          opacity: ballOpacity,
          ...(isMobile ? {} : { scale: ballScale, filter: ballFilter }),
        }}
      >
        <Image
          src={`/images/toys/${selectedImages[0]}`}
          alt=""
          width={200}
          height={200}
          className="w-40 h-40 md:w-64 md:h-64 lg:w-80 lg:h-80"
          priority={false}
        />
      </motion.div>

      {/* Position 2 - Middle Left */}
      <motion.div
        ref={miceRef}
        className="absolute top-[30%] left-[-8%] pointer-events-none will-change-transform"
        style={{
          y: y3,
          opacity: miceOpacity,
          ...(isMobile ? {} : { scale: miceScale, filter: miceFilter }),
        }}
      >
        <Image
          src={`/images/toys/${selectedImages[1]}`}
          alt=""
          width={200}
          height={200}
          className="w-44 h-44 md:w-64 md:h-64 lg:w-96 lg:h-96"
          priority={false}
        />
      </motion.div>

      {/* Position 3 - Bottom Left */}
      <motion.div
        ref={heartRef}
        className="absolute top-[75%] left-[1%] pointer-events-none will-change-transform"
        style={{
          y: y2,
          opacity: heartOpacity,
          ...(isMobile ? {} : { scale: heartScale, filter: heartFilter }),
        }}
      >
        <Image
          src={`/images/toys/${selectedImages[2]}`}
          alt=""
          width={180}
          height={180}
          className="w-36 h-36 md:w-56 md:h-56 lg:w-72 lg:h-72"
          priority={false}
        />
      </motion.div>

      {/* Position 4 - Bottom Right */}
      <motion.div
        ref={boneRef}
        className="absolute top-[75%] right-[1%] pointer-events-none will-change-transform"
        style={{
          y: y4,
          opacity: boneOpacity,
          ...(isMobile ? {} : { scale: boneScale, filter: boneFilter }),
        }}
      >
        <Image
          src={`/images/toys/${selectedImages[3]}`}
          alt=""
          width={200}
          height={200}
          className="w-44 h-44 md:w-64 md:h-64 lg:w-96 lg:h-96"
          priority={false}
        />
      </motion.div>
    </div>
  );
}
