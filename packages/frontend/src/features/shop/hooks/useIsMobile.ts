// packages/frontend/src/hooks/useIsMobile.ts
import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768; // Padrão tablet/mobile

export const useIsMobile = () => {
  // Inicializa o estado com base na largura atual da janela
  const [isMobile, setIsMobile] = useState(() => {
    // Verifica se window existe (para evitar erros em ambientes de build/SSR, embora seja Vite SPA)
    return typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Adiciona o listener
    window.addEventListener('resize', handleResize);
    
    // Limpa o listener ao desmontar
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};