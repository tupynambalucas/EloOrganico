import { useEffect, Suspense, lazy } from 'react';
import { useAuthStore } from '@/domains/auth';
import { useCycleStore } from '@/domains/cycle';
import { initializeCsrf } from '@/lib/axios';
import Loader from '@/components/loaders/ScreenLoader';
import '@/i18n';

const AdminLayout = lazy(() => import('@/features/admin'));
const ShopLayout = lazy(() => import('@/features/shop'));
const LandingLayout = lazy(() => import('@/features/landing/LandingLayout'));
const AuthForm = lazy(() => import('@/features/auth/AuthForm'));
const CycleTimer = lazy(() => import('@/features/landing/components/CycleTimer/index'));

function App() {
  const { 
    user, 
    isAuthenticated, 
    isAuthLoading, 
    verifyAuth 
  } = useAuthStore();

  const { 
    activeCycle, 
    fetchActiveCycle, 
    isLoading: isCycleLoading 
  } = useCycleStore();

  useEffect(() => {
    const initApp = async () => {
      await initializeCsrf();
      await verifyAuth();
    };
    initApp();
  }, [verifyAuth]);

  useEffect(() => {
    if (isAuthenticated && user && user.role !== 'admin') {
      fetchActiveCycle();
    }
  }, [isAuthenticated, user, fetchActiveCycle]);

  if (isAuthLoading) {
    return <Loader />;
  }

  return (
    <Suspense fallback={<Loader />}>
      {!isAuthenticated || !user ? (
        <LandingLayout>
          <AuthForm />
        </LandingLayout>
      ) : user.role === 'admin' ? (
        <AdminLayout />
      ) : (
        <>
          {isCycleLoading ? (
            <Loader />
          ) : activeCycle?.status === 'OPEN' ? (
            <ShopLayout />
          ) : (
            <LandingLayout>
              <CycleTimer />
            </LandingLayout>
          )}
        </>
      )}
    </Suspense>
  );
}

export default App;