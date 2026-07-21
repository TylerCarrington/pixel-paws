import React, { useState } from 'react';
import { useGameStore } from '../stores/game.store';
import { getAnimalSpriteSrc } from '../logic/animalAssets.logic';
import { Species } from '../types/animal.types';

export default function WheelInjury({ onFinish }: { onFinish?: () => void }) {
  const setPhase6State = useGameStore(state => state.setPhase6State);
  const rescueBreed = useGameStore(state => state.rescueBreed);
  const species = (useGameStore(state => state.rescueSpecies) as Species) || Species.SMALL_ANIMAL;
  
  const [phase, setPhase] = useState<'cup' | 'examine' | 'done'>('cup');
  const [prompt, setPrompt] = useState('They are limping after getting stuck in a wheel. Form a cup with your hands and drag to gently scope them up.');
  
  const [handPos, setHandPos] = useState({ x: 0, y: 0 });
  const [isCupped, setIsCupped] = useState(false);
  const [examineClicks, setExamineClicks] = useState(0);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (phase !== 'cup') return;
    if (e.buttons > 0) {
      const targetArea = document.getElementById('animal-area');
      if (targetArea) {
        const rect = targetArea.getBoundingClientRect();
        // If pointer is over the animal area roughly
        if (
          e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom
        ) {
          setIsCupped(true);
          setPhase('examine');
          setPrompt('Good job! They are safe in your hands. Now gently tap to examine their legs for injuries.');
        }
      }
    }
  };

  const handleExamineClick = () => {
    if (phase !== 'examine') return;
    const newCount = examineClicks + 1;
    setExamineClicks(newCount);
    
    if (newCount === 1) {
      setPrompt('Front legs look okay... gently turn to check the back legs.');
    } else if (newCount === 2) {
      setPrompt('Left back leg is fine...');
    } else if (newCount >= 3) {
      setPhase('done');
      setPrompt('Ah, just a minor scrape on the right back foot. Some rest in a proper enclosure without a wire wheel will heal it perfectly!');
      setTimeout(() => {
        if (onFinish) onFinish();
        else setPhase6State('day2_discovery');
      }, 4000);
    }
  };

  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden font-pixel touch-none select-none z-50 bg-stone-900"
      onPointerMove={handlePointerMove}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: "url('./src/assets/images/backgrounds/wheel-injury.png')" }}
      />
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      <div className="absolute top-8 left-0 right-0 px-6 z-20 text-center pointer-events-none">
        <h2 className="text-night-plum font-game text-xl drop-shadow-sm mb-2">Wheel Injury Check</h2>
        <div className="bg-warm-cream/90 border-2 border-stone-400 rounded-lg p-4 inline-block max-w-md mx-auto pointer-events-auto shadow-md">
          <p className="text-stone-800 text-sm leading-relaxed">{prompt}</p>
        </div>
      </div>

      <div className="relative w-full h-full flex items-center justify-center pt-24">
        
        {/* Background Cage Element */}
        {phase === 'cup' && (
          <div className="absolute right-1/4 bottom-1/4 w-32 h-32 rounded-full border-8 border-stone-400 opacity-30 shadow-inner bg-transparent flex items-center justify-center">
            {/* Wheel Spokes */}
            <div className="w-full h-2 bg-stone-400 absolute" />
            <div className="w-full h-2 bg-stone-400 absolute rotate-45" />
            <div className="w-full h-2 bg-stone-400 absolute rotate-90" />
            <div className="w-full h-2 bg-stone-400 absolute rotate-[135deg]" />
          </div>
        )}

        {/* Hands Visualization (simplified as a cup shape) */}
        <div 
          className="absolute w-64 h-32 bottom-20 z-10 flex justify-center items-end"
        >
           {/* Left hand curve */}
           <div className={`w-32 h-24 bg-rose-200/40 border-r-0 border-4 border-rose-300/60 rounded-bl-[40px] transition-all duration-700 origin-bottom-right ${phase !== 'cup' ? 'rotate-[-10deg]' : '-translate-x-12'}`} />
           {/* Right hand curve */}
           <div className={`w-32 h-24 bg-rose-200/40 border-l-0 border-4 border-rose-300/60 rounded-br-[40px] transition-all duration-700 origin-bottom-left ${phase !== 'cup' ? 'rotate-[10deg]' : 'translate-x-12'}`} />
        </div>

        {/* Animal */}
        <div 
          id="animal-area"
          className="relative w-32 h-32 z-20"
          onClick={handleExamineClick}
        >
          {rescueBreed && (
            <img 
              src={getAnimalSpriteSrc(species, rescueBreed.spriteKey)}
              alt={rescueBreed.name}
              className={`w-full h-full object-contain drop-shadow-xl transition-all duration-500 cursor-pointer ${phase === 'examine' ? 'scale-125 -translate-y-4' : ''} ${examineClicks > 0 ? 'scale-x-[-1]' : ''}`}
              style={{ imageRendering: 'pixelated' }}
            />
          )}
          
          {phase === 'examine' && (
            <div className={`absolute top-0 right-0 p-2 bg-white rounded-full shadow border-2 border-stone-200 text-xs font-bold text-night-plum animate-pulse pointer-events-none`}>
              Tap to examine
            </div>
          )}
          
          {phase === 'done' && (
            <div className="absolute right-0 bottom-4 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center animate-bounce z-30 shadow-md">
              <span className="text-white text-[10px]">✓</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
