import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { getAnimalSpriteSrc } from '../logic/animalAssets.logic';
import { Species } from '../types/animal.types';
import { getAssetUrl } from '../logic/assetResolver.logic';

export default function WallSqueak({ onFinish }: { onFinish?: () => void }) {
  const setPhase6State = useGameStore(state => state.setPhase6State);
  const rescueBreed = useGameStore(state => state.rescueBreed);
  const species = (useGameStore(state => state.rescueSpecies) as Species) || Species.SMALL_ANIMAL;
  
  const [phase, setPhase] = useState<'listen' | 'trap_set' | 'waiting' | 'done'>('listen');
  const [prompt, setPrompt] = useState('We hear squeaking in the walls! Focus on a vent to listen closely.');
  
  const [isScared, setIsScared] = useState(false);
  const [focusedVent, setFocusedVent] = useState<number | null>(null);
  const [focusEnergy, setFocusEnergy] = useState(100);
  const [targetIdx, setTargetIdx] = useState(() => Math.floor(Math.random() * 5));
  
  const vents = [0, 1, 2, 3, 4].map(i => ({ id: i, isTarget: i === targetIdx }));
  
  const [soundIntensity, setSoundIntensity] = useState([0, 0, 0, 0, 0]);
  
  // Focus energy regeneration/drain
  useEffect(() => {
    if (phase !== 'listen') return;
    
    const interval = setInterval(() => {
      setFocusEnergy(prev => {
        if (focusedVent !== null) {
          return Math.max(0, prev - 2); // Drain while listening
        }
        return Math.min(100, prev + 1); // Regen while resting
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [phase, focusedVent]);

  // If focus energy hits 0, stop listening
  useEffect(() => {
    if (focusEnergy === 0) setFocusedVent(null);
  }, [focusEnergy]);

  useEffect(() => {
    if (phase !== 'listen') return;
    
    // Simulate sound with more overlap and subtle patterns
    const interval = setInterval(() => {
      setSoundIntensity(prev => prev.map((_, i) => {
        if (isScared) return 0;
        
        // Only show sound for the focused vent
        if (focusedVent !== i) return 0;

        if (i === targetIdx) {
          // Target: Rhythmically consistent but subtle
          const time = Date.now() / 1000;
          const rhythm = Math.sin(time * 5) * 30 + 50; 
          return rhythm + (Math.random() * 20 - 10);
        } else {
          // Distractors: Random and jittery, sometimes similar to target
          return Math.random() < 0.3 ? Math.random() * 50 + 20 : Math.random() * 30;
        }
      }));
    }, 100);
    
    return () => clearInterval(interval);
  }, [phase, targetIdx, isScared, focusedVent]);

  const handleVentClick = (ventId: number) => {
    if (phase !== 'listen' || isScared) return;
    
    if (ventId === targetIdx) {
      setPhase('trap_set');
      setPrompt('You pinpointed the source! Placing the trap now...');
      setTimeout(() => {
        setPhase('waiting');
        setPrompt('Trap set. Tune the lure frequency to match the animal\'s rustling!');
      }, 2000);
    } else {
      setIsScared(true);
      setPrompt('Nothing here... The animal scurried away to another part of the wall!');
      
      // Move the target to a neighbor on miss
      setTimeout(() => {
        setTargetIdx(prev => {
          const move = Math.random() < 0.5 ? -1 : 1;
          let next = prev + move;
          if (next < 0) next = 1;
          if (next > 4) next = 3;
          return next;
        });
        setIsScared(false);
        setPrompt('It has settled down. Listen carefully again.');
      }, 3000);
    }
  };

  const [waitProgress, setWaitProgress] = useState(0);
  const [currentFrequency, setCurrentFrequency] = useState(50);
  const [targetFrequency, setTargetFrequency] = useState(50);

  // Update target frequency periodically during wait phase
  useEffect(() => {
    if (phase !== 'waiting') return;

    const interval = setInterval(() => {
      setTargetFrequency(Math.floor(Math.random() * 80) + 10);
    }, 2500);

    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'waiting') return;

    const interval = setInterval(() => {
      const diff = Math.abs(currentFrequency - targetFrequency);
      const isSynced = diff < 12;

      if (isSynced) {
        setWaitProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setPhase('done');
            setPrompt(`Gotcha! The ${rescueBreed?.name || 'little friend'} is safe.`);
            setTimeout(() => {
              if (onFinish) onFinish();
              else setPhase6State('day2_discovery');
            }, 3500);
            return 100;
          }
          return prev + 1.5;
        });
      } else {
        setWaitProgress(prev => Math.max(0, prev - 0.5));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [phase, currentFrequency, targetFrequency, rescueBreed, onFinish, setPhase6State]);


  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden font-pixel z-50 bg-stone-900 select-none">
      <style>{`
        @keyframes move-bg {
          0% { background-position: 0 0; }
          100% { background-position: 1rem 0; }
        }
      `}</style>
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url('${getAssetUrl('./src/assets/images/backgrounds/wall-squeak.png')}')` }}
      />
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      {/* Title / Prompt */}
      <div className="absolute top-8 left-0 right-0 px-6 z-20 text-center pointer-events-none">
        <h2 className="text-warm-cream font-game text-xl drop-shadow-md mb-2 uppercase tracking-widest">Acoustic Rescue</h2>
        <div className="bg-stone-900/85 border-2 border-stone-600 rounded-lg p-4 inline-block max-w-md mx-auto pointer-events-auto shadow-2xl">
          <p className="text-white text-sm leading-relaxed antialiased">{prompt}</p>
        </div>
      </div>

      {/* Wall Scene */}
      <div className="relative w-full h-full flex flex-col items-center justify-end pb-32 z-10 px-4">
        
        {/* Interaction Controls */}
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-full max-w-xs flex flex-col items-center gap-4 z-30">
          {phase === 'listen' && (
            <div className="w-full bg-stone-800/50 rounded-full h-2 overflow-hidden border border-white/10">
              <div 
                className="h-full bg-sky-400 transition-all duration-300"
                style={{ width: `${focusEnergy}%` }}
              />
            </div>
          )}

          {phase === 'waiting' && (
            <div className="flex flex-col items-center gap-8 w-full">
              {/* Overall Progress */}
              <div className="w-full bg-stone-950/60 rounded-full h-5 overflow-hidden border-2 border-stone-600 p-0.5 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full relative"
                  style={{ width: `${waitProgress}%` }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[move-bg_1s_linear_infinite]" />
                </div>
              </div>

              {/* Frequency Tuning UI */}
              <div className="w-full bg-stone-800/80 border-2 border-stone-500 rounded-xl p-6 shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-stone-400 text-[10px] uppercase tracking-tighter">Signal Analysis</span>
                  <div className={`w-3 h-3 rounded-full transition-colors duration-200 ${Math.abs(currentFrequency - targetFrequency) < 12 ? 'bg-sky-400 animate-pulse' : 'bg-stone-600'}`} />
                </div>

                {/* The Slider Track with Target Zone */}
                <div className="relative w-full h-12 flex items-center">
                  <div className="absolute inset-x-0 h-1.5 bg-stone-900 rounded-full border border-stone-700" />
                  
                  {/* Target Zone Marker */}
                  <div 
                    className="absolute h-6 w-12 bg-sky-500/20 border-x-2 border-sky-400/40 rounded transition-all duration-1000 ease-in-out"
                    style={{ left: `calc(${targetFrequency}% - 1.5rem)` }}
                  />

                  {/* Player Slider */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentFrequency}
                    onChange={(e) => setCurrentFrequency(parseInt(e.target.value))}
                    className="absolute inset-x-0 w-full appearance-none bg-transparent cursor-pointer z-10 
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-10 
                      [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-200
                      [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:shadow-lg
                      [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:h-10 [&::-moz-range-thumb]:bg-amber-400 
                      [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-amber-200 [&::-moz-range-thumb]:rounded-sm"
                  />
                </div>
                
                <p className="text-center text-white/60 text-[10px] mt-4 uppercase tracking-[0.2em]">Match frequency to lure animal</p>
              </div>
            </div>
          )}
        </div>

        <div className="relative z-10 flex flex-wrap justify-center gap-6 sm:gap-12 items-end mb-16 max-w-5xl">
          {[0, 1, 2, 3, 4].map(id => (
            <div key={id} className="flex flex-col items-center">
              {/* Sound indicator */}
              <div className="h-20 w-12 mb-3 flex items-end justify-center gap-1 opacity-80 bg-black/20 rounded-t-lg p-1">
                {phase === 'listen' && Array.from({ length: 3 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1.5 bg-sky-400 rounded-t-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                    style={{ 
                      height: `${(soundIntensity[id] || 0) * (0.6 + Math.random() * 0.4)}%`,
                      opacity: (soundIntensity[id] || 0) / 100 + 0.2
                    }}
                  />
                ))}
              </div>
              
              {/* Vent Grate */}
              <button 
                onMouseDown={() => phase === 'listen' && setFocusedVent(id)}
                onMouseUp={() => setFocusedVent(null)}
                onMouseLeave={() => setFocusedVent(null)}
                onTouchStart={() => phase === 'listen' && setFocusedVent(id)}
                onTouchEnd={() => setFocusedVent(null)}
                onClick={() => handleVentClick(id)}
                className={`relative w-16 h-20 bg-stone-300/40 border-4 border-stone-500 rounded shadow-inner flex flex-col justify-evenly p-1.5 group transition-all duration-200 ${phase === 'listen' ? 'hover:bg-stone-200/60 hover:-translate-y-1 active:scale-95 cursor-pointer' : 'cursor-default'} ${focusedVent === id ? 'ring-2 ring-sky-400/50 bg-stone-200/50' : ''}`}
              >
                {/* Grate lines */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-full h-0.5 bg-stone-900/80" />
                ))}

                {/* Trap overlay */}
                {(phase === 'trap_set' || phase === 'waiting' || phase === 'done') && id === targetIdx && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-14 bg-stone-800 border-2 border-stone-500 rounded shadow-2xl translate-y-6 z-20 flex items-end justify-center pb-2">
                     <div className="w-16 h-8 border border-stone-600 rounded-sm bg-stone-950 flex items-center justify-center relative overflow-hidden">
                       {/* Wire pattern */}
                       <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.2) 2px, rgba(255,255,255,0.2) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.2) 2px, rgba(255,255,255,0.2) 4px)' }}></div>
                       
                       {phase === 'done' && rescueBreed && (
                         <div className="relative w-6 h-6 z-10 animate-pulse">
                           <img 
                            src={getAnimalSpriteSrc(species, rescueBreed.spriteKey)} 
                            alt={rescueBreed.name}
                            className="w-full h-full object-contain filter brightness-110"
                            style={{ imageRendering: 'pixelated' }}
                           />
                         </div>
                       )}
                     </div>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
