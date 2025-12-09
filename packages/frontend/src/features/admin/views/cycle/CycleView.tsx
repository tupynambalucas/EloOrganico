import { useEffect } from 'react';
import styles from './Cycle.module.css';
import CreateCycle from './create/CycleCreate';
import ActiveCycle from './active/ActiveCycle';
import CyclesHistory from './history/CycleHistory';
import Loader from '@/components/Loader';
import { useCycleStore } from './cycle.store';

const CyclesView = () => {
  const { 
    activeCycle, 
    fetchActiveCycle, 
    isLoadingActive,
    success, 
    resetStatus
  } = useCycleStore();

  useEffect(() => {
    fetchActiveCycle();
  }, [fetchActiveCycle]); // Adicionada dependência correta

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => resetStatus(), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, resetStatus]); // Adicionadas dependências corretas

  if (isLoadingActive) {
    return <div className={styles.loadingContainer}><Loader /></div>;
  }

  return (
    <div className={styles.container}>
      <section className={styles.mainArea}>
        {activeCycle ? (
          <ActiveCycle />
        ) : (
          <CreateCycle />
        )}
      </section>

      <section className={styles.historyArea}>
        <CyclesHistory />
      </section>
    </div>
  );
};

export default CyclesView;