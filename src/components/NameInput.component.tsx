import React from 'react';

interface Props {
  label: string;
  value: string;
  onChange: (val: string) => void;
  maxLength: number;
}

export default function NameInput({ label, value, onChange, maxLength }: Props) {
  return (
    <div className="mb-4">
      <label className="block text-[10px] font-pixel mb-3 text-muted-sage uppercase tracking-widest">{label}</label>
      <input
        type="text"
        className="w-full px-4 py-3 bg-warm-cream/50 border border-stone-grey/30 rounded text-xs text-dialogue-text focus:outline-none focus:border-mossy-green font-pixel transition-colors uppercase placeholder:text-stone-grey/50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={`ENTER ${label.toUpperCase()}...`}
      />
    </div>
  );
}
