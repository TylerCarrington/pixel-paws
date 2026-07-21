import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../stores/game.store';
import AnimalSprite from './AnimalSprite.component';
import { motion, AnimatePresence } from 'motion/react';

interface LogItem {
  id: number;
  imageSrc: string;
  width: string;
  height: string;
  top: string;
  left: string;
  rotate: number;
  zIndex: number;
  weightMs: number; // Required hold duration
  removed: boolean;
}

const INITIAL_LOGS: LogItem[] = [
  // Layer 4 (Top)
  { id: 1, imageSrc: './src/assets/images/items/log-sprites-1.png', width: '140px', height: '60px', top: '50%', left: '45%', rotate: -5, zIndex: 40, weightMs: 1200, removed: false },
  
  // Layer 3
  { id: 2, imageSrc: './src/assets/images/items/log-sprites-2.png', width: '120px', height: '80px', top: '45%', left: '55%', rotate: 15, zIndex: 30, weightMs: 1500, removed: false },
  { id: 3, imageSrc: './src/assets/images/items/log-sprites-3.png', width: '140px', height: '50px', top: '60%', left: '60%', rotate: -25, zIndex: 31, weightMs: 800, removed: false },
  
  // Layer 2
  { id: 4, imageSrc: './src/assets/images/items/log-sprites-4.png', width: '150px', height: '50px', top: '55%', left: '40%', rotate: -10, zIndex: 20, weightMs: 1100, removed: false },
  { id: 5, imageSrc: './src/assets/images/items/log-sprites-5.png', width: '120px', height: '40px', top: '40%', left: '50%', rotate: 8, zIndex: 21, weightMs: 900, removed: false },
  { id: 8, imageSrc: './src/assets/images/items/log-sprites-8.png', width: '100px', height: '80px', top: '48%', left: '48%', rotate: -15, zIndex: 22, weightMs: 1000, removed: false },
  
  // Layer 1 (Bottom)
  { id: 6, imageSrc: './src/assets/images/items/log-sprites-6.png', width: '130px', height: '70px', top: '55%', left: '55%', rotate: -3, zIndex: 10, weightMs: 1400, removed: false },
  { id: 7, imageSrc: './src/assets/images/items/log-sprites-7.png', width: '110px', height: '60px', top: '48%', left: '35%', rotate: 20, zIndex: 11, weightMs: 1000, removed: false },
];

export default function WoodpileRescue({ onFinish }: { onFinish?: () => void }) {
  const rescueBreed = useGameStore(state => state.rescueBreed);
  const setPhase6State = useGameStore(state => state.setPhase6State);
  
  const [logs, setLogs] = useState<LogItem[]>(INITIAL_LOGS);
  const [activeLogId, setActiveLogId] = useState<number | null>(null);
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 100
  const [animalState, setAnimalState] = useState<'nervous' | 'trusting' | 'happy'>('nervous');
  const [isComplete, setIsComplete] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  
  const holdStartRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const logsRemaining = logs.filter(l => !l.removed).length;
  const totalLogs = logs.length;
  const visibilityEffect = 1 - (logsRemaining / totalLogs); // 0 to 1

  useEffect(() => {
    // Check completion
    if (logsRemaining === 0 && !isComplete) {
      setIsComplete(true);
      setAnimalState('happy');
      setTimeout(() => setShowCompletion(true), 1500);
    } else if (logsRemaining <= 2 && animalState === 'nervous') {
      setAnimalState('trusting');
    }
  }, [logsRemaining, isComplete, animalState]);

  const removeLog = (id: number) => {
    setLogs(prev => prev.map(log => log.id === id ? { ...log, removed: true } : log));
    setActiveLogId(null);
    setHoldProgress(0);
    holdStartRef.current = null;
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  };

  const handlePointerDown = (id: number) => {
    if (isComplete) return;
    setActiveLogId(id);
    holdStartRef.current = Date.now();
    setHoldProgress(0);

    const activeLog = logs.find(l => l.id === id);
    if (!activeLog) return;

    const animateHold = () => {
      if (!holdStartRef.current) return;
      
      const elapsed = Date.now() - holdStartRef.current;
      const progress = Math.min(100, Math.max(0, (elapsed / activeLog.weightMs) * 100));
      
      setHoldProgress(progress);
      
      if (progress >= 100) {
        removeLog(id);
      } else {
        animationFrameRef.current = requestAnimationFrame(animateHold);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animateHold);
  };

  const handlePointerUp = () => {
    if (activeLogId !== null) {
      setActiveLogId(null);
      setHoldProgress(0);
      holdStartRef.current = null;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  useEffect(() => {
    const handleGlobalUp = () => handlePointerUp();
    window.addEventListener('pointerup', handleGlobalUp);
    return () => window.removeEventListener('pointerup', handleGlobalUp);
  }, [activeLogId]);

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
       className="relative w-full h-full bg-night-plum overflow-hidden font-pixel select-none"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="./src/assets/images/backgrounds/woodpile.png" 
          className="w-full h-full object-cover opacity-80"
          alt="Woodpile Backyard"
          onError={(e) => {
            e.currentTarget.style.backgroundColor = '#1a1a2e';
          }}
        />
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      </div>

      {/* Trapped Animal (Underneath) */}
      <div 
        className="absolute z-1 pointer-events-none transition-all duration-500"
        style={{
          left: '50%',
          top: '55%',
          transform: 'translate(-50%, -50%)',
          filter: `brightness(${0.3 + visibilityEffect * 0.7}) saturate(${0.5 + visibilityEffect * 0.5})`,
          opacity: 0.1 + visibilityEffect * 0.9
        }}
      >
         <motion.div
           animate={isComplete ? { y: [0, -10, 0] } : (visibilityEffect < 0.5 ? { x: [-1, 1, -1] } : {})}
           transition={isComplete ? { duration: 0.6, ease: "easeOut" } : { repeat: Infinity, duration: 0.1 }}
         >
           <AnimalSprite 
              spriteKey={rescueBreed.spriteKey}
              species={useGameStore.getState().rescueSpecies || 'DOG'}
              animation={animalState}
              size={120}
           />
         </motion.div>
      </div>

      {/* Woodpile Logs Container */}
      <div className="absolute inset-0 z-20">
        <AnimatePresence>
          {logs.map(log => {
            if (log.removed) return null;
            
            const isActive = activeLogId === log.id;
            
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 1, scale: 1 }}
                exit={{ 
                  opacity: 0, 
                  scale: 1.1, 
                  y: 50,
                  rotate: log.rotate + (Math.random() * 20 - 10),
                  transition: { duration: 0.4 }
                }}
                className={`absolute cursor-pointer will-change-transform drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] ${isActive ? 'scale-105' : ''}`}
                style={{
                  width: log.width,
                  height: log.height,
                  top: log.top,
                  left: log.left,
                  marginTop: `-${parseInt(log.height)/2}px`,
                  marginLeft: `-${parseInt(log.width)/2}px`,
                  rotate: `${log.rotate}deg`,
                  zIndex: log.zIndex,
                  // Use the standalone cropped sprite image
                  backgroundImage: `url(${log.imageSrc})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  handlePointerDown(log.id);
                }}
              >
                {isActive && (
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none w-10 h-10 rounded-full border-2 border-white/20 bg-black/40">
                      <div 
                         className="absolute inset-0 rounded-full bg-warm-cream/50 transition-all duration-75 block origin-center"
                         style={{ transform: `scale(${holdProgress / 100})`, opacity: holdProgress / 100 }}
                      />
                   </div>
                )}
                {/* Visual jiggle when pulled? Maybe motion handles is better */}
                {isActive && holdProgress > 10 && (
                   <motion.div
                     animate={{ x: [-1, 1, -1], y: [-1, 1, -1] }}
                     transition={{ repeat: Infinity, duration: 0.1 }}
                     className="absolute inset-0 rounded bg-white/10"
                   />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Floating Dust Particles */}
      <div className="absolute inset-0 z-25 pointer-events-none mix-blend-screen opacity-20">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-warm-cream/50 rounded-full"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              opacity: 0 
            }}
            animate={{ 
              x: `+=${(Math.random() - 0.5) * 5}%`,
              y: `+=${(Math.random() - 0.5) * 5}%`,
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

      {/* UI Overlay */}
      <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between py-6 px-4">
        <header className="text-center space-y-2 drop-shadow-md w-full bg-black/40 backdrop-blur rounded-xl p-3 border border-warm-cream/10 pointer-events-auto">
          <h2 className="text-warm-cream text-xs uppercase tracking-[0.2em] font-game">Dig Them Out</h2>
          <div className="min-h-[25px] flex items-center justify-center">
            <p className="text-warm-cream/80 text-[10px] uppercase tracking-widest text-center">
              {isComplete ? 'The woodpile is cleared!' : 'Hold down on the logs to pull them away.'}
            </p>
          </div>
        </header>

        <footer className="w-full max-w-md mx-auto space-y-4 pb-4 pointer-events-auto flex flex-col justify-end">
          {showCompletion && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleFinish}
              className="w-full bg-warm-cream text-night-plum py-4 rounded-xl font-game text-xs uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(255,245,230,0.4)] hover:bg-white active:scale-95 mb-4"
            >
              Reach Out & Rescue
            </motion.button>
          )}

          {!showCompletion && (
            <div className="w-full px-2">
                 <div className="flex justify-between items-end mb-2">
                    <span className="text-warm-cream/60 text-[8px] uppercase tracking-widest">Progress</span>
                 </div>
                 <div className="relative h-2 bg-black/50 rounded-full border border-warm-cream/20 overflow-hidden">
                    <motion.div 
                      className="h-full bg-warm-cream"
                      initial={{ width: '0%' }}
                      animate={{ width: `${visibilityEffect * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                 </div>
            </div>
          )}

          <div className="flex flex-col items-center">
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
