import { create } from 'zustand';
import { cycleApi } from './cycle.api';
import { getErrorMessage } from '@/utils/errorHelper';
import { CycleResponseSchema, type ICycle } from '@elo-organico/shared';

interface PublicCycleState {
  activeCycle: ICycle | null;
  isLoading: boolean;
  error: string | null;
  fetchActiveCycle: () => Promise<void>;
}

export const useCycleStore = create<PublicCycleState>((set) => ({
  activeCycle: null,
  isLoading: false,
  error: null,

  fetchActiveCycle: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await cycleApi.getActive();
      const validated = data ? CycleResponseSchema.parse(data) : null;
      set({ activeCycle: validated });
    } catch (err: unknown) {
      set({ activeCycle: null, error: getErrorMessage(err) });
    } finally {
      set({ isLoading: false });
    }
  }
}));