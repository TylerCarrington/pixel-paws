import React from 'react';

interface DesirabilityBarProps {
  value: number; // 0 to 100
}

export default function DesirabilityBar({ value }: DesirabilityBarProps) {
  const percentage = Math.min(100, Math.max(0, value));
  
  return (
    <div className="w-[40px]">
      <div className="h-[4px] w-full bg-black/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-mossy-green transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
