import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../stores/game.store';
import { motion, AnimatePresence } from 'framer-motion';
import DialoguePanel from './DialoguePanel';
import AnimalSprite from './AnimalSprite.component';

export default function ShellCheck({ onFinish }: { onFinish?: () => void }) {
  const setPhase6State = useGameStore(state => state.setPhase6State);
  const rescueBreed = useGameStore(state => state.rescueBreed);
  const species = useGameStore(state => state.rescueSpecies) || 'REPTILE';
  
  const [phase, setPhase] = useState<'waiting' | 'inspecting' | 'done'>('waiting');
  const [isSpooked, setIsSpooked] = useState(false);
  const [prompt, setPrompt] = useState('Gain their trust. Approach only when they are calm.');
  
  // Phase 1 state
  const [trustProgress, setTrustProgress] = useState(0);
  const [reptileMood, setReptileMood] = useState<'calm' | 'alert'>('calm');

  // Red Light / Green Light Mood Change
  useEffect(() => {
    if (phase !== 'waiting') return;
    const interval = setInterval(() => {
      setReptileMood(prev => prev === 'calm' ? 'alert' : 'calm');
      // Actually make it somewhat random timing within 1-2.5s
    }, 1000 + Math.random() * 1500);
    return () => clearInterval(interval);
  }, [phase, reptileMood]);

  const handleApproach = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();
    if (phase !== 'waiting') return;
    
    if (reptileMood === 'alert') {
      setTrustProgress(prev => Math.max(0, prev - 25));
      setPrompt("They seem alert! Wait for them to relax before approaching.");
      setIsSpooked(true);
      setTimeout(() => setIsSpooked(false), 500);
    } else {
      setTrustProgress(prev => {
        const next = prev + 15;
        if (next >= 100) {
          setPhase('inspecting');
          setPrompt("They trust you! Inspect all the scales. See if you can find the spot they want you to touch next.");
          // Start Phase 2 init
          const newOrder = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5);
          setCorrectOrder(newOrder);
        } else {
          setPrompt("Good, they are staying calm. Move closer...");
        }
        return next;
      });
    }
  };

  // Phase 2 state
  const [correctOrder, setCorrectOrder] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [failCount, setFailCount] = useState(0);

  const SPOTS = [
    { id: '1', top: '10%', left: '75%' }, // Head/neck
    { id: '2', top: '35%', left: '50%' }, // Upper back
    { id: '3', top: '55%', left: '20%' }, // Mid back
    { id: '4', top: '75%', left: '35%' }, // Leg area
    { id: '5', top: '85%', left: '70%' }, // Tail area
  ];

  const handleInspect = (e: React.MouseEvent | React.TouchEvent, idx: number) => {
    e.stopPropagation();
    if (phase !== 'inspecting' || isSpooked || showHint) return;

    if (idx === correctOrder[currentStep]) {
      setPrompt(`Good! That didn't bother them.`);
      if (currentStep + 1 === 5) {
        setPhase('done');
        setPrompt("Their scales seem healthy and intact. Let's bring them to the shelter.");
        setTimeout(() => {
          if (onFinish) onFinish();
          else setPhase6State('day2_discovery');
        }, 3000);
      } else {
        setCurrentStep(prev => prev + 1);
      }
    } else {
      // Wrong order!
      setIsSpooked(true);
      setCurrentStep(0); // Reset
      const newFailCount = failCount + 1;
      setFailCount(newFailCount);
      
      if (newFailCount >= 10) {
        setPrompt("You startled them! Memorize this exact pattern.");
        setShowHint(true);
        setTimeout(() => {
          setIsSpooked(false);
          setShowHint(false);
        }, 3000);
      } else {
        setPrompt("You startled them! That wasn't the right spot. Start over and try a different sequence.");
        setTimeout(() => {
          setIsSpooked(false);
        }, 1500);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden font-pixel bg-stone-900 select-none"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-80" 
        style={{ backgroundImage: "url('./src/assets/images/backgrounds/riverside-path.jpeg')" }}
      />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10 transition-transform duration-1000" style={{ transform: phase === 'waiting' ? `scale(${1 + (trustProgress / 100) * 0.5})` : 'scale(1.5)' }}>
        <motion.div className="relative w-64 h-64 flex items-center justify-center">
          
          {phase === 'waiting' && rescueBreed && (
            <motion.div 
               initial={{ opacity: 0.5 }} 
               animate={{ 
                  opacity: reptileMood === 'alert' ? 1 : 0.8,
                  x: isSpooked ? [-5, 5, -5, 5, 0] : 0,
                  transition: isSpooked ? { duration: 0.2 } : { duration: 0.3 }
               }} 
               className={`relative z-0 filter transition-all duration-300 ${reptileMood === 'alert' ? 'brightness-125 sepia-0' : 'brightness-75 sepia'}`}
            >
               {reptileMood === 'alert' && !isSpooked && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-2xl font-bold text-red-500 animate-pulse">!</div>
               )}
               <AnimalSprite 
                spriteKey={rescueBreed.spriteKey} 
                species={species} 
                animation="idle"
                size={160} 
              />
            </motion.div>
          )}

          {phase !== 'waiting' && rescueBreed && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }} 
               animate={{ 
                 opacity: 1, 
                 scale: 1, 
                 x: isSpooked ? [-5, 5, -5, 5, 0] : 0,
                 transition: isSpooked ? { repeat: isSpooked ? Infinity : 0, duration: 0.2 } : { duration: 0.3 }
               }} 
               className="relative z-0"
            >
               {isSpooked && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-2xl font-bold text-red-500 animate-bounce">!</div>
               )}
               <AnimalSprite 
                spriteKey={rescueBreed.spriteKey} 
                species={species} 
                animation="idle"
                size={160} 
              />
            </motion.div>
          )}

          {phase === 'inspecting' && (
            <div className="absolute inset-x-0 inset-y-8 z-20">
              {SPOTS.map((spot, idx) => {
                const orderIndex = correctOrder.indexOf(idx);
                const isPassed = currentStep > orderIndex;
                
                const displayNum = showHint ? orderIndex + 1 : '';
                
                return (
                  <button 
                    key={spot.id}
                    className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full border-2 flex items-center justify-center font-bold text-lg pointer-events-auto shadow-sm transition-all duration-300
                      ${isPassed ? 'bg-green-500 border-green-300 text-white' : 
                        showHint ? 'bg-yellow-400 border-white text-stone-900 animate-pulse scale-110' : 
                        'bg-white/50 border-white text-transparent hover:bg-white hover:text-stone-900 hover:scale-110'}`
                    }
                    style={{ top: spot.top, left: spot.left }}
                    onClick={(e) => handleInspect(e, idx)}
                    disabled={showHint || isSpooked || isPassed}
                  >
                    {isPassed ? '✓' : displayNum}
                  </button>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {phase === 'waiting' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-40 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center space-y-4"
          >
            <div className="bg-stone-800/80 p-4 rounded-xl text-white w-64 border-2 border-stone-600 shadow-lg mb-4">
              <div className="text-sm mb-2 text-center">Trust Level</div>
              <div className="w-full h-4 bg-stone-900 rounded-full overflow-hidden border border-stone-500">
                <div className="h-full bg-blue-400 transition-all duration-300 ease-out" style={{ width: `${trustProgress}%` }} />
              </div>
            </div>
            
            <button
               onPointerDown={handleApproach}
               className={`px-8 py-4 rounded-full font-bold text-xl border-4 shadow-xl transition-all active:scale-95 ${
                 reptileMood === 'calm' 
                   ? 'bg-green-500 border-green-700 text-white hover:bg-green-400' 
                   : 'bg-stone-400 border-stone-500 text-stone-200 opacity-80'
               }`}
            >
               Approach Slowly
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warning overlay for spooked phase */}
      <AnimatePresence>
        {isSpooked && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 border-8 border-red-500/50 pointer-events-none z-[100]"
            />
        )}
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-0 z-[200]">
        <DialoguePanel 
          speaker={null}
          text={prompt}
          variant="narration"
          onComplete={() => {}}
        />
      </div>
    </div>
  );
}
