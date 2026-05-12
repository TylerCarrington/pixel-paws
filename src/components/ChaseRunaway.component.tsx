import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'motion/react';
import { useGameStore } from '../stores/game.store';
import AnimalSprite from './AnimalSprite.component';

interface Obstacle {
  id: number;
  type: 'basket' | 'branch' | 'boxes' | 'wheelbarrow';
  x: number; // percentage 0 to 100
  hp: number; // taps required to clear
  maxHp: number;
  cleared: boolean;
  hit: boolean;
  imageSrc: string;
}

const OBSTACLE_TYPES = {
  basket: { hp: 1, imageSrc: '/src/assets/images/items/item-basket-empty.png', width: '40px', height: '40px' },
  branch: { hp: 1, imageSrc: '/src/assets/images/items/item-branch.png', width: '60px', height: '20px' },
  boxes: { hp: 2, imageSrc: '/src/assets/images/items/item-boxes.png', width: '50px', height: '50px' },
  wheelbarrow: { hp: 3, imageSrc: '/src/assets/images/items/item-wheelbarrow-empty.png', width: '70px', height: '50px' },
};

export default function ChaseRunaway({ onFinish }: { onFinish?: () => void }) {
  const rescueBreed = useGameStore(state => state.rescueBreed);
  const setPhase6State = useGameStore(state => state.setPhase6State);

  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [animalState, setAnimalState] = useState<'curious' | 'nervous' | 'retreat' | 'trusting' | 'happy'>('curious');
  const [animalX, setAnimalX] = useState(20); // starts at 20%
  const [progress, setProgress] = useState(0); // 0 to 100 progress through the level
  const [isFinishing, setIsFinishing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const spawnTimerRef = useRef<number>(2);
  const bgControls = useAnimation();
  
  const GAME_DURATION_MS = 15000; // 15 seconds to finish
  const OBSTACLE_SPEED = 20; // percentage per second
  const RUN_SPEED = 100 / (GAME_DURATION_MS / 1000); // percentage per second

  useEffect(() => {
    // Generate initial obstacles
    const initialObstacles: Obstacle[] = [
      { id: 1, type: 'basket', x: 80, hp: 1, maxHp: 1, cleared: false, hit: false, imageSrc: OBSTACLE_TYPES.basket.imageSrc },
      { id: 2, type: 'branch', x: 130, hp: 1, maxHp: 1, cleared: false, hit: false, imageSrc: OBSTACLE_TYPES.branch.imageSrc },
      { id: 3, type: 'boxes', x: 180, hp: 2, maxHp: 2, cleared: false, hit: false, imageSrc: OBSTACLE_TYPES.boxes.imageSrc },
    ];
    setObstacles(initialObstacles);
  }, []);

  // Check completion
  useEffect(() => {
    if (progress >= 100 && !isFinishing && !isComplete) {
      setIsFinishing(true);
      setAnimalState('trusting');
      
      // Give the animal 2.0s to run to the center before stopping the background
      setTimeout(() => {
        setIsComplete(true);
        setAnimalState('happy');
        setTimeout(() => setShowCompletion(true), 1500);
      }, 2000);
    }
  }, [progress, isFinishing, isComplete]);

  useEffect(() => {
    if (isComplete) {
      bgControls.stop();
    } else {
      bgControls.start({
        x: ['0%', '-50%'],
        transition: { ease: "linear", duration: 15, repeat: Infinity }
      });
    }
  }, [isComplete, bgControls]);

  useEffect(() => {
    if (isComplete) return;

    const tick = (time: number) => {
      const dt = (time - lastTimeRef.current) / 1000; // delta time in seconds
      lastTimeRef.current = time;

      setObstacles(prev => {
        let collision = false;
        
        const next = prev.map(obs => {
          if (obs.cleared || obs.hit) return { ...obs, x: obs.x - OBSTACLE_SPEED * dt };
          
          const newX = obs.x - OBSTACLE_SPEED * dt;
          
          // Collision check
          if (newX < animalX + 5 && newX > animalX - 5 && !obs.cleared && !obs.hit && !isFinishing) {
            collision = true;
            return { ...obs, x: newX, hit: true };
          }
          
          return { ...obs, x: newX };
        });
        
        if (collision) {
          setAnimalState('retreat');
          setProgress(p => Math.max(0, p - 10)); // progress penalty
          setAnimalX(prevX => Math.max(5, prevX - 30)); // Get pushed back
        } else if (animalState === 'retreat') {
          // Recover
          setAnimalState('curious');
        } else if (isFinishing) {
          // Run to the center
          setAnimalX(prevX => Math.min(50, prevX + 25 * dt));
        } else if (animalState !== 'trusting' && animalState !== 'happy') {
          // Normal running
          setAnimalX(prevX => Math.min(20, prevX + 15 * dt)); // Slowly return to 20%
        }

        // Spawn logic
        if (!isFinishing) {
          spawnTimerRef.current -= dt;
          if (spawnTimerRef.current <= 0) {
            spawnTimerRef.current = 1.0 + Math.random() * 2.0; // Next spawn in 1 to 3 sec

            const types = ['basket', 'branch', 'boxes', 'wheelbarrow'] as const;
            const type = types[Math.floor(Math.random() * types.length)];
            const obsConfig = OBSTACLE_TYPES[type];

            next.push({
              id: Date.now() + Math.random(),
              type,
              x: 120,
              hp: obsConfig.hp,
              maxHp: obsConfig.hp,
              cleared: false,
              hit: false,
              imageSrc: obsConfig.imageSrc
            });
          }
        }

        return next;
      });

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [animalX, animalState, isComplete, isFinishing]);

  const handleTapObstacle = (id: number) => {
    if (isComplete) return;
    
    setObstacles(prev => prev.map(obs => {
      if (obs.id === id && !obs.cleared && !obs.hit) {
        const newHp = obs.hp - 1;
        if (newHp <= 0) {
          const progressGain = obs.maxHp * 4; // Scale reward by hp (4, 8, 12)
          setProgress(p => Math.min(100, p + progressGain)); // Progress gained!
          return { ...obs, hp: 0, cleared: true };
        }
        return { ...obs, hp: newHp };
      }
      return obs;
    }));
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
    <div className="relative w-full h-full bg-night-plum overflow-hidden font-pixel select-none">
      {/* Background Pan */}
      <div className="absolute inset-0 z-0 overflow-hidden flex whitespace-nowrap">
         <motion.div
            className="flex min-w-max h-full"
            animate={bgControls}
         >
           <img src="/src/assets/images/backgrounds/downtown-village.png" className="h-full w-[100vw] object-cover opacity-80" />
           <img src="/src/assets/images/backgrounds/downtown-village.png" className="h-full w-[100vw] object-cover opacity-80 scale-x-[-1]" />
           <img src="/src/assets/images/backgrounds/downtown-village.png" className="h-full w-[100vw] object-cover opacity-80" />
           <img src="/src/assets/images/backgrounds/downtown-village.png" className="h-full w-[100vw] object-cover opacity-80 scale-x-[-1]" />
         </motion.div>
         {/* Dimmer overlay logic */}
         <div className={`absolute inset-0 transition-colors duration-1000 ${isComplete ? 'bg-black/20' : 'bg-black/40'}`} />
      </div>

      {/* Animal */}
      <div 
        className={`absolute z-10 pointer-events-none transition-transform duration-300 ease-out ${(isFinishing || isComplete) ? 'z-[100]' : ''}`}
        style={{
          left: `${animalX}%`,
          top: '70%',
          transform: `translate(-50%, -50%) ${!isComplete && animalState !== 'retreat' ? 'rotate(10deg)' : ''}`
        }}
      >
        <motion.div
           animate={!isComplete && animalState !== 'retreat' ? { y: [0, -10, 0] } : {}}
           transition={{ repeat: Infinity, duration: 0.3 }}
        >
          <AnimalSprite 
             spriteKey={rescueBreed.spriteKey}
             animation={animalState}
             size={80}
          />
        </motion.div>
      </div>

      {/* Obstacles */}
      <div className="absolute inset-0 z-20 overflow-hidden">
        <AnimatePresence>
          {obstacles.map(obs => {
            if (obs.x < -20 || obs.x > 150) return null; // cull offscreen
            
            const obsConfig = OBSTACLE_TYPES[obs.type];
            
            return (
              <motion.div
                key={obs.id}
                className={`absolute cursor-pointer will-change-transform ${obs.cleared ? 'pointer-events-none opacity-50 blur-sm' : 'drop-shadow-lg'}`}
                style={{
                  left: `${obs.x}%`,
                  top: '70%',
                  width: obsConfig.width,
                  height: obsConfig.height,
                  transform: 'translate(-50%, -100%)'
                }}
                animate={obs.cleared ? { y: 100, rotate: 45, opacity: 0 } : { y: 0 }}
                transition={obs.cleared ? { duration: 0.5 } : { duration: 0.1 }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  handleTapObstacle(obs.id);
                }}
              >
                <img src={obs.imageSrc} className="w-full h-full object-contain pointer-events-none" />
                
                {/* Visual HP Indicator */}
                {!obs.cleared && obs.maxHp > 1 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
                    {[...Array(obs.maxHp)].map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < obs.hp ? 'bg-speaker-rose' : 'bg-warm-cream/30'}`} />
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between py-6 px-4">
        <header className="text-center space-y-2 drop-shadow-md w-full bg-black/40 backdrop-blur rounded-xl p-3 border border-warm-cream/10 pointer-events-auto">
          <h2 className="text-warm-cream text-xs uppercase tracking-[0.2em] font-game">Chase the Runaway</h2>
          <div className="min-h-[25px] flex items-center justify-center">
            <p className="text-warm-cream/80 text-[10px] uppercase tracking-widest text-center">
              {isComplete ? 'They reached the safe garden!' : 'Tap obstacles to clear the path!'}
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
                    <span className="text-warm-cream/60 text-[8px] uppercase tracking-widest">Village Path</span>
                 </div>
                 <div className="relative h-2 bg-black/50 rounded-full border border-warm-cream/20 overflow-hidden">
                    <motion.div 
                      className="h-full bg-warm-cream"
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
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
