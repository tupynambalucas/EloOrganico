import { LoginDTOSchema, RegisterDTOSchema, AUTH_RULES } from '@elo-organico/shared';
import { AuthFormData, AuthFormRefs, ValidationResult } from '../types';
import { TFunction } from 'i18next';

export const validateAuthForm = (
  isLogin: boolean,
  data: AuthFormData,
  refs: AuthFormRefs,
  t: TFunction
): ValidationResult => {
  const schema = isLogin ? LoginDTOSchema : RegisterDTOSchema;
  const dataToValidate = isLogin 
    ? { identifier: data.identifier, password: data.password }
    : { email: data.email, username: data.username, icon: data.icon, password: data.password };

  const result = schema.safeParse(dataToValidate);

  if (!result.success) {
    const firstError = result.error.errors[0];
    const field = firstError.path[0] as keyof AuthFormData;
    const minVal = field === 'username' ? AUTH_RULES.USERNAME.MIN : AUTH_RULES.PASSWORD.MIN;

    const errorMessage = t(`auth.errors.${field}_${firstError.code}`, { 
      min: minVal,
      defaultValue: firstError.message 
    });

    const errorRefs: Record<string, React.RefObject<HTMLInputElement | null>> = {
      identifier: refs.identifier,
      password: isLogin ? refs.passwordLogin : refs.passwordRegister,
      username: refs.username,
      email: refs.email,
    };

    return { 
      isValid: false, 
      errors: { [field]: errorMessage }, 
      firstErrorRef: errorRefs[field] 
    };
  }

  return { isValid: true, errors: {} };
};