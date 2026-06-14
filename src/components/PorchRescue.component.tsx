import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../stores/game.store';
import AnimalSprite from './AnimalSprite.component';

export default function PorchRescue({ onFinish }: { onFinish?: () => void }) {
  const rescueBreed = useGameStore(state => state.rescueBreed);
  const setPhase6State = useGameStore(state => state.setPhase6State);

  // Gameplay state
  const [safePosition, setSafePosition] = useState(1); // 0: Left, 1: Center, 2: Right
  const [curiosity, setCuriosity] = useState(0); // 0 to 100
  const [isComplete, setIsComplete] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [eyeState, setEyeState] = useState<'hidden' | 'nervous' | 'curious'>('nervous');
  const [hintMessage, setHintMessage] = useState('Wait for a sign from the shadows...');

  useEffect(() => {
    setSafePosition(Math.floor(Math.random() * 3));
  }, []);

  const handleApproach = (pos: number) => {
    if (isComplete) return;

    if (pos === safePosition) {
      // Good!
      setEyeState('curious');
      setHintMessage('They like this angle! They are watching you closely...');
      
      // Randomize position for the next move (per user request: can be same spot)
      setSafePosition(Math.floor(Math.random() * 3));

      setCuriosity(prev => {
        const next = Math.min(100, prev + 34);
        if (next >= 100 && !isComplete) {
          setIsComplete(true);
          setHintMessage('They trust you enough to come out!');
          setTimeout(() => setShowCompletion(true), 2500);
        }
        return next;
      });
    } else {
      // Bad!
      setEyeState('hidden');
      setHintMessage('They retreated deeper into the shadows... try another way.');
      setCuriosity(prev => Math.max(0, prev - 15));
      // Re-randomize to avoid just mashing
      const newPos = [0, 1, 2].filter(p => p !== pos)[Math.floor(Math.random() * 2)];
      setSafePosition(prev => Math.random() > 0.4 ? newPos : prev);
      
      // Return to nervous after a bit
      setTimeout(() => {
        if (!isComplete) setEyeState('nervous');
      }, 1500);
    }
  };

  // Eye visual logic
  const getEyeProperties = () => {
    // defaults
    let opacity = 0.4 + (curiosity / 100) * 0.6;
    let scale = 0.6 + (curiosity / 100) * 0.4;
    let yOffset = isComplete ? 20 : 0;
    
    if (eyeState === 'hidden') {
      opacity = 0.1;
      scale = 0.4;
      yOffset = -15;
    } else if (eyeState === 'curious') {
      scale += 0.25;
      yOffset = 5;
    }

    if (isComplete) {
      opacity = 0; // Transition to sprite
    }

    return { opacity, scale, yOffset };
  };

  const { opacity: eyeOpacity, scale: eyeScale, yOffset: eyeY } = getEyeProperties();

  const handleFinish = () => {
    if (onFinish) {
      onFinish();
    } else {
      setPhase6State('wash_rescue');
    }
  };

  if (!rescueBreed) return null;

  return (
    <div className="relative w-full h-full bg-black overflow-hidden font-pixel select-none">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="./src/assets/images/backgrounds/porch.png" 
          alt="Porch" 
          className="w-full h-full object-cover object-bottom"
          style={{ filter: `brightness(${isComplete ? 1 : 0.5}) saturate(${isComplete ? 1 : 0.8})`, transition: 'all 3s ease' }}
        />
        {/* Darkness overlay that fades out on complete */}
        <div 
          className="absolute inset-0 bg-black transition-opacity duration-3000 pointer-events-none"
          style={{ opacity: isComplete ? 0 : 0.4 }}
        />
      </div>

      {/* The Hiding Spot - Positioned slightly lower for better alignment */}
      <div className="absolute w-full flex items-center justify-center pointer-events-none z-10 bottom-[35%]">
        
        {/* Glowing Eyes */}
        <motion.div
           className="absolute flex gap-4"
           animate={{
             opacity: eyeOpacity,
             scale: eyeScale,
             y: eyeY,
             x: eyeState === 'nervous' ? [-1, 1, -1] : 0
           }}
           transition={{
             x: { repeat: Infinity, duration: 0.15 },
             default: { duration: 0.6 }
           }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-warm-cream shadow-[0_0_12px_rgba(255,245,230,0.9)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-warm-cream shadow-[0_0_12px_rgba(255,245,230,0.9)]" />
        </motion.div>

        {/* Revealed Animal */}
        <motion.div
          className="absolute transition-opacity duration-2000"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ 
            opacity: isComplete ? 1 : 0,
            scale: isComplete ? 1 : 0.8,
            y: isComplete ? 50 : 20
          }}
        >
          <AnimalSprite 
             spriteKey={rescueBreed.spriteKey}
             animation={isComplete ? 'curious' : 'idle'}
             size={90}
          />
        </motion.div>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-30 flex flex-col justify-between py-6 px-4">
        <div className="w-full max-w-md mx-auto space-y-3">
          <header className="text-center space-y-2 drop-shadow-md bg-black/50 backdrop-blur-sm rounded-2xl p-4 border border-warm-cream/10">
            <h2 className="text-warm-cream text-[10px] uppercase tracking-[0.3em] font-game opacity-60">Encounter</h2>
            <h1 className="text-warm-cream text-sm uppercase tracking-[0.1em] font-game">The Hiding Guest</h1>
            <div className="min-h-[30px] flex items-center justify-center mt-2">
              <p className="text-warm-cream/90 text-[10px] leading-relaxed tracking-wide text-center italic">
                "{hintMessage}"
              </p>
            </div>
          </header>

          {!showCompletion && (
            <div className="grid grid-cols-3 gap-2 w-full">
              <button 
                onClick={() => handleApproach(0)} 
                className="bg-black/60 hover:bg-black/80 border border-warm-cream/20 text-warm-cream text-[9px] uppercase tracking-widest py-3 rounded-xl transition-all active:scale-95"
              >
                Left
              </button>
              <button 
                onClick={() => handleApproach(1)} 
                className="bg-black/60 hover:bg-black/80 border border-warm-cream/20 text-warm-cream text-[9px] uppercase tracking-widest py-3 rounded-xl transition-all active:scale-95"
              >
                Center
              </button>
              <button 
                onClick={() => handleApproach(2)} 
                className="bg-black/60 hover:bg-black/80 border border-warm-cream/20 text-warm-cream text-[9px] uppercase tracking-widest py-3 rounded-xl transition-all active:scale-95"
              >
                Right
              </button>
            </div>
          )}
        </div>

        <footer className="w-full max-w-md mx-auto space-y-5 pb-6 flex flex-col justify-end">
          {showCompletion && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleFinish}
              className="w-full bg-warm-cream text-night-plum py-5 rounded-2xl font-game text-xs uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(255,245,230,0.4)] hover:bg-white active:scale-95 mb-4"
            >
              Reach Out
            </motion.button>
          )}

          {!showCompletion && (
            <div className="w-full px-2 space-y-5">
               {/* Progress Bar w/ Visual Label */}
               <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                     <span className="text-warm-cream/40 text-[9px] uppercase tracking-[0.2em] font-game">Curiosity</span>
                     <span className="text-warm-cream/80 text-[10px] font-mono">{Math.floor(curiosity)}%</span>
                  </div>
                  <div className="relative h-2.5 bg-black/40 rounded-full border border-warm-cream/10 overflow-hidden shadow-inner">
                     <motion.div 
                       className="h-full bg-gradient-to-r from-warm-cream/60 to-warm-cream"
                       initial={{ width: '0%' }}
                       animate={{ width: `${curiosity}%` }}
                       transition={{ duration: 0.5, ease: "easeOut" }}
                     />
                  </div>
               </div>
            </div>
          )}

          <div className="flex flex-col items-center pt-2">
            <button 
              onClick={() => setPhase6State('phone_call')}
              className="text-[8px] text-warm-cream/40 hover:text-warm-cream uppercase tracking-widest transition-colors font-game"
            >
              Step Away (Cancel)
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
