import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Heart {
  id: string;
  x: number;
  y: number;
}

export const useHeartParticles = () => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  const addHeart = (x: number, y: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    setHearts((prev) => [...prev, { id, x, y }]);
    
    // Automatically remove the heart after animation duration
    setTimeout(() => {
      setHearts((prev) => prev.filter(h => h.id !== id));
    }, 1500);
  };

  return { hearts, addHeart };
};

interface HeartParticlesProps {
  hearts: Heart[];
}

export default function HeartParticle({ hearts }: HeartParticlesProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[500]">
      <AnimatePresence>
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 1, y: heart.y, x: heart.x, scale: 0.5 }}
            animate={{ opacity: 0, y: heart.y - 100, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute text-pink-500 will-change-transform"
            style={{ left: 0, top: 0 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-8 h-8"
              style={{ filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.3))' }}
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
