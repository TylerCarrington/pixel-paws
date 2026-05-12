import React from 'react';
import { Rarity } from '../types/animal.types';

interface RarityBadgeProps {
  rarity: Rarity;
}

export default function RarityBadge({ rarity }: RarityBadgeProps) {
  let colorClass = '';

  switch (rarity) {
    case Rarity.COMMON: colorClass = 'text-muted-sage border-muted-sage/30 bg-stone-grey/10'; break;
    case Rarity.UNCOMMON: colorClass = 'text-mossy-green border-mossy-green/30 bg-mossy-green/10'; break;
    case Rarity.RARE: colorClass = 'text-soft-lilac border-soft-lilac/30 bg-soft-lilac/10'; break;
    case Rarity.EXOTIC: colorClass = 'text-soft-rose border-soft-rose/30 bg-soft-rose/10'; break;
    case Rarity.LEGENDARY: colorClass = 'text-amber-glow border-amber-glow/30 bg-amber-glow/10'; break;
  }

  return (
    <div className={`inline-flex items-center px-1.5 py-0.5 rounded border ${colorClass} text-[8px] font-pixel uppercase tracking-tighter`}>
      {rarity}
    </div>
  );
}
