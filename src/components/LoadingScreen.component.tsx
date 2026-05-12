import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('Initializing rescue systems...');

  const tips = [
    'Brushing animals reduces their stress levels.',
    'Keep your vet wing upgraded to handle exotic species.',
    'Comfortable rooms lead to happier morning reunions.',
    'Check the morning board daily for high-rarity rescues.',
    'Some species require specific medicine to stay healthy.'
  ];

  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % tips.length);
    }, 3000);

    const loadInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(loadInterval);
          setTimeout(onFinish, 800);
          return 100;
        }
        
        // Dynamic loading text
        if (prev > 80) setText('Finalizing shelter layout...');
        else if (prev > 50) setText('Waking up the animals...');
        else if (prev > 20) setText('Stocking vet supplies...');
        
        return prev + Math.random() * 8;
      });
    }, 150);

    return () => {
      clearInterval(tipInterval);
      clearInterval(loadInterval);
    };
  }, [onFinish, tips.length]);

  return (
    <div className="fixed inset-0 z-[500] bg-night-plum flex flex-col items-center justify-center font-pixel p-8">
      {/* Animated Logo Placeholder */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], rotate: [0, -2, 2, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="mb-16 flex flex-col items-center"
      >
        <span className="text-8xl mb-6">🐾</span>
        <h1 className="text-3xl font-game text-speaker-rose uppercase tracking-tighter shadow-speaker-rose/20">Pixel Paws</h1>
        <div className="text-[10px] text-muted-sage uppercase tracking-[0.5em] mt-2 italic">Shelter Management</div>
      </motion.div>

      {/* Progress Bar */}
      <div className="w-full max-w-sm">
        <div className="flex justify-between items-center mb-2 text-[8px] uppercase tracking-widest text-soft-lilac">
          <motion.span key={text} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{text}</motion.span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-stone-grey/10 rounded-full overflow-hidden border border-stone-grey/30 p-[1px]">
          <motion.div 
            className="h-full bg-mossy-green shadow-[0_0_15px_rgba(122,184,122,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Rotating Tip */}
      <div className="mt-20 text-center max-w-xs">
        <div className="text-[7px] text-muted-sage uppercase tracking-[0.2em] mb-2 font-bold opacity-40">Pro Tip</div>
        <AnimatePresence mode="wait">
          <motion.p 
            key={tipIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-[9px] text-soft-lilac/60 uppercase tracking-widest leading-relaxed h-12"
          >
            {tips[tipIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-12 text-[6px] text-stone-grey uppercase tracking-widest">
        Pixel Paws Studio © 2026
      </div>
    </div>
  );
}
