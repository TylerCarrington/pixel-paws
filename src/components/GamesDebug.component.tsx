import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import AlleyRescue from './AlleyRescue.component';
import BushSearch from './BushSearch.component';
import ReactWashInteraction from './ReactWashInteraction';
import AnimationDebug from './AnimationDebug.component';

import FenceRescue from './FenceRescue.component';
import LightSearch from './LightSearch.component';
import FoodTempt from './FoodTempt.component';
import WoodpileRescue from './WoodpileRescue.component';
import ChaseRunaway from './ChaseRunaway.component';
import PorchRescue from './PorchRescue.component';
import RiversideWarmup from './RiversideWarmup.component';

export default function GamesDebug() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const { initializeRescueWash, setPhase6State } = useGameStore();

  useEffect(() => {
    // Ensure we have a dog assigned so games don't crash if visited early
    initializeRescueWash();
  }, [initializeRescueWash]);

  const games = [
    { id: 'alley', name: 'Alley Rescue (Scared Dog)', component: AlleyRescue },
    { id: 'fence', name: 'Fence Rescue (Tangled Dog)', component: FenceRescue },
    { id: 'light', name: 'Light Search (Shed Dog)', component: LightSearch },
    { id: 'food', name: 'Food Tempt (Market Dog)', component: FoodTempt },
    { id: 'woodpile', name: 'Woodpile Rescue (Trapped Dog)', component: WoodpileRescue },
    { id: 'chase', name: 'Chase Runaway (Village)', component: ChaseRunaway },
    { id: 'porch', name: 'Porch Rescue (Hiding Dog)', component: PorchRescue },
    { id: 'riverside', name: 'Riverside Warmup (Wet Dog)', component: RiversideWarmup },
    { id: 'bush', name: 'Bush Search (Find Dog)', component: BushSearch },
    { id: 'wash', name: 'Wash Rescue (Muddy Dog)', component: ({ onFinish }: any) => <ReactWashInteraction isRescue={true} onFinish={onFinish} /> },
    { id: 'anim', name: 'Animation Debugger', component: AnimationDebug },
  ];

  if (activeGame) {
    const GameComponent = games.find(g => g.id === activeGame)?.component;
    
    return (
      <div className="relative w-full h-full bg-night-plum overflow-hidden">
        {GameComponent && <GameComponent onFinish={() => setActiveGame(null)} />}
        
        {/* Floating Back Button to easily switch games */}
        <div className="absolute top-4 left-4 z-[9999]">
          <button 
            onClick={() => setActiveGame(null)}
            className="bg-black/50 hover:bg-black/80 text-warm-cream px-4 py-2 rounded-full font-pixel text-[10px] uppercase tracking-widest backdrop-blur transition-all"
          >
            ← Back to Games Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 bg-night-plum font-pixel w-full h-full overflow-y-auto">
      <div className="bg-warm-cream border-2 border-stone-grey p-8 rounded-xl shadow-2xl max-w-md w-full my-8 flex-shrink-0">
        <h1 className="text-xl font-game text-night-plum mb-6 text-center uppercase tracking-widest">
          Minigames Debug
        </h1>

        <p className="text-center text-muted-sage text-[10px] uppercase tracking-widest mb-8">
          Select a minigame to test its interactions independently.
        </p>

        <div className="flex flex-col gap-4">
          {games.map(game => (
            <button
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              className="bg-stone-grey/10 hover:bg-soft-rose/20 hover:text-soft-rose hover:border-soft-rose text-dialogue-text border border-stone-grey/30 py-4 px-6 rounded-lg text-xs uppercase tracking-widest transition-all text-left font-game"
            >
              {game.name}
            </button>
          ))}
        </div>

        <button 
          onClick={() => setPhase6State('shelter_view')}
          className="mt-8 w-full text-[8px] text-muted-sage hover:text-soft-rose uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
        >
          ← Back to Shelter
        </button>
      </div>
    </div>
  );
}
