import { lazy, Suspense, useRef } from 'react';
import { useAuthStore } from '@/domains/auth';
import { useCycleStore } from '@/domains/cycle';
import { useGSAP } from '@gsap/react'; // Import necessário
import styles from './styles.module.css';
import BannerNegative from '@/assets/svg/identity/banner-negative.svg?react';

// Importamos a lógica de animação separada
import { animateLandingIntro } from './animations';

const AuthForm = lazy(() => import('@/features/auth'));
const CycleTimer = lazy(() => import('@/features/landing/components/CycleTimer/index'));

const LandingLayout = () => {
  const { isAuthenticated } = useAuthStore();
  const { activeCycle, isLoading: isCycleLoading } = useCycleStore();

  // 1. Criamos referências para os elementos que queremos animar
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null); // Wrapper para a logo
  const rightPanelRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!leftPanelRef.current || !logoWrapperRef.current || !rightPanelRef.current) return;

    const tl = animateLandingIntro(
      leftPanelRef.current,
      logoWrapperRef.current,
      rightPanelRef.current
    );

  }, { scope: containerRef });


  const renderContent = () => {
    if (!isAuthenticated) return <AuthForm />;
    if (isCycleLoading) return null;
    if (activeCycle?.status !== 'OPEN') {
      return <CycleTimer />;
    }
    return null;
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <div ref={leftPanelRef} className={styles.leftPanel}>
        <div className={styles.bannerContainer}>
           <div ref={logoWrapperRef} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
             <BannerNegative />
           </div>
        </div>
      </div>
      
      <div ref={rightPanelRef} className={styles.rightPanel}>
        <Suspense fallback={null}>
          {renderContent()}
        </Suspense>
      </div>
    </div>
  );
};

export default LandingLayout;