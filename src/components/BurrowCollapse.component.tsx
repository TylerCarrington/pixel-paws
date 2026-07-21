import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { getAnimalSpriteSrc } from '../logic/animalAssets.logic';
import { Species } from '../types/animal.types';

export default function BurrowCollapse({ onFinish }: { onFinish?: () => void }) {
  const setPhase6State = useGameStore(state => state.setPhase6State);
  const rescueBreed = useGameStore(state => state.rescueBreed);
  const species = (useGameStore(state => state.rescueSpecies) as Species) || Species.SMALL_ANIMAL;
  
  const [phase, setPhase] = useState<'dig' | 'done'>('dig');
  const [prompt, setPrompt] = useState('The burrow collapsed! Carefully clear the dirt by gently swiping. Don\'t move too violently or more dirt will fall!');
  
  // A grid of dirt patches
  const [dirtGrid, setDirtGrid] = useState(Array.from({ length: 48 }, (_, i) => ({ id: i, health: 100 })));
  const [shake, setShake] = useState(0);

  const handlePointerMove = (e: React.PointerEvent, id: number) => {
    if (phase !== 'dig') return;
    
    // We only dig if pointer is down
    if (e.buttons > 0) {
      if (Math.abs(e.movementX) > 15 || Math.abs(e.movementY) > 15) {
        // Too fast!
        setShake(10);
        setPrompt('Careful! Digging too fast causes a little cave-in!');
        // Add a bit of health back to a random remaining patch to simulate cave-in
        setDirtGrid(prev => {
          const next = [...prev];
          const activeIds = next.filter(d => d.health > 0).map(d => d.id);
          if (activeIds.length > 0) {
            const randomId = activeIds[Math.floor(Math.random() * activeIds.length)];
            next[randomId] = { ...next[randomId], health: Math.min(100, next[randomId].health + 30) };
          }
          return next;
        });
        setTimeout(() => setShake(0), 300);
      } else {
        // Safe dig
        setDirtGrid(prev => prev.map(d => d.id === id ? { ...d, health: Math.max(0, d.health - 20) } : d));
      }
    }
  };

  useEffect(() => {
    if (phase === 'dig') {
      const remainingAmount = dirtGrid.reduce((acc, curr) => acc + curr.health, 0);
      if (remainingAmount <= 200) { // If almost all dirt is gone (2 squares left max equivalent)
        setPhase('done');
        setPrompt(`You cleared the burrow! The ${rescueBreed?.name || 'little friend'} is safe.`);
        setTimeout(() => {
          if (onFinish) onFinish();
          else setPhase6State('day2_discovery');
        }, 3500);
      }
    }
  }, [dirtGrid, phase, onFinish, setPhase6State, rescueBreed]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden font-pixel touch-none select-none z-50 bg-stone-900">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: "url('./src/assets/images/backgrounds/burrow-collapse.png')" }}
      />
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      <div className="absolute top-8 left-0 right-0 px-6 z-20 text-center pointer-events-none">
        <h2 className="text-warm-cream font-game text-xl drop-shadow-md mb-2">Burrow Collapse</h2>
        <div className="bg-stone-900/80 border-2 border-stone-600 rounded-lg p-4 inline-block max-w-md mx-auto pointer-events-auto">
          <p className={`${shake > 0 ? 'text-red-400' : 'text-white'} text-sm leading-relaxed transition-colors`}>{prompt}</p>
        </div>
      </div>

      <div 
        className="relative w-80 h-96 mt-16 bg-transparent rounded-b-full border-4 border-t-0 border-stone-600/30 overflow-hidden flex flex-wrap content-start"
        style={{ transform: `translate(${shake > 0 ? (Math.random() * 8 - 4) : 0}px, ${shake > 0 ? (Math.random() * 8 - 4) : 0}px)` }}
      >
         {/* The hidden animal at the bottom */}
         <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-16 h-16 z-0">
           {rescueBreed && (
             <img 
               src={getAnimalSpriteSrc(species, rescueBreed.spriteKey)}
               alt={rescueBreed.name}
               className={`w-full h-full object-contain drop-shadow transition-all duration-1000 ${phase === 'done' ? 'scale-125 -translate-y-4 animate-bounce' : 'opacity-50'}`}
               style={{ imageRendering: 'pixelated' }}
             />
           )}
         </div>

         {/* The dirt patches */}
         <div className="absolute inset-0 z-10 grid grid-cols-6 grid-rows-8">
           {dirtGrid.map(dirt => (
             <div 
               key={dirt.id}
               className="relative"
               onPointerMove={(e) => handlePointerMove(e, dirt.id)}
               onPointerDown={(e) => handlePointerMove({ ...e, buttons: 1 } as React.PointerEvent, dirt.id)}
             >
                {dirt.health > 0 && (
                  <div 
                    className="absolute inset-0 bg-amber-900 border border-amber-800/30 rounded-sm m-px"
                    style={{ opacity: dirt.health / 100 }}
                  >
                     {/* Dirt texture specs */}
                     <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
                  </div>
                )}
             </div>
           ))}
         </div>
      </div>
    </div>
  );
}
