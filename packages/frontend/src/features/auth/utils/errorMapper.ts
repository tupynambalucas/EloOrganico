import { AuthFormRefs, AuthFormData, ErrorUIMapping } from '../types';
import { TFunction } from 'i18next';

export const mapBackendErrorToUI = (
  code: string, 
  refs: AuthFormRefs, 
  t: TFunction,
  isLogin: boolean
): ErrorUIMapping | null => {
  const errorMap: Record<string, { field: keyof AuthFormData; getRef: (r: AuthFormRefs) => any }> = {
    'USER_NOT_FOUND': { field: 'identifier', getRef: (r) => r.identifier },
    'INVALID_PASSWORD': { field: 'password', getRef: (r) => isLogin ? r.passwordLogin : r.passwordRegister },
    'EMAIL_ALREADY_EXISTS': { field: 'email', getRef: (r) => r.email },
    'USERNAME_ALREADY_EXISTS': { field: 'username', getRef: (r) => r.username },
  };

  const config = errorMap[code];
  if (!config) return null;

  return {
    errors: { [config.field]: t(`auth.errors.${code}`) },
    ref: config.getRef(refs)
  };
};