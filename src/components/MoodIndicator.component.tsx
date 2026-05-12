import React from 'react';
import { MoodState } from '../logic/moodState.logic';

interface MoodIndicatorProps {
  mood: MoodState;
}

export default function MoodIndicator({ mood }: MoodIndicatorProps) {
  let icon = '';
  let colorClass = '';

  switch (mood) {
    case MoodState.HAPPY:
      icon = '✨'; colorClass = 'text-amber-glow border-amber-glow/30 bg-amber-glow/10'; break;
    case MoodState.CALM:
      icon = '😌'; colorClass = 'text-soft-lilac border-soft-lilac/30 bg-soft-lilac/10'; break;
    case MoodState.ANXIOUS:
      icon = '😰'; colorClass = 'text-soft-rose border-soft-rose/30 bg-soft-rose/10'; break;
    case MoodState.SHY:
      icon = '🫣'; colorClass = 'text-muted-sage border-muted-sage/30 bg-muted-sage/10'; break;
  }

  return (
    <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border ${colorClass} text-[8px] font-pixel uppercase tracking-tighter`}>
      <span className="scale-75">{icon}</span>
      <span>{mood}</span>
    </div>
  );
}
