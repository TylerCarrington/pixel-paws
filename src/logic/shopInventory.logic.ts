import { SHOP_ITEMS, ShopItem } from '../config/shopItems.config';

/**
 * Filters the master shop list based on current facility upgrades.
 */
export function getAvailableShopItems(currentUpgrades: string[], purchasedItemIds: string[]): ShopItem[] {
  return SHOP_ITEMS.filter(item => {
    // If it's a one-time item and already purchased, hide it
    if (item.oneTime && purchasedItemIds.includes(item.id)) {
      return false;
    }

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
