import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/domains/auth';
import { shakeElement } from '../animations';
import { AuthFormData, AuthFieldErrors, AuthFormRefs } from '../types';
import { validateAuthForm } from '../utils/validation';
import { mapBackendErrorToUI } from '../utils/errorMapper';

export const useAuthForm = (isLogin: boolean, onSuccess: () => void) => {
  const { t } = useTranslation();
  const { login, register, status, errorCode, clearErrors } = useAuthStore();

  const refs: AuthFormRefs = {
    identifier: useRef<HTMLInputElement>(null),
    passwordLogin: useRef<HTMLInputElement>(null),
    username: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    passwordRegister: useRef<HTMLInputElement>(null),
  };

  const [formData, setFormData] = useState<AuthFormData>({
    identifier: '',
    username: '',
    email: '',
    password: '',
    icon: 'graxaim'
  });

  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});

  useEffect(() => {
    if (errorCode) {
      const errorUI = mapBackendErrorToUI(errorCode, refs, t);
      if (errorUI) {
        setFieldErrors(errorUI.errors);
        shakeElement(errorUI.ref.current);
      }
    }
  }, [errorCode, t]);

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: null }));
    if (errorCode) clearErrors();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'LOADING') return;

    const validation = validateAuthForm(isLogin, formData, refs, t);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      shakeElement(validation.firstErrorRef?.current || null);
      return;
    }

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
    isLoading: status === 'LOADING',
    refs
  };
};