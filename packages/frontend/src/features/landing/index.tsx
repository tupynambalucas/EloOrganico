import { lazy, Suspense, useRef } from 'react';
import { useAuthStore } from '@/domains/auth';
import { useCycleStore } from '@/domains/cycle';
import { useGSAP } from '@gsap/react';
import BannerNegative from '@/assets/svg/identity/banner-negative.svg?react';
import { animateLandingIntro } from './animations';
import styles from './styles.module.css';

const AuthForm = lazy(() => import('@/features/auth'));
const CycleTimer = lazy(() => import('@/features/landing/components/CycleTimer/index'));

const LandingLayout = () => {
  const { isAuthenticated } = useAuthStore();
  const { activeCycle, isLoading: isCycleLoading } = useCycleStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!leftPanelRef.current || !logoWrapperRef.current || !rightPanelRef.current) {
        return;
      }

      animateLandingIntro(leftPanelRef.current, logoWrapperRef.current, rightPanelRef.current);
    },
    { scope: containerRef },
  );

  const renderContent = () => {
    if (!isAuthenticated) {
      return <AuthForm />;
    }
    if (isCycleLoading) {
      return null;
    }
    if (activeCycle?.status !== 'OPEN') {
      return <CycleTimer />;
    }
    return null;
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <div ref={leftPanelRef} className={styles.leftPanel}>
        <div className={styles.bannerContainer}>
          <div
            ref={logoWrapperRef}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <BannerNegative />
          </div>
        </div>
      </div>

      <div ref={rightPanelRef} className={styles.rightPanel}>
        <div className={styles.contentWrapper}>
          <Suspense fallback={null}>{renderContent()}</Suspense>
        </div>
      </div>
    </div>
  );
};

export default LandingLayout;
