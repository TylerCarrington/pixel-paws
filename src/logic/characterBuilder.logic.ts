import { PlayerAppearance } from '../types/player.types';

export const validateName = (name: string): boolean => {
  if (!name || name.trim() === '') return false;
  if (name.length > 20) return false;
  const regex = /^[a-zA-Z0-9 ]+$/;
  return regex.test(name);
};

export const createInitialPlayerObject = (appearance: PlayerAppearance) => {
  return {
    appearance
  };
};
