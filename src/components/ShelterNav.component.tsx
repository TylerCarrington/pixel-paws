import React from 'react';
import { useGameStore } from '../stores/game.store';
import { audioManager } from '../audio/audio.manager';
import { SFX } from '../config/audio.config';

export default function ShelterNav() {
  const phase6State = useGameStore(state => state.phase6State);
  const setPhase6State = useGameStore(state => state.setPhase6State);
  const facilityUpgrades = useGameStore(state => state.facilityUpgrades);
  const dayNumber = useGameStore(state => state.dayNumber);

  const hasVet = facilityUpgrades.includes('vet_wing');

  const navItems = [
    { id: 'shelter_view', label: 'Kennels', icon: '🐕' },
    { id: 'vet_wing', label: 'Vet Wing', icon: '🏥', condition: hasVet },
    { id: 'facility_expansion', label: 'Facility', icon: '🏛️' },
    { id: 'facility_shop', label: 'Shop', icon: '🛒', condition: dayNumber >= 2 },
  ];

  return (
    <nav className="h-24 bg-night-plum border-t border-soft-lilac/30 flex justify-center items-center gap-4 md:gap-12 z-[100] px-6">
      {navItems.map(item => {
        if (item.condition === false) return null;
        
        const isActive = phase6State === item.id;
        
        return (
            <button
              key={item.id}
              onClick={() => {
                audioManager.playSFX(SFX.CLICK);
                setPhase6State(item.id as any);
              }}
              className={`
                flex flex-col items-center justify-center gap-1 min-w-[70px] h-16 rounded-xl transition-all relative
                ${isActive ? 'bg-soft-lilac/20 text-soft-lilac border border-soft-lilac/30 shadow-[0_0_15px_rgba(200,168,216,0.2)]' : 'text-stone-grey hover:text-warm-cream'}
              `}
            >
              {item.id === 'facility_expansion' && dayNumber <= 4 && (
                <span className="absolute -top-1 -right-1 bg-speaker-rose text-white text-[7px] px-2 py-0.5 rounded-full font-bold animate-pulse shadow-lg">
                  LVL UP
                </span>
              )}
              <span className="text-2xl mb-0.5">{item.icon}</span>
              <span className="text-[9px] font-game uppercase tracking-[0.15em]">{item.label}</span>
            </button>
        );
      })}
    </nav>
  );
}
