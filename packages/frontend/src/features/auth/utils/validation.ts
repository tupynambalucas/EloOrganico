import { AUTH_RULES } from '@elo-organico/shared';
import { AuthFormData, AuthFieldErrors, AuthFormRefs } from '../types';
import { TFunction } from 'i18next';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ValidationResult {
  isValid: boolean;
  errors: AuthFieldErrors;
  firstErrorRef?: React.RefObject<HTMLInputElement | null>;
}

export const validateAuthForm = (
  isLogin: boolean,
  data: AuthFormData,
  refs: AuthFormRefs,
  t: TFunction
): ValidationResult => {
  const errors: AuthFieldErrors = {};
  
  if (isLogin) {
    if (!data.identifier) {
      errors.identifier = t('auth.errors.required');
      return { isValid: false, errors, firstErrorRef: refs.identifier };
    }
    if (!data.password) {
      errors.password = t('auth.errors.required');
      return { isValid: false, errors, firstErrorRef: refs.passwordLogin };
    }
  } else {
    if (data.username.length < AUTH_RULES.USERNAME.MIN) {
      errors.username = t('auth.errors.username_min', { min: AUTH_RULES.USERNAME.MIN });
      return { isValid: false, errors, firstErrorRef: refs.username };
    }
    if (!EMAIL_REGEX.test(data.email)) {
      errors.email = t('auth.errors.invalid_email');
      return { isValid: false, errors, firstErrorRef: refs.email };
    }
    if (data.password.length < AUTH_RULES.PASSWORD.MIN) {
      errors.password = t('auth.errors.password_min', { min: AUTH_RULES.PASSWORD.MIN });
      return { isValid: false, errors, firstErrorRef: refs.passwordRegister };
    }
  }

  return { isValid: true, errors };
};