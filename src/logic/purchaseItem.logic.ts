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
    case 'ADD_DOG_SLOT': {
      const maxDogCap = currentState.facilityUpgrades.includes('facility_shelter') ? 6 : 4;
      if ((currentState.shelterCapacity || 0) < maxDogCap) {
        updates.shelterCapacity = (currentState.shelterCapacity || 0) + 1;
        updates.facilityUpgrades = [...currentState.facilityUpgrades, `DOG_SLOT_${updates.shelterCapacity}`];
      }
      break;
    }
    case 'ADD_CAT_SLOT': {
      const maxCatCap = currentState.facilityUpgrades.includes('facility_shelter') ? 6 : 4;
      if ((currentState.catCapacity || 0) < maxCatCap) {
        updates.catCapacity = (currentState.catCapacity || 0) + 1;
        updates.facilityUpgrades = [...currentState.facilityUpgrades, `CAT_SLOT_${updates.catCapacity}`];
      }
      break;
    }
    
    case 'SET_HOME_CAPACITY':
      if (effect.species === 'DOG') updates.homeDogCapacity = effect.value;
      if (effect.species === 'CAT') updates.homeCatCapacity = effect.value;
      if (effect.species === 'SMALL_ANIMAL') updates.homeRabbitCapacity = effect.value;
      if (effect.species === 'BIRD') updates.homeBirdCapacity = effect.value;
      if (effect.species === 'REPTILE') updates.homeReptileCapacity = effect.value;
      if (effect.species === 'AQUATIC') updates.homeAquaticCapacity = effect.value;
      updates.facilityUpgrades = [...currentState.facilityUpgrades, item.id];
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

    case 'ADD_TO_INVENTORY':
      updates.inventory = [...(currentState.inventory || []), effect.value];
      break;

    case 'RECOVERY_MODIFIER':
      updates.facilityUpgrades = [...currentState.facilityUpgrades, item.id];
      break;

    case 'UNLOCK_SHELTER':
      // The phase and day are handled in the zustand store directly.
      break;

    default:
      break;
  }

  return updates;
}
