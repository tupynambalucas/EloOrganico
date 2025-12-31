import { Suspense, lazy } from 'react';
import { useIsMobile } from './hooks/useIsMobile';
import Loader from '@/components/loaders/ScreenLoader';

const DesktopLayout = lazy(() => import('./layouts/DesktopLayout'));
const MobileLayout = lazy(() => import('./layouts/MobileLayout'));

const Shop = () => {
  const isMobile = useIsMobile();

  return (
    <Suspense fallback={<Loader />}>{isMobile ? <MobileLayout /> : <DesktopLayout />}</Suspense>
  );
};

export default Shop;
