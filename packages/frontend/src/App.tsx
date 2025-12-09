import { useEffect, Suspense, lazy } from 'react';
import { useAuthStore } from '@/features/auth/auth.store';
import Loader from '@/components/Loader';

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
    verifyAuth();
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