export interface Furniture {
  id: string;
  name: string;
  comfortValue: number;
  width: number;
  height: number;
  spriteKey: string;
}

export const FURNITURE: Record<string, Furniture> = {
  'basic_rug': {
    id: 'basic_rug',
    name: 'Cozy Rug',
    comfortValue: 5,
    width: 2,
    height: 2,
    spriteKey: 'furniture_rug'
  },
  'beanbag': {
    id: 'beanbag',
    name: 'Fluffy Beanbag',
    comfortValue: 10,
    width: 1,
    height: 1,
    spriteKey: 'furniture_beanbag'
  },
  'lamp': {
    id: 'lamp',
    name: 'Warm Lamp',
    comfortValue: 3,
    width: 1,
    height: 1,
    spriteKey: 'furniture_lamp'
  },
  'pet_tree': {
    id: 'pet_tree',
    name: 'Climbing Tree',
    comfortValue: 15,
    width: 1,
    height: 2,
    spriteKey: 'furniture_tree'
  }
};
