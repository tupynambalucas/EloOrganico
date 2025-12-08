// packages/frontend/src/features/shop/Shop.tsx
import { Suspense, lazy } from 'react';
import { useIsMobile } from '@/features/shop/hooks/useIsMobile';
import Loader from '@/components/Loader';

// Lazy loading para performance:
// O usuário mobile não baixa o código do desktop e vice-versa.
const MobileShopLayout = lazy(() => import('./mobile'));
const DesktopShopLayout = lazy(() => import('./desktop'));

const Shop = () => {
  const isMobile = useIsMobile();

  // Aqui você poderia chamar hooks de dados globais da loja
  // const { products } = useCatalogStore(); 

  return (
    <Suspense fallback={<Loader />}>
      {isMobile ? (
        <MobileShopLayout />
      ) : (
        <DesktopShopLayout />
      )}
    </Suspense>
  );
};

export default Shop;