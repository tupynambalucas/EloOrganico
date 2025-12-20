import { LoginDTO, RegisterDTO } from '@elo-organico/shared';

export type AuthFormData = LoginDTO & RegisterDTO & { icon: string };

export type AuthFieldErrors = Partial<Record<keyof AuthFormData, string | null>>;

export interface AuthFormRefs {
  identifier: React.RefObject<HTMLInputElement | null>;
  passwordLogin: React.RefObject<HTMLInputElement | null>;
  username: React.RefObject<HTMLInputElement | null>;
  email: React.RefObject<HTMLInputElement | null>;
  passwordRegister: React.RefObject<HTMLInputElement | null>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: AuthFieldErrors;
  firstErrorRef?: React.RefObject<HTMLInputElement | null>;
}

export interface ErrorUIMapping {
  errors: AuthFieldErrors;
  ref: React.RefObject<HTMLInputElement | null>;
}