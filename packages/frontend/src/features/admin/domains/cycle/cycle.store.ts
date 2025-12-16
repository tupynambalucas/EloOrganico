import { create } from 'zustand';
import { adminCycleApi } from './cycle.api';
import { useCycleStore as usePublicCycleStore } from '@/domains/cycle';
import { getErrorMessage } from '@/utils/errorHelper';
import { 
  type IProduct, 
  type CycleResponse, // [CORREÇÃO] Usar o tipo de resposta correto
  CycleResponseSchema
} from '@elo-organico/shared';
import { z } from 'zod';

export type CycleFormData = {
  products: IProduct[];
  description: string;
  openingDate: Date | null;
  closingDate: Date | null;
};

interface HistoryResponse {
  data: CycleResponse[]; // [CORREÇÃO] Atualizado
  pagination: {
    total: number;
    page: number;
    pages: number;
  }
}

interface AdminCycleState {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;

  historyCycles: CycleResponse[]; // [CORREÇÃO] Atualizado de ICycle para CycleResponse
  historyPagination: HistoryResponse['pagination'] | null;
  isLoadingHistory: boolean;
  
  selectedCycle: CycleResponse | null; // [CORREÇÃO] Atualizado
  isLoadingDetails: boolean;

  fetchHistory: (filters?: { page?: number; startDate?: Date; endDate?: Date }) => Promise<void>;
  fetchCycleDetails: (id: string) => Promise<void>;
  
  createCycle: (data: CycleFormData) => Promise<boolean>;
  updateActiveCycleProducts: (products: IProduct[]) => Promise<boolean>;
  
  resetStatus: () => void;
  clearSelectedCycle: () => void;
}

const CycleListSchema = z.array(CycleResponseSchema);

export const useAdminCycleStore = create<AdminCycleState>((set) => ({
  isSubmitting: false,
  error: null,
  success: false,

  historyCycles: [],
  historyPagination: null,
  isLoadingHistory: false,

  selectedCycle: null,
  isLoadingDetails: false,

  fetchHistory: async (filters = {}) => {
    set({ isLoadingHistory: true, error: null });
    try {
      const response = await adminCycleApi.getHistory({
        page: filters.page || 1,
        startDate: filters.startDate?.toISOString(),
        endDate: filters.endDate?.toISOString()
      });

      // Valida os dados recebidos com o Schema correto
      const validatedData = CycleListSchema.parse(response.data);

      set({ 
        historyCycles: validatedData, 
        historyPagination: response.pagination 
      });
    } catch (err: unknown) {
      set({ error: getErrorMessage(err) });
    } finally {
      set({ isLoadingHistory: false });
    }
  },

  fetchCycleDetails: async (id) => {
    set({ isLoadingDetails: true, error: null });
    try {
      const data = await adminCycleApi.getById(id);
      const validated = CycleResponseSchema.parse(data);
      set({ selectedCycle: validated });
    } catch (err: unknown) {
      set({ error: getErrorMessage(err) });
    } finally {
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

      await adminCycleApi.create(payload);

      set({ isSubmitting: false, success: true });
      
      // Atualiza a store pública para refletir a mudança imediatamente se necessário
      usePublicCycleStore.getState().fetchActiveCycle();
      
      return true;

    } catch (err: unknown) {
      set({ isSubmitting: false, error: getErrorMessage(err) });
      return false;
    }
  },

  updateActiveCycleProducts: async (updatedProducts) => {
    const currentPublicCycle = usePublicCycleStore.getState().activeCycle;
    
    if (!currentPublicCycle || !currentPublicCycle._id) return false;

    set({ isSubmitting: true, error: null });

    try {
      const updatedCycle = await adminCycleApi.updateProducts(currentPublicCycle._id, updatedProducts);
      CycleResponseSchema.parse(updatedCycle);

      set({ isSubmitting: false, success: true });

      usePublicCycleStore.getState().fetchActiveCycle();
      
      return true;

    } catch (err: unknown) {
      set({ isSubmitting: false, error: getErrorMessage(err) });
      return false;
    }
  },

  resetStatus: () => set({ error: null, success: false }),
  clearSelectedCycle: () => set({ selectedCycle: null })
}));