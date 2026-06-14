import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../stores/game.store';
import AnimalSprite from './AnimalSprite.component';
import { motion, AnimatePresence } from 'motion/react';

type DogState = 'calm' | 'nervous';

export default function AlleyRescue({ onFinish }: { onFinish?: () => void }) {
  const rescueBreed = useGameStore(state => state.rescueBreed);
  const setPhase6State = useGameStore(state => state.setPhase6State);
  
  const [trust, setTrust] = useState(20);
  const distance = 100 - trust;
  const [dogState, setDogState] = useState<DogState>('nervous');
  const [isMoving, setIsMoving] = useState(false);
  const [message, setMessage] = useState('The alley is quiet...');
  const [isComplete, setIsComplete] = useState(false);

  const stateTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cycle dog state
  useEffect(() => {
    const cycleState = () => {
      const nextState = dogState === 'calm' ? 'nervous' : 'calm';
      const duration = nextState === 'calm' ? 3000 + Math.random() * 2000 : 2000 + Math.random() * 1500;
      
      setDogState(nextState);
      stateTimerRef.current = setTimeout(cycleState, duration);
    };

    stateTimerRef.current = setTimeout(cycleState, 2000);
    return () => {
      if (stateTimerRef.current) clearTimeout(stateTimerRef.current);
    };
  }, [dogState]);

  // Handle movement logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMoving && !isComplete) {
      interval = setInterval(() => {
        if (dogState === 'nervous') {
          // Bad move!
          setTrust(prev => Math.max(0, prev - 2));
          setMessage('The dog growls and backs away!');
        } else {
          // Good move!
          setTrust(prev => {
            const next = Math.min(100, prev + 1);
            if (next === 100) {
               setIsComplete(true);
               setMessage('The dog sniffs your hand...');
            }
            return next;
          });
          setMessage('You move closer slowly...');
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isMoving, dogState, isComplete]);

  const handleFinish = () => {
    if (onFinish) {
      onFinish();
    } else {
      setPhase6State('wash_rescue');
    }
  };

  if (!rescueBreed) return null;

  return (
    <div className="relative w-full h-full bg-night-plum overflow-hidden font-pixel">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="./src/assets/images/back-alley.png" 
          className="w-full h-full object-cover opacity-60"
          alt="Back Alley"
          onError={(e) => {
            e.currentTarget.style.backgroundColor = '#1a1a2e';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night-plum/80 to-transparent" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-warm-cream/20 rounded-full"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: '110%',
              opacity: 0 
            }}
            animate={{ 
              y: '-10%',
              opacity: [0, 1, 0],
              x: (Math.random() - 0.5) * 50 + '%'
            }}
            transition={{ 
              duration: 10 + Math.random() * 10, 
              repeat: Infinity,
              delay: Math.random() * 10
            }}
          />
        ))}
      </div>

      {/* Game Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-between py-12 px-6">
        <header className="text-center space-y-2">
          <h2 className="text-soft-rose text-[10px] uppercase tracking-[0.2em] font-game">Rescue Operation</h2>
          <p className="text-warm-cream/60 text-[8px] uppercase tracking-widest">{message}</p>
        </header>

        {/* The Scene */}
        <div className="flex-1 w-full flex items-center justify-center relative">
          <div className="relative w-full max-w-lg aspect-video flex items-center justify-center">
            {/* The Dog */}
            <div 
              className={`transition-all duration-1000 ease-in-out`}
              style={{ 
                transform: `translateY(${(100 - distance) / 2}px) scale(${1 + (100 - distance) / 150})`,
                opacity: isComplete ? 1 : 0.8
              }}
            >
              <div className={`${dogState === 'nervous' ? 'camera-nervous' : ''}`}>
                <AnimalSprite 
                  spriteKey={rescueBreed.spriteKey}
                  animation={isComplete ? 'happy' : (dogState === 'nervous' ? 'nervous' : 'idle')}
                  size={128}
                />
              </div>
              
              {/* Emotion Indicator */}
              <AnimatePresence>
                {!isComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    key={dogState}
                    className="absolute -top-12 left-1/2 -translate-x-1/2"
                  >
                    <div className={`text-[8px] uppercase tracking-tighter px-2 py-1 rounded border ${
                      dogState === 'nervous' 
                        ? 'bg-soft-rose/20 border-soft-rose text-soft-rose' 
                        : 'bg-deep-moss/20 border-deep-moss text-deep-moss'
                    }`}>
                      {dogState === 'nervous' ? '⚠ Tense' : '• Calm'}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Ground Shadow */}
            <div 
               className="absolute bottom-1/4 w-32 h-4 bg-night-plum/40 rounded-full blur-xl transition-all duration-1000"
               style={{ transform: `translateY(${(100 - distance) / 2}px) scale(${1 + (100 - distance) / 150})` }}
            />
          </div>
        </div>

        {/* UI Controls */}
        <footer className="w-full max-w-md space-y-8">
          <div className="space-y-2">
             <div className="flex justify-between items-end">
                <span className="text-warm-cream/40 text-[8px] uppercase tracking-widest">Trust Level</span>
                <span className="text-soft-rose text-[10px]">{Math.floor(trust)}%</span>
             </div>
             <div className="h-1 bg-night-plum rounded-full overflow-hidden border border-warm-cream/10">
                <motion.div 
                  className="h-full bg-soft-rose"
                  initial={{ width: 0 }}
                  animate={{ width: `${trust}%` }}
                />
             </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            {!isComplete ? (
              <button
                onMouseDown={() => setIsMoving(true)}
                onMouseUp={() => setIsMoving(false)}
                onMouseLeave={() => setIsMoving(false)}
                onTouchStart={() => setIsMoving(true)}
                onTouchEnd={() => setIsMoving(false)}
                className={`w-full py-6 rounded-xl border-2 transition-all active:scale-95 flex flex-col items-center gap-1 ${
                  isMoving 
                    ? 'bg-blossom-pink/20 border-blossom-pink text-blossom-pink shadow-[0_0_20px_rgba(255,182,193,0.3)]' 
                    : 'bg-stone-grey/10 border-stone-grey/30 text-warm-cream/60'
                }`}
              >
                <span className="text-xs uppercase tracking-[0.3em] font-game">Move Closer</span>
                <span className="text-[7px] uppercase tracking-widest opacity-50">Hold gently during calm moments</span>
              </button>
            ) : (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleFinish}
                className="w-full bg-deep-moss text-warm-cream py-6 rounded-xl font-game text-xs uppercase tracking-[0.3em] shadow-lg hover:bg-deep-moss/80 active:scale-95"
              >
                Reach Out & Rescue
              </motion.button>
            )}
            
            <button 
              onClick={() => setPhase6State('phone_call')}
              className="text-[8px] text-muted-sage hover:text-soft-rose uppercase tracking-widest transition-colors"
            >
              Back Away (Cancel)
            </button>
          </div>
        </footer>
      </div>

    </div>
  );
}
