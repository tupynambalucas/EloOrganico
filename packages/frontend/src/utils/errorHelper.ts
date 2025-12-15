import { AxiosError } from 'axios';
import i18n from '@/i18n';

interface ApiErrorData {
  code?: string;
  message?: string;
}

export const getErrorMessage = (err: unknown): string => {
  if (err instanceof AxiosError) {
    const data = err.response?.data as ApiErrorData;
    if (data?.code) {
      return i18n.t(`errors.${data.code}`);
    }
  }
  return i18n.t('errors.UNKNOWN_ERROR');
};