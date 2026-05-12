import React, { useState } from 'react';
import AnimalSprite, { AnimalAnimation } from './AnimalSprite.component';
import { STARTER_DOGS } from '../config/starterDogs.config';

export default function AnimationDebug() {
  const [selectedSpecies, setSelectedSpecies] = useState('DOG');
  const [selectedSubspecies, setSelectedSubspecies] = useState(STARTER_DOGS[0].spriteKey);
  const [selectedAnimation, setSelectedAnimation] = useState<AnimalAnimation>('idle');
  const [activeAnimation, setActiveAnimation] = useState<AnimalAnimation>('idle');
  const [isCameraNervous, setIsCameraNervous] = useState(false);
  const [key, setKey] = useState(0);

  const animations: AnimalAnimation[] = [
    'idle',
    'nervous',
    'cowering',
    'curious',
    'retreat',
    'happy',
    'shivering',
    'trusting',
    'petting',
    'fear',
    'neutral',
    'hidden',
    'revealed'
  ];

  const handleAct = () => {
    setActiveAnimation(selectedAnimation);
    setKey(prev => prev + 1); // Force re-render for one-shot animations
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-night-plum p-8 font-pixel">
      <div className="bg-warm-cream border-2 border-stone-grey p-8 rounded-xl shadow-2xl max-w-2xl w-full">
        <h1 className="text-xl font-game text-night-plum mb-8 text-center uppercase tracking-widest">
          Animation Debug
        </h1>

        <div className="flex gap-12 mb-12 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className={`w-48 h-48 bg-stone-grey/20 rounded-lg flex items-center justify-center p-4 border border-stone-grey/30 transition-all ${isCameraNervous ? 'camera-nervous' : ''}`}>
              <AnimalSprite 
                key={key}
                spriteKey={selectedSubspecies} 
                animation={activeAnimation} 
                size={128}
              />
            </div>
            <div className="text-[8px] text-muted-sage uppercase tracking-widest">
              Preview
            </div>
          </div>

          <div className="flex flex-col gap-4 flex-1">
             <div className="space-y-1">
               <label className="text-[8px] text-muted-sage uppercase block">Species</label>
               <select 
                value={selectedSpecies}
                onChange={(e) => setSelectedSpecies(e.target.value)}
                className="w-full bg-stone-grey/20 border border-stone-grey/40 text-dialogue-text px-3 py-2 rounded text-[10px] outline-none"
               >
                 <option value="DOG">Dog</option>
                 <option value="CAT" disabled>Cat (Coming Soon)</option>
               </select>
             </div>

             <div className="space-y-1">
               <label className="text-[8px] text-muted-sage uppercase block">Sub-species</label>
               <select 
                value={selectedSubspecies}
                onChange={(e) => setSelectedSubspecies(e.target.value)}
                className="w-full bg-stone-grey/20 border border-stone-grey/40 text-dialogue-text px-3 py-2 rounded text-[10px] outline-none"
               >
                 {STARTER_DOGS.map(dog => (
                   <option key={dog.id} value={dog.spriteKey}>{dog.name}</option>
                 ))}
               </select>
             </div>

             <div className="space-y-1">
               <label className="text-[8px] text-muted-sage uppercase block">Animation</label>
               <select 
                value={selectedAnimation}
                onChange={(e) => setSelectedAnimation(e.target.value as AnimalAnimation)}
                className="w-full bg-stone-grey/20 border border-stone-grey/40 text-dialogue-text px-3 py-2 rounded text-[10px] outline-none"
               >
                 {animations.map(anim => (
                   <option key={anim} value={anim}>{anim}</option>
                 ))}
               </select>
             </div>

             <div className="flex items-center gap-2 py-2">
               <input 
                type="checkbox" 
                id="camera_nervous" 
                checked={isCameraNervous} 
                onChange={(e) => setIsCameraNervous(e.target.checked)}
                className="rounded border-stone-grey/40"
               />
               <label htmlFor="camera_nervous" className="text-[8px] text-muted-sage uppercase cursor-pointer">Nervous Camera</label>
             </div>

             <button 
              onClick={handleAct}
              className="mt-2 bg-soft-rose hover:bg-blossom-pink text-warm-cream font-game text-[10px] py-4 rounded shadow-lg transition-all active:scale-95 uppercase tracking-widest"
             >
                Act
             </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => {
              setActiveAnimation('petting');
              setKey(prev => prev + 1);
            }}
            className="bg-stone-grey/20 hover:bg-stone-grey/40 text-dialogue-text px-4 py-3 rounded text-[8px] tracking-widest uppercase transition-colors"
          >
            Test: Pet Interaction
          </button>
          <button 
            onClick={() => setActiveAnimation('idle')}
            className="bg-stone-grey/20 hover:bg-stone-grey/40 text-dialogue-text px-4 py-3 rounded text-[8px] tracking-widest uppercase transition-colors"
          >
            Reset to Idle
          </button>
        </div>

        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('dev-jump', { detail: { target: 'shelter_view' } }))}
          className="mt-12 w-full text-[8px] text-muted-sage hover:text-soft-rose uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
        >
          ← Back to Shelter
        </button>
      </div>
    </div>
  );
}
