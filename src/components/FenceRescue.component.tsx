import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../stores/game.store';
import AnimalSprite from './AnimalSprite.component';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Link as LinkIcon } from 'lucide-react';

export default function FenceRescue({ onFinish }: { onFinish?: () => void }) {
  const rescueBreed = useGameStore(state => state.rescueBreed);
  const rescueSpecies = useGameStore(state => state.rescueSpecies);
  const setPhase6State = useGameStore(state => state.setPhase6State);
  
  // Game states
  const [rotationX, setRotationX] = useState(0); // Player controlled rotation (-100 to 100)
  const [targetRotation, setTargetRotation] = useState(() => Math.floor(Math.random() * 160) - 80); // The "sweet spot"
  const [tension, setTension] = useState(100); // 100 is max tension, 0 is free
  const [nextCheckpoint, setNextCheckpoint] = useState(75); // 75, 50, 25
  const [isRotating, setIsRotating] = useState(false);
  const [message, setMessage] = useState('The collar is tangled...');
  const [isComplete, setIsComplete] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  // Randomly change the sweet spot if player takes too long in tension?
  // Let's just keep it simple: find the sweet spot, hold it, it reduces tension.
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRotating && !isComplete && tension > 0) {
      interval = setInterval(() => {
        // Calculate distance from sweet spot
        const distanceToTarget = Math.abs(rotationX - targetRotation);
        
        let newTension = tension;
        
        if (distanceToTarget < 25) {
          // Sweet spot! Decrease tension
          newTension -= 2;
          if (newTension > nextCheckpoint) {
             setMessage('You carefully ease the tension...');
          }
        } else {
          // Wrong spot! Increase tension from moving incorrectly
          newTension += 0.5;
          setMessage('The dog whines, the collar tightens!');
        }
        
        // Boundaries
        const maxTensionAllowed = nextCheckpoint + 25;
        newTension = Math.max(0, Math.min(maxTensionAllowed, newTension));
        
        if (newTension <= nextCheckpoint && nextCheckpoint > 0) {
          setTargetRotation(Math.floor(Math.random() * 160) - 80);
          setNextCheckpoint(prev => prev - 25);
          setMessage('The animal shifts, find the new angle!');
        }

        setTension(newTension);
        
        if (newTension === 0) {
          setIsComplete(true);
          setMessage('The collar slips free!');
          setTimeout(() => setShowCompletion(true), 2000); // 2s pause
        }
      }, 50);
    } else if (!isRotating && tension > 0 && !isComplete) {
       interval = setInterval(() => {
          // Slowly decay tension if they stop acting
          setTension(prev => Math.min(nextCheckpoint + 25, prev + 0.1));
       }, 100);
    }
    return () => clearInterval(interval);
  }, [rotationX, targetRotation, isRotating, tension, isComplete]);

  const handleFinish = () => {
    if (onFinish) {
      onFinish();
    } else {
      setPhase6State('wash_rescue');
    }
  };

  if (!rescueBreed) return null;

  // We map the player's rotation value (-100 to 100) to a visual rotation (-45deg to 45deg)
  const visualRotation = (rotationX / 100) * 45;
  const isSweetSpot = Math.abs(rotationX - targetRotation) < 25 && isRotating;
  const tensionEffect = tension / 100; // 0 to 1

  return (
    <div className="relative w-full h-full bg-stone-grey/20 overflow-hidden font-pixel">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/src/assets/images/backgrounds/playground.png" 
          className="w-full h-full object-cover opacity-80"
          alt="School Playground"
          onError={(e) => {
            e.currentTarget.style.backgroundColor = '#2c3e50';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* Floating Particles (Dust) */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-warm-cream/30 rounded-full"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              opacity: 0 
            }}
            animate={{ 
              x: `+=${(Math.random() - 0.5) * 5}%`,
              y: `+=${(Math.random() - 0.5) * 5}%`,
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 2 + Math.random() * 3, 
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Game Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-between py-6 px-4">
        <header className="text-center space-y-2 drop-shadow-md">
          <h2 className="text-warm-cream text-xs uppercase tracking-[0.2em] font-game">Free the Collar</h2>
          <p className="text-warm-cream/80 text-[10px] uppercase tracking-widest">{message}</p>
        </header>

        {/* The Scene */}
        <div className="flex-1 min-h-0 w-full flex items-center justify-center relative">
          <div className="relative w-full max-w-xs aspect-square flex items-center justify-center">
             
            {!showCompletion ? (
              // Trapped Phase
              <motion.div 
                className="relative"
                animate={{ 
                  x: tensionEffect > 0.5 && !isSweetSpot ? [0, -2, 2, -1, 1, 0] : 0,
                  y: tensionEffect > 0.5 && !isSweetSpot ? [0, 1, -1, 2, -2, 0] : 0
                }}
                transition={{ repeat: Infinity, duration: 0.2 }}
              >
                {/* Fence element overlaying the animal */}
                <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center opacity-60">
                   <div className="w-48 h-48 border border-white/20 relative" style={{
                      backgroundImage: 'linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.4) 49%, rgba(255,255,255,0.4) 51%, transparent 52%), linear-gradient(-45deg, transparent 48%, rgba(255,255,255,0.4) 49%, rgba(255,255,255,0.4) 51%, transparent 52%)',
                      backgroundSize: '24px 24px'
                   }} />
                </div>

                <div 
                  className={`transition-all duration-100 ease-out`}
                  style={{ 
                    transform: `rotate(${visualRotation}deg) scale(${1 - tensionEffect * 0.1})`,
                    filter: `brightness(${1 - tensionEffect * 0.3})`
                  }}
                >
                  <AnimalSprite 
                    spriteKey={rescueBreed.spriteKey}
                    species={rescueSpecies || 'DOG'}
                    animation={tensionEffect > 0.7 ? 'nervous' : (tensionEffect > 0.3 ? 'shivering' : 'idle')}
                    size={160}
                  />
                  
                  {/* Tension indicator shadow */}
                  <div className="absolute inset-0 z-10 pointer-events-none rounded-full" 
                    style={{
                      boxShadow: `inset 0 0 ${tensionEffect * 50}px rgba(0,0,0,0.8)`
                    }}
                  />
                </div>
              </motion.div>
            ) : (
              // Completed Phase
              <motion.div
                initial={{ scale: 0.8, x: 20, opacity: 0 }}
                animate={{ scale: 1, x: 0, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                 <AnimalSprite 
                    spriteKey={rescueBreed.spriteKey}
                    species={rescueSpecies || 'DOG'}
                    animation="happy"
                    size={160}
                  />
              </motion.div>
            )}

            {/* Ground Shadow */}
            <div 
               className="absolute -bottom-8 w-40 h-6 bg-black/60 rounded-full blur-xl transition-all duration-300"
               style={{ opacity: showCompletion ? 0.4 : 0.6 + tensionEffect * 0.4 }}
            />
          </div>
        </div>

        {/* UI Controls */}
        <footer className="w-full max-w-md space-y-4 pb-4 z-30 flex flex-col justify-end">
          {!showCompletion ? (
            <div className="w-full bg-black/40 backdrop-blur rounded-xl p-4 space-y-4 border border-warm-cream/10">
                <div className="space-y-2">
                   <p className="text-center text-[9px] text-warm-cream/80 uppercase tracking-widest mb-4">
                     Move the collar left and right to free the pet
                   </p>
                   <div className="flex justify-between w-full px-2 text-[8px] text-warm-cream/40 uppercase tracking-widest font-game">
                      <span>Left</span>
                      <span>Right</span>
                   </div>
                   <input 
                     type="range" 
                     min="-100" 
                     max="100" 
                     value={rotationX}
                     onMouseDown={() => setIsRotating(true)}
                     onMouseUp={() => setIsRotating(false)}
                     onTouchStart={() => setIsRotating(true)}
                     onTouchEnd={() => setIsRotating(false)}
                     onChange={(e) => setRotationX(Number(e.target.value))}
                     className="w-full accent-warm-cream appearance-none bg-black/60 h-4 rounded-full outline-none"
                     style={{
                        WebkitAppearance: 'none',
                     }}
                   />
                </div>

                <div className="space-y-2 pt-2 border-t border-warm-cream/10">
                   <div className="flex justify-between items-end">
                      <span className="text-warm-cream/60 text-[8px] uppercase tracking-widest">Tension Level</span>
                      <span className={`text-[10px] ${tension < 20 ? 'text-soft-rose' : 'text-warm-cream'}`}>{Math.floor(tension)}%</span>
                   </div>
                   <div className="relative h-2 bg-black/50 rounded-full border border-warm-cream/20 flex items-center">
                      <motion.div 
                        className={`absolute left-0 top-0 bottom-0 h-full rounded-full ${tension < 20 ? 'bg-soft-rose' : (tension > 80 ? 'bg-red-500' : 'bg-warm-cream')}`}
                        initial={{ width: '100%' }}
                        animate={{ width: `${tension}%` }}
                        transition={{ duration: 0.1 }}
                      />
                      {[75, 50, 25].map(cp => {
                        const achieved = tension <= cp;
                        return (
                          <div 
                            key={cp} 
                            className="absolute z-10 -translate-x-1/2 flex items-center justify-center bg-black rounded-full" 
                            style={{ left: `${cp}%` }}
                          >
                            {achieved ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                              <LinkIcon className="w-3 h-3 text-warm-cream/40 m-0.5" />
                            )}
                          </div>
                        );
                      })}
                   </div>
                </div>
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

          <div className="flex flex-col items-center">
            <button 
              onClick={() => setPhase6State('phone_call')}
              className="text-[8px] pt-2 text-warm-cream/40 hover:text-warm-cream uppercase tracking-widest transition-colors font-game"
            >
              Step Away (Cancel)
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
