import { useState } from 'react';
import { useAuthStore } from './AuthStore';
import UserIconsList from '@/constants/userIconList';
import EloOrganicoLogo from '@/assets/midia/svg/logo/logo-negative.svg?react';
import styles from './auth.module.css';

export const AuthForm = () => {
  const { 
    login, 
    register, 
    loginLoading, 
    loginError, 
    registerLoading, 
    registerError 
  } = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [icon, setUserIcon] = useState('graxaim');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(identifier, password);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register({ email, username, password, icon });
    if (success) {
      setIsLogin(true);
    }
  };

  const isLoading = isLogin ? loginLoading : registerLoading;
  const currentError = isLogin ? loginError : registerError;

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
                  placeholder="Username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required  
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
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={isLogin ? "current-password" : "new-password"} 
            className='Inter-Regular'
          />

          <button className='Inter-Regular' type="submit" disabled={isLoading}>
            {isLoading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Registrar')}
          </button>

          {currentError && <p style={{ color: 'red', marginTop: '10px' }} className='Inter-Regular'>{currentError}</p>}
        </form>

        <a onClick={() => setIsLogin(!isLogin)} className='Inter-Regular' style={{ cursor: 'pointer', display: 'block', marginTop: '15px' }}>
          {isLogin ? 'Não tem uma conta? Registre-se' : 'Já tem uma conta? Faça o login'}
        </a>
      </div>
    </div>
  );
};