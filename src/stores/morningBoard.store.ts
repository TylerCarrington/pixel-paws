import { create } from 'zustand';
import { DailyCall } from '../types/calls.types';

interface MorningBoardStore {
  todayCalls: DailyCall[];
  selectedCallId: string | null;
  setTodayCalls: (calls: DailyCall[]) => void;
  setSelectedCallId: (id: string | null) => void;
  markCallResponded: (id: string) => void;
}

export const useMorningBoardStore = create<MorningBoardStore>((set) => ({
  todayCalls: [],
  selectedCallId: null,
  setTodayCalls: (calls) => set({ todayCalls: calls, selectedCallId: null }),
  setSelectedCallId: (id) => set({ selectedCallId: id }),
  markCallResponded: (id) => set((state) => ({
    todayCalls: state.todayCalls.map(c => c.instanceId === id ? { ...c, responded: true } : c)
  })),
}));
