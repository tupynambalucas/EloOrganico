import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { AuthFormData, AuthFieldErrors, AuthFormRefs } from '../types';
import styles from '../styles.module.css';

interface LoginFormProps {
  data: Pick<AuthFormData, 'identifier' | 'password'>;
  errors: AuthFieldErrors;
  onChange: (field: keyof AuthFormData, value: string) => void;
  inputRefs: Pick<AuthFormRefs, 'identifier' | 'passwordLogin'>;
  disabled: boolean;
}

export const LoginForm = ({ data, errors, onChange, inputRefs, disabled }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.inputGroup}>
      <div className={styles.inputWrapper}>
        <input
          ref={inputRefs.identifier}
          type="text"
          placeholder="Usuário ou E-mail"
          value={data.identifier}
          onChange={(e) => onChange('identifier', e.target.value)}
          className={errors.identifier ? styles.inputError : ''}
          disabled={disabled}
          required
          aria-invalid={!!errors.identifier}
        />
        {errors.identifier && <span className={styles.fieldErrorMessage} role="alert">{errors.identifier}</span>}
      </div>
      <div className={styles.inputWrapper}>
        <div className={styles.passwordWrapper}>
          <input
            ref={inputRefs.passwordLogin}
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            value={data.password}
            onChange={(e) => onChange('password', e.target.value)}
            className={errors.password ? styles.inputError : ''}
            disabled={disabled}
            required
            aria-invalid={!!errors.password}
          />
          <button 
            type="button" 
            className={styles.eyeIcon} 
            onClick={() => setShowPassword(!showPassword)} 
            tabIndex={-1}
            aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        {errors.password && <span className={styles.fieldErrorMessage} role="alert">{errors.password}</span>}
      </div>
    </div>
  );
};