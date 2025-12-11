import { useState } from 'react';
import { useAuthStore } from './auth.store';
import UserIconsList from '@/constants/userIconList';
import BannerNegative from '@/assets/svg/identity/banner-negative.svg?react';
import styles from './Auth.module.css';
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
    if (!identifier || !password) return;
    await login({ identifier, password });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const success = await register({ username, email, password, icon });
    if (success) {
      setIsLogin(true);
      setIdentifier(username || email);
      setPassword('');
    }
  };

  const currentError = localError || (isLogin ? loginError : registerError);
  const isLoading = isLogin ? loginLoading : registerLoading;

  return (
    <div className={styles.authContainer}>
      <div className={styles.leftPanel}>
        <div className={styles.bannerContainer}>
           <BannerNegative style={{ width: '100%', height: 'auto' }} />
        </div>
      </div>
      
      <div className={styles.rightPanel}>
        <form className={styles.formContainer} onSubmit={isLogin ? handleLogin : handleRegister}>
          <h2>{isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}</h2>
          
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
                    <label>Escolha seu ícone:</label>
                    <div className={styles.iconsGrid}>
                        {UserIconsList.map((item) => (
                            <div 
                                key={item.name} 
                                className={`${styles.iconOption} ${icon === item.name ? styles.selected : ''}`}
                                onClick={() => setUserIcon(item.name)}
                            >
                                <UserIcon forceIcon={item.name} size={30} />
                            </div>
                        ))}
                    </div>
                </div>
                <input 
                    type="text" 
                    placeholder={`Usuário (min. ${AUTH_RULES.USERNAME.MIN})`}
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
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
            <p style={{ color: '#d32f2f', marginTop: '10px', fontSize: '0.9rem', textAlign: 'center' }}>
              {currentError}
            </p>
          )}
        </form>

        <a onClick={() => {
            setIsLogin(!isLogin);
            setLocalError(null);
          }}>
          {isLogin ? 'Não tem uma conta? Registre-se' : 'Já tem uma conta? Faça o login'}
        </a>
      </div>
    </div>
  );
};

export default AuthForm;