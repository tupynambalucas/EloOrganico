import { useEffect } from 'react';
import styles from './Cycle.module.css';
import CreateCycle from './create/CycleCreate';
import ActiveCycle from './active/ActiveCycle';
import CyclesHistory from './history/CycleHistory';
import ContainerLoader from '../../components/ContainerLoader';
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
  }, [fetchActiveCycle]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => resetStatus(), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, resetStatus]);

  return (
    <div className={styles.container}>
      <section>
        {isLoadingActive ? (
          <ContainerLoader />
        ) : activeCycle ? (
          <ActiveCycle />
        ) : (
          <CreateCycle />
        )}
      </section>

      {/* Seção Direita: Histórico */}
      <section>
        <CyclesHistory />
      </section>
    </div>
  );
};

export default CyclesView;