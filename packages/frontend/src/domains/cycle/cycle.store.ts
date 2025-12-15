import { create } from 'zustand';
import { cyclesApi } from './cycle.api';
import { CycleResponseSchema, type ICycle } from '@elo-organico/shared';

interface PublicCycleState {
  activeCycle: ICycle | null;
  isLoading: boolean;
  fetchActiveCycle: () => Promise<void>;
}

export const useCycleStore = create<PublicCycleState>((set) => ({
  activeCycle: null,
  isLoading: false,

  fetchActiveCycle: async () => {
    set({ isLoading: true });
    try {
      const data = await cyclesApi.getActive();
      const validated = data ? CycleResponseSchema.parse(data) : null;
      set({ activeCycle: validated });
    } catch (error) {
      console.error(error);
      set({ activeCycle: null });
    } finally {
      set({ isLoading: false });
    }
  }
}));