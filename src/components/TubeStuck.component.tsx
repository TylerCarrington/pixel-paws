import React, { useState } from 'react';
import { useGameStore } from '../stores/game.store';
import { getAnimalSpriteSrc } from '../logic/animalAssets.logic';
import { Species } from '../types/animal.types';
import { getAssetUrl } from '../logic/assetResolver.logic';

export default function TubeStuck({ onFinish }: { onFinish?: () => void }) {
  const setPhase6State = useGameStore(state => state.setPhase6State);
  const rescueBreed = useGameStore(state => state.rescueBreed);
  const species = (useGameStore(state => state.rescueSpecies) as Species) || Species.SMALL_ANIMAL;
  
  const [phase, setPhase] = useState<'inspect' | 'disassemble' | 'freed'>('inspect');
  const [prompt, setPrompt] = useState('They are wedged tight in this tube system! Tap to inspect the blockage.');
  
  // A simple tube system structure
  // We need to remove the outer pieces to reach the center piece safely
  const [tubePieces, setTubePieces] = useState([
    { id: 1, type: 'end_left', connected: true, position: 'left-0' },
    { id: 2, type: 'straight_left', connected: true, position: 'left-1/4' },
    { id: 3, type: 'center', connected: true, position: 'left-1/2 -translate-x-1/2', hasAnimal: true },
    { id: 4, type: 'straight_right', connected: true, position: 'right-1/4' },
    { id: 5, type: 'end_right', connected: true, position: 'right-0' },
  ]);

  const handleTubeClick = (id: number) => {
    if (phase === 'inspect') {
      setPhase('disassemble');
      setPrompt('Carefully detach the outer tube sections to safely reach them. Do not move the section they are in yet!');
      return;
    }
    
    if (phase === 'disassemble') {
      const piece = tubePieces.find(p => p.id === id);
      if (!piece) return;

      if (piece.hasAnimal) {
        // Did they try to remove the animal piece before the others are removed?
        const othersConnected = tubePieces.some(p => !p.hasAnimal && p.connected);
        if (othersConnected) {
          setPrompt('Be careful! You need to detach the side pieces first before you can free them.');
        } else {
          setPhase('freed');
          setPrompt(`Got them! The ${rescueBreed?.name || 'little friend'} is safe.`);
          setTimeout(() => {
            if (onFinish) onFinish();
            else setPhase6State('day2_discovery');
          }, 3500);
        }
      } else {
        // Can only remove an outer piece if it's an end or its outer piece is already removed
        // For simplicity: just let any non-animal piece be removed
        setTubePieces(prev => prev.map(p => p.id === id ? { ...p, connected: false } : p));
        setPrompt('Tube section detached.');
      }
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden font-pixel select-none z-50 bg-stone-900">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url('${getAssetUrl('./src/assets/images/backgrounds/tube-stuck.png')}')` }}
      />
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      
      <div className="absolute top-8 left-0 right-0 px-6 z-20 text-center pointer-events-none">
        <h2 className="text-warm-cream font-game text-xl drop-shadow-md mb-2">Tube Stuck</h2>
        <div className="bg-stone-900/80 border-2 border-stone-600 rounded-lg p-4 inline-block max-w-md mx-auto pointer-events-auto">
          <p className="text-white text-sm leading-relaxed">{prompt}</p>
        </div>
      </div>

      <div className="relative w-full max-w-2xl h-64 flex items-center justify-center mt-12 bg-transparent rounded-xl p-8 overflow-visible">
        
        {tubePieces.map(piece => {
           if (!piece.connected && !piece.hasAnimal) return null;

           return (
             <div 
               key={piece.id}
               onClick={() => handleTubeClick(piece.id)}
               className={`absolute w-32 h-32 rounded-3xl border-4 ${piece.hasAnimal && phase === 'freed' ? 'border-green-500 scale-110' : 'border-blue-400/50 bg-blue-300/10'} shadow-lg backdrop-blur-sm flex items-center justify-center cursor-pointer transition-all duration-300 transform ${piece.position} ${phase === 'freed' && piece.hasAnimal ? 'z-50 shadow-2xl bg-stone-700 border-none' : 'hover:bg-blue-300/30'}`}
             >
                {/* Tube connection rings */}
                {!piece.hasAnimal && <div className="absolute inset-y-0 left-0 w-2 bg-blue-500/50 rounded-l" />}
                {!piece.hasAnimal && <div className="absolute inset-y-0 right-0 w-2 bg-blue-500/50 rounded-r" />}
                
                {piece.hasAnimal && (
                  <div className={`relative w-16 h-16 ${phase !== 'freed' ? 'opacity-80 rotate-90 scale-90' : 'animate-bounce'}`}>
                    {rescueBreed && (
                      <img 
                        src={getAnimalSpriteSrc(species, rescueBreed.spriteKey)}
                        alt={rescueBreed.name}
                        className="w-full h-full object-contain drop-shadow"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    )}
                  </div>
                )}
             </div>
           )
        })}

      </div>
    </div>
  );
}
