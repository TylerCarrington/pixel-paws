import React from 'react';
import { useGameStore } from '../stores/game.store';
import { HABITAT_UPGRADES, HabitatUpgrade } from '../config/habitatUpgrades.config';
import { VET_UPGRADES_TREE, VetUpgrade } from '../config/vetUpgradesTree.config';
import ReputationMeter from './ReputationMeter.component';
import { Species } from '../types/animal.types';
import { REPUTATION_THRESHOLDS } from '../config/reputationThresholds.config';

export default function FacilityScreen() {
  const money = useGameStore(state => state.money);
  const facilityUpgrades = useGameStore(state => state.facilityUpgrades);
  const reputation = useGameStore(state => state.reputationBySpecies);
  const purchaseUpgrade = useGameStore(state => state.purchaseUpgrade);

  const canAfford = (cost: number) => money >= cost;
  const isOwned = (id: string) => facilityUpgrades.includes(id);

  // Check if species reputation threshold is met to unlock next tier
  const isSpeciesReady = (species: Species) => {
    return (reputation[species] || 0) >= REPUTATION_THRESHOLDS[species];
  };

  const activeSpecies = Object.keys(REPUTATION_THRESHOLDS) as Species[];

  return (
    <div className="flex flex-col h-full bg-warm-cream p-8 overflow-hidden font-pixel">
      <header className="mb-10 flex justify-between items-end border-b border-soft-lilac/50 pb-6">
        <div>
          <h1 className="text-xl font-game text-speaker-rose uppercase tracking-tighter">Facility Expansion</h1>
          <p className="text-[10px] text-muted-sage uppercase tracking-widest mt-1">Upgrade habitats and vet care to unlock new species</p>
        </div>
        <div className="bg-stone-grey/20 border border-stone-grey/50 px-6 py-3 rounded-xl">
          <span className="text-sm font-game text-amber-glow">${money}</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto space-y-12 pr-4 scrollbar-thin">
        {/* Reputation Panel */}
        <section>
          <h2 className="text-[10px] text-muted-sage uppercase tracking-[0.2em] mb-6">Reputation & Species Gating</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeSpecies.map(s => (
              <div key={s} className="bg-stone-grey/10 p-4 rounded-xl border border-stone-grey/30">
                <ReputationMeter species={s} value={reputation[s] || 0} />
                {isSpeciesReady(s) && !isOwned(`habitat_${s.toLowerCase()}`) && (
                  <div className="mt-3 text-[7px] text-speaker-rose uppercase tracking-widest animate-pulse">
                    New habitat available!
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Upgrade Trees */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Habitats */}
          <section>
            <h3 className="text-[10px] text-speaker-rose uppercase tracking-widest mb-6 border-l-4 border-speaker-rose pl-4">Habitats</h3>
            <div className="space-y-4">
              {HABITAT_UPGRADES.map(u => {
                const owned = isOwned(u.id);
                // Pre-requisite check (simplified: check previous threshold)
                // For cat habitat, check dog reputation
                const reqSpecies = u.unlockedSpecies[0] === Species.CAT ? Species.DOG : 
                                   u.unlockedSpecies[0] === Species.SMALL_ANIMAL ? Species.CAT :
                                   u.unlockedSpecies[0] === Species.BIRD ? Species.SMALL_ANIMAL : Species.DOG;
                
                const ready = isSpeciesReady(reqSpecies);

                return (
                  <UpgradeCard 
                    key={u.id}
                    title={u.name}
                    desc={u.description}
                    cost={u.cost}
                    icon={u.icon}
                    owned={owned}
                    locked={!ready}
                    canAfford={canAfford(u.cost)}
                    onPurchase={() => purchaseUpgrade({ id: u.id, name: u.name, cost: u.cost, description: u.description } as any)}
                  />
                );
              })}
            </div>
          </section>

          {/* Vet Care */}
          <section>
            <h3 className="text-[10px] text-soft-lilac uppercase tracking-widest mb-6 border-l-4 border-soft-lilac pl-4">Vet Clinic</h3>
            <div className="space-y-4">
              {VET_UPGRADES_TREE.map(u => {
                const owned = isOwned(u.id);
                const ready = true; // For now vet care is always researchable if you have cash

                return (
                  <UpgradeCard 
                    key={u.id}
                    title={u.name}
                    desc={u.description}
                    cost={u.cost}
                    icon={u.icon}
                    owned={owned}
                    locked={!ready}
                    canAfford={canAfford(u.cost)}
                    onPurchase={() => purchaseUpgrade({ id: u.id, name: u.name, cost: u.cost, description: u.description } as any)}
                  />
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function UpgradeCard({ title, desc, cost, icon, owned, locked, canAfford, onPurchase }: any) {
  return (
    <div className={`p-4 rounded-xl border transition-all ${owned ? 'bg-soft-lilac/20 border-soft-lilac/50' : 'bg-stone-grey/20 border-stone-grey/30'}`}>
      <div className="flex gap-4">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-[10px] text-dialogue-text uppercase tracking-widest">{title}</h4>
            {!owned && (
              <span className={`text-[10px] font-game ${canAfford ? 'text-speaker-rose' : 'text-red-500'}`}>
                ${cost}
              </span>
            )}
          </div>
          <p className="text-[8px] text-muted-sage leading-relaxed mb-4">{desc}</p>
          
          {owned ? (
            <div className="text-[8px] text-soft-lilac uppercase tracking-widest font-bold">✓ Installed</div>
          ) : locked ? (
            <div className="text-[8px] text-stone-grey uppercase tracking-widest">Locked: Increase Reputation</div>
          ) : (
            <button
              disabled={!canAfford}
              onClick={onPurchase}
              className={`text-[8px] uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${canAfford ? 'bg-mossy-green text-warm-cream hover:bg-deep-moss' : 'bg-stone-grey/30 text-stone-grey cursor-not-allowed'}`}
            >
              Purchase
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
