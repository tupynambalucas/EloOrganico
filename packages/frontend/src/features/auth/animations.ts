import gsap from 'gsap';

/**
 * Anima um elemento HTML simulando uma "tremedeira" (shake) para indicar erro.
 * Agora mais rápido e garantindo o retorno à posição original.
 * @param element O elemento HTML a ser animado (ref.current)
 */
export const shakeElement = (element: HTMLElement | null) => {
  if (!element) return;
  
  // Para qualquer animação anterior no mesmo elemento para evitar conflitos
  gsap.killTweensOf(element); 
  
  // Garante que comece do zero antes de tremer
  gsap.set(element, { x: 0 });

  gsap.fromTo(element, 
    { x: -6 }, 
    { 
      x: 6, 
      duration: 0.05, // Mais rápido (tremor)
      repeat: 5,      // Mais repetições para vibrar
      yoyo: true, 
      ease: 'sine.inOut',
      clearProps: 'x', // Tenta limpar o transform ao final
      onComplete: () => {
        // Cinto de segurança: força voltar para 0 se o clearProps falhar
        gsap.set(element, { x: 0, clearProps: 'x' });
      }
    }
  );
};

/**
 * Anima a entrada dos containers de Login/Registro (Fade In + Slide Up)
 * @param element O container principal do formulário
 */
export const animateFormEntrance = (element: HTMLElement | null) => {
  if (!element) return;

  gsap.fromTo(element,
    { y: '5vh', opacity: 0 }, // Usando unidade relativa
    { 
      y: 0, 
      opacity: 1, 
      duration: 0.6, 
      ease: 'back.out(1.2)' 
    }
  );
};