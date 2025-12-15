import { create } from 'zustand';
import { authApi } from './auth.api';
import i18n from '@/i18n';
import { setCsrfToken } from '@/lib/axios';
import { AxiosError } from 'axios'; // Import necessário
import { 
  type LoginDTO, 
  type RegisterDTO, 
  type UserResponse, 
  UserResponseSchema
} from '@elo-organico/shared';

// Interface para o formato de erro esperado do backend
interface ApiErrorData {
  code?: string;
  message?: string;
}

// Helper fortemente tipado
const getErrorMessage = (err: unknown) => {
  if (err instanceof AxiosError) {
    const data = err.response?.data as ApiErrorData;
    const code = data?.code || 'UNKNOWN_ERROR';
    return i18n.t(`errors.${code}`);
  }
  return i18n.t('errors.UNKNOWN_ERROR');
};

// ... Resto das interfaces (AuthState) mantém igual ...
interface AuthState {
  user: UserResponse | null;
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
      const result = await authApi.login(data);
      const validatedUser = UserResponseSchema.parse(result.user);

      set({ 
        user: validatedUser, 
        isAuthenticated: true, 
        loginLoading: false 
      });
    } catch (err: unknown) { // Correção: unknown
      set({ 
        loginLoading: false, 
        loginError: getErrorMessage(err),
        isAuthenticated: false,
        user: null
      });
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error(error);
    } finally {
      set({ user: null, isAuthenticated: false });
      setCsrfToken('');
    }
  },

  register: async (data) => {
    set({ registerLoading: true, registerError: null, registerSuccess: null });
    try {
      await authApi.register(data);
      set({
        registerLoading: false,
        registerSuccess: i18n.t('success.USER_CREATED_SUCCESSFULLY'),
      });
      return true;
    } catch (err: unknown) { // Correção: unknown
      set({
        registerLoading: false,
        registerError: getErrorMessage(err),
      });
      return false;
    }
  },

  verifyAuth: async () => {
    set({ isAuthLoading: true });
    try {
      const result = await authApi.verify();
      const validatedUser = UserResponseSchema.parse(result.user);

      set({ 
        user: validatedUser, 
        isAuthenticated: true, 
        isAuthLoading: false 
      });
    } catch {
      // Catch sem variável quando ela não é usada (ES2019)
      set({ 
        user: null, 
        isAuthenticated: false, 
        isAuthLoading: false 
      });
    }
  },
}));