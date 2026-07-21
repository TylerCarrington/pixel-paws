import React from 'react';
import { DailyCall } from '../types/calls.types';
import RarityBadge from './RarityBadge.component';

interface CallCardProps {
  call: DailyCall;
  isSelected: boolean;
  onClick: () => void;
}

export default function CallCard({ call, isSelected, onClick }: CallCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`
        relative p-4 cursor-pointer transition-all border-l-4
        ${call.responded ? 'opacity-50 grayscale bg-warm-cream border-stone-grey' : 'bg-warm-cream border-speaker-rose shadow shadow-speaker-rose/20 hover:brightness-95'}
        ${isSelected ? 'ring-2 ring-speaker-rose scale-[1.02] z-10' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-pixel text-[10px] font-bold uppercase tracking-wider text-dialogue-text">
          {call.title}
        </h4>
        <RarityBadge rarity={call.rarity} />
      </div>
      
      <p className="text-[14px] font-retro text-stone-grey line-clamp-2 mb-3 leading-tight">
        {call.description}
      </p>

      <div className="flex items-center gap-3">
        <div className="text-[8px] font-pixel text-muted-sage uppercase tracking-widest bg-stone-grey/20 px-2 py-0.5 rounded">
          {call.species}
        </div>
      </div>

      {call.responded && (
        <div className="absolute inset-0 flex items-center justify-center bg-night-plum/40 pointer-events-none">
          <div className="border-2 border-soft-rose text-soft-rose font-game px-4 py-1 rotate-[-15deg] uppercase tracking-widest text-sm">
            RESOLVED
          </div>
        </div>
      )}
    </div>
  );
}
