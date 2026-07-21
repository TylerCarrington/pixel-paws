import { SHOP_ITEMS, ShopItem } from '../config/shopItems.config';

/**
 * Filters the master shop list based on current facility upgrades.
 */
export function getAvailableShopItems(currentUpgrades: string[], purchasedItemIds: string[], shelterCapacity: number = 0, catCapacity: number = 0, catsUnlocked: boolean = false): ShopItem[] {
  return SHOP_ITEMS.filter(item => {
    // If it's a one-time item and already purchased, hide it
    if (item.oneTime && purchasedItemIds.includes(item.id)) {
      return false;
    }

    // Hide expansion slots if max capacity reached
    const maxCapacity = currentUpgrades.includes('facility_shelter') ? 6 : 4;
    if (item.id === 'shelter_dog_slot' && shelterCapacity >= maxCapacity) return false;
    if (item.id === 'shelter_cat_slot' && catCapacity >= maxCapacity) return false;

    // Filter cat items if not unlocked
    const isCatItem = item.id === 'shelter_cat_slot' || 
                      item.id === 'family_room_cat_bed' || 
                      (item.effect.type === 'SET_HOME_CAPACITY' && item.effect.species === 'CAT') ||
                      item.effect.type === 'ADD_CAT_SLOT';
    
    if (isCatItem && !catsUnlocked) return false;

    // Check unlock requirements
    if (item.requiredUnlock && !currentUpgrades.includes(item.requiredUnlock)) {
      return false;
    }

    return true;
  });
}

/**
 * Groups items by category for the UI
 */
export function groupItemsByCategory(items: ShopItem[]): Record<string, ShopItem[]> {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShopItem[]>);
}
