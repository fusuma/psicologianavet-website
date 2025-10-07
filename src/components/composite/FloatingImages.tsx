'use client';

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';
import { useEffect } from 'react';

/**
 * FloatingImages Component
 *
 * Displays decorative pet-themed images with advanced scroll-triggered parallax effects.
 *
 * Features:
 * - GSAP-style scroll parallax (each image moves at different speeds)
 * - Scroll-linked fade effect (images fade as you scroll)
 * - Mobile gyroscope/accelerometer support for tilt-based movement
 * - Staggered entrance animations when scrolling into view
 * - Responsive sizing (larger on desktop, smaller on mobile)
 *
 * Mobile Accelerometer:
 * - On iOS 13+: First tap/touch requests permission, then tilt phone to see effect
 * - On Android/other: Works automatically, no permission needed
 * - Desktop: Only scroll parallax (no tilt effect)
 */
export function FloatingImages() {
  const { scrollYProgress } = useScroll();

  // Device motion values for mobile tilt
  const motionX = useMotionValue(0);
  const motionY = useMotionValue(0);

  // Smooth spring animation for device motion
  const smoothX = useSpring(motionX, { damping: 20, stiffness: 100 });
  const smoothY = useSpring(motionY, { damping: 20, stiffness: 100 });

  // GSAP-style parallax transforms (different speeds for depth)
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, -120]);

  // Scroll-triggered fade and scale
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 0.25, 0.2, 0.1]);

  // Device orientation listener for mobile accelerometer
  useEffect(() => {
    let isActive = true;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (!isActive) return;

      // beta: front-back tilt (-180 to 180)
      // gamma: left-right tilt (-90 to 90)
      const beta = event.beta || 0;
      const gamma = event.gamma || 0;

      // Normalize to subtle movement range
      motionX.set(gamma * 0.5); // -45 to 45
      motionY.set(beta * 0.3); // -54 to 54
    };

    const setupOrientation = async () => {
      // Check if device supports orientation
      if (typeof window === 'undefined' || !window.DeviceOrientationEvent) return;

      // iOS 13+ requires permission via user interaction
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        // Set up a one-time click handler to request permission
        const handleFirstTouch = async () => {
          try {
            const permissionState = await (DeviceOrientationEvent as any).requestPermission();
            if (permissionState === 'granted' && isActive) {
              window.addEventListener('deviceorientation', handleOrientation);
            }
          } catch (error) {
            console.warn('Device orientation permission denied:', error);
          }
          // Remove this listener after first interaction
          window.removeEventListener('click', handleFirstTouch);
          window.removeEventListener('touchstart', handleFirstTouch);
        };

        window.addEventListener('click', handleFirstTouch, { once: true });
        window.addEventListener('touchstart', handleFirstTouch, { once: true });
      } else {
        // Non-iOS or older iOS - no permission needed
        window.addEventListener('deviceorientation', handleOrientation);
      }
    };

    setupOrientation();

    return () => {
      isActive = false;
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [motionX, motionY]);

  return (
    <>
      {/* Ball - Upper Right */}
      <motion.div
        className="absolute top-[25%] right-[5%] z-0 pointer-events-none"
        style={{
          y: y1,
          opacity,
          x: useTransform(smoothX, (x) => x * -0.8),
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.3, scale: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Image
          src="/images/ball.png"
          alt=""
          width={200}
          height={200}
          className="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56"
          priority={false}
        />
      </motion.div>

      {/* Mice - Middle Left */}
      <motion.div
        className="absolute top-[50%] left-[8%] z-0 pointer-events-none"
        style={{
          y: y3,
          opacity,
          x: useTransform(smoothX, (x) => x * 0.7),
        }}
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 0.25, x: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
      >
        <Image
          src="/images/mice.png"
          alt=""
          width={200}
          height={200}
          className="w-36 h-36 md:w-48 md:h-48 lg:w-60 lg:h-60"
          priority={false}
        />
      </motion.div>

      {/* Heart - Bottom Left */}
      <motion.div
        className="absolute top-[90%] left-[5%] z-0 pointer-events-none"
        style={{
          y: y2,
          opacity,
          x: useTransform(smoothX, (x) => x * 0.6),
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.25, scale: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
      >
        <Image
          src="/images/heart.png"
          alt=""
          width={180}
          height={180}
          className="w-28 h-28 md:w-40 md:h-40 lg:w-48 lg:h-48"
          priority={false}
        />
      </motion.div>

      {/* Bone - Bottom Right */}
      <motion.div
        className="absolute top-[75%] right-[8%] z-0 pointer-events-none"
        style={{
          y: y4,
          opacity,
          x: useTransform(smoothX, (x) => x * -0.9),
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.2, scale: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
      >
        <Image
          src="/images/bone.png"
          alt=""
          width={200}
          height={200}
          className="w-36 h-36 md:w-48 md:h-48 lg:w-60 lg:h-60"
          priority={false}
        />
      </motion.div>
    </>
  );
}
