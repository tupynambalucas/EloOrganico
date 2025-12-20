import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { IconSelector } from '@/components/UserIcon';
import { AUTH_RULES } from '@elo-organico/shared';
import styles from '../AuthForm.module.css';

interface RegisterFormProps {
  data: any;
  errors: any;
  onChange: (field: string, value: string) => void;
  inputRefs: any;
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
        />
        {errors.username && <span className={styles.fieldErrorMessage}>{errors.username}</span>}
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
        />
        {errors.email && <span className={styles.fieldErrorMessage}>{errors.email}</span>}
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
            placeholder={`Senha (min. ${AUTH_RULES.PASSWORD.MIN})`}
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