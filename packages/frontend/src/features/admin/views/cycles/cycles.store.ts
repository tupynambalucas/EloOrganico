import { create } from 'zustand';
import { sendJSON } from '@/lib/fetch';
import type { IProduct, ICycle, CreateCycleDTO } from '@elo-organico/shared';

export type CycleFormData = {
  products: IProduct[];
  description: string;
  openingDate: Date | null;
  closingDate: Date | null;
};

interface HistoryResponse {
  data: ICycle[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  }
}

interface ApiError {
  message?: string;
  body?: {
    message?: string;
  };
}

interface CycleState {
  activeCycle: ICycle | null;
  isLoadingActive: boolean;

  isSubmitting: boolean;
  createError: string | null;
  createSuccess: boolean;

  historyCycles: ICycle[];
  historyPagination: HistoryResponse['pagination'] | null;
  isLoadingHistory: boolean;
  
  selectedCycle: ICycle | null; 
  isLoadingDetails: boolean;

  fetchActiveCycle: () => Promise<void>;
  fetchHistory: (filters?: { page?: number; startDate?: Date; endDate?: Date }) => Promise<void>;
  fetchCycleDetails: (id: string) => Promise<void>;
  
  createCycle: (data: CycleFormData) => Promise<boolean>;
  resetCreateStatus: () => void;
  clearSelectedCycle: () => void;
}

export const useCycleStore = create<CycleState>((set, get) => ({
  activeCycle: null,
  isLoadingActive: true,
  
  isSubmitting: false,
  createError: null,
  createSuccess: false,

  historyCycles: [],
  historyPagination: null,
  isLoadingHistory: false,

  selectedCycle: null,
  isLoadingDetails: false,

  resetCreateStatus: () => set({ isSubmitting: false, createError: null, createSuccess: false }),
  clearSelectedCycle: () => set({ selectedCycle: null }),

  fetchActiveCycle: async () => {
    set({ isLoadingActive: true });
    try {
      const data = await sendJSON<ICycle>('/api/cycles/active');
      set({ activeCycle: data, isLoadingActive: false });
    } catch {
      set({ activeCycle: null, isLoadingActive: false });
    }
  },

  fetchHistory: async (filters = {}) => {
    set({ isLoadingHistory: true });
    
    const params = new URLSearchParams();
    params.append('page', (filters.page || 1).toString());
    params.append('limit', '10');
    if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters.endDate) params.append('endDate', filters.endDate.toISOString());

    try {
      const response = await sendJSON<HistoryResponse>(`/api/admin/cycles/history?${params.toString()}`);
      set({ 
        historyCycles: response.data, 
        historyPagination: response.pagination,
        isLoadingHistory: false 
      });
    } catch (error) {
      console.error(error);
      set({ historyCycles: [], isLoadingHistory: false });
    }
  },

  fetchCycleDetails: async (id: string) => {
    set({ isLoadingDetails: true, selectedCycle: null });
    try {
      const data = await sendJSON<ICycle>(`/api/admin/cycles/${id}`);
      set({ selectedCycle: data, isLoadingDetails: false });
    } catch (error) {
      console.error(error);
      set({ isLoadingDetails: false });
    }
  },

  createCycle: async (data) => {
    set({ isSubmitting: true, createError: null, createSuccess: false });

    if (!data.openingDate || !data.closingDate) {
      set({ isSubmitting: false, createError: 'Datas são obrigatórias.' });
      return false;
    }

    try {
      const payload: CreateCycleDTO = {
        description: data.description,
        products: data.products,
        openingDate: data.openingDate.toISOString(),
        closingDate: data.closingDate.toISOString(),
      };

      await sendJSON('/api/admin/cycles', {
        method: 'POST',
        json: payload,
      });

      set({ isSubmitting: false, createSuccess: true });
      get().fetchActiveCycle();
      return true;

    } catch (err: unknown) {
      const error = err as ApiError; 
      const message = error.body?.message || error.message || 'Falha ao criar ciclo';
      
      set({ isSubmitting: false, createError: message });
      return false;
    }
  },
}));