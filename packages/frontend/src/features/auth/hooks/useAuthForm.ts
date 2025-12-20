import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/domains/auth';
import { AUTH_RULES } from '@elo-organico/shared';
import { shakeElement } from '../animations';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useAuthForm = (isLogin: boolean, onSuccess: () => void) => {
  const { t } = useTranslation();
  const { login, register, loginLoading, registerLoading, errorCode, clearErrors } = useAuthStore();

  const refs = {
    identifier: useRef<HTMLInputElement>(null),
    passwordLogin: useRef<HTMLInputElement>(null),
    username: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    passwordRegister: useRef<HTMLInputElement>(null),
  };

  const [formData, setFormData] = useState({
    identifier: '',
    username: '',
    email: '',
    password: '',
    icon: 'graxaim'
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    if (errorCode) {
      const errorMap: Record<string, { field: string; ref: React.RefObject<HTMLInputElement | null> }> = {
        'USER_NOT_FOUND': { field: 'identifier', ref: refs.identifier },
        'INVALID_PASSWORD': { field: 'password', ref: refs.passwordLogin },
        'EMAIL_ALREADY_EXISTS': { field: 'email', ref: refs.email },
        'USERNAME_ALREADY_EXISTS': { field: 'username', ref: refs.username },
      };

      const errorConfig = errorMap[errorCode];
      if (errorConfig) {
        setFieldErrors({ [errorConfig.field]: t(`auth.errors.${errorCode.toLowerCase()}`) });
        shakeElement(errorConfig.ref.current);
      }
    }
  }, [errorCode, t]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: null }));
    }
    if (errorCode) clearErrors();
  };

  const validate = () => {
    const errors: Record<string, string | null> = {};
    let isValid = true;

    if (isLogin) {
      if (!formData.identifier) {
        errors.identifier = t('auth.errors.required');
        shakeElement(refs.identifier.current);
        isValid = false;
      }
      if (!formData.password) {
        errors.password = t('auth.errors.required');
        shakeElement(refs.passwordLogin.current);
        isValid = false;
      }
    } else {
      if (formData.username.length < AUTH_RULES.USERNAME.MIN) {
        errors.username = t('auth.errors.username_min', { min: AUTH_RULES.USERNAME.MIN });
        shakeElement(refs.username.current);
        isValid = false;
      }
      if (!EMAIL_REGEX.test(formData.email)) {
        errors.email = t('auth.errors.invalid_email');
        shakeElement(refs.email.current);
        isValid = false;
      }
      if (formData.password.length < AUTH_RULES.PASSWORD.MIN) {
        errors.password = t('auth.errors.password_min', { min: AUTH_RULES.PASSWORD.MIN });
        shakeElement(refs.passwordRegister.current);
        isValid = false;
      }
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginLoading || registerLoading || !validate()) return;

    if (isLogin) {
      await login({ identifier: formData.identifier, password: formData.password });
    } else {
      const success = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        icon: formData.icon
      });
      if (success) onSuccess();
    }
  };

  return {
    formData,
    fieldErrors,
    handleInputChange,
    handleSubmit,
    isLoading: loginLoading || registerLoading,
    refs
  };
};