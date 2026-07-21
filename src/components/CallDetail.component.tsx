import React from 'react';
import { DailyCall } from '../types/calls.types';
import { useGameStore } from '../stores/game.store';
import { DiscoveryMethod } from '../types/animal.types';

interface CallDetailProps {
  call: DailyCall;
  onRespond: () => void;
}

const LOCATION_BACKGROUNDS: Record<string, string> = {
  [DiscoveryMethod.SCARED_APPROACH]: '/src/assets/images/backgrounds/back-alley.png',
  [DiscoveryMethod.FOOD_TEMPT]: '/src/assets/images/backgrounds/back-alley.png',
  [DiscoveryMethod.DARK_SEARCH]: '/src/assets/images/backgrounds/construction‑shed.png',
  [DiscoveryMethod.WOODPILE_TRAPPED]: '/src/assets/images/backgrounds/woodpile.png',
  [DiscoveryMethod.RUNAWAY_CHASE]: '/src/assets/images/backgrounds/downtown-village.png',
  [DiscoveryMethod.PORCH_HIDING]: '/src/assets/images/backgrounds/porch.png',
  [DiscoveryMethod.RIVERSIDE_WARMUP]: '/src/assets/images/backgrounds/riverside-cold.png',
  [DiscoveryMethod.PARK_INJURED]: '/src/assets/images/backgrounds/park-with-benches.png',
  [DiscoveryMethod.HIDING]: '/src/assets/images/backgrounds/park-with-benches.png',
  [DiscoveryMethod.FENCE_TANGLED]: '/src/assets/images/backgrounds/playground.png',
  [DiscoveryMethod.DIRTY]: '/src/assets/images/backgrounds/riverside-path.jpeg',
  [DiscoveryMethod.BOX]: '/src/assets/images/backgrounds/marketplace.png',
  [DiscoveryMethod.PARK_FIND]: '/src/assets/images/backgrounds/park-with-benches.png',
  [DiscoveryMethod.BACKYARD_STRAY]: '/src/assets/images/backgrounds/porch.png',
  [DiscoveryMethod.POLICE_DROP]: '/src/assets/images/backgrounds/marketplace.png',
  [DiscoveryMethod.SOUND]: '/src/assets/images/backgrounds/construction‑shed.png',
  [DiscoveryMethod.TANGLED]: '/src/assets/images/backgrounds/park-fountain.png',
};

export default function CallDetail({ call, onRespond }: CallDetailProps) {
  const shelterAnimals = useGameStore(s => s.shelterAnimals);
  const shelterCapacity = useGameStore(s => s.shelterCapacity);
  const catCapacity = useGameStore(s => s.catCapacity);
  const catsUnlocked = useGameStore(s => s.catsUnlocked);

  const isCat = call.species.toLowerCase() === 'cat';
  const isDog = call.species.toLowerCase() === 'dog';
  
  const catsCount = shelterAnimals.filter(a => a.species === 'CAT').length;
  const dogsCount = shelterAnimals.filter(a => a.species === 'DOG').length;

  let canTake = true;
  let reason = '';

  if (isCat && !catsUnlocked) {
    canTake = false;
    reason = 'Shelter cannot accept cats yet.';
  } else if (isCat && catsCount >= catCapacity) {
    canTake = false;
    reason = `Cat capacity is full (${catsCount}/${catCapacity}).`;
  } else if (isDog && dogsCount >= shelterCapacity) {
    canTake = false;
    reason = `Dog capacity is full (${dogsCount}/${shelterCapacity}).`;
  }

  const bgImage = LOCATION_BACKGROUNDS[call.discoveryMethod] || '/src/assets/images/backgrounds/park-with-benches.png';

  return (
    <div className="bg-warm-cream border-2 border-soft-rose rounded-lg p-6 flex flex-col h-full shadow-lg font-pixel overflow-hidden">
      <h2 className="text-sm font-game text-dialogue-text uppercase tracking-tighter mb-4 border-b border-soft-rose/30 pb-4 leading-relaxed shrink-0">
        {call.title}
      </h2>
      
      <div className="flex-1 overflow-y-auto pr-2 mb-4 scrollbar-thin scrollbar-thumb-soft-rose/30 space-y-4">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-soft-rose/20 shadow-inner group shrink-0">
           <img 
             src={bgImage} 
             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
             alt="Rescue Location" 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
           <div className="absolute bottom-3 left-3 flex items-center gap-2">
             <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
             <span className="text-[8px] text-white uppercase tracking-widest font-pixel drop-shadow-md">Live Dispatch Location</span>
           </div>
        </div>

        <div className="space-y-4">
          <p className="text-dialogue-text leading-relaxed text-xs sm:text-sm font-retro">
            {call.description}
          </p>

          <div className="grid grid-cols-1 gap-2 mt-4">
            <div className="bg-stone-grey/5 p-3 rounded-lg border border-stone-grey/10 flex items-center justify-between">
               <div className="text-[8px] text-muted-sage uppercase tracking-widest">Reported Species</div>
               <div className="text-dialogue-text text-[10px] uppercase font-bold">{call.species}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-2 border-t border-soft-rose/10">
        {(!canTake && !call.responded) && (
          <div className="text-speaker-rose text-[8px] mb-2 text-center uppercase tracking-widest bg-soft-rose/10 py-1 rounded">
            {reason}
          </div>
        )}
        <button
          onClick={onRespond}
          disabled={call.responded || !canTake}
          className={`
            w-full py-3 sm:py-4 text-xs font-game uppercase tracking-widest transition-all rounded-xl
            ${(call.responded || !canTake)
              ? 'bg-stone-grey/30 text-warm-cream cursor-not-allowed' 
              : 'bg-mossy-green hover:bg-deep-moss text-white shadow-[0_4px_0_rgb(60,95,60)] active:shadow-none active:translate-y-1'
            }
          `}
        >
          {call.responded ? 'Call Resolved' : (!canTake ? 'Capacity Reached' : 'Dispatch Rescue Unit')}
        </button>
      </div>
    </div>
  );
}
