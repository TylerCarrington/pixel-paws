import React, { useState, useEffect, useRef } from 'react';

interface NameInputPanelProps {
  placeholder: string;
  onConfirm: (name: string) => void;
}

export default function NameInputPanel({ placeholder, onConfirm }: NameInputPanelProps) {
  const [value, setValue] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length > 0 && trimmed.length <= 20) {
      onConfirm(trimmed);
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
    }
  };

  return (
    <div className="dialogue-panel">
      <form onSubmit={handleSubmit} className={`name-input-container ${isShaking ? 'shake' : ''}`}>
        <input
          ref={inputRef}
          type="text"
          className="name-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={20}
        />
        <div className="input-hint">
          press enter or tap ✓ to confirm
        </div>
        <button type="submit" className="hidden">Confirm</button>
      </form>
      
      <button 
        className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl text-soft-rose opacity-60 hover:opacity-100 transition-opacity"
        onClick={handleSubmit}
      >
        ✓
      </button>
    </div>
  );
}
