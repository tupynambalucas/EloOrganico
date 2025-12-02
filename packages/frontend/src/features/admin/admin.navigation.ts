import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define quais telas existem no Admin
export type AdminViewType = 'usuarios' | 'partilhas' | 'relatorios' | 'configuracoes' | 'produtos';

interface AdminNavigationState {
  currentView: AdminViewType;
  setView: (view: AdminViewType) => void;
}

export const useAdminNavigation = create<AdminNavigationState>()(
  persist(
    (set) => ({
      currentView: 'partilhas', // Tela inicial padrão
      setView: (view) => set({ currentView: view }),
    }),
    {
      name: 'admin-navigation-storage', // Nome da chave no localStorage
    }
  )
);