import React from 'react';
import { useGameStore } from '../stores/game.store';
import { getAvailableShopItems, groupItemsByCategory } from '../logic/shopInventory.logic';
import { VET_UPGRADES } from '../config/vetUpgrades.config';
import ShopCategory from './ShopCategory.component';
import { motion } from 'framer-motion';
import { audioManager } from '../audio/audio.manager';
import { SFX } from '../config/audio.config';
import { ShopItem } from '../config/shopItems.config';
import { FacilityUpgrade } from '../config/vetUpgrades.config';

export default function ShopScreen() {
  const money = useGameStore(state => state.money);
  const facilityUpgrades = useGameStore(state => state.facilityUpgrades);
  const shopUnlocks = useGameStore(state => state.shopUnlocks);
  const buyShopItemStore = useGameStore(state => state.buyShopItem);
  const purchaseUpgradeStore = useGameStore(state => state.purchaseUpgrade);
  const dayNumber = useGameStore(state => state.dayNumber);

  const handleBuyItem = (item: ShopItem) => {
    audioManager.playSFX(SFX.CASH);
    buyShopItemStore(item);
  };

  const handleUpgrade = (u: FacilityUpgrade) => {
    audioManager.playSFX(SFX.CASH);
    purchaseUpgradeStore(u);
  };

  // Shop items from logic
  const availableItems = getAvailableShopItems(facilityUpgrades, shopUnlocks);
  const groupedItems = groupItemsByCategory(availableItems);

  // Vet upgrades (for consistency, we show them as another category if available)
  const availableVetUpgrades = VET_UPGRADES.filter(u => {
    const isUnlocked = !u.dayUnlock || dayNumber >= u.dayUnlock;
    const isAlreadyOwned = facilityUpgrades.includes(u.id);
    return isUnlocked && !isAlreadyOwned;
  });

  return (
    <div className="flex flex-col h-full bg-warm-cream p-8 pt-10 overflow-hidden font-pixel">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-soft-lilac/50 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🛒</span>
            <h1 className="text-2xl font-game text-dialogue-text uppercase tracking-tighter">
              Pets R Us
            </h1>
          </div>
          <p className="text-muted-sage text-[10px] uppercase tracking-widest leading-relaxed">
            Your neighborhood shelter supply depot • <span className="text-amber-glow font-bold">Est. Day 3</span>
          </p>
        </div>

        <div className="bg-stone-grey/20 border border-stone-grey/50 px-8 py-4 rounded-2xl flex flex-col items-center shadow-lg">
          <span className="text-[8px] text-muted-sage uppercase tracking-[0.2em] mb-1">Available Funds</span>
          <span className="text-2xl font-game text-amber-glow tracking-tighter">${money}</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-stone-grey/50 space-y-12">
        {/* Essentials & Supplies */}
        {Object.entries(groupedItems).map(([category, items]) => (
          <ShopCategory 
            key={category}
            title={category}
            items={items}
            money={money}
            onPurchase={handleBuyItem}
          />
        ))}

        {/* Vet / Facility Section (Legacy/Special Upgrades) */}
        {availableVetUpgrades.length > 0 && (
          <section className="mb-10">
            <h2 className="text-[10px] text-soft-lilac font-game uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
              Facility Upgrades
              <div className="h-[1px] flex-1 bg-gradient-to-r from-soft-lilac/30 to-transparent" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableVetUpgrades.map(u => (
                <div 
                   key={u.id}
                   className="bg-warm-cream border border-stone-grey/20 p-5 rounded-2xl flex flex-col justify-between hover:border-soft-lilac/30 transition-all group shadow-sm"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-[10px] text-dialogue-text font-game uppercase tracking-widest group-hover:text-soft-lilac transition-colors">
                        {u.name}
                      </h3>
                      <span className="text-soft-lilac text-xs font-game tracking-tighter">
                        ${u.cost}
                      </span>
                    </div>
                    <p className="text-[8px] text-muted-sage leading-relaxed mb-6 font-pixel">
                      {u.description}
                    </p>
                  </div>
                  <button
                    disabled={money < u.cost}
                    onClick={() => handleUpgrade(u)}
                    className={`
                      w-full py-3 text-[8px] uppercase tracking-widest rounded-xl font-game transition-all active:scale-95
                      ${money >= u.cost ? 'bg-mossy-green hover:bg-deep-moss text-warm-cream shadow-[0_5px_15px_rgba(122,184,122,0.3)]' : 'bg-stone-grey/20 text-stone-grey cursor-not-allowed'}
                    `}
                  >
                    Invest in {u.name}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {availableItems.length === 0 && availableVetUpgrades.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 opacity-30 select-none">
            <span className="text-6xl mb-6">📦</span>
            <p className="text-[10px] uppercase tracking-[0.3em] font-game">All items purchased</p>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <footer className="mt-8 pt-6 border-t border-stone-grey/10 flex justify-between items-center opacity-40">
        <span className="text-[8px] tracking-[0.2em] font-pixel uppercase">Pets R Us Loyalty Program Active</span>
        <span className="text-[8px] tracking-[0.2em] font-pixel uppercase">Official Shelter Partner</span>
      </footer>
    </div>
  );
}
