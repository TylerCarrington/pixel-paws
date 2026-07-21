import React, { useState } from 'react';
import { useGameStore } from '../stores/game.store';
import { xpToNextLevel } from '../logic/ownedPet.logic';
import { Animal } from '../types/animal.types';

type RoomType = 'Kitchen' | 'Bedroom' | 'Family Room';

interface ActivityDef {
  id: string;
  name: string;
  room: RoomType;
  levelReq: number;
  xpReward: number;
  itemReq?: string;
  description: string;
}

export const ACTIVITIES: ActivityDef[] = [
  { id: 'bakingTreats', name: 'Baking Treats', room: 'Kitchen', levelReq: 1, xpReward: 80, description: 'Bake delicious treats together.' },
  { id: 'fruitCatch', name: 'Fruit Catch', room: 'Kitchen', levelReq: 5, itemReq: 'fruitBowl', xpReward: 100, description: 'Toss fruit pieces for your pet to catch.' },
  { id: 'cookingTogether', name: 'Cooking Together', room: 'Kitchen', levelReq: 15, itemReq: 'chefsApron', xpReward: 120, description: 'Prepare a simple dish together.' },
  { id: 'tasteTester', name: 'Taste Tester', room: 'Kitchen', levelReq: 30, itemReq: 'gourmetTreats', xpReward: 130, description: 'Find out your pet\'s favorite flavors.' },
  
  { id: 'hideSeek', name: 'Hide and Seek', room: 'Bedroom', levelReq: 1, xpReward: 80, description: 'A classic game of hide and seek.' },
  { id: 'fetch', name: 'Fetch', room: 'Bedroom', levelReq: 5, itemReq: 'squeakyToy', xpReward: 100, description: 'Throw the toy without hitting furniture.' },
  { id: 'puzzleToy', name: 'Puzzle Toy', room: 'Bedroom', levelReq: 20, itemReq: 'smartFeeder', xpReward: 125, description: 'Solve a slider puzzle for a treat.' },
  
  { id: 'tugWar', name: 'Tug of War', room: 'Family Room', levelReq: 1, xpReward: 80, description: 'A test of strength and timing.' },
  { id: 'obstacleCourse', name: 'Obstacle Course', room: 'Family Room', levelReq: 10, itemReq: 'agilitySet', xpReward: 110, description: 'Run the agility course.' },
  { id: 'tricksShowcase', name: 'Tricks Showcase', room: 'Family Room', levelReq: 50, itemReq: 'championRibbon', xpReward: 150, description: 'Perform advanced trick sequences.' }
];

export default function ActivitySelection({ pet, onPlay }: { pet: Animal, onPlay: (activity: ActivityDef) => void }) {
  const [activeRoom, setActiveRoom] = useState<RoomType>('Kitchen');
  const inventory = useGameStore(state => state.inventory);
  const actionsPerPetToday = useGameStore(state => state.actionsPerPetToday);

  const rooms: RoomType[] = ['Kitchen', 'Bedroom', 'Family Room'];
  const roomActivities = ACTIVITIES.filter(a => a.room === activeRoom);

  const remainingActions = Math.max(0, actionsPerPetToday - (pet.actionsUsedToday || 0));

  return (
    <div className="flex flex-col h-full bg-warm-cream p-6 rounded-2xl border border-stone-grey/20">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 border-b border-stone-grey/20 pb-2">
          {rooms.map(room => (
            <button
              key={room}
              onClick={() => setActiveRoom(room)}
              className={`font-pixel text-[10px] uppercase tracking-widest px-4 py-2 transition-colors ${
                activeRoom === room ? 'text-speaker-rose border-b-2 border-speaker-rose' : 'text-stone-grey hover:text-night-plum'
              }`}
            >
              {room}
            </button>
          ))}
        </div>
        <div className="bg-night-plum text-warm-cream px-3 py-1 rounded-full text-[8px] font-pixel uppercase tracking-widest">
           Actions: {remainingActions} left
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2 pb-8">
        {roomActivities.map(activity => {
          const isDone = pet.activityCooldowns?.[activity.id];
          const meetsLevel = (pet.level ?? 1) >= activity.levelReq;
          const hasItem = !activity.itemReq || inventory.includes(activity.itemReq);
          const isLocked = !meetsLevel || !hasItem;
          const hasActions = remainingActions > 0;

          return (
            <div 
              key={activity.id}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                isLocked ? 'bg-stone-grey/10 border-stone-grey/20 opacity-70' :
                isDone ? 'bg-muted-sage/10 border-muted-sage/30' :
                !hasActions ? 'bg-stone-grey/5 border-stone-grey/10 opacity-60' :
                'bg-white border-warm-brown/30 shadow-sm'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-game text-sm text-night-plum">{activity.name}</h3>
                  <div className="text-[10px] font-pixel text-amber-500 bg-amber-50 px-2 py-1 rounded">
                    +{activity.xpReward + (pet.hiddenBonuses?.activity || 0)} XP
                  </div>
                </div>
                <p className="text-[10px] font-pixel text-stone-grey leading-relaxed">
                  {activity.description}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-stone-grey/10 flex items-center justify-between">
                {isLocked ? (
                  <div className="flex items-center gap-2 text-[8px] font-pixel text-stone-grey uppercase">
                    <span>🔒</span>
                    {!meetsLevel ? `Lvl ${activity.levelReq} Req` : `Requires Item`}
                  </div>
                ) : isDone ? (
                  <div className="text-[10px] font-pixel text-muted-sage font-bold uppercase tracking-widest flex items-center gap-2">
                    <span>✓</span> Completed Today
                  </div>
                ) : !hasActions ? (
                  <div className="text-[10px] font-pixel text-stone-grey uppercase text-center w-full">
                    No actions left
                  </div>
                ) : (
                  <button
                    onClick={() => onPlay(activity)}
                    className="w-full bg-soft-rose hover:bg-speaker-rose text-white font-pixel text-[10px] uppercase tracking-widest py-3 rounded-lg shadow-md transition-all active:scale-95"
                  >
                    Play
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
