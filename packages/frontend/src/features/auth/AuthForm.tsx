import { useState } from 'react';
import { useAuthStore } from './auth.store';
import UserIconsList from '@/constants/userIconList';
import EloOrganicoLogo from '@/assets/midia/svg/logo/logo-negative.svg?react';
import styles from './auth.module.css';
import { AUTH_RULES } from '@elo-organico/shared';

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
      <div>
        <div style={{ width: '150px', margin: '0 auto 20px' }}>
             <EloOrganicoLogo />
        </div>
        
        <h2 className='Inter-Regular'>
            {isLogin ? 'Bem-vindo de Volta!' : 'Crie sua Conta'}
        </h2>
        
        <form className={styles.form} onSubmit={isLogin ? handleLogin : handleRegister}>
          {isLogin ? (
            <input
              type="text"
              placeholder="Email ou Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoComplete="username" 
              className='Inter-Regular'
            />
          ) : (
            <>
              <div className={styles.iconGrid} style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '15px' }}>
                {UserIconsList.map((item) => (
                  <div 
                    key={item.name} 
                    onClick={() => setUserIcon(item.name)}
                    style={{ 
                        cursor: 'pointer', 
                        opacity: icon === item.name ? 1 : 0.5,
                        border: icon === item.name ? '2px solid white' : 'none',
                        borderRadius: '50%',
                        padding: '2px'
                    }}
                  >
                    <img src={item.base64} alt={item.name} width={40} />
                  </div>
                ))}
              </div>

              <input 
                  className='Inter-Regular' 
                  type="text" 
                  placeholder={`Username`}
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
                  className='Inter-Regular' 
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
            placeholder={`Senha`}
            value={password}
            onChange={(e) => {
               setPassword(e.target.value);
               if (localError) setLocalError(null);
            }}
            required
            minLength={AUTH_RULES.PASSWORD.MIN}
            autoComplete={isLogin ? "current-password" : "new-password"} 
            className='Inter-Regular'
          />

          <button className='Inter-Regular' type="submit" disabled={isLoading}>
            {isLoading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Registrar')}
          </button>

          {currentError && (
            <p style={{ color: '#ff6b6b', marginTop: '10px', fontSize: '0.9rem' }} className='Inter-Regular'>
              {currentError}
            </p>
          )}
        </form>

        <a onClick={() => {
            setIsLogin(!isLogin);
            setLocalError(null);
          }} 
          className='Inter-Regular' 
          style={{ cursor: 'pointer', display: 'block', marginTop: '15px', textDecoration: 'underline' }}>
          {isLogin ? 'Não tem uma conta? Registre-se' : 'Já tem uma conta? Faça o login'}
        </a>
      </div>
    </div>
  );
};

export default AuthForm;