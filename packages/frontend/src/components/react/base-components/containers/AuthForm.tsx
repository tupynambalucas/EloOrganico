import React, { type FC, useState, useEffect } from 'react';
import AuthFormStyles from '@cssComponents/base-components/containers/auth.module.css';
import { useRouteContext } from '@tupynamba/fastifyreact-ts/client'; 
import UserIconsList from '@assets/components/UserIconsList'
import EloOrganicoLogo from '@assets/midia/svg/logo/logo-negative.svg?react';

export const AuthForm: FC = () => {
  const { state, actions } = useRouteContext(); 
  const [isLogin, setIsLogin] = useState(true);
  const [icons, setIcons] = useState(UserIconsList);
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [icon, setUserIcon] = useState('graxaim');

  const handleLogin = async (e: React.FormEvent) => {
    console.log('Attempting to log in with identifier:', identifier);
    e.preventDefault();
    await actions.login(state, { identifier, password });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await actions.register(state, { email, username, password, icon });
    if (success) {
      // Se o registro for bem-sucedido, muda para a tela de login
      setIsLogin(true); 
    }
  };

  return (
    <div className={AuthFormStyles.container}>
      <div>
        <EloOrganicoLogo />
        <h2 className='Inter-Regular'>{isLogin ? 'Bem-vindo de Volta!' : 'Crie sua Conta'}</h2>
        <form className={AuthFormStyles.form} onSubmit={isLogin ? handleLogin : handleRegister}>
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
              <div>
                {icons.map((icons) => (
                  <div key={icons.name} onClick={() => setUserIcon(icons.name)}>
                    <img src={icons.base64} alt={icons.name} />
                  </div>
                ))}
              </div>
              <div>
                <input className='Inter-Regular' type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required  autoComplete="username"/>
                <input className='Inter-Regular' type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </div>
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
          <button className='Inter-Regular' type="submit">{isLogin ? 'Entrar' : 'Registrar'}</button>
          {state.error && <p className='Inter-Regular'>{state.error}</p>}
        </form>
        <a onClick={() => setIsLogin(!isLogin)} className='Inter-Regular'>
          {isLogin ? 'Não tem uma conta? Registre-se' : 'Já tem uma conta? Faça o login'}
        </a>
      </div>
    </div>
  );
};