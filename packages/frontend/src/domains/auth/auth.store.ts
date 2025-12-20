import { create } from 'zustand';
import { authApi } from './auth.api';
import { setCsrfToken } from '@/lib/axios';
import { getErrorMessage, extractErrorCode } from '@/utils/errorHelper';
import { type LoginDTO, type RegisterDTO, type UserResponse, UserResponseSchema } from '@elo-organico/shared';

type AuthStatus = 'IDLE' | 'LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED' | 'ERROR';

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  status: AuthStatus;
  error: string | null;
  errorCode: string | null;
  login: (data: LoginDTO) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterDTO) => Promise<boolean>;
  verifyAuth: () => Promise<void>;
  clearErrors: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isAuthLoading: false,
  status: 'IDLE',
  error: null,
  errorCode: null,

  login: async (data) => {
    set({ status: 'LOADING', error: null, errorCode: null });
    try {
      const result = await authApi.login(data);
      setCsrfToken(result.token);
      set({ user: result.user, isAuthenticated: true, status: 'AUTHENTICATED' });
    } catch (err) {
      set({ status: 'ERROR', error: getErrorMessage(err), errorCode: extractErrorCode(err), isAuthenticated: false, user: null });
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({ user: null, isAuthenticated: false, status: 'UNAUTHENTICATED' });
      setCsrfToken('');
    }
  },

  register: async (data) => {
    set({ status: 'LOADING', error: null, errorCode: null });
    try {
      await authApi.register(data);
      set({ status: 'IDLE' });
      return true;
    } catch (err) {
      set({ status: 'ERROR', error: getErrorMessage(err), errorCode: extractErrorCode(err) });
      return false;
    }
  },

  verifyAuth: async () => {
    set({ isAuthLoading: true, status: 'LOADING' });
    try {
      const result = await authApi.verify();
      const validatedUser = UserResponseSchema.parse(result.user);
      set({ user: validatedUser, isAuthenticated: true, status: 'AUTHENTICATED', isAuthLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, status: 'UNAUTHENTICATED', isAuthLoading: false });
    }
  },

  clearErrors: () => set({ error: null, errorCode: null })
}));