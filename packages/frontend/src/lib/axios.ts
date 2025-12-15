import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Definição da estrutura da fila de processamento
interface FailedRequestQueueItem {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}

// Singleton para controle de estado
let csrfToken: string | null = null;
let isRefreshing = false;
let failedQueue: FailedRequestQueueItem[] = [];

// Processa a fila
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setCsrfToken(token: string) {
  csrfToken = token;
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (csrfToken && config.method && !['get', 'head', 'options'].includes(config.method.toLowerCase())) {
    config.headers['x-csrf-token'] = csrfToken;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 403 && originalRequest && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers['x-csrf-token'] = token;
              resolve(api(originalRequest));
            },
            reject: (err: unknown) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.get('/api/csrf-token', { 
          withCredentials: true,
          baseURL: '/api' 
        });
        
        const newToken = response.data.token;
        setCsrfToken(newToken);
        
        processQueue(null, newToken);
        
        originalRequest.headers['x-csrf-token'] = newToken;
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const initializeCsrf = async () => {
  try {
    const { data } = await api.get('/csrf-token');
    setCsrfToken(data.token);
    return true;
  } catch {
    // Erro ignorado intencionalmente na inicialização (pode estar offline)
    console.warn('Falha na inicialização do CSRF');
    return false;
  }
};