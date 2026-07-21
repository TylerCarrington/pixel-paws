import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Animal } from '../types/animal.types';
import { useGameStore } from '../stores/game.store';
import kitchenBg from '../assets/images/backgrounds/kitchen.png';
import appleImg from '../assets/images/items/apple.png';
import AnimalSprite from './AnimalSprite.component';
import { STARTER_DOGS } from '../config/starterDogs.config';
import { STARTER_CATS } from '../config/starterCats.config';

interface FruitCatchProps {
  pet: Animal;
  onComplete: () => void;
}

export default function FruitCatchActivity({ pet, onComplete }: FruitCatchProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [fruitActive, setFruitActive] = useState(false);
  const [fruitCaught, setFruitCaught] = useState<boolean | null>(null);
  const [timingFeedback, setTimingFeedback] = useState<'Early' | 'Late' | null>(null);
  const [petJumping, setPetJumping] = useState(false);
  
  const addXP = useGameStore(state => state.addXP);
  const markActivityDone = useGameStore(state => state.markActivityDone);

  const maxAttempts = 10;
  const breedDef = pet.species === 'CAT' 
    ? STARTER_CATS.find(c => c.id === pet.breed)
    : STARTER_DOGS.find(d => d.id === pet.breed);
  const spriteKey = breedDef?.spriteKey || pet.breed;

  const tossStartTime = useRef<number>(0);
  const currentDuration = useRef<number>(2000);

  const handleToss = () => {
    if (fruitActive || gameState !== 'playing') return;
    
    // Randomize duration between 1.2s and 2.4s
    const duration = 1200 + Math.random() * 1200;
    currentDuration.current = duration;

    setFruitActive(true);
    setFruitCaught(null);
    setTimingFeedback(null);
    setTotalAttempts(prev => prev + 1);
    tossStartTime.current = Date.now();

    // Reset fruit after animation
    setTimeout(() => {
      setFruitActive(false);
      if (totalAttempts + 1 >= maxAttempts) {
        setGameState('result');
      }
    }, duration);
  };

  const handlePetCatch = () => {
    if (!fruitActive || fruitCaught !== null || petJumping) return;
    
    setPetJumping(true);
    setTimeout(() => setPetJumping(false), 600);

    const elapsed = Date.now() - tossStartTime.current;
    
    // The fruit reaches the peak at roughly 50% of the duration
    const peakTime = currentDuration.current * 0.5;
    const windowSize = 80; // Tightened from 150ms for expert difficulty
    
    if (Math.abs(elapsed - peakTime) < windowSize) {
      setFruitCaught(true);
      setScore(prev => prev + 1);
    } else {
      setFruitCaught(false); // Missed
      setTimingFeedback(elapsed < peakTime ? 'Early' : 'Late');
    }
  };

  const handleFinish = () => {
    addXP(pet.id, 100);
    markActivityDone(pet.id, 'fruitCatch');
    onComplete();
  };

  const finalXP = 100 + (pet.hiddenBonuses?.activity || 0);

  return (
    <div className="absolute inset-0 z-50 bg-night-plum flex flex-col items-center justify-center font-pixel overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${kitchenBg})` }}
      />
      
      <div className="z-10 bg-warm-cream/95 p-6 rounded-3xl shadow-2xl backdrop-blur-md max-w-2xl w-full h-[85vh] flex flex-col border-4 border-amber-glow relative">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <h2 className="text-2xl font-game text-speaker-rose uppercase tracking-widest">Fruit Catch</h2>
            <p className="text-[10px] text-stone-grey uppercase font-bold">Level 5 Activity</p>
          </div>
          <div className="bg-night-plum text-white px-4 py-2 rounded-xl text-center min-w-[100px]">
            <div className="text-[8px] opacity-60 uppercase mb-1">Caught</div>
            <div className="font-game text-lg">{score} / {totalAttempts}</div>
          </div>
        </div>

        {gameState === 'intro' ? (
          <div className="flex-1 flex flex-col items-center p-2 overflow-y-auto scrollbar-hide">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="relative mb-4 mt-2 shrink-0"
            >
              <img src={appleImg} className="w-12 h-12 drop-shadow-xl" alt="Apple" />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-glow text-white text-[7px] px-2 py-0.5 rounded-full uppercase font-bold whitespace-nowrap">Target</div>
            </motion.div>
            
            <div className="bg-white/40 p-4 rounded-2xl border-2 border-amber-glow/20 mb-4 max-w-md w-full shrink-0">
              <h3 className="font-game text-night-plum mb-2 text-sm">HOW TO PLAY</h3>
              <ul className="text-stone-grey text-[9px] space-y-1.5 text-left list-disc list-inside leading-tight">
                <li>Tap <span className="text-speaker-rose font-bold">"TOSS APPLE"</span> to throw.</li>
                <li>Wait for the apple to fly into the <span className="text-amber-600 font-bold">golden window</span>.</li>
                <li>Tap <span className="text-speaker-rose font-bold">"{pet.name}"</span> to jump and catch!</li>
                <li>Catch <span className="text-night-plum font-bold">8+ apples</span> for max bonus!</li>
              </ul>
            </div>

            <button 
              onClick={() => setGameState('playing')}
              className="bg-mossy-green hover:bg-green-700 text-white px-8 py-3 rounded-xl font-game uppercase tracking-widest shadow-xl active:scale-95 transition-all transform shrink-0 mb-2"
            >
              Start Game
            </button>
          </div>
        ) : gameState === 'playing' ? (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 relative border-2 border-dashed border-stone-grey/10 rounded-xl overflow-hidden bg-white/5 mb-4">
              {/* Target Window - Positioned higher */}
              <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-28 h-28 border-4 border-amber-glow/20 rounded-full flex items-center justify-center backdrop-blur-[1px]">
                 <div className="w-20 h-20 border border-amber-glow/10 rounded-full animate-pulse flex items-center justify-center">
                    <span className="text-[8px] text-amber-glow/30 font-bold uppercase tracking-widest">Zone</span>
                 </div>
              </div>

              {/* The Pet - Positioned lower with smaller size */}
              <motion.div 
                className="absolute bottom-4 left-1/2 -translate-x-1/2 cursor-pointer z-10 group"
                animate={{ 
                  y: petJumping ? -200 : 0,
                  scale: petJumping ? 1.1 : 1
                }}
                onClick={handlePetCatch}
              >
                <div className="relative">
                   <AnimalSprite 
                     species={pet.species}
                     spriteKey={spriteKey} 
                     animation={petJumping ? 'happy' : 'idle'} 
                     size={120} 
                   />
                   
                   <AnimatePresence>
                     {fruitCaught === true && (
                       <motion.div
                         initial={{ scale: 0, opacity: 0, y: 0 }}
                         animate={{ scale: 2, opacity: 1, y: -60 }}
                         exit={{ opacity: 0 }}
                         className="absolute top-0 left-1/2 -translate-x-1/2 text-4xl pointer-events-none"
                       >
                         ⭐
                       </motion.div>
                     )}
                     {fruitCaught === false && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0, y: 0 }}
                          animate={{ scale: 1, opacity: 1, y: -40 }}
                          exit={{ opacity: 0 }}
                          className="absolute -top-12 left-1/2 -translate-x-1/2 text-xs font-bold text-night-plum bg-white/80 px-2 py-1 rounded-lg shadow-sm pointer-events-none whitespace-nowrap"
                        >
                          {timingFeedback === 'Early' ? 'Too Early!' : 'Too Late!'}
                        </motion.div>
                     )}
                   </AnimatePresence>
                </div>
                <div className="mt-1 bg-speaker-rose/10 group-hover:bg-speaker-rose/20 px-3 py-1 rounded-full transition-colors">
                  <p className="text-[8px] text-center text-speaker-rose uppercase font-bold tracking-widest whitespace-nowrap">Jump!</p>
                </div>
              </motion.div>

              {/* The Fruit - Path adjusted to match the higher window */}
              <AnimatePresence>
                {fruitActive && !fruitCaught && (
                  <motion.img 
                    key={totalAttempts}
                    src={appleImg}
                    className="absolute w-12 h-12 pointer-events-none drop-shadow-lg z-20"
                    initial={{ left: -50, bottom: '15%', rotate: 0 }}
                    animate={{ 
                      left: ['-10%', '50%', '110%'],
                      bottom: ['15%', '85%', '15%'],
                      rotate: 1080
                    }}
                    transition={{ duration: currentDuration.current / 1000, ease: "linear" }}
                  />
                )}
              </AnimatePresence>

              {/* Game indicators */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <p className="text-[8px] text-stone-grey uppercase font-bold opacity-60">Attempts</p>
                <div className="flex gap-1">
                  {Array.from({ length: maxAttempts }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-4 h-4 rounded-sm border ${
                        i < totalAttempts 
                          ? (i < score ? 'bg-amber-glow border-amber-500' : 'bg-night-plum/40 border-night-plum') 
                          : 'bg-white/20 border-stone-grey/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="h-20 flex items-center justify-center">
               <button
                 disabled={fruitActive}
                 onClick={handleToss}
                 className={`group relative px-12 py-4 rounded-2xl font-game uppercase tracking-[0.2em] transition-all overflow-hidden ${
                   fruitActive 
                    ? 'bg-stone-grey/20 text-stone-grey cursor-not-allowed' 
                    : 'bg-speaker-rose text-white shadow-lg lg:hover:scale-105 active:scale-95'
                 }`}
               >
                 <span className="relative z-10">Toss Apple</span>
                 {!fruitActive && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />}
               </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-2 overflow-y-auto scrollbar-hide">
            <div className="relative mb-4">
              <span className="text-7xl">🍎</span>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="bg-white/80 rounded-full px-3 py-1 border-2 border-amber-glow">
                    <span className="text-xl font-game text-amber-600">{score}</span>
                 </div>
              </div>
            </div>
            <h3 className="text-2xl font-game text-night-plum mb-1 uppercase tracking-widest">Well Done!</h3>
            <p className="text-stone-grey mb-4 text-xs">
              {pet.name} caught <span className="font-bold text-night-plum">{score} / {maxAttempts}</span> apples!
            </p>
            <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-amber-50 border-2 border-amber-200 text-amber-700 px-8 py-3 rounded-2xl mb-6"
            >
               <div className="text-[8px] uppercase font-bold opacity-70 mb-0.5">XP Gained</div>
               <div className="text-2xl font-game">+{finalXP}</div>
            </motion.div>
            
            <button 
              onClick={handleFinish}
              className="bg-night-plum hover:bg-black text-white px-10 py-4 rounded-xl font-game uppercase tracking-widest shadow-xl active:scale-95 transition-all w-full max-w-xs shrink-0"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>

      <button 
        onClick={onComplete}
        className="absolute top-6 right-6 z-10 w-10 h-10 bg-night-plum/60 hover:bg-night-plum text-white rounded-full flex items-center justify-center backdrop-blur-md active:scale-95 transition-all font-pixel text-xl"
      >
        ×
      </button>
    </div>
  );
}
