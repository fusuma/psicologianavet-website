'use client';

import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

/**
 * FloatingImages Component
 *
 * Displays decorative pet-themed images with advanced scroll-triggered parallax effects.
 *
 * Features:
 * - GSAP-style scroll parallax (each image moves at different speeds)
 * - Scroll-linked fade effect (images fade as you scroll)
 * - Proximity-based opacity (images become more visible when mouse is closer)
 * - Staggered entrance animations when scrolling into view
 * - Responsive sizing (larger on desktop, smaller on mobile)
 */
export function FloatingImages() {
  const { scrollYProgress } = useScroll();

  // Mouse position tracking for proximity-based opacity
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scrollTrigger = useMotionValue(0); // Triggers recalculation on scroll

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
    scrollProgress: number = 0
  ): number => {
    if (!ref.current) return baseOpacity;

    const rect = ref.current.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;

    // Calculate vertical distance only
    const distance = Math.abs(my - centerY);

    // Increase proximity threshold as you scroll (300px at top, 1000px at bottom)
    const proximityThreshold = 300 + (scrollProgress * 700);

    if (distance < proximityThreshold) {
      // Linear interpolation from baseOpacity to maxOpacity
      const factor = 1 - distance / proximityThreshold;
      return baseOpacity + (maxOpacity - baseOpacity) * factor;
    }

    return baseOpacity;
  };

  // Proximity-based opacity transforms (update on mouse move AND scroll)
  const ballOpacity = useTransform([mouseX, mouseY, scrollTrigger, scrollYProgress], ([mx, my, _, scroll]) =>
    calculateProximityOpacity(ballRef, mx as number, my as number, 0.3, 0.6, scroll as number)
  );

  const miceOpacity = useTransform([mouseX, mouseY, scrollTrigger, scrollYProgress], ([mx, my, _, scroll]) =>
    calculateProximityOpacity(miceRef, mx as number, my as number, 0.25, 0.6, scroll as number)
  );

  const heartOpacity = useTransform([mouseX, mouseY, scrollTrigger, scrollYProgress], ([mx, my, _, scroll]) =>
    calculateProximityOpacity(heartRef, mx as number, my as number, 0.25, 0.6, scroll as number)
  );

  const boneOpacity = useTransform([mouseX, mouseY, scrollTrigger, scrollYProgress], ([mx, my, _, scroll]) =>
    calculateProximityOpacity(boneRef, mx as number, my as number, 0.2, 0.6, scroll as number)
  );

  // Blur transforms - inversely proportional to opacity (more blur when less visible)
  const ballBlur = useTransform(ballOpacity, [0.3, 0.6], [5.6, 0]);
  const miceBlur = useTransform(miceOpacity, [0.25, 0.6], [7, 0]);
  const heartBlur = useTransform(heartOpacity, [0.25, 0.6], [7, 0]);
  const boneBlur = useTransform(boneOpacity, [0.2, 0.6], [8.4, 0]);

  // Scale transforms - proportional to opacity (smaller when faded)
  const ballScale = useTransform(ballOpacity, [0.3, 0.6], [0.8, 1.0]);
  const miceScale = useTransform(miceOpacity, [0.25, 0.6], [0.8, 1.0]);
  const heartScale = useTransform(heartOpacity, [0.25, 0.6], [0.8, 1.0]);
  const boneScale = useTransform(boneOpacity, [0.2, 0.6], [0.8, 1.0]);

  // Mouse tracking for proximity-based opacity
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    const handleScroll = () => {
      // Trigger recalculation by updating scrollTrigger
      scrollTrigger.set(Math.random());
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mouseX, mouseY, scrollTrigger]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Ball - Upper Right */}
      <motion.div
        ref={ballRef}
        className="absolute top-[15%] right-[-15%] md:right-[-8%] pointer-events-none"
        style={{
          y: y1,
          opacity: ballOpacity,
          scale: ballScale,
          filter: useTransform(ballBlur, (b) => `blur(${b}px)`),
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.3 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Image
          src="/images/ball.png"
          alt=""
          width={200}
          height={200}
          className="w-40 h-40 md:w-64 md:h-64 lg:w-80 lg:h-80"
          priority={false}
        />
      </motion.div>

      {/* Mice - Middle Left */}
      <motion.div
        ref={miceRef}
        className="absolute top-[50%] left-[-8%] pointer-events-none"
        style={{
          y: y3,
          opacity: miceOpacity,
          scale: miceScale,
          filter: useTransform(miceBlur, (b) => `blur(${b}px)`),
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.25 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
      >
        <Image
          src="/images/mice.png"
          alt=""
          width={200}
          height={200}
          className="w-44 h-44 md:w-64 md:h-64 lg:w-96 lg:h-96"
          priority={false}
        />
      </motion.div>

      {/* Heart - Bottom Left */}
      <motion.div
        ref={heartRef}
        className="absolute top-[75%] left-[1%] pointer-events-none"
        style={{
          y: y2,
          opacity: heartOpacity,
          scale: heartScale,
          filter: useTransform(heartBlur, (b) => `blur(${b}px)`),
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.25 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
      >
        <Image
          src="/images/heart.png"
          alt=""
          width={180}
          height={180}
          className="w-36 h-36 md:w-56 md:h-56 lg:w-72 lg:h-72"
          priority={false}
        />
      </motion.div>

      {/* Bone - Bottom Right */}
      <motion.div
        ref={boneRef}
        className="absolute top-[75%] right-[1%] pointer-events-none"
        style={{
          y: y4,
          opacity: boneOpacity,
          scale: boneScale,
          filter: useTransform(boneBlur, (b) => `blur(${b}px)`),
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.2 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
      >
        <Image
          src="/images/bone.png"
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
