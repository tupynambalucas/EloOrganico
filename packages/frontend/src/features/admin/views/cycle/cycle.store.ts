import { create } from 'zustand';
import { sendJSON } from '@/lib/fetch';
import type { IProduct, CreateCycleDTO } from '@elo-organico/shared';

export type CycleFormData = {
  products: IProduct[];
  description: string;
  openingDate: Date | null;
  closingDate: Date | null;
};

interface ApiError {
  message?: string;
  body?: {
    message?: string;
  };
}

interface CycleState {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
  
  createCycle: (data: CycleFormData) => Promise<boolean>;
  resetStatus: () => void;
}

export const useCycleStore = create<CycleState>((set) => ({
  isSubmitting: false,
  error: null,
  success: false,

  resetStatus: () => set({ isSubmitting: false, error: null, success: false }),

  createCycle: async (data) => {
    set({ isSubmitting: true, error: null, success: false });

    if (!data.openingDate || !data.closingDate) {
      set({ isSubmitting: false, error: 'Datas de abertura e fechamento são obrigatórias.' });
      return false;
    }

    try {
      const payload: CreateCycleDTO = {
        description: data.description,
        products: data.products,
        openingDate: data.openingDate.toISOString(),
        closingDate: data.closingDate.toISOString(),
      };

      await sendJSON('/api/admin/cycle', {
        method: 'POST',
        json: payload,
      });

      set({ isSubmitting: false, success: true });
      return true;

    } catch (err: unknown) {
      const error = err as ApiError;
      const message = error.body?.message || error.message || 'Falha ao criar ciclo';
      set({ isSubmitting: false, error: message });
      return false;
    }
  },
}));