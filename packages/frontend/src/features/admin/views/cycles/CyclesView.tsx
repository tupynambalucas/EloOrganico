import { useEffect } from 'react';
import styles from './Cycles.module.css';
import CreateCycleForm from './create/CreateCycleForm';
import CurrentCycle from './current/CurrentCycle'; // Assumindo que este componente exibe o activeCycle
import CyclesHistory from './history/CyclesHistory'; // Seu componente de histórico
import Loader from '@/components/Loader';
import { useCycleStore } from './cycles.store';

const CycleView = () => {
  const { 
    activeCycle, 
    fetchActiveCycle, 
    isLoadingActive,
    createSuccess, // Para trocar a tela após criar
    resetCreateStatus
  } = useCycleStore();

  // Inicialização: Verifica se existe ciclo ativo ao carregar a página
  useEffect(() => {
    fetchActiveCycle();
  }, []);

  // Se acabou de criar com sucesso, reseta o form (O fetchActiveCycle já foi chamado na store)
  useEffect(() => {
    if (createSuccess) {
      const timer = setTimeout(() => resetCreateStatus(), 3000); // Feedback visual de 3s
      return () => clearTimeout(timer);
    }
  }, [createSuccess]);

  if (isLoadingActive) {
    return <div className={styles.loadingContainer}><Loader /></div>;
  }

  return (
    <div className={styles.container}>
      {/* Área Principal: Mostra Ciclo Ativo OU Formulário de Criação */}
      <section className={styles.mainArea}>
        {activeCycle ? (
          <CurrentCycle />
        ) : (
          <div className={styles.createWrapper}>
            {createSuccess ? (
               <div className={styles.successMessage}>
                 <h2>✅ Ciclo Criado!</h2>
                 <p>O ciclo está no ar. Recarregando painel...</p>
               </div>
            ) : (
               <CreateCycleForm />
            )}
          </div>
        )}
      </section>

      {/* Área Secundária: Histórico (Sempre visível ou abaixo) */}
      <section className={styles.historyArea}>
        <CyclesHistory />
      </section>
    </div>
  );
};

export default CycleView;