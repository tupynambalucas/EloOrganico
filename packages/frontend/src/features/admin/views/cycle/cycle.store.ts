import { create } from 'zustand';
import { sendJSON, HttpError } from '@/lib/fetch';
import { 
  type IProduct, 
  type ICycle, 
  type CreateCycleDTO,
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
    set({ isLoadingActive: true, error: null });
    try {
      const data = await sendJSON<ICycle | null>('/api/cycles/active', { method: 'GET' });
      
      if (data) {
        // Validação Zod
        const validatedCycle = CycleResponseSchema.parse(data);
        set({ activeCycle: validatedCycle });
      } else {
        set({ activeCycle: null });
      }
    } catch (err: unknown) {
      // LOG DE ERRO ADICIONADO PARA DEBUG
      console.error("❌ Erro ao processar ciclo ativo (Provável erro de Schema):", err);
      
      // Opcional: Se for erro de validação do Zod, logar detalhes
      if (err instanceof z.ZodError) {
        console.table(err.issues);
      }
      
      set({ activeCycle: null });
    } finally {
      set({ isLoadingActive: false });
    }
  },

  fetchHistory: async (filters = {}) => {
    set({ isLoadingHistory: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters.endDate) params.append('endDate', filters.endDate.toISOString());

      const response = await sendJSON<HistoryResponse>(`/api/admin/cycles/history?${params.toString()}`, {
        method: 'GET'
      });

      const validatedList = CycleListSchema.parse(response.data);

      set({ 
        historyCycles: validatedList,
        historyPagination: response.pagination
      });
    } catch (err: unknown) {
      const error = err as HttpError;
      const body = error.body as { message?: string } | undefined;
      set({ error: body?.message || error.message || 'Erro ao buscar histórico' });
    } finally {
      set({ isLoadingHistory: false });
    }
  },

  fetchCycleDetails: async (id: string) => {
    set({ isLoadingDetails: true, error: null });
    try {
      const data = await sendJSON<ICycle>(`/api/admin/cycles/${id}`, { method: 'GET' });
      const validatedCycle = CycleResponseSchema.parse(data);
      set({ selectedCycle: validatedCycle });
    } catch (err: unknown) {
      const error = err as HttpError;
      const body = error.body as { message?: string } | undefined;
      set({ error: body?.message || error.message || 'Erro ao carregar detalhes' });
    } finally {
      set({ isLoadingDetails: false });
    }
  },

  createCycle: async (data: CycleFormData) => {
    set({ isSubmitting: true, error: null, success: false });

    if (!data.openingDate || !data.closingDate) {
      set({ isSubmitting: false, error: 'Datas são obrigatórias' });
      return false;
    }

    try {
      const payload: CreateCycleDTO = {
        description: data.description,
        products: data.products,
        openingDate: data.openingDate.toISOString(),
        closingDate: data.closingDate.toISOString(),
      };

      const response = await sendJSON<ICycle>('/api/admin/cycles', {
        method: 'POST',
        json: payload,
      });

      CycleResponseSchema.parse(response);

      set({ isSubmitting: false, success: true });
      get().fetchActiveCycle();
      return true;

    } catch (err: unknown) {
      const error = err as HttpError;
      const body = error.body as { message?: string } | undefined;
      set({ isSubmitting: false, error: body?.message || error.message || 'Falha ao criar ciclo' });
      return false;
    }
  },

  updateActiveCycleProducts: async (updatedProducts) => {
    const currentCycle = get().activeCycle;
    if (!currentCycle || !currentCycle._id) return false;

    set({ isSubmitting: true, error: null });

    try {
      const updatedCycle = await sendJSON<ICycle>(`/api/admin/cycles/${currentCycle._id}`, {
        method: 'PATCH',
        json: { products: updatedProducts }
      });

      const validatedCycle = CycleResponseSchema.parse(updatedCycle);

      set({ 
        activeCycle: validatedCycle,
        isSubmitting: false, 
        success: true
      });
      return true;

    } catch (err: unknown) {
      const error = err as HttpError;
      const body = error.body as { message?: string } | undefined;
      set({ isSubmitting: false, error: body?.message || error.message || 'Erro ao atualizar produtos' });
      return false;
    }
  },

  resetStatus: () => set({ error: null, success: false }),
  clearSelectedCycle: () => set({ selectedCycle: null })
}));