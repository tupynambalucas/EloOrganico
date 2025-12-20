import { AuthFieldErrors, AuthFormRefs, AuthFormData } from '../types';
import { TFunction } from 'i18next';

interface ErrorMapping {
  field: keyof AuthFormData;
  ref: React.RefObject<HTMLInputElement | null>;
}

export const mapBackendErrorToUI = (
  code: string,
  refs: AuthFormRefs,
  t: TFunction
): { errors: AuthFieldErrors; ref: React.RefObject<HTMLInputElement | null> } | null => {
  const errorMap: Record<string, ErrorMapping> = {
    'USER_NOT_FOUND': { field: 'identifier', ref: refs.identifier },
    'INVALID_PASSWORD': { field: 'password', ref: refs.passwordLogin },
    'EMAIL_ALREADY_EXISTS': { field: 'email', ref: refs.email },
    'USERNAME_ALREADY_EXISTS': { field: 'username', ref: refs.username },
  };

  const config = errorMap[code];
  if (!config) return null;

  return {
    errors: { [config.field]: t(`auth.errors.${code.toLowerCase()}`) },
    ref: config.ref
  };
};