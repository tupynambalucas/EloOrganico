import { api } from '@/lib/axios';
import type { ICycle, CreateCycleDTO, IProduct } from '@elo-organico/shared'; // Adicionado IProduct

interface HistoryParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

interface HistoryResponse {
  data: ICycle[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  }
}

export const cycleApi = {
  getActive: async () => {
    const response = await api.get<ICycle | null>('/cycles/active');
    return response.status === 204 ? null : response.data;
  },

  getHistory: async (params: HistoryParams) => {
    const response = await api.get<HistoryResponse>('/admin/cycles/history', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ICycle>(`/admin/cycles/${id}`);
    return response.data;
  },

  create: async (data: CreateCycleDTO) => {
    const response = await api.post<ICycle>('/admin/cycles', data);
    return response.data;
  },

  // Correção: products agora é tipado como IProduct[]
  updateProducts: async (id: string, products: IProduct[]) => {
    const response = await api.patch<ICycle>(`/admin/cycles/${id}`, { products });
    return response.data;
  }
};