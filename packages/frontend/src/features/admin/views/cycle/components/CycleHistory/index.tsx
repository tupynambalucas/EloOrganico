import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faCalendarAlt,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { IProduct } from '@elo-organico/shared';
import { useAdminCycleStore } from '../../../../domains/cycle/cycle.store';
import styles from './styles.module.css';

const CyclesHistory = () => {
  const {
    historyCycles,
    fetchHistory,
    isLoadingHistory,
    selectedCycle,
    fetchCycleDetails,
    clearSelectedCycle,
    isLoadingDetails,
    historyPagination,
  } = useAdminCycleStore();

  const [page, setPage] = useState(1);

  useEffect(() => {
    void fetchHistory({ page });
  }, [page, fetchHistory]);

  const handleSelectCycle = (id: string) => {
    void fetchCycleDetails(id);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((p) => p - 1);
    }
  };

  const handleNextPage = () => {
    if (historyPagination && page < historyPagination.pages) {
      setPage((p) => p + 1);
    }
  };

  if (selectedCycle) {
    return (
      <div className={styles.container}>
        <header className={styles.detailHeader}>
          <button type="button" onClick={clearSelectedCycle} className={styles.closeBtn}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <h3>Detalhes do Ciclo</h3>
        </header>

        {isLoadingDetails ? (
          <div className={styles.loading}>Carregando...</div>
        ) : (
          <div className={styles.detailContent}>
            <div className={styles.infoBlock}>
              <label htmlFor="period-display">Período</label>
              <p id="period-display">
                {format(new Date(selectedCycle.openingDate), 'dd/MM/yyyy', { locale: ptBR })}
                {' - '}
                {format(new Date(selectedCycle.closingDate), 'dd/MM/yyyy', { locale: ptBR })}
              </p>
            </div>
            <div className={styles.infoBlock}>
              <label htmlFor="products-display">Produtos Ofertados</label>
              <div id="products-display">
                {selectedCycle.products.map((p: string | IProduct, index) => {
                  const productName =
                    typeof p === 'object' && 'name' in p ? p.name : `Produto ID: ${p}`;

                  // Mantida a lógica original de chave estável enviada no seu arquivo
                  const key = typeof p === 'object' ? (p._id ?? index) : p;

                  return (
                    <div key={key} className={styles.miniProduct}>
                      {productName}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.listHeader}>
        <h3>Histórico</h3>
      </header>

      {isLoadingHistory ? (
        <div className={styles.loading}>Carregando...</div>
      ) : historyCycles.length === 0 ? (
        <div className={styles.emptyState}>
          <FontAwesomeIcon icon={faCalendarAlt} size="2x" />
          <p>Nenhum ciclo anterior encontrado.</p>
        </div>
      ) : (
        <>
          <div className={styles.list}>
            {historyCycles.map((cycle) => (
              <button
                type="button"
                key={cycle._id}
                className={styles.card}
                onClick={() => handleSelectCycle(cycle._id ?? '')}
              >
                <div className={styles.cardDate}>
                  <strong>{format(new Date(cycle.closingDate), 'dd/MM', { locale: ptBR })}</strong>
                  <span>{format(new Date(cycle.closingDate), 'yyyy', { locale: ptBR })}</span>
                </div>
                <div className={styles.cardInfo}>
                  <span>{cycle.description ?? 'Ciclo sem descrição'}</span>
                  <small>Encerrado</small>
                </div>
              </button>
            ))}
          </div>

          {historyPagination && historyPagination.pages > 1 && (
            <footer>
              <button type="button" onClick={handlePrevPage} disabled={page === 1}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <span>
                {page} de {historyPagination.pages}
              </span>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={page === historyPagination.pages}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </footer>
          )}
        </>
      )}
    </div>
  );
};

export default CyclesHistory;
