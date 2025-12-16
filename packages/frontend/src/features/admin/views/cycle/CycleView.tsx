import { useEffect } from 'react';
import styles from './Cycle.module.css';
import CreateCycle from './create/CycleCreate';
import ActiveCycle from './active/ActiveCycle';
import CyclesHistory from './history/CycleHistory';
import ContainerLoader from '@/components/loaders/ContainerLoader';
import { useCycleStore } from '@/domains/cycle';
import { useAdminCycleStore } from '@/features/admin/domains/cycle';

const CyclesView = () => {
  const { 
    activeCycle, 
    fetchActiveCycle, 
    isLoading: isLoadingActive 
  } = useCycleStore();

  const {
    success, 
    resetStatus
  } = useAdminCycleStore();

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

      <section>
        <CyclesHistory />
      </section>
    </div>
  );
};

export default CyclesView;