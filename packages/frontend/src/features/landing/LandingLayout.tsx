import { lazy, Suspense, useRef } from 'react';
import { useAuthStore } from '@/domains/auth';
import { useCycleStore } from '@/domains/cycle';
import { useGSAP } from '@gsap/react'; // Import necessário
import styles from './LandingLayout.module.css';
import BannerNegative from '@/assets/svg/identity/banner-negative.svg?react';

// Importamos a lógica de animação separada
import { animateLandingIntro } from './animations';

const AuthForm = lazy(() => import('@/features/auth/AuthForm'));
const CycleTimer = lazy(() => import('@/features/landing/components/CycleTimer/index'));

const LandingLayout = () => {
  const { isAuthenticated } = useAuthStore();
  const { activeCycle, isLoading: isCycleLoading } = useCycleStore();

  // 1. Criamos referências para os elementos que queremos animar
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null); // Wrapper para a logo
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // 2. Executamos a animação assim que o componente monta
  useGSAP(() => {
    // Verificação de segurança para garantir que os elementos existem no DOM
    if (!leftPanelRef.current || !logoWrapperRef.current || !rightPanelRef.current) return;

    // Chama a função externa passando os elementos reais do DOM
    const tl = animateLandingIntro(
      leftPanelRef.current,
      logoWrapperRef.current,
      rightPanelRef.current
    );

    // Opcional: Se quiser que a animação rode mais rápido durante o desenvolvimento:
    // tl.timeScale(2); 

  }, { scope: containerRef }); // 'scope' ajuda o GSAP a limpar a memória automaticamente


  const renderContent = () => {
    if (!isAuthenticated) return <AuthForm />;
    if (isCycleLoading) return null;
    if (activeCycle?.status !== 'OPEN') {
      return <CycleTimer />;
    }
    return null;
  };

  return (
    // Adicionamos o ref ao container principal para escopo
    <div ref={containerRef} className={styles.container}>
      
      {/* Ref para o painel esquerdo */}
      <div ref={leftPanelRef} className={styles.leftPanel}>
        <div className={styles.bannerContainer}>
           {/* ADICIONADO: Wrapper div para animar a logo */}
           <div ref={logoWrapperRef} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
             <BannerNegative />
           </div>
        </div>
      </div>
      
      {/* Ref para o painel direito */}
      <div ref={rightPanelRef} className={styles.rightPanel}>
        <Suspense fallback={null}>
          {renderContent()}
        </Suspense>
      </div>
    </div>
  );
};

export default LandingLayout;