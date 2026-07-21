import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../stores/game.store';
import AnimalSprite from './AnimalSprite.component';
import { Heart, Hand } from 'lucide-react';

export default function ParkInjured({ onFinish }: { onFinish?: () => void }) {
  const rescueBreed = useGameStore(state => state.rescueBreed);
  const setPhase6State = useGameStore(state => state.setPhase6State);

  const [trust, setTrust] = useState(0); // 0 to 100
  const [gameState, setGameState] = useState<'reassuring' | 'treating' | 'complete'>('reassuring');
  const [thornPulled, setThornPulled] = useState(0); // 0 to 100
  const [tension, setTension] = useState(0); // 0 to 100 (stress/pain)
  const [isHolding, setIsHolding] = useState(false);
  const [isFlinching, setIsFlinching] = useState(false);
  const [feedback, setFeedback] = useState<string | null>("They look scared. Speak softly and be patient.");
  const [showCompletion, setShowCompletion] = useState(false);

  // Randomize rates for this session
  const rates = React.useRef({
    trustGain: 1.2 + Math.random() * 0.8,
    tensionGainReassuring: 2.5 + Math.random() * 1.5,
    pullGain: 1.0 + Math.random() * 0.6,
    tensionGainTreating: 4.0 + Math.random() * 2.0,
    tensionDecay: 4.0 + Math.random() * 1.5
  }).current;

  // Reassuring Phase Logic
  useEffect(() => {
    let interval: any;
    
    if (isFlinching) return;

    if (isHolding && gameState === 'reassuring' && trust < 100) {
      interval = setInterval(() => {
        setTrust(prev => {
          const next = Math.min(100, prev + rates.trustGain);
          if (next >= 100) {
            setGameState('treating');
            setFeedback("Steady now... carefully pull the thorn.");
          }
          return next;
        });
        
        setTension(prev => {
          const next = prev + rates.tensionGainReassuring;
          if (next >= 100) {
            triggerFlinch('overwhelmed');
          }
          return next;
        });
      }, 100);
    } else if (!isHolding && tension > 0) {
      // Tension decays when NOT holding
      interval = setInterval(() => {
        setTension(prev => Math.max(0, prev - rates.tensionDecay));
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isHolding, gameState, trust, tension, isFlinching, rates]);

  // Treating Phase Logic
  useEffect(() => {
    let interval: any;
    
    if (isFlinching) return;

    if (isHolding && gameState === 'treating' && thornPulled < 100) {
      interval = setInterval(() => {
        setThornPulled(prev => {
          const next = Math.min(100, prev + rates.pullGain);
          if (next >= 100) {
            setGameState('complete');
            setTimeout(() => setShowCompletion(true), 2000);
          }
          return next;
        });
        
        setTension(prev => {
          const next = prev + rates.tensionGainTreating;
          if (next >= 100) {
            triggerFlinch('hurt');
          }
          return next;
        });
      }, 50);
    } else if (!isHolding && tension > 0) {
      interval = setInterval(() => {
        setTension(prev => Math.max(0, prev - (rates.tensionDecay * 0.8)));
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isHolding, gameState, thornPulled, tension, isFlinching, rates]);

  const triggerFlinch = (type: 'overwhelmed' | 'hurt') => {
    setIsFlinching(true);
    setIsHolding(false);
    setTension(0);
    
    if (type === 'overwhelmed') {
      setFeedback("Too much too fast! They're overwhelmed...");
      setTrust(prev => Math.max(0, prev - 15));
    } else {
      setFeedback("Ouch! They flinched. Be more gentle.");
      setThornPulled(prev => Math.max(0, prev - 10));
      setTrust(prev => Math.max(80, prev - 5)); // Keep trust relatively high once in treatment
    }

    setTimeout(() => {
      setIsFlinching(false);
      setFeedback(gameState === 'reassuring' ? "Try again, slowly." : "Take your time...");
    }, 2000);
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
      className="relative w-full h-full bg-slate-900 overflow-hidden font-pixel select-none touch-none"
      onMouseDown={() => setIsHolding(true)}
      onMouseUp={() => setIsHolding(false)}
      onMouseLeave={() => setIsHolding(false)}
      onTouchStart={() => setIsHolding(true)}
      onTouchEnd={() => setIsHolding(false)}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="./src/assets/images/backgrounds/park-with-benches.png" 
          alt="Park" 
          className="w-full h-full object-cover"
          style={{ 
            filter: `brightness(${0.8 + (trust/100)*0.2}) saturate(${0.7 + (trust/100)*0.3})`,
            transition: 'filter 1s ease'
          }}
        />
        {/* Soft Sunlight Bloom */}
        <div 
          className="absolute inset-0 bg-yellow-100/5 mix-blend-overlay transition-opacity duration-2000"
          style={{ opacity: (trust/100) }}
        />
      </div>

      {/* Animal Container */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 pb-[15vh]">
        <motion.div
           animate={{
             y: gameState === 'complete' ? [0, -20, 0] : (isHolding && gameState === 'treating' ? -5 : (isFlinching ? [0, -10, 0] : 0)),
             rotate: gameState === 'complete' ? [0, 5, -5, 0] : (gameState === 'reassuring' && (trust < 50 || tension > 70) ? [-2, 2, -2] : 0),
             scale: isFlinching ? 0.95 : 1
           }}
           transition={{
             y: gameState === 'complete' ? { repeat: Infinity, duration: 1.5 } : { duration: 0.2 },
             rotate: { repeat: Infinity, duration: 0.1 }
           }}
        >
          <AnimalSprite 
             spriteKey={rescueBreed.spriteKey}
             species={useGameStore.getState().rescueSpecies || 'DOG'}
             animation={gameState === 'complete' ? 'happy' : (isFlinching ? 'nervous' : (trust < 50 ? 'nervous' : 'trusting'))}
             size={140}
          />

          {/* Thorn Visual */}
          {gameState !== 'complete' && ( trust > 70 ) && (
            <motion.div
              className="absolute bottom-4 right-4 w-10 h-10 origin-bottom"
              animate={{
                opacity: 1,
                y: thornPulled * -0.5,
                rotate: (thornPulled * 0.2) + (tension / 10),
                scale: 1 + (tension / 200)
              }}
            >
              <img 
                src="./src/assets/images/items/thorn.png" 
                className="w-full h-full object-contain filter drop-shadow-md" 
                alt="Thorn" 
              />
            </motion.div>
          )}

          {/* Emotional Feedback */}
          <AnimatePresence>
            {isHolding && !isFlinching && (
              <motion.div
                key={gameState}
                initial={{ opacity: 0, scale: 0.5, y: 0 }}
                animate={{ opacity: 1, scale: 1, y: -50 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="absolute -top-12 left-1/2 -translate-x-1/2"
              >
                {gameState === 'reassuring' ? (
                   <Heart className="text-pink-400" fill="currentColor" size={32} />
                ) : (
                   <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping delay-75" />
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping delay-150" />
                   </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Tension Alert Overlay */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-10"
        animate={{ 
          backgroundColor: tension > 80 ? 'rgba(255, 100, 100, 0.15)' : 'rgba(0,0,0,0)',
        }}
      />

      {/* UI Overlay */}
      <div className="absolute inset-0 z-30 flex flex-col justify-between py-8 px-4 pointer-events-none text-white font-pixel">
        <header className="text-center space-y-2 drop-shadow-md w-full max-w-md mx-auto p-5">
          <h2 className="text-warm-cream/50 text-[10px] uppercase tracking-[0.4em]">Emergency Care</h2>
          <h1 className="text-warm-cream text-sm uppercase tracking-[0.2em]">Park Rescue</h1>
          <div className="min-h-[24px] flex items-center justify-center mt-2 px-2">
            <p className={`text-[10px] tracking-widest text-center italic transition-colors duration-300 ${isFlinching ? 'text-red-400' : 'text-warm-cream/90'}`}>
              {gameState === 'complete' ? "They're so relieved! Good job." : feedback}
            </p>
          </div>
        </header>

        <footer className="w-full max-w-md mx-auto space-y-5 pb-8 flex flex-col justify-end pointer-events-auto">
          {showCompletion ? (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleFinish}
              className="w-full bg-warm-cream text-night-plum py-5 rounded-2xl font-game text-xs uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(255,245,230,0.5)] hover:bg-white active:scale-95 border-b-4 border-black/20"
            >
              Take Home
            </motion.button>
          ) : (
            <div className="w-full p-6 space-y-5">
              {/* Interaction Hint */}
              <div className="flex flex-col items-center gap-3">
                <motion.div
                  animate={isHolding ? { scale: 0.85, rotate: [0, 2, -2, 0] } : { scale: [1, 1.1, 1], y: [0, -2, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center border-2 shadow-xl transition-all duration-300 ${
                    isFlinching ? 'bg-red-900/40 border-red-500/50' : 
                    isHolding ? 'bg-warm-cream border-white scale-90' : 'bg-warm-cream/10 border-warm-cream/30'
                  }`}
                >
                  {gameState === 'reassuring' ? (
                    <Heart className={`transition-colors duration-300 ${isHolding ? 'text-night-plum' : 'text-warm-cream'}`} fill={isHolding ? "currentColor" : "none"} size={24} />
                  ) : (
                    <Hand className={`transition-colors duration-300 ${isHolding ? 'text-night-plum' : 'text-warm-cream'}`} size={24} />
                  )}
                </motion.div>
                <div className="text-center">
                  <p className={`text-[9px] uppercase tracking-[0.2em] transition-all duration-300 ${isHolding ? 'text-warm-cream' : 'text-warm-cream/40 opacity-70'}`}>
                    {isFlinching ? 'Patience...' : isHolding ? (gameState === 'reassuring' ? 'Comforting...' : 'Moving slowly...') : 'Hold to Calm'}
                  </p>
                </div>
              </div>

              {/* Progress Bar Group */}
              <div className="space-y-4">
                {/* Main Progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-warm-cream/40 text-[9px] uppercase tracking-[0.2em]">
                      {gameState === 'reassuring' ? 'Trust' : 'Recovery'}
                    </span>
                    <span className="text-warm-cream/80 text-[10px] font-mono">
                      {Math.floor(gameState === 'reassuring' ? trust : thornPulled)}%
                    </span>
                  </div>
                  <div className="relative h-2 bg-black/60 rounded-full border border-white/5 overflow-hidden">
                    <motion.div 
                      className={`h-full bg-gradient-to-r ${gameState === 'reassuring' ? 'from-pink-500 to-warm-cream' : 'from-emerald-500 to-warm-cream'}`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${gameState === 'reassuring' ? trust : thornPulled}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </div>

                {/* Tension Meter (Mini Difficulty) */}
                <div className="space-y-1.5 opacity-80">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-warm-cream/30 text-[8px] uppercase tracking-[0.2em]">Comfort Stability</span>
                     <span className={`text-[8px] font-mono transition-colors ${tension > 80 ? 'text-red-400 animate-pulse' : 'text-warm-cream/50'}`}>
                       {Math.floor(100 - tension)}%
                     </span>
                  </div>
                  <div className="relative h-1.5 bg-black/60 rounded-full border border-white/5 overflow-hidden">
                    <motion.div 
                      className="h-full bg-orange-400/60"
                      initial={{ width: '100%' }}
                      animate={{ 
                        width: `${100 - tension}%`,
                        backgroundColor: tension > 80 ? '#fb7185' : '#fb923c' 
                      }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </div>
                
                 <p className="text-[7px] text-warm-cream/20 text-center uppercase tracking-widest pt-1">
                    Release to let them breathe
                 </p>
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
    </div>
  );
}
