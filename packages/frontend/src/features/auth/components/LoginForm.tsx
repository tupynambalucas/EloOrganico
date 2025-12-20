import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { AuthFormData, AuthFieldErrors, AuthFormRefs } from '../types';
import styles from '../styles.module.css';

interface LoginFormProps {
  data: AuthFormData;
  errors: AuthFieldErrors;
  onChange: (field: keyof AuthFormData, value: string) => void;
  inputRefs: AuthFormRefs;
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
        />
        {errors.identifier && <span className={styles.fieldErrorMessage}>{errors.identifier}</span>}
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
          />
          <button type="button" className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        {errors.password && <span className={styles.fieldErrorMessage}>{errors.password}</span>}
      </div>
    </div>
  );
};