import React from 'react';
import styles from '../styles.module.css';

interface InputStepProps {
  value: string;
  onChange: (value: string) => void;
  onParse: () => void;
  onCancel: () => void; // <--- Adicionado de volta
}

export const InputStep: React.FC<InputStepProps> = ({ value, onChange, onParse, onCancel }) => {
  return (
    <div className={styles.stepContainer}>
      <h3>Novo Ciclo - Colar Lista</h3>
      <p>Cole a lista do WhatsApp ou Excel abaixo.</p>

      <textarea
        className={styles.listInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ex: Alface Americana un R$ 3,50..."
      />

      <footer className={styles.actions}>
        <button type="button" className={styles.secondaryBtn} onClick={onCancel}>
          Cancelar
        </button>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={onParse}
          disabled={!value.trim()}
        >
          Processar Lista
        </button>
      </footer>
    </div>
  );
};
