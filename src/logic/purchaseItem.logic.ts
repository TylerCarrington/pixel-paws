import { ShopItem } from '../config/shopItems.config';
import { GameState } from '../types/game.types';

/**
 * Handles the logic for applying a shop item's effect to the game state.
 * Returns the modified GameState aspects.
 */
export function applyItemEffect(item: ShopItem, currentState: GameState): Partial<GameState> {
  const { effect } = item;
  const updates: Partial<GameState> = {
    money: currentState.money - item.cost,
    shopUnlocks: [...currentState.shopUnlocks, item.id]
  };

  switch (effect.type) {
    case 'ADD_KENNEL_SLOT':
      // The slot count is often derived from facilityUpgrades or a specific count.
      // For simplicity, we can add a specific upgrade key that the ShelterFloor component checks.
      // Let's use a convention: KENNEL_SLOT_N
      const slotCount = currentState.facilityUpgrades.filter(u => u.startsWith('KENNEL_SLOT_')).length;
      updates.facilityUpgrades = [...currentState.facilityUpgrades, `KENNEL_SLOT_${slotCount + 1}`];
      break;

    case 'UNLOCK_ACTION':
      // Unlocking an action usually means adding a key to facilityUpgrades
      // so other components can check for it.
      updates.facilityUpgrades = [...currentState.facilityUpgrades, `ACTION_${effect.value.toUpperCase()}`];
      break;

    case 'PASSIVE_DESIRABILITY_BOOST':
      // This is usually handled by a multiplier or flat bonus in desirability calculation.
      // We can just track the upgrade in facilityUpgrades.
      updates.facilityUpgrades = [...currentState.facilityUpgrades, item.id];
      break;

    case 'RECOVERY_MODIFIER':
      updates.facilityUpgrades = [...currentState.facilityUpgrades, item.id];
      break;

    default:
      break;
  }

  return updates;
}
