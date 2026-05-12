import React from 'react';
import { DailyCall } from '../types/calls.types';

interface CallDetailProps {
  call: DailyCall;
  onRespond: () => void;
}

export default function CallDetail({ call, onRespond }: CallDetailProps) {
  return (
    <div className="bg-warm-cream border-2 border-soft-rose rounded-lg p-6 flex flex-col h-full shadow-lg font-pixel">
      <div className="mb-6 flex-1">
        <h2 className="text-sm font-game text-dialogue-text uppercase tracking-tighter mb-4 border-b border-soft-rose/30 pb-6 leading-relaxed">
          {call.title}
        </h2>
        
        <div className="space-y-4">
          <p className="text-dialogue-text leading-relaxed text-lg font-retro">
            {call.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-stone-grey/10 p-3 rounded border border-stone-grey/30">
               <div className="text-[8px] text-muted-sage uppercase tracking-widest mb-1">Target Species</div>
               <div className="text-dialogue-text text-[10px] uppercase">{call.species}</div>
            </div>
            <div className="bg-stone-grey/10 p-3 rounded border border-stone-grey/30">
               <div className="text-[8px] text-muted-sage uppercase tracking-widest mb-1">Investigation Method</div>
               <div className="text-speaker-rose text-[10px] uppercase">{call.discoveryMethod}</div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onRespond}
        disabled={call.responded}
        className={`
          w-full py-4 text-xs font-game uppercase tracking-widest transition-all
          ${call.responded 
            ? 'bg-stone-grey/50 text-warm-cream cursor-not-allowed' 
            : 'bg-mossy-green hover:bg-deep-moss text-warm-cream shadow-lg active:scale-95'
          }
        `}
      >
        {call.responded ? 'Resolved' : 'Dispatch'}
      </button>
    </div>
  );
}
