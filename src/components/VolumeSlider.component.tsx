import React from 'react';

interface VolumeSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon: string;
}

export default function VolumeSlider({ label, value, onChange, icon }: VolumeSliderProps) {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-muted-sage">
        <span className="flex items-center gap-2">
          <span>{icon}</span> {label}
        </span>
        <span className="font-game text-night-plum">{Math.round(value * 100)}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-stone-grey/20 rounded-full appearance-none cursor-pointer accent-mossy-green hover:accent-deep-moss transition-all"
      />
    </div>
  );
}
