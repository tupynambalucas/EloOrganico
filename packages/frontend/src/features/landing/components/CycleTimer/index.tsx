import { useEffect, useState, useRef } from 'react';
import { differenceInSeconds, format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { useCycleStore } from '@/domains/cycle';
import styles from './styles.module.css';
import { animateTimerEntrance, animateSecondsTick } from './animations';

const CycleTimer = () => {
  const { activeCycle, fetchActiveCycle } = useCycleStore();
  
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (activeCycle && containerRef.current) {
      animateTimerEntrance(containerRef.current);
    }
  }, [activeCycle]);

  useEffect(() => {
    if (!activeCycle?.openingDate || activeCycle.status === 'CLOSED') return;

    const calculateTime = () => {
      const now = new Date();
      const openDate = new Date(activeCycle.openingDate);
      const diff = differenceInSeconds(openDate, now);

      if (diff <= 0) {
        fetchActiveCycle(); 
        return null;
      }

      const d = Math.floor(diff / (3600 * 24));
      const h = Math.floor((diff % (3600 * 24)) / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;

      return { d, h, m, s };
    };

    const initialTime = calculateTime();
    if (initialTime) setTime(initialTime);

    const interval = setInterval(() => {
      const newTime = calculateTime();
      if (newTime) {
        setTime(prev => {
          if (prev.s !== newTime.s) {
             animateSecondsTick(`.${styles.secondsRef}`);
          }
          return newTime;
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCycle, fetchActiveCycle]);

  if (!activeCycle) return <div className={styles.loading}>Carregando...</div>;

  const isClosed = activeCycle.status === 'CLOSED';
  
  const displayDateRaw = isClosed ? activeCycle.closingDate : activeCycle.openingDate;
  
  const formattedDate = displayDateRaw 
    ? format(new Date(displayDateRaw), "d 'de' MMMM 'às' HH:mm'h'", { locale: ptBR })
    : '';

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title} ref={titleRef}>
        {isClosed ? 'Ciclo Encerrado em ' : 'Próximo ciclo abre em '}
        <span className={styles.dateHighlight}>
          {formattedDate}
        </span>
      </h2>
      
      {isClosed ? (
        <div className={styles.closedMessage}>
          <p className={styles.subtitle}>
            Este ciclo já foi finalizado. Aguarde a divulgação das datas para a próxima feira.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.timerGrid} ref={containerRef}>
            <TimeUnit value={time.d} label="Dias" />
            <div className={styles.separator}>:</div>
            <TimeUnit value={time.h} label="Horas" />
            <div className={styles.separator}>:</div>
            <TimeUnit value={time.m} label="Minutos" />
            <div className={styles.separator}>:</div>
            <TimeUnit value={time.s} label="Segundos" className={styles.secondsRef} />
          </div>
          <p className={styles.subtitle}>Prepare sua lista! A loja abrirá automaticamente.</p>
        </>
      )}
    </div>
  );
};

const TimeUnit = ({ value, label, className = '' }: { value: number, label: string, className?: string }) => (
  <div className={styles.timeUnit}>
    <div className={`${styles.numberBox} ${className}`}>
      {String(value).padStart(2, '0')}
    </div>
    <span className={styles.label}>{label}</span>
  </div>
);

export default CycleTimer;