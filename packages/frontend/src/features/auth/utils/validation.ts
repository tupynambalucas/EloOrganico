import { RegisterDTOSchema, LoginDTOSchema } from '@elo-organico/shared';
import { AuthFormData, AuthFieldErrors, AuthFormRefs } from '../types';
import { TFunction } from 'i18next';

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
  const schema = isLogin ? LoginDTOSchema : RegisterDTOSchema;
  const result = schema.safeParse(data);

  if (!result.success) {
    const firstError = result.error.errors[0];
    const field = firstError.path[0] as keyof AuthFormData;
    
    const errorRefs: Record<string, React.RefObject<HTMLInputElement | null>> = {
      identifier: refs.identifier,
      password: isLogin ? refs.passwordLogin : refs.passwordRegister,
      username: refs.username,
      email: refs.email,
    };

    return {
      isValid: false,
      errors: { [field]: t(`auth.errors.${field}_${firstError.code.toLowerCase()}`, { defaultValue: firstError.message }) },
      firstErrorRef: errorRefs[field]
    };
  }

  return { isValid: true, errors: {} };
};