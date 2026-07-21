import React, { useState, useMemo } from 'react';
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
  const phase6State = useGameStore(state => state.phase6State);
  const shelterCapacity = useGameStore(state => state.shelterCapacity);
  const catCapacity = useGameStore(state => state.catCapacity);
  const catsUnlocked = useGameStore(state => state.catsUnlocked);

  const handleBuyItem = (item: ShopItem) => {
    audioManager.playSFX(SFX.CASH);
    buyShopItemStore(item);
  };

  const handleUpgrade = (u: FacilityUpgrade) => {
    audioManager.playSFX(SFX.CASH);
    purchaseUpgradeStore(u);
  };

  const ownedPets = useGameStore(state => state.ownedPets);
  const isAtFacility = phase6State === 'facility_shop';
  const isAtHome = phase6State === 'home_shop';

  // Shop items from logic
  const availableItems = getAvailableShopItems(facilityUpgrades, shopUnlocks, shelterCapacity, catCapacity, catsUnlocked);
  
  // Filter based on context (Home vs Shelter)
  const filteredAvailableItems = availableItems.filter(item => {
    if (isAtHome) {
      // Home mode: Only show Decorations and Activities
      return ['Decorations', 'Activities', 'Upgrades'].includes(item.category);
    } else {
      // Shelter mode: Only show items for the facility expansion and daily operations
      return ['Essentials', 'Upgrades', 'Supplies'].includes(item.category);
    }
  });

  const groupedItems = groupItemsByCategory(filteredAvailableItems);

  const isEarlyGame = dayNumber < 8;

  // Vet upgrades (for consistency, we show them as another category if available)
  // These are facility specific, so only show if not in home mode
  const availableVetUpgrades = (isEarlyGame || isAtHome) ? [] : VET_UPGRADES.filter(u => {
    const isUnlocked = !u.dayUnlock || dayNumber >= u.dayUnlock;
    const isAlreadyOwned = facilityUpgrades.includes(u.id);
    return isUnlocked && !isAlreadyOwned;
  });

  const categoryDescriptions: Record<string, string> = {
    'Upgrades': 'Permanent improvements to your shelter and home capacity.',
    'Decorations': 'Whimsical items to make every space more cozy and beautiful.',
    'Essentials': 'Maintenance tools and comfort items for daily animal care.',
    'Activities': 'Fun equipment to unlock new ways to play and bond with pets.',
    'Supplies': 'Stock up on food, medicine, and other immediate needs.',
    'Facility Upgrades': 'Advanced medical and structural improvements for your growing rescue.'
  };

  const allCategories = useMemo(() => {
    const cats = Object.keys(groupedItems);
    if (availableVetUpgrades.length > 0) {
      cats.push('Facility Upgrades');
    }
    
    // Sort logic: Upgrades first, then alphabetic or others
    return cats.sort((a, b) => {
      if (a === 'Upgrades') return -1;
      if (b === 'Upgrades') return 1;
      return a.localeCompare(b);
    });
  }, [groupedItems, availableVetUpgrades]);

  const [activeCategory, setActiveCategory] = useState<string>(allCategories[0] || '');

  // Auto-switch category if current one becomes empty or doesn't exist
  React.useEffect(() => {
    if (!allCategories.includes(activeCategory) && allCategories.length > 0) {
      setActiveCategory(allCategories[0]);
    }
  }, [allCategories, activeCategory]);

  const goBack = () => {
    const state = useGameStore.getState();
    if (isAtHome) {
      state.setPhase6State('home_view');
    } else {
      state.setPhase6State('shelter_view');
    }
  };

  return (
    <div className="flex flex-col h-full bg-warm-cream p-4 md:p-8 pt-6 md:pt-10 overflow-hidden font-pixel">
      <header className="mb-4 flex justify-between items-center bg-white/40 backdrop-blur-sm border border-soft-lilac/20 p-3 px-5 rounded-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={goBack}
            className="w-8 h-8 bg-night-plum hover:bg-black text-warm-cream rounded-lg flex items-center justify-center transition-all active:scale-90 text-[10px]"
          >
            ←
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xl">🛒</span>
            <div className="flex flex-col">
              <h1 className="text-sm font-game text-dialogue-text uppercase tracking-widest">
                Pets R Us
              </h1>
              <span className="text-[7px] text-muted-sage uppercase tracking-widest hidden md:block">
                {isAtFacility ? 'Shelter Supply Depot' : 'Boutique Decorations'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[7px] text-muted-sage uppercase tracking-[0.2em]">Available Funds</span>
              <span className="text-lg font-game text-amber-glow tracking-tighter leading-none">${money}</span>
           </div>
           <div className="h-8 w-[1px] bg-soft-lilac/20" />
        </div>
      </header>

      {/* Category Tabs */}
      {allCategories.length > 1 && (
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                px-6 py-2.5 rounded-xl text-[9px] uppercase tracking-widest font-game transition-all whitespace-nowrap
                ${activeCategory === cat 
                  ? 'bg-night-plum text-warm-cream shadow-md' 
                  : 'bg-white/50 text-muted-sage hover:bg-white hover:text-night-plum border border-soft-lilac/10'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-stone-grey/50 space-y-12">
        {/* Render only active category content */}
        {activeCategory !== 'Facility Upgrades' && groupedItems[activeCategory] && (
          <ShopCategory 
            title={activeCategory}
            description={categoryDescriptions[activeCategory]}
            items={groupedItems[activeCategory]}
            money={money}
            onPurchase={handleBuyItem}
          />
        )}

        {/* Facility Section */}
        {activeCategory === 'Facility Upgrades' && availableVetUpgrades.length > 0 && (
          <section className="mb-10">
            <div className="mb-6">
              <h2 className="text-[10px] text-soft-lilac font-game uppercase tracking-[0.2em] mb-1 flex items-center gap-4">
                Facility Upgrades
                <div className="h-[1px] flex-1 bg-gradient-to-r from-soft-lilac/30 to-transparent" />
              </h2>
              <p className="text-[9px] text-muted-sage italic">{categoryDescriptions['Facility Upgrades']}</p>
            </div>
            <div className="flex flex-col gap-3">
              {availableVetUpgrades.map(u => (
                <div 
                   key={u.id}
                   className="bg-white/60 border border-stone-grey/20 p-4 rounded-3xl flex items-center gap-6 hover:border-soft-lilac/30 transition-all group shadow-sm hover:shadow-md"
                >
                  <div className="w-16 h-16 bg-warm-cream/50 rounded-2xl flex-shrink-0 flex items-center justify-center border border-stone-grey/5">
                    <span className="text-3xl">🏗️</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-[10px] text-dialogue-text font-game uppercase tracking-widest group-hover:text-soft-lilac transition-colors truncate">
                        {u.name}
                      </h3>
                      <span className="text-soft-lilac text-[10px] font-game tracking-tighter ml-2">
                        ${u.cost}
                      </span>
                    </div>
                    <p className="text-[9px] text-muted-sage leading-tight font-pixel line-clamp-1">
                      {u.description}
                    </p>
                  </div>
                  <div className="w-32">
                    <button
                      disabled={money < u.cost}
                      onClick={() => handleUpgrade(u)}
                      className={`
                        w-full py-2.5 text-[8px] uppercase tracking-widest rounded-xl font-game transition-all active:scale-95
                        ${money >= u.cost ? 'bg-mossy-green hover:bg-deep-moss text-warm-cream shadow-[0_2px_8px_rgba(122,184,122,0.2)]' : 'bg-stone-grey/20 text-stone-grey cursor-not-allowed'}
                      `}
                    >
                      Invest
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {allCategories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 opacity-30 select-none">
          <span className="text-6xl mb-6">📦</span>
          <p className="text-[10px] uppercase tracking-[0.3em] font-game">All items purchased</p>
        </div>
      )}
    </div>
  );
}
