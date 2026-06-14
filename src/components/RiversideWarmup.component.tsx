import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../stores/game.store';
import AnimalSprite from './AnimalSprite.component';

export default function RiversideWarmup({ onFinish }: { onFinish?: () => void }) {
  const rescueBreed = useGameStore(state => state.rescueBreed);
  const setPhase6State = useGameStore(state => state.setPhase6State);

  const [warmth, setWarmth] = useState(0); // 0 to 100
  const [isComplete, setIsComplete] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [towelPos, setTowelPos] = useState({ x: 200, y: 500 }); // Visible start position
  const [isDragging, setIsDragging] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastPosRef = useRef<{ x: number, y: number, time: number } | null>(null);

  // Set initial position based on container size once mounted
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTowelPos({ x: rect.width / 2, y: rect.height * 0.7 });
    }
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isComplete || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTowelPos({ x, y });

    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;

    // Gesture analysis
    const now = Date.now();
    if (lastPosRef.current) {
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      const dt = now - lastPosRef.current.time;
      if (dt > 0) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = dist / dt;

        // Check if near animal (roughly center-ish)
        const isNearAnimal = pctX > 30 && pctX < 70 && pctY > 35 && pctY < 85;

        if (isNearAnimal) {
          if (speed > 0.05 && speed < 1.5) {
            // Good speed
            setWarmth(prev => {
              const next = Math.min(100, prev + 0.8);
              if (next >= 100 && !isComplete) {
                setIsComplete(true);
                setTimeout(() => setShowCompletion(true), 3000);
              }
              return next;
            });
            setFeedback(null);
          } else if (speed >= 1.5) {
            // Too fast!
            setWarmth(prev => Math.max(0, prev - 0.5));
            setFeedback('Too rough! Slow down...');
          }
        }
      }
    }

    lastPosRef.current = { x: e.clientX, y: e.clientY, time: now };
  };

  const handleFinish = () => {
    if (onFinish) {
      onFinish();
    } else {
      setPhase6State('wash_rescue');
    }
  };

  if (!rescueBreed) return null;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-slate-900 overflow-hidden font-pixel select-none cursor-none touch-none"
      onPointerMove={handlePointerMove}
      onPointerDown={() => setIsDragging(true)}
      onPointerUp={() => { setIsDragging(false); lastPosRef.current = null; }}
      onPointerLeave={() => { setIsDragging(false); lastPosRef.current = null; }}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="./src/assets/images/backgrounds/riverside-cold.png" 
          alt="Riverside" 
          className="w-full h-full object-cover"
          style={{ 
            filter: `brightness(${0.6 + (warmth/100)*0.4}) saturate(${0.5 + (warmth/100)*0.5})`,
            transition: 'filter 1s ease'
          }}
        />
        {/* Cold Blue Overlay */}
        <div 
          className="absolute inset-0 bg-blue-900/20 mix-blend-overlay transition-opacity duration-1000"
          style={{ opacity: 1 - (warmth/100) }}
        />
      </div>

      {/* Animal */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bottom-[10%]">
        <motion.div
           animate={isComplete ? {
             y: [0, -20, 0, -10, 0],
             rotate: [0, 5, -5, 5, -5, 0],
             scale: [1, 1.1, 1, 1.05, 1]
           } : {
             x: warmth < 100 ? [-1, 1, -1] : 0,
             scale: 1,
             filter: `grayscale(${Math.max(0, 0.6 - warmth/100)}) contrast(${1 + (100 - warmth)/200})`
           }}
           transition={isComplete ? { duration: 1.5, ease: "easeInOut" } : {
             x: { repeat: Infinity, duration: 0.1 / (1 + warmth/50) },
             default: { duration: 0.5 }
           }}
        >
          <AnimalSprite 
             spriteKey={rescueBreed.spriteKey}
             animation={isComplete ? 'happy' : 'shivering'}
             size={100}
          />
          
          {/* Water Droplets (decreasing with warmth) */}
          <AnimatePresence>
            {!isComplete && Array.from({ length: Math.floor((100-warmth)/10) }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: 20, opacity: [0, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1 + Math.random(), delay: Math.random() * 2 }}
                className="absolute w-1 h-2 bg-blue-300/40 rounded-full"
                style={{ 
                  left: `${20 + Math.random() * 60}%`, 
                  top: `${30 + Math.random() * 40}%` 
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Towel (Following Cursor) */}
      <motion.div
        className="absolute w-32 h-32 pointer-events-none z-20"
        animate={{
          x: towelPos.x - 64,
          y: isDragging ? towelPos.y - 64 : [towelPos.y - 64, towelPos.y - 72, towelPos.y - 64],
          rotate: isDragging ? [-3, 3, -3] : 0,
          scale: isDragging ? 1.1 : 1,
          opacity: isComplete ? 0 : 1
        }}
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30, restDelta: 0.001 },
          y: isDragging 
            ? { type: "spring", stiffness: 300, damping: 30, restDelta: 0.001 } 
            : { repeat: Infinity, duration: 2, ease: "easeInOut" },
          rotate: isDragging 
            ? { repeat: Infinity, duration: 0.4, ease: "linear" } 
            : { duration: 0.3 }
        }}
      >
        <img src="./src/assets/images/items/towel.png" className="w-full h-full object-contain drop-shadow-2xl" alt="Towel" />
      </motion.div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-30 flex flex-col justify-between py-6 px-4 pointer-events-none">
        <header className="text-center space-y-2 drop-shadow-md w-full max-w-md mx-auto bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-warm-cream/10">
          <h2 className="text-warm-cream text-[10px] uppercase tracking-[0.3em] font-game opacity-60">Emergency Care</h2>
          <h1 className="text-warm-cream text-sm uppercase tracking-[0.1em] font-game">Riverside Rescue</h1>
          <div className="min-h-[20px] flex items-center justify-center mt-1">
            <p className="text-warm-cream/80 text-[10px] tracking-widest text-center italic">
              {isComplete ? "They're all dry and warm now!" : feedback || "Gently dry them with the towel."}
            </p>
          </div>
        </header>

        <footer className="w-full max-w-md mx-auto space-y-4 pb-6 flex flex-col justify-end pointer-events-auto">
          {showCompletion && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleFinish}
              className="w-full bg-warm-cream text-night-plum py-5 rounded-2xl font-game text-xs uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(255,245,230,0.4)] hover:bg-white active:scale-95 mb-4"
            >
              Bring Home
            </motion.button>
          )}

          {!showCompletion && (
            <div className="w-full px-2 space-y-3">
               <div className="flex justify-between items-center px-1">
                  <span className="text-warm-cream/40 text-[9px] uppercase tracking-[0.2em] font-game">Warmth</span>
                  <span className="text-warm-cream/80 text-[10px] font-mono">{Math.floor(warmth)}%</span>
               </div>
               <div className="relative h-2.5 bg-black/40 rounded-full border border-warm-cream/10 overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-orange-400 to-warm-cream"
                    initial={{ width: '0%' }}
                    animate={{ width: `${warmth}%` }}
                    transition={{ duration: 0.3 }}
                  />
               </div>
            </div>
          )}

          <div className="flex flex-col items-center pt-2">
            <button 
              onClick={() => setPhase6State('phone_call')}
              className="text-[8px] text-warm-cream/40 hover:text-warm-cream uppercase tracking-widest transition-colors font-game"
            >
              Cancel Rescue
            </button>
          </div>
        </footer>
      </div>

      {/* Global CSS for cursor hiding if needed, but we used cursor-none */}
    </div>
  );
}
