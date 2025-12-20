import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { IconSelector } from '@/components/UserIcon';
import { AuthFormData, AuthFieldErrors, AuthFormRefs } from '../types';
import styles from '../styles.module.css';

interface RegisterFormProps {
  data: Omit<AuthFormData, 'identifier'>;
  errors: AuthFieldErrors;
  onChange: (field: keyof AuthFormData, value: string) => void;
  inputRefs: Omit<AuthFormRefs, 'identifier' | 'passwordLogin'>;
  disabled: boolean;
}

export const RegisterForm = ({ data, errors, onChange, inputRefs, disabled }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.inputGroup}>
      <div className={styles.inputWrapper}>
        <input
          ref={inputRefs.username}
          type="text"
          placeholder="Como quer ser chamado?"
          value={data.username}
          onChange={(e) => onChange('username', e.target.value)}
          className={errors.username ? styles.inputError : ''}
          disabled={disabled}
          required
          aria-invalid={!!errors.username}
        />
        {errors.username && <span className={styles.fieldErrorMessage} role="alert">{errors.username}</span>}
      </div>

      <div className={styles.inputWrapper}>
        <input
          ref={inputRefs.email}
          type="email"
          placeholder="Seu melhor e-mail"
          value={data.email}
          onChange={(e) => onChange('email', e.target.value)}
          className={errors.email ? styles.inputError : ''}
          disabled={disabled}
          required
          aria-invalid={!!errors.email}
        />
        {errors.email && <span className={styles.fieldErrorMessage} role="alert">{errors.email}</span>}
      </div>

      <IconSelector 
        selectedIcon={data.icon} 
        onSelect={(icon) => onChange('icon', icon)} 
        disabled={disabled}
        className={styles.selectorAdaptation}
      />

      <div className={styles.inputWrapper}>
        <div className={styles.passwordWrapper}>
          <input
            ref={inputRefs.passwordRegister}
            type={showPassword ? "text" : "password"}
            placeholder="Escolha uma senha forte"
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