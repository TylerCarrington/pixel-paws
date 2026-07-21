import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../stores/game.store';
import AnimalSprite from './AnimalSprite.component';
import { motion, AnimatePresence } from 'motion/react';

export default function LightSearch({ onFinish }: { onFinish?: () => void }) {
  const rescueBreed = useGameStore(state => state.rescueBreed);
  const setPhase6State = useGameStore(state => state.setPhase6State);
  
  // Flashlight and hidden target system
  const [discoveryProgress, setDiscoveryProgress] = useState(0); // 0 to 100
  const [isComplete, setIsComplete] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [message, setMessage] = useState('Search the darkness...');
  
  const flashlightPos = useRef({ x: 50, y: 50 });
  
  const targetPos = useRef({ x: 80, y: 80 });
  const initializedPos = useRef(false);
  
  if (!initializedPos.current) {
    let x, y, dist;
    do {
      x = 15 + Math.random() * 70;
      y = 15 + Math.random() * 70;
      const dx = x - 50;
      const dy = y - 50;
      dist = Math.sqrt(dx*dx + dy*dy);
    } while (dist < 25); // Don't spawn within 25% of the center start
    targetPos.current = { x, y };
    initializedPos.current = true;
  }
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setForceRender] = useState(0); 


  // Removed useEffect for targetPos initialization


  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isComplete) return;
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    flashlightPos.current = { x, y };
    setForceRender(prev => prev + 1);
  };

  useEffect(() => {
    if (isComplete) return;

    let interval: NodeJS.Timeout;
    
    interval = setInterval(() => {
      // Calculate distance between flashlight and target
      const dx = flashlightPos.current.x - targetPos.current.x;
      const dy = flashlightPos.current.y - targetPos.current.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      const isIlluminated = dist < 10; // Within 10% distance (less forgiving)
      
      if (isIlluminated) {
         setMessage('You see something shivering... hold the light there.');
      } else {
         setMessage('Search the darkness...');
      }

      setDiscoveryProgress(prev => {
        let next = prev;
        if (isIlluminated) {
          next += 2; // Rapid progress when found
        } else {
          next -= 1; // Slow decay if light leaves
        }
        
        next = Math.max(0, Math.min(100, next));
        
        if (next === 100 && !isComplete) {
          setIsComplete(true);
          setMessage('You found the poor animal!');
          setTimeout(() => setShowCompletion(true), 2000);
        }
        return next;
      });
      
    }, 50);

    return () => clearInterval(interval);
  }, [isComplete]);

  const handleFinish = () => {
    if (onFinish) {
      onFinish();
    } else {
      setPhase6State('wash_rescue');
    }
  };

  if (!rescueBreed) return null;

  // Visual calculations based on progress
  const visibilityEffect = discoveryProgress / 100;

  return (
    <div 
       ref={containerRef}
       className="relative w-full h-full bg-black overflow-hidden font-pixel"
       onPointerMove={handlePointerMove}
       onPointerDown={handlePointerMove}
       style={{ touchAction: 'none' }} // Prevent scrolling while swiping flashlight
    >
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src="./src/assets/images/backgrounds/construction-shed.png" 
          className="w-full h-full object-cover"
          alt="Construction Shed"
          onError={(e) => {
            e.currentTarget.style.backgroundColor = '#1a1a2e';
          }}
        />
      </div>

      {/* Post-completion dim layer (so it isn't fully bright) */}
      <div 
        className={`absolute inset-0 z-0 bg-black transition-opacity duration-[2000ms] pointer-events-none ${isComplete ? 'opacity-40' : 'opacity-0'}`}
      />

      {/* Target Animal (Hidden in dark) */}
      <div 
        className="absolute z-10 pointer-events-none transition-all duration-300"
        style={{
          left: `${targetPos.current.x}%`,
          top: `${targetPos.current.y}%`,
          transform: 'translate(-50%, -50%)',
          // Only show up heavily heavily shadowed if not complete
          filter: isComplete ? 'brightness(1)' : `brightness(${0.2 + visibilityEffect * 0.4}) saturate(${0.2 + visibilityEffect * 0.5})`
        }}
      >
         <motion.div
           animate={isComplete ? { y: [0, -10, 0] } : { x: visibilityEffect > 0.3 ? 0 : [-1, 1, -1] }}
           transition={isComplete ? { duration: 0.6, ease: "easeOut" } : { repeat: Infinity, duration: 0.1 }}
         >
           <AnimalSprite 
              spriteKey={rescueBreed.spriteKey}
              species={useGameStore.getState().rescueSpecies || 'DOG'}
              animation={isComplete ? 'happy' : (visibilityEffect > 0.5 ? 'curious' : 'shivering')}
              size={isComplete ? 120 : 50 + visibilityEffect * 15}
           />
         </motion.div>
      </div>

      {/* Flashlight Mask Overlay Layer */}
      <div 
        className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-[2000ms] ${isComplete ? 'opacity-0' : 'opacity-100'}`}
        style={{
          background: `radial-gradient(circle 70px at ${flashlightPos.current.x}% ${flashlightPos.current.y}%, transparent 0%, rgba(0,0,0,0.8) 60px, #000 75px)`
        }}
      />

      {/* Floating Dust Particles */}
      <div className="absolute inset-0 z-25 pointer-events-none mix-blend-screen opacity-40">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-warm-cream/30 rounded-full"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              opacity: 0 
            }}
            animate={{ 
              x: `+=${(Math.random() - 0.5) * 10}%`,
              y: `+=${(Math.random() - 0.5) * 10}%`,
              opacity: [0, 0.8, 0]
            }}
            transition={{ 
              duration: 3 + Math.random() * 4, 
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>

      {/* Game Content Header / UI */}
      <div className="relative z-30 w-full h-full flex flex-col items-center justify-between py-6 px-4 pointer-events-none">
        
        <header className="text-center space-y-2 drop-shadow-md w-full bg-black/40 backdrop-blur rounded-xl p-3 border border-warm-cream/10 pointer-events-auto">
          <h2 className="text-warm-cream text-xs uppercase tracking-[0.2em] font-game">Shed in the Dark</h2>
          <p className="text-warm-cream/80 text-[10px] uppercase tracking-widest min-h-[15px]">{message}</p>
        </header>

        {/* UI Controls */}
        <footer className="w-full max-w-md space-y-4 pb-4 flex flex-col justify-end pointer-events-auto">
          {!showCompletion ? (
            <div className="w-full space-y-2 px-2 pb-2">
                 <div className="flex justify-between items-end">
                    <span className="text-warm-cream/60 text-[8px] uppercase tracking-widest">Visibility</span>
                    <span className={`text-[10px] ${discoveryProgress > 80 ? 'text-green-300' : 'text-warm-cream'}`}>{Math.floor(discoveryProgress)}%</span>
                 </div>
                 <div className="relative h-2 bg-black/50 rounded-full border border-warm-cream/20 overflow-hidden">
                    <motion.div 
                      className={`h-full ${discoveryProgress > 80 ? 'bg-green-400' : 'bg-warm-cream'}`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${discoveryProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                 </div>
                 <p className="text-center pt-2 text-[8px] text-warm-cream/40 uppercase tracking-widest font-game">
                    Drag around to move the flashlight
                 </p>
            </div>
          ) : (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleFinish}
              className="w-full bg-warm-cream text-night-plum py-4 rounded-xl font-game text-xs uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(255,245,230,0.4)] hover:bg-white active:scale-95"
            >
              Reach Out & Rescue
            </motion.button>
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
