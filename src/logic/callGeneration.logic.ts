import { Species } from '../types/animal.types';
import { CallTemplate, DailyCall } from '../types/calls.types';

export function generateDailyCalls(
  eligiblePool: CallTemplate[], 
  count: number, 
  seed: number,
  catsUnlocked: boolean = false
): DailyCall[] {
  if (eligiblePool.length === 0) return [];

  // Seeded random helper
  const rand = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const selected: CallTemplate[] = [];
  
  if (catsUnlocked) {
    // 60/40 Dog/Cat split
    const dogPool = eligiblePool.filter(c => c.species.toUpperCase() === 'DOG');
    const catPool = eligiblePool.filter(c => c.species.toUpperCase() === 'CAT');

    for (let i = 0; i < count; i++) {
      const r = rand();
      const targetSpecies = r < 0.6 ? 'DOG' : 'CAT';
      const pool = targetSpecies === 'DOG' ? (dogPool.length > 0 ? dogPool : catPool) : (catPool.length > 0 ? catPool : dogPool);
      
      if (pool.length > 0) {
        const index = Math.floor(rand() * pool.length);
        selected.push(pool[index]);
      }
    }
  } else {
    // Random selection from pool (usually just dogs)
    const shuffled = [...eligiblePool].sort(() => rand() - 0.5);
    selected.push(...shuffled.slice(0, Math.min(count, shuffled.length)));
  }

  return selected.map((template, index) => ({
    ...template,
    instanceId: `call-${Date.now()}-${index}`,
    responded: false
  }));
}
