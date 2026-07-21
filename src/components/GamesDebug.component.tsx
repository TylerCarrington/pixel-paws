import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { STARTER_REPTILES } from '../config/starterReptiles.config';
import { STARTER_CATS } from '../config/starterCats.config';
import { STARTER_DOGS } from '../config/starterDogs.config';
import { STARTER_SMALL_ANIMALS } from '../config/starterSmallAnimals.config';
import { Species, HealthStatus, Rarity } from '../types/animal.types';
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
import ParkInjured from './ParkInjured.component';
import SunbeamSeeker from './SunbeamSeeker.component';
import TemperatureRegulation from './TemperatureRegulation.component';
import ShellCheck from './ShellCheck.component';
import RockHiding from './RockHiding.component';
import ShedSkinDiscovery from './ShedSkinDiscovery.component';

import WallSqueak from './WallSqueak.component';
import TubeStuck from './TubeStuck.component';
import BurrowCollapse from './BurrowCollapse.component';
import WheelInjury from './WheelInjury.component';
import BeddingBreather from './BeddingBreather.component';

export default function GamesDebug() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<'All' | 'Dog' | 'Cat' | 'Reptile' | 'Small Animal' | 'Other'>('All');
  const { initializeRescueWash, setPhase6State } = useGameStore();

  useEffect(() => {
    // Ensure we have a normal dog assigned broadly so regular games don't crash
    initializeRescueWash();
  }, [initializeRescueWash]);

  useEffect(() => {
    // Manually force the species into the store based on the active category
    let breed;
    let species;
    
    if (filterCategory === 'Reptile') {
      breed = STARTER_REPTILES[0];
      species = Species.REPTILE;
    } else if (filterCategory === 'Cat') {
      breed = STARTER_CATS[0];
      species = Species.CAT;
    } else if (filterCategory === 'Small Animal') {
      breed = STARTER_SMALL_ANIMALS[0];
      species = Species.SMALL_ANIMAL;
    } else {
      breed = STARTER_DOGS[0];
      species = Species.DOG;
    }

    if (breed) {
      useGameStore.setState({
        rescueBreed: breed,
        rescueSpecies: species,
        rescueHealth: HealthStatus.HEALTHY,
        rescueRarity: Rarity.COMMON,
        washComplete: false
      });
    }
  }, [filterCategory]);

  const games = [
    { id: 'alley', name: 'Alley Rescue (Scared Animal)', component: AlleyRescue, categories: ['Dog', 'Cat'] },
    { id: 'fence', name: 'Fence Rescue (Tangled Animal)', component: FenceRescue, categories: ['Dog', 'Cat'] },
    { id: 'light', name: 'Light Search (Shed Search)', component: LightSearch, categories: ['Dog', 'Cat'] },
    { id: 'food', name: 'Food Tempt (Market Animal)', component: FoodTempt, categories: ['Dog', 'Cat'] },
    { id: 'woodpile', name: 'Woodpile Rescue (Trapped Animal)', component: WoodpileRescue, categories: ['Dog', 'Cat'] },
    { id: 'chase', name: 'Chase Runaway (Village Runaway)', component: ChaseRunaway, categories: ['Dog', 'Cat'] },
    { id: 'porch', name: 'Porch Rescue (Stray Cat / Hider)', component: PorchRescue, categories: ['Dog', 'Cat'] },
    { id: 'riverside', name: 'Riverside Warmup (Wet Animal)', component: RiversideWarmup, categories: ['Dog', 'Cat'] },
    { id: 'park', name: 'Park Rescue (Injured Animal)', component: ParkInjured, categories: ['Dog', 'Cat'] },
    { id: 'bush', name: 'Bush Search (Find Animal)', component: BushSearch, categories: ['Dog', 'Cat'] },
    
    { id: 'sunbeam', name: 'Sunbeam Seeker (Reptile)', component: SunbeamSeeker, categories: ['Reptile'] },
    { id: 'turtle-temp', name: 'Temperature Match (Turtle)', component: TemperatureRegulation, categories: ['Reptile'] },
    { id: 'reptile-scales', name: 'Scales Check (Reptile)', component: ShellCheck, categories: ['Reptile'] },
    { id: 'reptile-rock', name: 'Rock Hiding (Reptile)', component: RockHiding, categories: ['Reptile'] },
    { id: 'reptile-shed', name: 'Shed Skin (Reptile)', component: ShedSkinDiscovery, categories: ['Reptile'] },
    
    { id: 'wall-squeak', name: 'Wall Squeak (Small Animal)', component: WallSqueak, categories: ['Small Animal'] },
    { id: 'tube-stuck', name: 'Tube Stuck (Small Animal)', component: TubeStuck, categories: ['Small Animal'] },
    { id: 'burrow-collapse', name: 'Burrow Collapse (Small Animal)', component: BurrowCollapse, categories: ['Small Animal'] },
    { id: 'wheel-injury', name: 'Wheel Injury (Small Animal)', component: WheelInjury, categories: ['Small Animal'] },
    { id: 'bedding', name: 'Bedding Breather (Small Animal)', component: BeddingBreather, categories: ['Small Animal'] },

    { id: 'wash', name: 'Wash Rescue (Muddy Animal)', component: ({ onFinish }: any) => <ReactWashInteraction isRescue={true} onFinish={onFinish} />, categories: ['Dog', 'Cat'] },
    { id: 'anim', name: 'Animation Debugger', component: AnimationDebug, categories: ['Other'] },
  ];

  const filteredGames = games.filter(g => filterCategory === 'All' || g.categories.includes(filterCategory));

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

        <p className="text-center text-muted-sage text-[10px] uppercase tracking-widest mb-6">
          Select a minigame to test its interactions independently.
        </p>

        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {(['All', 'Dog', 'Cat', 'Reptile', 'Small Animal', 'Other'] as const).map(cat => (
             <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded text-[10px] uppercase tracking-widest font-game transition-colors ${filterCategory === cat ? 'bg-night-plum text-warm-cream' : 'bg-stone-grey/20 text-night-plum hover:bg-stone-grey/40'}`}
             >
                {cat}
             </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {filteredGames.map(game => (
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
