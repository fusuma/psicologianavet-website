'use client';

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
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

  // Mouse position tracking for proximity-based opacity
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scrollTrigger = useMotionValue(0); // Triggers recalculation on scroll

  // Refs to track each image's position
  const ballRef = useRef<HTMLDivElement>(null);
  const miceRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const boneRef = useRef<HTMLDivElement>(null);

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

  // Helper function to calculate opacity based on Y proximity only
  const calculateProximityOpacity = (
    ref: React.RefObject<HTMLDivElement | null>,
    mx: number,
    my: number,
    baseOpacity: number,
    maxOpacity: number = 0.6
  ): number => {
    if (!ref.current) return baseOpacity;

    const rect = ref.current.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;

    // Calculate vertical distance only
    const distance = Math.abs(my - centerY);

    // Define proximity threshold (pixels) - closer than this gets max opacity
    const proximityThreshold = 300;

    if (distance < proximityThreshold) {
      // Linear interpolation from baseOpacity to maxOpacity
      const factor = 1 - distance / proximityThreshold;
      return baseOpacity + (maxOpacity - baseOpacity) * factor;
    }

    return baseOpacity;
  };

  // Proximity-based opacity transforms (update on mouse move AND scroll)
  const ballOpacity = useTransform([mouseX, mouseY, scrollTrigger], ([mx, my]) =>
    calculateProximityOpacity(ballRef, mx as number, my as number, 0.3, 0.6)
  );

  const miceOpacity = useTransform([mouseX, mouseY, scrollTrigger], ([mx, my]) =>
    calculateProximityOpacity(miceRef, mx as number, my as number, 0.25, 0.6)
  );

  const heartOpacity = useTransform([mouseX, mouseY, scrollTrigger], ([mx, my]) =>
    calculateProximityOpacity(heartRef, mx as number, my as number, 0.25, 0.6)
  );

  const boneOpacity = useTransform([mouseX, mouseY, scrollTrigger], ([mx, my]) =>
    calculateProximityOpacity(boneRef, mx as number, my as number, 0.2, 0.6)
  );

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

  // Device orientation listener for mobile accelerometer
  useEffect(() => {
    let isActive = true;
    let orientationHandlerAdded = false;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (!isActive) return;

      // beta: front-back tilt (-180 to 180)
      // gamma: left-right tilt (-90 to 90)
      const beta = event.beta || 0;
      const gamma = event.gamma || 0;

      // Log values for debugging (throttled)
      if (Math.random() < 0.01) {
        console.log('Orientation:', { beta, gamma });
      }

      // Increased sensitivity for more noticeable movement
      motionX.set(gamma * 1.5); // -135 to 135
      motionY.set(beta * 1.0); // -180 to 180
    };

    const setupOrientation = async () => {
      // Check if device supports orientation
      if (typeof window === 'undefined' || !window.DeviceOrientationEvent) {
        console.log('Device orientation not supported');
        return;
      }

      // iOS 13+ requires permission via user interaction
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        console.log('iOS detected - needs permission');

        // Set up a one-time interaction handler to request permission
        const handleFirstInteraction = async (e: Event) => {
          console.log('First interaction detected, requesting permission...');
          try {
            const permissionState = await (DeviceOrientationEvent as any).requestPermission();
            console.log('Device orientation permission:', permissionState);
            if (permissionState === 'granted' && isActive) {
              window.addEventListener('deviceorientation', handleOrientation, { passive: true });
              orientationHandlerAdded = true;
              console.log('✅ Device orientation enabled (iOS)');
            } else {
              console.log('❌ Permission not granted:', permissionState);
            }
          } catch (error) {
            console.warn('Device orientation permission error:', error);
          }
        };

        // Listen to multiple interaction types on document for better capture
        document.addEventListener('touchstart', handleFirstInteraction, { once: true, passive: true });
        document.addEventListener('click', handleFirstInteraction, { once: true });
        console.log('👆 Tap anywhere to enable device tilt');
      } else {
        // Non-iOS or older iOS - no permission needed
        window.addEventListener('deviceorientation', handleOrientation, { passive: true });
        orientationHandlerAdded = true;
        console.log('Device orientation enabled (non-iOS)');
      }
    };

    setupOrientation();

    return () => {
      isActive = false;
      if (orientationHandlerAdded) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, [motionX, motionY]);

  return (
    <>
      {/* Ball - Upper Right */}
      <motion.div
        ref={ballRef}
        className="absolute top-[25%] right-[1%] z-0 pointer-events-none"
        style={{
          y: useTransform([y1, smoothY], ([scroll, tilt]) => (scroll as number) + (tilt as number) * 1.2),
          x: useTransform(smoothX, (x) => x * -1.2),
          opacity: ballOpacity,
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
          className="w-40 h-40 md:w-64 md:h-64 lg:w-80 lg:h-80"
          priority={false}
        />
      </motion.div>

      {/* Mice - Middle Left */}
      <motion.div
        ref={miceRef}
        className="absolute top-[50%] left-[1%] z-0 pointer-events-none"
        style={{
          y: useTransform([y3, smoothY], ([scroll, tilt]) => (scroll as number) + (tilt as number) * 1.4),
          x: useTransform(smoothX, (x) => x * 1.0),
          opacity: miceOpacity,
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
          className="w-44 h-44 md:w-64 md:h-64 lg:w-96 lg:h-96"
          priority={false}
        />
      </motion.div>

      {/* Heart - Bottom Left */}
      <motion.div
        ref={heartRef}
        className="absolute top-[90%] left-[1%] z-0 pointer-events-none"
        style={{
          y: useTransform([y2, smoothY], ([scroll, tilt]) => (scroll as number) + (tilt as number) * 0.9),
          x: useTransform(smoothX, (x) => x * 0.9),
          opacity: heartOpacity,
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
          className="w-36 h-36 md:w-56 md:h-56 lg:w-72 lg:h-72"
          priority={false}
        />
      </motion.div>

      {/* Bone - Bottom Right */}
      <motion.div
        ref={boneRef}
        className="absolute top-[75%] right-[1%] z-0 pointer-events-none"
        style={{
          y: useTransform([y4, smoothY], ([scroll, tilt]) => (scroll as number) + (tilt as number) * 1.0),
          x: useTransform(smoothX, (x) => x * -1.3),
          opacity: boneOpacity,
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
          className="w-44 h-44 md:w-64 md:h-64 lg:w-96 lg:h-96"
          priority={false}
        />
      </motion.div>
    </>
  );
}
