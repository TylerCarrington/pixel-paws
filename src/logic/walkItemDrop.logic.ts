import { WALK_ITEMS, WalkItem } from '../config/walkItems.config';

export function getWalkDrop(seed: number): WalkItem | null {
  // Simple probability-based drop
  const random = (Math.sin(seed) + 1) / 2; // Pseudo-random 0-1
  
  if (random < 0.3) return null; // 30% chance of nothing

  const pool = WALK_ITEMS;
  
  if (random > 0.95) {
    return pool.find(i => i.rarity === 'Legendary') || pool[0];
  } else if (random > 0.8) {
    const rareItems = pool.filter(i => i.rarity === 'Rare');
    return rareItems[Math.floor(random * rareItems.length)] || pool[0];
  } else {
    const commonItems = pool.filter(i => i.rarity === 'Common');
    return commonItems[Math.floor(random * commonItems.length)] || pool[0];
  }
}
