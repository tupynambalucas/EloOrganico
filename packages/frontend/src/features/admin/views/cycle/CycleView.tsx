import { useEffect } from 'react';
import styles from './cycle.module.css';
import CycleForm from './components/CycleForm';
import { useCycleStore } from './cycle.store';

const CycleView = () => {
  const { success, resetStatus } = useCycleStore();

  useEffect(() => {
    resetStatus();
  }, [resetStatus]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {success ? (
          <div className={styles.successMessage}>
            <h1>✅ Ciclo Criado com Sucesso!</h1>
            <p>O ciclo está ativo e os produtos foram atualizados.</p>
            <button className={styles.primaryBtn} onClick={resetStatus}>Criar Novo Ciclo</button>
          </div>
        ) : (
          <CycleForm />
        )}
      </div>
    </div>
  );
};

export default CycleView;