import React from 'react';
import { ShopItem } from '../config/shopItems.config';
import InsufficientFunds from './InsufficientFunds.component';

interface ShopItemCardProps {
  item: ShopItem;
  canAfford: boolean;
  onPurchase: (item: ShopItem) => void;
}

export default function ShopItemCard({ item, canAfford, onPurchase }: ShopItemCardProps) {
  return (
    <div className="bg-warm-cream/50 border border-stone-grey/20 p-5 rounded-2xl flex flex-col justify-between hover:border-soft-lilac/50 transition-all group">
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-[10px] text-dialogue-text font-game uppercase tracking-widest group-hover:text-speaker-rose transition-colors">
            {item.name}
          </h3>
          <span className="text-speaker-rose text-xs font-game tracking-tighter">
            ${item.cost}
          </span>
        </div>
        <p className="text-[8px] text-muted-sage leading-relaxed mb-6 font-pixel">
          {item.description}
        </p>
      </div>
      
      <div className="flex flex-col gap-3">
        {!canAfford && <InsufficientFunds />}
        <button
          disabled={!canAfford}
          onClick={() => onPurchase(item)}
          className={`
            w-full py-3 text-[8px] uppercase tracking-widest rounded-xl font-game transition-all active:scale-95
            ${canAfford ? 'bg-mossy-green hover:bg-deep-moss text-warm-cream shadow-[0_4px_12px_rgba(122,184,122,0.4)]' : 'bg-stone-grey/30 text-stone-grey cursor-not-allowed'}
          `}
        >
          Buy {item.name}
        </button>
      </div>
    </div>
  );
}
