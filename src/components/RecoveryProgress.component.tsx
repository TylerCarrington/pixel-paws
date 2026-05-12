import React from 'react';

interface RecoveryProgressProps {
  daysRemaining: number;
  totalDays: number;
}

export default function RecoveryProgress({ daysRemaining, totalDays }: RecoveryProgressProps) {
  const percentage = totalDays > 0 ? Math.max(0, 100 * (1 - daysRemaining / totalDays)) : 100;
  
  return (
    <div className="w-full font-pixel">
      <div className="flex justify-between text-[8px] mb-2 text-soft-lilac uppercase tracking-tighter">
        <span>Recovery</span>
        <span>{Math.ceil(daysRemaining)}d left</span>
      </div>
      <div className="h-2 w-full bg-stone-grey/10 rounded-full overflow-hidden border border-stone-grey/20">
        <div 
          className="h-full bg-mossy-green transition-all duration-500 shadow-[0_0_8px_rgba(122,184,122,0.4)]" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
