import React, { useState } from 'react';
import { useGameStore } from '../stores/game.store';
import BakingTreatsActivity from './BakingTreatsActivity.component';
import FruitCatchActivity from './FruitCatchActivity.component';
import CookingTogetherActivity from './CookingTogetherActivity.component';
import TasteTesterActivity from './TasteTesterActivity.component';
import HideSeekActivity from './HideSeekActivity.component';
import FetchActivity from './FetchActivity.component';
import PuzzleToyActivity from './PuzzleToyActivity.component';
import TugWarActivity from './TugWarActivity.component';
import ObstacleCourseActivity from './ObstacleCourseActivity.component';
import TricksShowcaseActivity from './TricksShowcaseActivity.component';
import { STARTER_DOGS } from '../config/starterDogs.config';
import { Species, Animal, Rarity, HealthStatus, DiscoveryMethod } from '../types/animal.types';

export default function ActivitiesDebug() {
  const [activeActivity, setActiveActivity] = useState<string | null>(null);
  const { setPhase6State } = useGameStore();

  // Create a mock pet for testing
  const mockPet: Animal = {
    id: 'debug-pet-id',
    name: 'Debug Pup',
    species: Species.DOG,
    breed: STARTER_DOGS[0].id,
    rarity: Rarity.COMMON,
    isRevealed: true,
    desirability: 100,
    healthStatus: HealthStatus.HEALTHY,
    vetDaysRemaining: 0,
    hasHealthCertificate: true,
    isMine: true,
    outfits: [],
    discoveryMethod: DiscoveryMethod.DIRTY,
    mood: 'Happy',
    actionsUsedToday: 0,
    level: 100,
    currentXP: 0,
    totalXP: 50000,
    activityCooldowns: {},
    equippedAccessories: {
      head: null,
      neck: null,
      body: null,
      back: null
    },
    hiddenBonuses: {
      pet: 0,
      feed: 0,
      play: 0,
      groom: 0,
      activity: 0
    }
  };

  const activities = [
    { id: 'baking', name: 'Baking Treats (Level 1)', component: BakingTreatsActivity },
    { id: 'hideSeek', name: 'Hide and Seek (Level 1)', component: HideSeekActivity },
    { id: 'tugWar', name: 'Tug of War (Level 1)', component: TugWarActivity },
    { id: 'fruit', name: 'Fruit Catch (Level 5)', component: FruitCatchActivity },
    { id: 'fetch', name: 'Fetch (Level 5)', component: FetchActivity },
    { id: 'obstacleCourse', name: 'Obstacle Course (Level 10)', component: ObstacleCourseActivity },
    { id: 'cooking', name: 'Cooking Together (Level 15)', component: CookingTogetherActivity },
    { id: 'puzzleToy', name: 'Puzzle Toy (Level 20)', component: PuzzleToyActivity },
    { id: 'taste', name: 'Taste Tester (Level 30)', component: TasteTesterActivity },
    { id: 'tricksShowcase', name: 'Tricks Showcase (Level 50)', component: TricksShowcaseActivity },
  ];

  if (activeActivity) {
    const ActivityComponent = activities.find(a => a.id === activeActivity)?.component;
    
    return (
      <div className="relative w-full h-full bg-night-plum overflow-hidden">
        {ActivityComponent && (
          <ActivityComponent 
            pet={mockPet as any} 
            onComplete={() => setActiveActivity(null)} 
          />
        )}
        
        {/* Floating Back Button */}
        <div className="absolute top-4 left-4 z-[9999]">
          <button 
            onClick={() => setActiveActivity(null)}
            className="bg-black/50 hover:bg-black/80 text-warm-cream px-4 py-2 rounded-full font-pixel text-[10px] uppercase tracking-widest backdrop-blur transition-all"
          >
            ← Back to Activities Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 bg-night-plum font-pixel w-full h-full overflow-y-auto">
      <div className="bg-warm-cream border-2 border-stone-grey p-8 rounded-xl shadow-2xl max-w-md w-full my-8 flex-shrink-0">
        <h1 className="text-xl font-game text-night-plum mb-6 text-center uppercase tracking-widest">
          Activities Debug
        </h1>

        <p className="text-center text-muted-sage text-[10px] uppercase tracking-widest mb-8 text-balance">
          Test home activities with a mock level-100 character.
        </p>

        <div className="flex flex-col gap-4">
          {activities.map(activity => (
            <button
              key={activity.id}
              onClick={() => setActiveActivity(activity.id)}
              className="bg-stone-grey/10 hover:bg-soft-rose/20 hover:text-soft-rose hover:border-soft-rose text-dialogue-text border border-stone-grey/30 py-4 px-6 rounded-lg text-xs uppercase tracking-widest transition-all text-left font-game"
            >
              {activity.name}
            </button>
          ))}
        </div>

        <button 
          onClick={() => setPhase6State('home_view')}
          className="mt-8 w-full text-[8px] text-muted-sage hover:text-soft-rose uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
        >
          ← Back to House
        </button>
      </div>
    </div>
  );
}
