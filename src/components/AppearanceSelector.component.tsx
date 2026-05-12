import React from 'react';

interface Props {
  label: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

export default function AppearanceSelector({ label, options, selectedValue, onSelect }: Props) {
  return (
    <div className="mb-4 font-pixel">
      <h3 className="text-[10px] mb-3 text-muted-sage uppercase tracking-widest">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            className={`px-3 py-2 text-[8px] rounded border transition-all uppercase tracking-tighter ${
              selectedValue === opt
                ? 'bg-mossy-green text-warm-cream border-deep-moss scale-105 z-10'
                : 'bg-stone-grey/20 text-stone-grey border-stone-grey/30 hover:bg-stone-grey/30'
            }`}
            onClick={() => onSelect(opt)}
          >
            {opt.startsWith('#') ? (
              <div className="w-4 h-4 rounded border border-stone-grey/50" style={{ backgroundColor: opt }} />
            ) : (
              opt
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
