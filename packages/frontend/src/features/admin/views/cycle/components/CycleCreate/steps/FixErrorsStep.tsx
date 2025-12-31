import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles.module.css';
import type { FixingItem } from '../types';

// Interface corrigida para corresponder ao index.tsx
interface FixErrorsStepProps {
  fixingItems: FixingItem[];
  onUpdateItem: (id: string, field: keyof FixingItem, value: string) => void;
  onProcessFixed: () => void;
}

export const FixErrorsStep: React.FC<FixErrorsStepProps> = ({
  fixingItems,
  onUpdateItem,
  onProcessFixed,
}) => {
  return (
    <div className={styles.stepContainer}>
      <div className={styles.headerStep}>
        <h3>Corrigindo Produtos ({fixingItems.length})</h3>
      </div>

      <div className={styles.fixList}>
        {fixingItems.map((item) => (
          <div key={item.id} className={styles.fixCard}>
            <div className={styles.fixCardTitle}>
              Texto Original: &quot;{item.originalText}&quot;
            </div>

            <div className={styles.fixGrid}>
              {/* Campo Nome */}
              <div className={styles.fixField} style={{ flex: '2 1 200px' }}>
                <label>Nome do Produto</label>
                <input
                  className={styles.fixInput}
                  value={item.name}
                  onChange={(e) => onUpdateItem(item.id, 'name', e.target.value)}
                  placeholder="Nome..."
                />
              </div>

              {/* Campo Preço */}
              <div className={styles.fixField} style={{ flex: '1 1 80px' }}>
                <label>Preço (R$)</label>
                <input
                  className={styles.fixInput}
                  value={item.price}
                  onChange={(e) => onUpdateItem(item.id, 'price', e.target.value)}
                  placeholder="0,00"
                  type="number"
                />
              </div>

              {/* Campo Unidade */}
              <div className={styles.fixField} style={{ flex: '1 1 100px' }}>
                <label>Unidade</label>
                <select
                  className={styles.fixInput}
                  value={item.unit}
                  onChange={(e) => onUpdateItem(item.id, 'unit', e.target.value)}
                >
                  <option value="unidade">Unidade</option>
                  <option value="pacote">Pacote</option>
                  <option value="kg">Kg</option>
                  <option value="litro">Litro</option>
                  <option value="maço">Maço</option>
                  <option value="bandeja">Bandeja</option>
                  <option value="garrafão">Garrafão</option>
                </select>
              </div>

              {/* Campo Categoria */}
              <div className={styles.fixField} style={{ flex: '1 1 120px' }}>
                <label>Categoria</label>
                <input
                  className={styles.fixInput}
                  value={item.category}
                  disabled
                  title="Categoria detectada automaticamente"
                  style={{ backgroundColor: '#f3f4f6' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className={styles.actions}>
        <button type="button" className={styles.primaryBtn} onClick={onProcessFixed}>
          <FontAwesomeIcon icon={faSync} style={{ marginRight: 8 }} />
          Atualizar Produtos
        </button>
      </footer>
    </div>
  );
};
