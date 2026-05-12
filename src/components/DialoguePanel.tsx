import React, { useState, useEffect, useRef } from 'react';

interface DialoguePanelProps {
  speaker: string | null;
  text: string;
  onComplete: () => void;
  variant?: 'narration' | 'normal' | 'phone';
}

export default function DialoguePanel({ speaker, text, onComplete, variant = 'normal' }: DialoguePanelProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;
    
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      index++;
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsTyping(false);
      }
    }, 40);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text]);

  const handlePanelClick = () => {
    if (isTyping) {
      if (timerRef.current) clearInterval(timerRef.current);
      setDisplayedText(text);
      setIsTyping(false);
    } else {
      onComplete();
    }
  };

  const isNarration = variant === 'narration';
  const isPhone = variant === 'phone';

  return (
    <div 
      className="dialogue-panel" 
      onClick={handlePanelClick}
      role="dialog"
      aria-live="polite"
    >
      <div 
        className="speaker-name flex items-center gap-2" 
        style={{ opacity: speaker ? 1 : 0 }}
      >
        {isPhone && <span className="text-[10px]" style={{ color: 'var(--speaker-name-color)' }}>📞</span>}
        {speaker}
      </div>
      
      <div className={`dialogue-text ${isNarration ? 'narration' : ''}`}>
        {displayedText}
      </div>
      
      {!isTyping && (
        <div className="advance-indicator">
          ▾
        </div>
      )}
    </div>
  );
}
