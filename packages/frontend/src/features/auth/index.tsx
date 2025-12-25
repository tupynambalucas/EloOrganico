import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { useAuthStore } from '@/domains/auth';
import styles from './styles.module.css';
import { animateFormEntrance } from './animations';
import { useAuthForm } from './hooks/useAuthForm';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';

const AuthFeature = () => {
  const [isLogin, setIsLogin] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { clearErrors } = useAuthStore();

  const { 
    formData, 
    fieldErrors, 
    handleInputChange, 
    handleSubmit, 
    isLoading,
    refs 
  } = useAuthForm(isLogin, () => setIsLogin(true));

  useGSAP(() => {
    animateFormEntrance(containerRef.current);
  }, { dependencies: [isLogin], scope: containerRef });

  const toggleMode = () => {
    setIsLogin(!isLogin);
    clearErrors();
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.header}>
        <h1>{isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}</h1>
        <p>{isLogin ? 'Faça login para continuar' : 'Comece sua jornada sustentável'}</p>
      </div>

      <form className={styles.formContainer} onSubmit={handleSubmit}>
        {isLogin ? (
          <LoginForm 
            data={formData} 
            errors={fieldErrors} 
            onChange={handleInputChange} 
            inputRefs={refs} 
            disabled={isLoading} 
          />
        ) : (
          <RegisterForm 
            data={formData} 
            errors={fieldErrors} 
            onChange={handleInputChange} 
            inputRefs={refs} 
            disabled={isLoading} 
          />
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

export default AuthFeature;