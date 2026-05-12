import React, { useState, useEffect, useRef } from 'react';

interface TownInputPanelProps {
  suggestion: string;
  onConfirm: (name: string) => void;
  confirmLabel: string;
  changeLabel: string;
}

export default function TownInputPanel({ suggestion, onConfirm, confirmLabel, changeLabel }: TownInputPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(suggestion);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const finalValue = value.trim() || suggestion;
    onConfirm(finalValue);
  };

  return (
    <div className="dialogue-panel">
      {!isEditing ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-lg text-[#5a3e38]">
              <span>🌸</span>
              <span className="font-medium">{suggestion}</span>
            </div>
            <button
              onClick={() => onConfirm(suggestion)}
              className="bg-[#d4a090]/20 hover:bg-[#d4a090]/40 text-[#b07060] px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-colors border border-[#d4a090]/30"
            >
              {confirmLabel}
            </button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 h-[1px] bg-[#d4a090]/30 mr-8" />
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#d4a090]/10 hover:bg-[#d4a090]/20 text-[#9a8078] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
            >
              {changeLabel}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="name-input-container">
          <input
            ref={inputRef}
            type="text"
            className="name-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={20}
          />
          <div className="input-hint">
            press enter or tap ✓ to confirm
          </div>
          <button 
            type="button"
            className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl text-soft-rose opacity-60 hover:opacity-100 transition-opacity"
            onClick={handleSubmit}
          >
            ✓
          </button>
        </form>
      )}
    </div>
  );
}
