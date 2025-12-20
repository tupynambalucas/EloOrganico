import { LoginDTO, RegisterDTO } from '@elo-organico/shared';

export type AuthFormData = LoginDTO & RegisterDTO & { icon: string };

export interface AuthFormRefs {
  identifier: React.RefObject<HTMLInputElement | null>;
  passwordLogin: React.RefObject<HTMLInputElement | null>;
  username: React.RefObject<HTMLInputElement | null>;
  email: React.RefObject<HTMLInputElement | null>;
  passwordRegister: React.RefObject<HTMLInputElement | null>;
}

export type AuthFieldErrors = Partial<Record<keyof AuthFormData, string | null>>;