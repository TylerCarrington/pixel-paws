import React from 'react';

interface DesirabilityBarProps {
  value: number; // 0 to 100
}

export default function DesirabilityBar({ value }: DesirabilityBarProps) {
  const percentage = Math.min(100, Math.max(0, value));
  
  let colorClass = 'bg-soft-rose';
  if (percentage >= 80) colorClass = 'bg-mossy-green';
  else if (percentage >= 50) colorClass = 'bg-amber-glow';
  else if (percentage >= 30) colorClass = 'bg-speaker-rose';

  return (
    <div className="w-full">
      <div className="flex justify-between text-[8px] mb-2 font-pixel text-muted-sage uppercase tracking-tighter">
        <span>Desirability</span>
        <span>{Math.floor(percentage)}</span>
      </div>
      <div className="h-3 w-full bg-stone-grey/10 rounded-full overflow-hidden border border-stone-grey/20">
        <div 
          className={`h-full ${colorClass} transition-all duration-500 ease-out shadow-[0_0_8px_rgba(0,0,0,0.1)]`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
