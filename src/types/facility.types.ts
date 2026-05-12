export interface FacilityUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
}

export interface ShopUnlock {
  id: string;
  requiredUpgrades: string[];
}
