import { create } from 'zustand';
import { cycleApi } from './cycle.api';
import i18n from '@/i18n';
import { AxiosError } from 'axios';
import { 
  type IProduct, 
  type ICycle, 
  CycleResponseSchema
} from '@elo-organico/shared';
import { z } from 'zod';

// ... (Tipos CycleFormData, HistoryResponse, CycleState mantêm-se iguais) ...
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

interface CycleState {
  activeCycle: ICycle | null;
  isLoadingActive: boolean;

  isSubmitting: boolean;
  error: string | null;
  success: boolean;

  historyCycles: ICycle[];
  historyPagination: HistoryResponse['pagination'] | null;
  isLoadingHistory: boolean;
  
  selectedCycle: ICycle | null; 
  isLoadingDetails: boolean;

  fetchActiveCycle: () => Promise<void>;
  fetchHistory: (filters?: { page?: number; startDate?: Date; endDate?: Date }) => Promise<void>;
  fetchCycleDetails: (id: string) => Promise<void>;
  
  createCycle: (data: CycleFormData) => Promise<boolean>;
  updateActiveCycleProducts: (products: IProduct[]) => Promise<boolean>;
  
  resetStatus: () => void;
  clearSelectedCycle: () => void;
}

const CycleListSchema = z.array(CycleResponseSchema);

// Helper tipado duplicado (idealmente extrair para utils)
interface ApiErrorData {
  code?: string;
  message?: string;
}

const getErrorMessage = (err: unknown) => {
  if (err instanceof AxiosError) {
    const data = err.response?.data as ApiErrorData;
    // Se tiver código usa tradução, senão fallback
    return data?.code ? i18n.t(`errors.${data.code}`) : i18n.t('errors.UNKNOWN_ERROR');
  }
  return i18n.t('errors.UNKNOWN_ERROR');
};

export const useCycleStore = create<CycleState>((set, get) => ({
  activeCycle: null,
  isLoadingActive: false,
  isSubmitting: false,
  error: null,
  success: false,
  historyCycles: [],
  historyPagination: null,
  isLoadingHistory: false,
  selectedCycle: null,
  isLoadingDetails: false,

  fetchActiveCycle: async () => {
    set({ isLoadingActive: true });
    try {
      const data = await cycleApi.getActive();
      if (data) {
        const validated = CycleResponseSchema.parse(data);
        set({ activeCycle: validated });
      } else {
        set({ activeCycle: null });
      }
    } catch (error) {
      console.error('Falha ao buscar ciclo', error);
      set({ activeCycle: null });
    } finally {
      set({ isLoadingActive: false });
    }
  },

  fetchHistory: async (filters = {}) => {
    set({ isLoadingHistory: true });
    try {
      const params = {
        page: filters.page || 1,
        startDate: filters.startDate?.toISOString(),
        endDate: filters.endDate?.toISOString()
      };
      
      const response = await cycleApi.getHistory(params);
      const validatedCycles = CycleListSchema.parse(response.data);

      set({ 
        historyCycles: validatedCycles,
        historyPagination: response.pagination,
        isLoadingHistory: false 
      });
    } catch (error) {
      console.error(error);
      set({ isLoadingHistory: false });
    }
  },

  fetchCycleDetails: async (id) => {
    set({ isLoadingDetails: true, selectedCycle: null });
    try {
      const data = await cycleApi.getById(id);
      const validated = CycleResponseSchema.parse(data);
      set({ selectedCycle: validated, isLoadingDetails: false });
    } catch (error) {
      console.error(error);
      set({ isLoadingDetails: false });
    }
  },

  createCycle: async (data) => {
    set({ isSubmitting: true, error: null, success: false });
    try {
      if (!data.openingDate || !data.closingDate) throw new Error('Datas inválidas');

      const payload = {
        description: data.description,
        openingDate: data.openingDate.toISOString(),
        closingDate: data.closingDate.toISOString(),
        products: data.products
      };

      await cycleApi.create(payload);

      set({ isSubmitting: false, success: true });
      get().fetchActiveCycle(); 
      return true;

    } catch (err: unknown) {
      set({ isSubmitting: false, error: getErrorMessage(err) });
      return false;
    }
  },

  updateActiveCycleProducts: async (updatedProducts) => {
    const currentCycle = get().activeCycle;
    if (!currentCycle || !currentCycle._id) return false;

    set({ isSubmitting: true, error: null });

    try {
      const updatedCycle = await cycleApi.updateProducts(currentCycle._id, updatedProducts);
      const validatedCycle = CycleResponseSchema.parse(updatedCycle);

      set({ 
        activeCycle: validatedCycle,
        isSubmitting: false, 
        success: true
      });
      return true;

    } catch (err: unknown) {
      set({ isSubmitting: false, error: getErrorMessage(err) });
      return false;
    }
  },

  resetStatus: () => set({ error: null, success: false }),
  clearSelectedCycle: () => set({ selectedCycle: null })
}));