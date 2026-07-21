import React, { useState } from 'react';
import { useGameStore } from '../stores/game.store';
import { getAnimalSpriteSrc } from '../logic/animalAssets.logic';
import { Species } from '../types/animal.types';

export default function BeddingBreather({ onFinish }: { onFinish?: () => void }) {
  const setPhase6State = useGameStore(state => state.setPhase6State);
  const rescueBreed = useGameStore(state => state.rescueBreed);
  const species = (useGameStore(state => state.rescueSpecies) as Species) || Species.SMALL_ANIMAL;
  
  const [phase, setPhase] = useState<'search' | 'found' | 'done'>('search');
  const [prompt, setPrompt] = useState('They got buried under too much bedding. Gently drag the bedding away to uncover them.');
  
  // Create a layered bedding covering
  const [beddingStrips, setBeddingStrips] = useState(Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 100,
    y: (Math.random() - 0.5) * 100,
    r: Math.random() * 360,
    removed: false,
    color: ['bg-amber-100', 'bg-orange-100', 'bg-stone-200'][Math.floor(Math.random() * 3)]
  })));

  const handlePointerOverStrip = (e: React.PointerEvent, id: number) => {
    if (phase !== 'search') return;
    
    // Require pointer button down to 'drag'
    if (e.buttons > 0) {
      setBeddingStrips(prev => prev.map(strip => strip.id === id ? { ...strip, removed: true } : strip));
      
      // Check if enough bedding is removed
      setTimeout(() => {
        setBeddingStrips(curr => {
          const remaining = curr.filter(s => !s.removed).length;
          if (remaining <= 3 && phase === 'search') {
            setPhase('found');
            setPrompt(`There they are! Just a bit startled but perfectly fine.`);
            setTimeout(() => {
              setPhase('done');
              setPrompt('Let\'s set up a safer depth of bedding for them at the shelter.');
              setTimeout(() => {
                if (onFinish) onFinish();
                else setPhase6State('day2_discovery');
              }, 3000);
            }, 2000);
          }
          return curr;
        });
      }, 50);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden font-pixel touch-none select-none z-50 bg-stone-900">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: "url('./src/assets/images/backgrounds/bedding-breather.png')" }}
      />
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      <div className="absolute top-8 left-0 right-0 px-6 z-20 text-center pointer-events-none">
        <h2 className="text-warm-cream font-game text-xl drop-shadow-md mb-2">Bedding Breather</h2>
        <div className="bg-stone-800/90 border-2 border-stone-600 rounded-lg p-4 inline-block max-w-md mx-auto pointer-events-auto">
          <p className="text-stone-300 text-sm leading-relaxed">{prompt}</p>
        </div>
      </div>

      <div className="relative w-64 h-64 mt-12 bg-transparent rounded-xl flex items-center justify-center overflow-hidden">
         {/* Animal hiding */}
         <div className="absolute z-0 w-24 h-24">
           {rescueBreed && (
             <img 
               src={getAnimalSpriteSrc(species, rescueBreed.spriteKey)}
               alt={rescueBreed.name}
               className={`w-full h-full object-contain drop-shadow transition-all duration-700 ${phase !== 'search' ? 'scale-110 -translate-y-2' : ''}`}
               style={{ imageRendering: 'pixelated' }}
             />
           )}
         </div>

         {/* Bedding Strips */}
         <div className="absolute inset-0 z-10 flex items-center justify-center">
           {beddingStrips.map(strip => (
             <div 
               key={strip.id}
               className={`absolute w-32 h-8 rounded-full border border-stone-300/20 shadow-md ${strip.color} transition-all duration-300 ease-out`}
               style={{ 
                 transform: `translate(${strip.removed ? strip.x * 3 : strip.x}px, ${strip.removed ? strip.y * 3 + 200 : strip.y}px) rotate(${strip.r}deg)`,
                 opacity: strip.removed ? 0 : 0.95
               }}
               onPointerOver={(e) => handlePointerOverStrip(e, strip.id)}
               onPointerDown={(e) => handlePointerOverStrip({ ...e, buttons: 1 } as React.PointerEvent, strip.id)}
             >
                {/* Paper shaving texture */}
                <div className="absolute inset-0 bg-black/5 rounded-full" style={{ backgroundImage: 'linear-gradient(90deg, transparent 40%, rgba(0,0,0,0.05) 50%, transparent 60%)' }} />
             </div>
           ))}
         </div>
      </div>
    </div>
  );
}
