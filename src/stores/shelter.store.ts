import { create } from 'zustand';

interface ShelterStore {
  selectedAnimalId: string | null;
  setSelectedAnimalId: (id: string | null) => void;
}

export const useShelterStore = create<ShelterStore>((set) => ({
  selectedAnimalId: null,
  setSelectedAnimalId: (id) => set({ selectedAnimalId: id }),
}));
