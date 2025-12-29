import { useEffect, Suspense, lazy } from 'react';
import { useAuthStore } from '@/domains/auth';
import { useCycleStore } from '@/domains/cycle';
import { initializeCsrf } from '@/lib/axios';
import '@/i18n';

const AdminLayout = lazy(() => import('@/features/admin'));
const ShopLayout = lazy(() => import('@/features/shop'));
const LandingLayout = lazy(() => import('@/features/landing'));

function App() {
  const { user, isAuthenticated, isAuthLoading, verifyAuth } = useAuthStore();
  const { activeCycle, fetchActiveCycle } = useCycleStore();

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

  if (isAuthLoading) return null;

  return (
    <Suspense fallback={null}>
      {isAuthenticated && user?.role === 'admin' ? (
        <AdminLayout />
      ) : isAuthenticated && activeCycle?.status === 'OPEN' ? (
        <ShopLayout />
      ) : (
        <LandingLayout />
      )}
    </Suspense>
  );
}

export default App;
