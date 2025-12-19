import { useEffect } from 'react';
import styles from './CycleView.module.css';
import CreateCycle from './components/CycleCreate';
import ActiveCycle from './components/ActiveCycle';
import CyclesHistory from './components/CycleHistory';
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