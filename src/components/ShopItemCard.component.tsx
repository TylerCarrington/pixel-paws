import React from 'react';
import { ShopItem } from '../config/shopItems.config';
import InsufficientFunds from './InsufficientFunds.component';

interface ShopItemCardProps {
  item: ShopItem;
  canAfford: boolean;
  onPurchase: (item: ShopItem) => void;
}

export default function ShopItemCard({ item, canAfford, onPurchase }: ShopItemCardProps) {
  const isImage = item.image?.startsWith('/') || item.image?.startsWith('http');

  return (
    <div className="bg-white/60 border border-stone-grey/20 p-4 rounded-3xl flex items-center gap-6 hover:border-soft-lilac/30 transition-all group shadow-sm hover:shadow-md">
      {/* Small Icon Left */}
      <div className="w-16 h-16 bg-warm-cream/50 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-stone-grey/5 relative">
         <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
         {item.image ? (
           isImage ? (
             <img 
               src={item.image} 
               alt={item.name} 
               className="w-2/3 h-2/3 object-contain drop-shadow-sm group-hover:scale-110 transition-transform" 
               style={{ imageRendering: 'pixelated' }}
             />
           ) : (
             <span className="text-3xl group-hover:scale-110 transition-transform drop-shadow-sm select-none">{item.image}</span>
           )
         ) : (
           <span className="text-2xl opacity-20 transform -rotate-12">📦</span>
         )}
      </div>

      {/* Info Middle */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-[10px] text-dialogue-text font-game uppercase tracking-widest group-hover:text-speaker-rose transition-colors truncate">
            {item.name}
          </h3>
          <span className="text-speaker-rose text-[10px] font-game tracking-tighter ml-2">
            ${item.cost}
          </span>
        </div>
        <p className="text-[9px] text-muted-sage leading-tight font-pixel line-clamp-1">
          {item.description}
        </p>
      </div>
      
      {/* Action Right */}
      <div className="flex flex-col items-end gap-1 w-32">
        <button
          disabled={!canAfford}
          onClick={() => onPurchase(item)}
          className={`
            w-full py-2.5 text-[8px] uppercase tracking-widest rounded-xl font-game transition-all active:scale-95
            ${canAfford ? 'bg-mossy-green hover:bg-deep-moss text-warm-cream shadow-[0_2px_8px_rgba(122,184,122,0.2)]' : 'bg-stone-grey/20 text-stone-grey cursor-not-allowed'}
          `}
        >
          {canAfford ? 'Purchase' : 'Locked'}
        </button>
        {!canAfford && <InsufficientFunds />}
      </div>
    </div>
  );
}
