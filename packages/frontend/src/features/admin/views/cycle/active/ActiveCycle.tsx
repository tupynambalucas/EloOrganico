import { useState } from 'react';
import { useCycleStore } from '@domains/cycle';
import { useAdminCycleStore } from '../../../domains/cycle/cycle.store';
import styles from './ActiveCycle.module.css';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faArrowLeft, faSave, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import type { IProduct } from '@elo-organico/shared';

const ActiveCycle = () => {
  const { activeCycle } = useCycleStore();
  const { updateActiveCycleProducts, isSubmitting } = useAdminCycleStore();
  
  const [viewMode, setViewMode] = useState<'dashboard' | 'products'>('dashboard');
  const [draftProducts, setDraftProducts] = useState<IProduct[]>([]);

  const handleOpenProducts = () => {
    if (activeCycle?.products) {
      setDraftProducts(activeCycle.products as IProduct[]);
    }
    setViewMode('products');
  };

  const handleRemoveProduct = (indexToRemove: number) => {
    setDraftProducts(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSaveChanges = async () => {
    const success = await updateActiveCycleProducts(draftProducts);
    if (success) {
      setViewMode('dashboard');
    }
  };

  if (!activeCycle) return null;

  if (viewMode === 'dashboard') {
    return (
      <div className={styles.container}>
        <header>
          <h2>🟢 Ciclo Ativo</h2>
          <span className={styles.dates}>
            {format(new Date(activeCycle.openingDate), "dd 'de' MMMM", { locale: ptBR })} 
            {' até '} 
            {format(new Date(activeCycle.closingDate), "dd 'de' MMMM", { locale: ptBR })}
          </span>
        </header>
        
        <div className={styles.content}>
          <p className={styles.description}>{activeCycle.description}</p>
          
          <div className={styles.stats}>
              <div className={styles.card}>
                  {/* CORREÇÃO: Removido 'as any[]'. O TS já sabe que products é um array. */}
                  <strong>{activeCycle.products.length}</strong>
                  <span>Produtos</span>
              </div>
              
              <button className={styles.actionBtn} onClick={handleOpenProducts}>
                  <FontAwesomeIcon icon={faBoxOpen} size="2x" />
                  <span>Gerenciar Produtos</span>
              </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.editHeader}>
        <div className={styles.headerLeft}>
            <button 
                className={styles.backBtn} 
                onClick={() => setViewMode('dashboard')}
                disabled={isSubmitting}
            >
                <FontAwesomeIcon icon={faArrowLeft} /> Voltar
            </button>
            <h3>Gerenciar Produtos do Ciclo</h3>
        </div>
        
        <button 
            className={styles.saveBtn} 
            onClick={handleSaveChanges}
            disabled={isSubmitting}
        >
            <FontAwesomeIcon icon={faSave} />
            {isSubmitting ? ' Salvando...' : ' Salvar Alterações'}
        </button>
      </header>

      <div className={styles.productsList}>
        {draftProducts.map((p, idx) => (
            <div key={p._id || idx} className={styles.productRow}>
                <div className={styles.pInfo}>
                    <strong>{p.name}</strong>
                    <span>{p.measure.type}</span>
                    <span className={styles.price}>R$ {Number(p.measure.value).toFixed(2)}</span>
                </div>
                <div className={styles.pActions}>
                    <button className={styles.iconBtn} title="Editar">
                        <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button 
                        className={`${styles.iconBtn} ${styles.danger}`} 
                        onClick={() => handleRemoveProduct(idx)}
                        title="Remover do Ciclo"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveCycle;