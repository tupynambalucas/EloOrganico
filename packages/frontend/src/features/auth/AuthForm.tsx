import { useState } from 'react';
import { useAuthStore } from './auth.store';
import UserIconsList from '@/constants/userIconList';
import BannerNegative from '@/assets/svg/identity/banner-negative.svg?react';
import styles from './auth.module.css';
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
    setLocalError(null);
    await login({ identifier, password });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const success = await register({ email, username, password, icon });
    if (success) {
      setIsLogin(true);
      setLocalError(null);
    }
  };

  const isLoading = isLogin ? loginLoading : registerLoading;
  const currentError = localError || (isLogin ? loginError : registerError);

  return (
    <div className={styles.container}>
      {/* Wrapper principal (div:first-child do container) */}
      <div>
        
        {/* Área do Logo (.banner) */}
        <div className={styles.banner}>
             <BannerNegative />
        </div>
        
        <h2>
            {isLogin ? 'Bem-vindo de Volta!' : 'Crie sua Conta'}
        </h2>
        
        <form className={styles.form} onSubmit={isLogin ? handleLogin : handleRegister}>
          
          {/* DIV 1: Grid de Ícones 
              IMPORTANTE: Mantemos este div mesmo no Login (vazio) para preservar 
              a ordem dos elementos (nth-of-type) exigida pelo CSS.
          */}
          <div>
            {!isLogin && UserIconsList.map((item) => (
              <div 
                key={item.name} 
                onClick={() => setUserIcon(item.name)}
                style={{
                    // Pequeno ajuste inline apenas para o estado "ativo" (borda),
                    // já que o CSS base está no arquivo module.
                    borderColor: icon === item.name ? '#333' : 'transparent'
                }}
              >
                {/* Reutilizamos o componente UserIcon para consistência visual */}
                <UserIcon forceIcon={item.name} />
              </div>
            ))}
          </div>

          {/* DIV 2: Inputs (Flex Column) */}
          <div>
            {isLogin ? (
                <input
                type="text"
                placeholder="Email ou Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoComplete="username" 
                />
            ) : (
                <>
                <input 
                    type="text" 
                    placeholder={`Username (min. ${AUTH_RULES.USERNAME.MIN})`}
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