import { AuthFieldErrors, AuthFormRefs, AuthFormData, ErrorUIMapping } from '../types';
import { TFunction } from 'i18next';

export const mapBackendErrorToUI = (code: string, refs: AuthFormRefs, t: TFunction): ErrorUIMapping | null => {
  const errorMap: Record<string, { field: keyof AuthFormData; ref: React.RefObject<HTMLInputElement | null> }> = {
    'USER_NOT_FOUND': { field: 'identifier', ref: refs.identifier },
    'INVALID_PASSWORD': { field: 'password', ref: refs.passwordLogin },
    'EMAIL_ALREADY_EXISTS': { field: 'email', ref: refs.email },
    'USERNAME_ALREADY_EXISTS': { field: 'username', ref: refs.username },
  };

  const config = errorMap[code];
  if (!config) return null;

  const fieldErrors: AuthFieldErrors = { [config.field]: t(`auth.errors.${code}`) };

  return {
    errors: fieldErrors,
    ref: config.ref
  };
};