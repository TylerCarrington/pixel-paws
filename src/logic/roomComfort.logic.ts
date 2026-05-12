import { FURNITURE } from '../config/furniture.config';

export interface PlacedFurniture {
  id: string; // furniture id
  x: number;
  y: number;
}

export function calculateRoomComfort(placed: PlacedFurniture[]): number {
  return placed.reduce((total, p) => {
    const data = FURNITURE[p.id];
    return total + (data ? data.comfortValue : 0);
  }, 0);
}
