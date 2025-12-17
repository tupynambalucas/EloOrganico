import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/domains/auth';
import { AUTH_RULES } from '@elo-organico/shared';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import UserIcon from '@/components/UserIcon';
import UserIconsList from '@/constants/userIconList';
import styles from './AuthForm.module.css';
import { shakeElement, animateFormEntrance } from './animations';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthForm = () => {
  const { t } = useTranslation();
  
  const { 
    login, 
    register, 
    loginLoading, 
    registerLoading, 
    errorCode,
    clearErrors
  } = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [icon, setUserIcon] = useState('graxaim');
  
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string | null }>({
    identifier: null,
    password: null,
    username: null,
    email: null
  });

  const containerRef = useRef<HTMLFormElement>(null);
  const identifierRef = useRef<HTMLInputElement>(null);
  const passwordLoginRef = useRef<HTMLInputElement>(null);
  const passwordRegisterRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    animateFormEntrance(containerRef.current);
  }, [isLogin]);

  useEffect(() => {
    if (errorCode) {
      const newErrors = { ...fieldErrors };
      let errorFound = false;

      if (errorCode === 'USER_NOT_FOUND') {
        newErrors.identifier = t('errors.USER_NOT_FOUND');
        shakeElement(identifierRef.current);
        errorFound = true;
      }
      if (errorCode === 'INVALID_PASSWORD') {
        newErrors.password = t('errors.INVALID_PASSWORD');
        shakeElement(passwordLoginRef.current);
        errorFound = true;
      }
      if (errorCode === 'USERNAME_ALREADY_EXISTS') {
        newErrors.username = t('errors.USERNAME_ALREADY_EXISTS');
        shakeElement(usernameRef.current);
        errorFound = true;
      }
      if (errorCode === 'EMAIL_ALREADY_EXISTS') {
        newErrors.email = t('errors.EMAIL_ALREADY_EXISTS');
        shakeElement(emailRef.current);
        errorFound = true;
      }

      if (errorFound) {
        setFieldErrors(newErrors);
      }
    }
  }, [errorCode, t]);

  const handleInput = (
    field: string, 
    value: string, 
    setter: (val: string) => void,
    e?: React.KeyboardEvent
  ) => {
    if ((e && e.key === 'Backspace') || !e) {
       if (fieldErrors[field]) {
         setFieldErrors(prev => ({ ...prev, [field]: null }));
         if (errorCode) clearErrors(); 
       }
    }
    
    if (!e) setter(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    
    if (isLogin) {
      await login({ identifier, password });
    } else {
      let hasLocalError = false;
      const localErrs = { ...fieldErrors };

      if (username.length < AUTH_RULES.USERNAME.MIN) {
        localErrs.username = `Mínimo ${AUTH_RULES.USERNAME.MIN} caracteres`;
        shakeElement(usernameRef.current);
        hasLocalError = true;
      }

      if (!EMAIL_REGEX.test(email)) {
        localErrs.email = t('errors.INVALID_EMAIL');
        shakeElement(emailRef.current);
        hasLocalError = true;
      }

      if (password.length < AUTH_RULES.PASSWORD.MIN) {
        localErrs.password = `Mínimo ${AUTH_RULES.PASSWORD.MIN} caracteres`;
        shakeElement(passwordRegisterRef.current);
        hasLocalError = true;
      }

      if (hasLocalError) {
        setFieldErrors(localErrs);
        return;
      }

      const success = await register({ username, email, password, icon });
      if (success) {
        setIsLogin(true);
        setUsername('');
        setEmail('');
        setPassword('');
        setIdentifier('');
        setUserIcon('graxaim');
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFieldErrors({});
    clearErrors();
    setPassword('');
  };

  const isLoading = isLogin ? loginLoading : registerLoading;

  return (
    <div className={styles.container}>
      {!isLogin && (
        <div className={styles.registerPreview}>
          <div className={styles.previewIconWrapper}>
            <UserIcon forceIcon={icon} size={100} className={styles.previewIcon} />
          </div>
          <p className={styles.previewUsername}>
            {username || 'Seu Usuário'}
          </p>
        </div>
      )}

      <div className={styles.header}>
        <h2>{isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}</h2>
        <p>{isLogin ? 'Faça login para continuar' : 'Comece sua jornada sustentável'}</p>
      </div>

      <form className={styles.formContainer} onSubmit={handleSubmit} ref={containerRef}>
        
        {isLogin && (
          <div id="login-form" className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <input
                ref={identifierRef}
                type="text"
                placeholder="Email ou Usuário"
                value={identifier}
                onChange={(e) => handleInput('identifier', e.target.value, setIdentifier)}
                onKeyDown={(e) => handleInput('identifier', identifier, setIdentifier, e)}
                className={fieldErrors.identifier ? styles.inputError : ''}
                disabled={isLoading}
                required
              />
              {fieldErrors.identifier && (
                <span className={styles.fieldErrorMessage}>{fieldErrors.identifier}</span>
              )}
            </div>

            <div className={styles.inputWrapper}>
              <div className={styles.passwordWrapper}>
                <input
                  ref={passwordLoginRef}
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => handleInput('password', e.target.value, setPassword)}
                  onKeyDown={(e) => handleInput('password', password, setPassword, e)}
                  className={fieldErrors.password ? styles.inputError : ''}
                  disabled={isLoading}
                  required
                />
                <button 
                  type="button" 
                  className={styles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {fieldErrors.password && (
                <span className={styles.fieldErrorMessage}>{fieldErrors.password}</span>
              )}
            </div>
          </div>
        )}

        {!isLogin && (
          <div id="register-form" className={styles.inputGroup}>
            
            <div className={styles.iconSelectorContainer}>
              <label>Escolha seu avatar:</label>
              <div className={styles.iconGrid}>
                {UserIconsList.map((item) => (
                  <div 
                    key={item.name}
                    className={`${styles.iconOption} ${icon === item.name ? styles.selectedIcon : ''}`}
                    onClick={() => setUserIcon(item.name)}
                    title={item.name}
                  >
                    <img src={item.base64} alt={item.name} />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.inputWrapper}>
              <input
                ref={usernameRef}
                type="text"
                placeholder="Nome de usuário"
                value={username}
                onChange={(e) => handleInput('username', e.target.value, setUsername)}
                onKeyDown={(e) => handleInput('username', username, setUsername, e)}
                className={fieldErrors.username ? styles.inputError : ''}
                disabled={isLoading}
                required
              />
              {fieldErrors.username && (
                <span className={styles.fieldErrorMessage}>{fieldErrors.username}</span>
              )}
            </div>

            <div className={styles.inputWrapper}>
              <input
                ref={emailRef}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => handleInput('email', e.target.value, setEmail)}
                onKeyDown={(e) => handleInput('email', email, setEmail, e)}
                className={fieldErrors.email ? styles.inputError : ''}
                disabled={isLoading}
                required
              />
              {fieldErrors.email && (
                <span className={styles.fieldErrorMessage}>{fieldErrors.email}</span>
              )}
            </div>

            <div className={styles.inputWrapper}>
              <div className={styles.passwordWrapper}>
                <input
                  ref={passwordRegisterRef}
                  type={showPassword ? "text" : "password"}
                  placeholder={`Senha (min. ${AUTH_RULES.PASSWORD.MIN})`}
                  value={password}
                  onChange={(e) => handleInput('password', e.target.value, setPassword)}
                  onKeyDown={(e) => handleInput('password', password, setPassword, e)}
                  className={fieldErrors.password ? styles.inputError : ''}
                  disabled={isLoading}
                  required
                />
                <button 
                  type="button" 
                  className={styles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {fieldErrors.password && (
                <span className={styles.fieldErrorMessage}>{fieldErrors.password}</span>
              )}
            </div>
          </div>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Registrar')}
        </button>

      </form>

      <div className={styles.footer}>
        <a className={styles.toggleLink} onClick={toggleMode}>
          {isLogin ? 'Não tem uma conta? Registre-se' : 'Já tem uma conta? Faça o login'}
        </a>
      </div>
    </div>
  );
};

export default AuthForm;