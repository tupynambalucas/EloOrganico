import { useEffect, Suspense, lazy } from 'react';
import { useAuthStore } from '@/features/auth/auth.store';
import { initializeCsrf } from '@/lib/axios'; // Importe a função de inicialização
import Loader from '@/components/Loader';
import '@/i18n'; // Importa a configuração do i18n para registrar o pt-BR

const AdminApp = lazy(() => import('@/features/admin'));
const UserApp = lazy(() => import('@/features/shop'));
const AuthScreen = lazy(() => import('@/features/auth'));

function App() {
  const { 
    user, 
    isAuthenticated, 
    isAuthLoading, 
    verifyAuth 
  } = useAuthStore();

  useEffect(() => {
    const initApp = async () => {
      // 1. Garante que temos um Token CSRF antes de qualquer coisa
      await initializeCsrf();
      
      // 2. Verifica sessão
      await verifyAuth();
    };

    initApp();
  }, [verifyAuth]);

  if (isAuthLoading) {
    return <Loader />;
  }

  return (
    <Suspense fallback={<Loader />}>
      {!isAuthenticated || !user ? (
        <AuthScreen />
      ) : user.role === 'admin' ? (
        <AdminApp />
      ) : (
        <UserApp />
      )}
    </Suspense>
  );
}

export default App;