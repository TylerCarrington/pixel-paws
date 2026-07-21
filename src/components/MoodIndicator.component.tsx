import React from 'react';

interface MoodIndicatorProps {
  mood: 'Happy' | 'Calm' | 'Anxious' | 'Shy';
}

export default function MoodIndicator({ mood }: MoodIndicatorProps) {
  const colors = {
    Happy: '#f5c87a',
    Calm: '#7ab87a',
    Anxious: '#c8a8d8',
    Shy: '#b0a898'
  };

  return (
    <div 
      className="w-[8px] h-[8px] rounded-full border border-black/10 shadow-sm"
      style={{ backgroundColor: colors[mood] }}
      title={mood}
    />
  );
}
