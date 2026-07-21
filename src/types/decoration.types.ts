export interface DecorationItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  image: string;
  type: 'floor' | 'wall' | 'ceiling';
  width: number; // For collision/boundary checks
  height: number;
}

export interface PlacedDecoration {
  instanceId: string;
  itemKey: string;
  x: number;
  y: number;
}
