import { useEffect, useState, useRef } from 'react';
import { differenceInSeconds, format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { useCycleStore } from '@/domains/cycle';
import { animateTimerEntrance, animateSecondsTick } from './animations';
import styles from './styles.module.css';

interface TimeUnitProps {
  value: number;
  label: string;
  className?: string;
}

const TimeUnit = ({ value, label, className = '' }: TimeUnitProps) => (
  <div className={styles.timeUnit}>
    <div className={`${styles.numberBox} ${className}`}>
      <span>{String(value).padStart(2, '0')}</span>
    </div>
    <span className={styles.label}>{label}</span>
  </div>
);

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
    if (!activeCycle?.openingDate || activeCycle.status === 'CLOSED') {
      return;
    }

    const calculateTime = () => {
      const now = new Date();
      const openDate = new Date(activeCycle.openingDate);
      const diff = differenceInSeconds(openDate, now);

      if (diff <= 0) {
        void fetchActiveCycle();
        return null;
      }

      const d = Math.floor(diff / (3600 * 24));
      const h = Math.floor((diff % (3600 * 24)) / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;

      return { d, h, m, s };
    };

    const initial = calculateTime();
    if (initial) {
      setTime(initial);
    }

    const timer = setInterval(() => {
      const newTime = calculateTime();
      if (newTime) {
        setTime(newTime);
        animateSecondsTick(`.${styles.secondsRef}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeCycle, fetchActiveCycle]);

  const isClosed = activeCycle?.status === 'CLOSED';
  const displayDate = activeCycle?.openingDate ? new Date(activeCycle.openingDate) : new Date();
  const formattedDate = format(displayDate, "EEEE, dd 'de' MMMM", { locale: ptBR });

  return (
    <div className={styles.timerContainer}>
      <h2 className={styles.title} ref={titleRef}>
        {isClosed ? 'Ciclo Encerrado em ' : 'Próximo ciclo abre em '}
        <span className={styles.dateHighlight}>{formattedDate}</span>
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

export default CycleTimer;
