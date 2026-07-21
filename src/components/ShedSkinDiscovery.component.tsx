import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { motion, AnimatePresence } from 'framer-motion';
import DialoguePanel from './DialoguePanel';
import AnimalSprite from './AnimalSprite.component';

const SEARCH_AREAS = [
  { id: 'haybales', label: 'Hay Bales', top: '30%', left: '20%' },
  { id: 'rafters', label: 'Rafters', top: '15%', left: '70%' },
  { id: 'corner', label: 'Warm Corner', top: '70%', left: '80%' },
  { id: 'box', label: 'Old Box', top: '65%', left: '25%' },
  { id: 'trough', label: 'Water Trough', top: '80%', left: '40%' },
  { id: 'loft', label: 'Hay Loft', top: '25%', left: '45%' },
  { id: 'barrel', label: 'Old Barrel', top: '50%', left: '15%' },
  { id: 'tools', label: 'Under Tools', top: '45%', left: '85%' },
];

const STUCK_SPOTS = [
  { id: 'head', top: '25%', left: '50%', label: 'Head' },
  { id: 'back', top: '45%', left: '50%', label: 'Back' },
  { id: 'tail', top: '75%', left: '60%', label: 'Tail' },
  { id: 'feet', top: '65%', left: '40%', label: 'Feet / Belly' },
];

export default function ShedSkinDiscovery({ onFinish }: { onFinish?: () => void }) {
  const setPhase6State = useGameStore(state => state.setPhase6State);
  const rescueBreed = useGameStore(state => state.rescueBreed);
  const species = useGameStore(state => state.rescueSpecies) || 'REPTILE';
  
  const [phase, setPhase] = useState<'search' | 'found' | 'soak' | 'rub' | 'done'>('search');
  const [prompt, setPrompt] = useState('We spotted a reptile that might need help shedding. Look in warm, dark places in the barn.');
  
  const [reptileLocation, setReptileLocation] = useState('');
  
  useEffect(() => {
    setReptileLocation(SEARCH_AREAS[Math.floor(Math.random() * SEARCH_AREAS.length)].id);
  }, []);

  const [soakProgress, setSoakProgress] = useState(0);
  const [isSoaking, setIsSoaking] = useState(false);

  const [shedStrength, setShedStrength] = useState<Record<string, number>>({
    head: 100,
    back: 100,
    tail: 100,
    feet: 100
  });

  const handleSearchClick = (areaId: string) => {
    if (phase !== 'search') return;
    
    if (areaId === reptileLocation) {
      setPhase('found');
      setPrompt('There they are! It looks like they have some stuck shed. We must be very gentle.');
      setTimeout(() => {
        setPhase('soak');
        setPrompt('Hold the "Mist" button to spray them with warm water and loosen the skin.');
      }, 3500);
    } else {
      setPrompt('Nothing here but dust. Keep looking.');
    }
  };

  useEffect(() => {
    let interval: any;
    if (phase === 'soak' && isSoaking) {
      interval = setInterval(() => {
        setSoakProgress(prev => {
          const next = prev + 2;
          if (next >= 100) {
            setPhase('rub');
            setPrompt('The skin is soft! Now repeatedly rub the stuck spots gently. They will dry up if you do not get them all quickly!');
            setIsSoaking(false);
          }
          return next;
        });
      }, 50);
    } else if (phase === 'rub') {
      interval = setInterval(() => {
        setShedStrength(prev => {
          let hasRemaining = false;
          let changed = false;
          const next = { ...prev };
          
          for (const key of Object.keys(next)) {
            if (next[key] > -200 && next[key] < 100) {
              next[key] = Math.min(100, next[key] + 2); // Reduced growth rate back to 1
              changed = true;
            }
            if (next[key] > 0) hasRemaining = true;
          }
          
          if (!hasRemaining) {
            setPhase('done');
            setPrompt('Perfect! All the stuck shed is gone and they are shiny and healthy. Time to head to the shelter.');
            setTimeout(() => {
              if (onFinish) onFinish();
              else setPhase6State('day2_discovery');
            }, 3500);
            
            // Disable updates so it doesn't run again
            for (const key of Object.keys(next)) { next[key] = -999; }
            return next;
          }
          
          return changed ? next : prev;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [phase, isSoaking, onFinish, setPhase6State]);

  const handleRub = (e: React.PointerEvent, spotId: string) => {
    if (phase !== 'rub') return;
    
    setShedStrength(prev => {
      const current = prev[spotId];
      if (current <= 0) return prev;
      
      let nextStr = current - 8; // Slightly easier to rub
      if (nextStr <= 0) {
        nextStr = -40; // 40 ticks grace period with growth rate 1 = 2 seconds grace 
        setPrompt(`Nice! The ${STUCK_SPOTS.find(s=>s.id === spotId)?.label.toLowerCase()} is clear. Get the others!`);
      }
      
      return { ...prev, [spotId]: nextStr };
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-pixel bg-stone-900 select-none">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: "url('/src/assets/images/backgrounds/barn-interior.png')" }}
      />
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* Intro Shed Skin Prop (visual only) */}
      {phase === 'search' && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-32 h-8 bg-stone-300/30 rounded-full border border-stone-100/50 rotate-[-10deg] animate-pulse pointer-events-none" />
      )}

      {phase === 'search' && SEARCH_AREAS.map(area => (
        <button
          key={area.id}
          className="absolute w-24 h-24 bg-white/10 hover:bg-white/30 border-2 border-white/20 hover:border-white/60 rounded-xl transition-all flex items-center justify-center text-white/80 hover:text-white text-xs -translate-x-1/2 -translate-y-1/2 shadow-lg"
          style={{ top: area.top, left: area.left }}
          onClick={() => handleSearchClick(area.id)}
        >
          {area.label}
        </button>
      ))}

      <AnimatePresence>
        {phase !== 'search' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center"
          >
            {rescueBreed && (
              <div className="relative bg-warm-cream p-8 rounded-xl shadow-2xl border-4 border-stone-300 flex items-center justify-center w-80 h-96">
                
                {/* Soak effect overlay */}
                {phase === 'soak' && isSoaking && (
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 0.4 }}
                     className="absolute inset-0 bg-blue-300 z-10 rounded-xl mix-blend-overlay pointer-events-none"
                   />
                )}

                <AnimalSprite
                  spriteKey={rescueBreed.spriteKey}
                  species={species}
                  animation="idle"
                  size={160}
                />
                
                {/* Spritz particles */}
                {phase === 'soak' && isSoaking && (
                  <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none rounded-xl">
                    {Array.from({length: 10}).map((_, i) => (
                       <motion.div 
                         key={i}
                         className="absolute w-2 h-2 bg-blue-200 rounded-full"
                         initial={{ 
                           opacity: 0, 
                           y: Math.random() * -100 - 50, 
                           x: Math.random() * 200 + 50 
                         }}
                         animate={{ 
                           opacity: [0, 1, 0], 
                           y: 400,
                           x: Math.random() * 100 + 100 
                         }}
                         transition={{ 
                           duration: 1 + Math.random(), 
                           repeat: Infinity, 
                           ease: "linear",
                           delay: Math.random()
                         }}
                       />
                    ))}
                  </div>
                )}

                {/* Soak Button UI */}
                {phase === 'soak' && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-64 flex flex-col items-center space-y-4 z-50">
                    <button 
                      className={`px-8 py-3 w-full rounded-full font-bold text-white text-lg shadow-xl border-b-4 transition-all touch-none select-none
                        ${isSoaking ? 'bg-blue-400 border-blue-600 translate-y-1' : 'bg-blue-500 border-blue-700 active:translate-y-1 active:border-b-0'}`}
                      onPointerDown={() => setIsSoaking(true)}
                      onPointerUp={() => setIsSoaking(false)}
                      onPointerLeave={() => setIsSoaking(false)}
                    >
                      Hold to Mist
                    </button>
                    <div className="w-full h-4 bg-stone-800 rounded-full overflow-hidden border-2 border-stone-600">
                      <div className="h-full bg-blue-500 transition-all duration-75" style={{ width: `${soakProgress}%` }} />
                    </div>
                  </div>
                )}

                {/* Shed skin inspection UI overlay */}
                {phase === 'rub' && (
                  <>
                    {STUCK_SPOTS.map((spot) => {
                      const strength = shedStrength[spot.id] || 0;
                      if (strength <= 0) return null;
                      
                      return (
                        <div 
                          key={spot.id}
                          className="absolute w-16 h-16 -ml-8 -mt-8 touch-none z-30"
                          style={{ top: spot.top, left: spot.left }}
                          onPointerMove={(e) => handleRub(e, spot.id)}
                          onPointerDown={(e) => handleRub(e, spot.id)}
                        >
                          {/* The stuck skin visual */}
                          <div 
                            className="absolute inset-0 bg-stone-300 rounded-full border-2 border-dashed border-stone-400 opacity-80 pointer-events-none flex items-center justify-center font-bold text-stone-500 text-[10px] tracking-tighter"
                            style={{ opacity: 0.3 + (strength / 100) * 0.5, transform: `scale(${0.5 + (strength / 100) * 0.5})` }}
                          >
                            <span className="bg-white/50 px-1 rounded">{spot.label}</span>
                          </div>
                        </div>
                      )
                    })}
                  </>
                )}
              </div>
            )}
          </motion.div>
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
