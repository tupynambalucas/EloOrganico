import { create } from 'zustand';
import { sendJSON, setCsrfToken } from '@/lib/fetch';
import type { IUser, LoginDTO, RegisterDTO } from '@elo-organico/shared';

export type UserState = Omit<IUser, 'password'>;

interface ApiError {
  message?: string;
  body?: {
    message?: string;
  };
}

interface LoginResponse {
  authenticated: boolean;
  token: string;
  user: UserState;
}

interface AuthState {
  user: UserState | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  loginLoading: boolean;
  loginError: string | null;
  registerLoading: boolean;
  registerError: string | null;
  registerSuccess: string | null;
  
  login: (data: LoginDTO) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterDTO) => Promise<boolean>;
  verifyAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isAuthLoading: true,
  loginLoading: false,
  loginError: null,
  registerLoading: false,
  registerError: null,
  registerSuccess: null,

  login: async (data) => {
    set({ loginLoading: true, loginError: null });
    try {
      const response = await sendJSON<LoginResponse>('/api/auth/login', {
        method: 'POST',
        json: data,
      });

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        loginLoading: false,
      });

    } catch (err: unknown) {
      const error = err as ApiError;
      const message = error.body?.message || error.message || 'Erro ao entrar.';
      set({
        loginLoading: false,
        loginError: message,
      });
    }
  },

  logout: async () => {
    try {
      await sendJSON('/api/auth/logout', { method: 'POST' });
    } finally {
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  register: async (data) => {
    set({ registerLoading: true, registerError: null, registerSuccess: null });
    try {
      await sendJSON('/api/auth/register', {
        method: 'POST',
        json: data,
      });

      set({
        registerLoading: false,
        registerSuccess: 'Conta criada com sucesso! Faça login.',
      });
      return true;

    } catch (err: unknown) {
      const error = err as ApiError;
      const message = error.body?.message || error.message || 'Erro ao registrar.';
      set({
        registerLoading: false,
        registerError: message,
      });
      return false;
    }
  },

  verifyAuth: async () => {
    set({ isAuthLoading: true });
    
    // 1. Inicializa CSRF antes de verificar autenticação
    try {
      const csrfRes = await sendJSON<{ token: string }>('/api/csrf-token', { method: 'GET' });
      setCsrfToken(csrfRes.token);
    } catch (e) {
      console.error('Falha ao obter CSRF', e);
    }

    // 2. Verifica sessão
    try {
      const response = await sendJSON<LoginResponse>('/api/auth/verify', {
        method: 'GET',
      });

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isAuthLoading: false,
      });

    } catch {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isAuthLoading: false,
      });
    }
  },
}));