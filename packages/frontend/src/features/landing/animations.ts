import gsap from 'gsap';

/**
 * Orquestra a entrada sequencial dos elementos da Landing Page.
 * * @param leftPanelRef - Referência ao painel verde esquerdo
 * @param logoWrapperRef - Referência ao container que envolve o SVG da logo
 * @param rightPanelRef - Referência ao painel branco direito (conteúdo)
 */
export const animateLandingIntro = (
  leftPanelRef: HTMLDivElement,
  logoWrapperRef: HTMLDivElement,
  rightPanelRef: HTMLDivElement
) => {
  // Cria uma timeline. 'defaults' aplica o ease a todas as animações da timeline,
  // a menos que sobrescrito. 'power3.out' é suave e profissional para entradas.
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out', duration: 1 }
  });

  tl
    // 1. Painel Esquerdo: Desliza da esquerda (-100%) para a posição original (0%)
    .from(leftPanelRef, {
      xPercent: -100,
      duration: 1.2, // Um pouco mais lento para dar peso
    })

    // 2. Logo: Aparece com um efeito de "pop" elástico
    // O '-=0.4' faz essa animação começar 0.4s antes da anterior terminar (overlap fluido)
    .from(logoWrapperRef, {
      scale: 0.8,     // Começa um pouco menor
      opacity: 0,     // Começa invisível
      duration: 0.8,
      // 'back.out(1.7)' faz ela passar um pouco do tamanho final e voltar (efeito elástico)
      ease: 'back.out(1.7)', 
    }, '-=0.4') 

    // 3. Painel Direito: Fade-in simples de opacidade, sem movimento
    // O '-=0.2' cria uma leve sobreposição com o final da animação da logo
    .from(rightPanelRef, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut' // Ease mais linear para fade simples
    }, '-=0.2');

  return tl;
};