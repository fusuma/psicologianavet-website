'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

/**
 * TiltingBookCover Component
 *
 * Displays the book cover with a 3D tilt effect that responds to mouse movement
 * Creates an interactive hover effect with perspective rotation
 */
export function TiltingBookCover() {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation based on mouse position relative to center
    // Max rotation of 15 degrees
    const rotX = ((y - centerY) / centerY) * -15;
    const rotY = ((x - centerX) / centerX) * 15;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="flex justify-center perspective-1000">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        whileHover={{ scale: 1.05 }}
        className="cursor-pointer"
      >
        <Image
          src="/images/cover.png"
          alt="Capa do livro Quando um amor se vai"
          width={300}
          height={400}
          className="rounded-lg shadow-xl"
        />
      </motion.div>
    </div>
  );
}
