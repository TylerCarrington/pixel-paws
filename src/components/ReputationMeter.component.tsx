import { Species } from '../types/animal.types';
import { REPUTATION_THRESHOLDS } from '../config/reputationThresholds.config';

interface ReputationMeterProps {
  species: Species;
  value: number;
}

export default function ReputationMeter({ species, value }: ReputationMeterProps) {
  const threshold = REPUTATION_THRESHOLDS[species] || 10;
  const progress = Math.min(100, (value / threshold) * 100);
  
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between items-center text-[8px] uppercase tracking-widest text-muted-sage">
        <span>{species} Reputation</span>
        <span className={progress >= 100 ? 'text-amber-glow font-bold' : ''}>
          {value} / {threshold}
        </span>
      </div>
      <div className="h-1.5 bg-stone-grey/20 rounded-full overflow-hidden border border-stone-grey/20">
        <div 
          className={`h-full transition-all duration-1000 ${progress >= 100 ? 'bg-mossy-green shadow-[0_0_10px_rgba(122,184,122,0.5)]' : 'bg-soft-lilac'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
