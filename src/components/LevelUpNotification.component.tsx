import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/game.store';
import Confetti from 'react-confetti';

export default function LevelUpNotification() {
  const levelUpQueue = useGameStore(state => state.levelUpQueue);
  const popLevelUp = useGameStore(state => state.popLevelUp);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (levelUpQueue.length === 0) return null;

  const currentNotif = levelUpQueue[0];

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
      <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} />
      
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: -20 }}
        className="pointer-events-auto bg-warm-cream border-4 border-amber-glow p-6 rounded-xl shadow-2xl flex flex-col items-center max-w-sm text-center"
      >
        <div className="text-4xl mb-4">🌟</div>
        <h2 className="text-2xl font-game text-speaker-rose mb-2">Level Up!</h2>
        <p className="text-lg font-pixel text-stone-grey mb-4">
          <span className="text-amber-glow font-bold">{currentNotif.name}</span> reached Level <span className="text-amber-glow font-bold">{currentNotif.level}</span>!
        </p>
        
        <button
          onClick={popLevelUp}
          className="mt-2 bg-amber-glow hover:bg-amber-500 text-white font-pixel text-sm px-6 py-3 rounded-lg shadow-md active:scale-95 transition-all"
        >
          Nice!
        </button>
      </motion.div>
    </div>
  );
}
