import { useState } from 'react';
import { useAuthStore } from '@/domains/auth';
import UserIconsList from '@/constants/userIconList';
import styles from './AuthForm.module.css';
import { AUTH_RULES } from '@elo-organico/shared';
import UserIcon from '@/components/UserIcon';

const AuthForm = () => {
  const { 
    login, 
    register, 
    loginLoading, 
    loginError, 
    registerLoading, 
    registerError 
  } = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [icon, setUserIcon] = useState('graxaim');

  const validateForm = () => {
    if (isLogin) return true;

    if (username.length < AUTH_RULES.USERNAME.MIN) {
      setLocalError(`O usuário deve ter no mínimo ${AUTH_RULES.USERNAME.MIN} letras.`);
      return false;
    }
    
    if (password.length < AUTH_RULES.PASSWORD.MIN) {
      setLocalError(`A senha deve ter no mínimo ${AUTH_RULES.PASSWORD.MIN} caracteres.`);
      return false;
    }

    setLocalError(null);
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ identifier, password });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    await register({ 
      email, 
      username, 
      password, 
      icon 
    });
  };

  const isLoading = isLogin ? loginLoading : registerLoading;
  const currentError = localError || (isLogin ? loginError : registerError);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>{isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}</h2>
        <p>{isLogin ? 'Acesse para fazer seus pedidos' : 'Junte-se à nossa comunidade orgânica'}</p>
      </header>

      <form className={styles.formContainer} onSubmit={isLogin ? handleLogin : handleRegister}>
        <div className={styles.inputGroup}>
          {isLogin ? (
            <input 
              type="text" 
              placeholder="Email ou Usuário" 
              value={identifier} 
              onChange={(e) => setIdentifier(e.target.value)} 
              required 
              autoComplete="username"
            />
          ) : (
            <>
              <div className={styles.iconSelector}>
                <label>Escolha seu avatar:</label>
                <div className={styles.iconsGrid}>
                  {UserIconsList.map((item) => (
                    <div 
                      key={item.name} 
                      onClick={() => setUserIcon(item.name)}
                      className={`${styles.iconOption} ${icon === item.name ? styles.selected : ''}`}
                    >
                      <UserIcon forceIcon={item.name} size={45} />
                    </div>
                  ))}
                </div>
              </div>

              <input 
                type="text" 
                placeholder={`Usuário (min. ${AUTH_RULES.USERNAME.MIN})`}
                value={username} 
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (localError) setLocalError(null);
                }}
                required 
                minLength={AUTH_RULES.USERNAME.MIN}
                autoComplete="username"
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                autoComplete="email" 
              />
            </>
          )}

          <input
            type="password"
            placeholder={ isLogin ? "Senha" :`Senha (min. ${AUTH_RULES.PASSWORD.MIN})`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (localError) setLocalError(null);
            }}
            required
            minLength={AUTH_RULES.PASSWORD.MIN}
            autoComplete={isLogin ? "current-password" : "new-password"} 
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Registrar')}
        </button>

        {currentError && (
          <p className={styles.errorMessage}>
            {currentError}
          </p>
        )}
      </form>

      <div className={styles.footer}>
        <a 
          className={styles.toggleLink}
          onClick={() => {
            setIsLogin(!isLogin);
            setLocalError(null);
          }}
        >
          {isLogin ? 'Não tem uma conta? Registre-se' : 'Já tem uma conta? Faça o login'}
        </a>
      </div>
    </div>
  );
};

export default AuthForm;