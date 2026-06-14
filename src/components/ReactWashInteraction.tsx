import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/game.store';
import { audioManager } from '../audio/audio.manager';
import { SFX } from '../config/audio.config';

interface ReactWashInteractionProps {
  isRescue?: boolean;
  onPostReveal?: () => void;
  onFinish?: () => void;
}

export default function ReactWashInteraction({ isRescue, onPostReveal, onFinish }: ReactWashInteractionProps) {
  const [progress, setProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number }[]>([]);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const scrubAccumulator = useRef(0);
  const bubbleId = useRef(0);
  const playScrubSoundTimer = useRef(0);
  
  const finishFirstWash = useGameStore(state => state.completeWash);
  const finishRescueWash = useGameStore(state => state.completeRescueWash);
  
  const assignedBreed = useGameStore(state => 
    isRescue ? state.rescueBreed : state.assignedBreed
  );

  const initFirstWash = useGameStore(state => state.initializeWash);
  const initRescueWash = useGameStore(state => state.initializeRescueWash);

  useEffect(() => {
    if (!assignedBreed) {
      if (isRescue) {
        initRescueWash();
      } else {
        initFirstWash();
      }
    }
  }, [assignedBreed, isRescue, initFirstWash, initRescueWash]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isRevealed) return;

    const { clientX, clientY } = e;
    
    // Only scrub if near center (middle 60% of screen)
    const cw = window.innerWidth;
    const ch = window.innerHeight;
    const isNearCenter = clientX > cw * 0.2 && clientX < cw * 0.8 &&
                         clientY > ch * 0.2 && clientY < ch * 0.8;
                         
    if (!isNearCenter) {
      lastPos.current = null;
      return;
    }

    if (e.buttons === 0 && e.pointerType === 'mouse') {
      lastPos.current = null;
      return; // Must be pressing if mouse
    }

    if (lastPos.current) {
      const dx = clientX - lastPos.current.x;
      const dy = clientY - lastPos.current.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      scrubAccumulator.current += dist;
      
      if (scrubAccumulator.current > 15) { // Every 15px of movement
        scrubAccumulator.current = 0;
        setProgress(p => Math.min(100, p + 2));
        
        // Bubbles
        if (Math.random() > 0.3) {
          const newBubble = { 
            id: bubbleId.current++, 
            x: clientX + (Math.random() * 60 - 30), 
            y: clientY + (Math.random() * 60 - 30) 
          };
          setBubbles(prev => [...prev.slice(-15), newBubble]);
        }
        
        // Sound delay to prevent aggressive overlapping
        const now = Date.now();
        if (now - playScrubSoundTimer.current > 100) {
          audioManager.playSFX(SFX.WASH_SCRUB);
          playScrubSoundTimer.current = now;
        }
      }
    }
    
    lastPos.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    lastPos.current = null;
  };
  
  useEffect(() => {
    if (progress >= 100 && !isRevealed) {
      setIsRevealed(true);
      audioManager.playSFX(SFX.BREED_REVEAL);
      setTimeout(() => {
        if (onFinish) {
          onFinish();
        } else if (isRescue) {
          finishRescueWash();
        } else {
          if (onPostReveal) {
            onPostReveal();
          } else {
            finishFirstWash();
          }
        }
      }, 3000); // 3 second reveal stay
    }
  }, [progress, isRevealed, finishFirstWash, finishRescueWash, isRescue, onFinish, onPostReveal]);

  // If breed is still generating, just show blank or loading
  if (!assignedBreed) return null;

  return (
    <div 
      className="absolute inset-0 bg-night-plum z-50 overflow-hidden touch-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ userSelect: 'none' }}
    >
      <AnimatePresence>
        {!isRevealed ? (
          <motion.div 
            key="muddy"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('./src/assets/images/muddy-shape.png')` }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="absolute bottom-16 left-0 right-0 text-center text-warm-cream/70 italic text-xl drop-shadow-md pointer-events-none"
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              scrub near the middle to clean...
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="clean"
            className="absolute inset-0 bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url('./src/assets/images/riverside-bridge-close.png')` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1, y: 20 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }}
            >
              <img 
                src={`./src/assets/images/animals/dogs/${assignedBreed.spriteKey}.png`} 
                alt="Pet Revealed" 
                className="pixelated"
                style={{ imageRendering: 'pixelated', width: '128px', height: '128px' }}
                onError={(e) => {
                  // Fallback for missing images mostly for non-husky ones right now
                  e.currentTarget.style.display = 'none';
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isRevealed && (
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {bubbles.map(b => (
              <motion.div
                key={b.id}
                className="absolute w-4 h-4 rounded-full border-2 border-warm-cream/50 bg-warm-cream/20"
                initial={{ x: b.x - 8, y: b.y - 8, scale: 0, opacity: 1 }}
                animate={{ y: b.y - 150, scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                onAnimationComplete={() => {
                  setBubbles(prev => prev.filter(p => p.id !== b.id));
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Flash effect when revealed */}
      <AnimatePresence>
        {isRevealed && progress === 100 && (
          <motion.div
            className="absolute inset-0 bg-warm-cream z-10 pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
